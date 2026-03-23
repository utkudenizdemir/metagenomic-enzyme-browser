import paramiko
import os
import csv
import zipfile
import shutil

def unzip_file(zip_path, extract_to):
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
        print(f"Unzipped {zip_path} to {extract_to}")
    except Exception as e:
        print(f"Error unzipping file {zip_path}: {e}")
        raise

def find_fastqc_subdir(extracted_dir):
    for root, dirs, files in os.walk(extracted_dir):
        if 'fastqc_data.txt' in files:
            print(f"Found fastqc_data.txt in {root}")
            return root
    raise FileNotFoundError("fastqc_data.txt not found in extracted directory")

def parse_fastqc_data(file_path):
    print(f"Parsing FastQC data from {file_path}")
    total_sequences = 0
    median_values = []

    try:
        with open(file_path, 'r') as f:
            lines = f.readlines()

            for i, line in enumerate(lines):
                if line.startswith("Total Sequences"):
                    total_sequences = int(line.split('\t')[1].strip())
                    print(f"Total Sequences: {total_sequences}")

                if line.startswith("#Base\tMean\tMedian"):
                    for data_line in lines[i + 1:]:
                        if data_line.startswith(">>"):
                            break
                        parts = data_line.split('\t')
                        if len(parts) > 1:
                            median_values.append(float(parts[1].strip()))

    except Exception as e:
        print(f"Error reading FastQC data file {file_path}: {e}")
        raise

    quality_score_avg = sum(median_values) / len(median_values) if median_values else None
    print(f"Quality Score Average: {quality_score_avg}")
    total_base_pairs = total_sequences * 150
    print(f"Total Base Pairs: {total_base_pairs}")
    return total_sequences, total_base_pairs, quality_score_avg

class SSH_conn:

    def __init__(self, ip_address, username, password):
        self.ip_address = ip_address
        self.username = username
        self.password = password
        self.client = None

    def connect(self):
        try:
            self.client = paramiko.SSHClient()
            self.client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            self.client.connect(self.ip_address, username=self.username, password=self.password)
            print(f"Connected to {self.ip_address}")
        except Exception as e:
            print(f"Failed to connect: {e}")
            raise

    def list_directory(self, remote_path):
        try:
            stdin, stdout, stderr = self.client.exec_command(f"ls -d {remote_path}*/")
            directories = stdout.read().decode().splitlines()
            return directories
        except Exception as e:
            print(f"Error listing directory: {e}")
            raise

    def fetch_file(self, remote_path, local_path):
        try:
            sftp = self.client.open_sftp()
            sftp.get(remote_path, local_path)
            print(f"Fetched file: {remote_path}")
            sftp.close()
        except Exception as e:
            print(f"Error fetching file: {e}")
            raise

    def close(self):
        if self.client:
            self.client.close()
            print("Connection closed.")

def main():
    ip_address = "82.148.225.97"
    username = "neil"
    password = input("Enter the SSH password: ")

    base_directory = "/data/njord_db/data/assemblies/"
    local_temp_dir = "./temp"
    output_file = "output_2.tsv"

    os.makedirs(local_temp_dir, exist_ok=True)
    ssh_conn = SSH_conn(ip_address, username, password)

    try:
        ssh_conn.connect()
        directories = ssh_conn.list_directory(base_directory)
        print(f"Found directories: {directories}")

        all_results = []

        for directory in directories:
            fastqc_files = [
                f"{directory}reports/fastqc_post/{os.path.basename(directory.rstrip('/'))}-1-paired_fastqc.zip",
                f"{directory}reports/fastqc_post/{os.path.basename(directory.rstrip('/'))}-2-paired_fastqc.zip",
                f"{directory}reports/fastqc_post/{os.path.basename(directory.rstrip('/'))}-1-unpaired_fastqc.zip",
                f"{directory}reports/fastqc_post/{os.path.basename(directory.rstrip('/'))}-2-unpaired_fastqc.zip"
            ]

            total_sequences = 0
            total_base_pairs = 0
            quality_scores = []

            for fastqc_zip in fastqc_files:
                local_zip = os.path.join(local_temp_dir, os.path.basename(fastqc_zip))
                extracted_dir = os.path.join(local_temp_dir, "fastqc_extracted")

                try:
                    if os.path.exists(extracted_dir):
                        shutil.rmtree(extracted_dir)

                    ssh_conn.fetch_file(fastqc_zip, local_zip)
                    os.makedirs(extracted_dir, exist_ok=True)
                    unzip_file(local_zip, extracted_dir)

                    fastqc_subdir = find_fastqc_subdir(extracted_dir)
                    fastqc_data_file = os.path.join(fastqc_subdir, "fastqc_data.txt")

                    seqs, base_pairs, quality_avg = parse_fastqc_data(fastqc_data_file)
                    total_sequences += seqs
                    total_base_pairs += base_pairs
                    quality_scores.append(quality_avg)

                except Exception as e:
                    print(f"Error processing FastQC zip {fastqc_zip}: {e}")

            quality_score_avg = sum(quality_scores) / len(quality_scores) if quality_scores else None

            all_results.append({
                "Directory": os.path.basename(directory.rstrip('/')),
                "Number of Reads": total_sequences,
                "Quality Score Avg": quality_score_avg,
                "Total Base Pairs": total_base_pairs
            })

        if all_results:
            with open(output_file, 'w', newline='') as f:
                writer = csv.DictWriter(f, fieldnames=[
                    "Directory", "Number of Reads", "Quality Score Avg", "Total Base Pairs"
                ])
                writer.writeheader()
                writer.writerows(all_results)

            print(f"Results written to {output_file}")

    finally:
        ssh_conn.close()

if __name__ == "__main__":
    main()
