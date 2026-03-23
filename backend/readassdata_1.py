import paramiko
import os
import csv

class SSH_conn():

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

def parse_multiqc_fastqc(file_path):
    """Parse the multiqc_fastqc.txt file to extract GC (%) from the first row."""
    try:
        with open(file_path, 'r') as f:
            reader = csv.DictReader(f, delimiter='\t')
            rows = list(reader)
            if rows:
                # Check for both possible column names
                gc_value = rows[0].get("%GC") or rows[0].get("GC (%)", "N/A")
                print(f"GC (%) retrieved from multiqc_fastqc.txt: {gc_value}")
                return gc_value
    except Exception as e:
        print(f"Error parsing {file_path}: {e}")
    return "N/A"


def parse_multiqc_quast(file_path, fastqc_gc):
    """Parse the multiqc_quast.txt file and extract relevant fields."""
    results = []
    with open(file_path, 'r') as f:
        reader = csv.DictReader(f, delimiter='\t')
        rows = list(reader)
        print(f"Rows fetched from {file_path}: {rows}")
        for row in rows:
            gc_value = row.get("GC (%)", "N/A")
            if gc_value == "N/A":
                gc_value = fastqc_gc
                print(f"GC (%) missing in multiqc_quast.txt; using value from multiqc_fastqc.txt: {gc_value}")
            else:
                print(f"GC (%) retrieved from multiqc_quast.txt: {gc_value}")
            results.append({
                "contigs >= 1000 bp": row.get("# contigs (>= 1000 bp)", "N/A"),
                "Largest contig": row.get("Largest contig", "N/A"),
                "Total length": row.get("Total length", "N/A"),
                "N50": row.get("N50", "N/A"),
                "GC (%)": gc_value
            })
    return results

def main():
    # Set up SSH connection details
    ip_address = "82.148.225.97"
    username = "neil"
    password = input("Enter the SSH password: ")

    base_directory = "/data/njord_db/data/assemblies/"
    local_temp_dir = "./temp"
    output_file = "output.tsv"

    # Ensure local temporary directory exists
    os.makedirs(local_temp_dir, exist_ok=True)

    # Initialize SSH connection
    ssh_conn = SSH_conn(ip_address, username, password)
    
    try:
        ssh_conn.connect()

        # List directories in the base path
        directories = ssh_conn.list_directory(base_directory)
        print(f"Found directories: {directories}")

        all_results = []

        for directory in directories:
            quast_file = f"{directory}reports/multiqc_data/multiqc_quast.txt"
            fastqc_file = f"{directory}reports/multiqc_data/multiqc_fastqc.txt"
            local_quast_file = os.path.join(local_temp_dir, os.path.basename(directory.rstrip('/')) + "_multiqc_quast.txt")
            local_fastqc_file = os.path.join(local_temp_dir, os.path.basename(directory.rstrip('/')) + "_multiqc_fastqc.txt")

            try:
                # Fetch files
                ssh_conn.fetch_file(fastqc_file, local_fastqc_file)
                fastqc_gc = parse_multiqc_fastqc(local_fastqc_file)

                ssh_conn.fetch_file(quast_file, local_quast_file)

                # Parse the file and append the results
                parsed_results = parse_multiqc_quast(local_quast_file, fastqc_gc)
                for result in parsed_results:
                    result["Directory"] = os.path.basename(directory.rstrip('/'))
                    all_results.append(result)

            except Exception as e:
                print(f"Could not fetch or process file for directory {directory}: {e}")

        # Write results to a TSV file
        if all_results:
            with open(output_file, 'w', newline='') as f:
                writer = csv.DictWriter(f, fieldnames=["Directory","contigs >= 1000 bp", "Largest contig", "N50", "GC (%)","Total length"])
                writer.writeheader()
                writer.writerows(all_results)

            print(f"Results written to {output_file}")

    finally:
        ssh_conn.close()

if __name__ == "__main__":
    main()