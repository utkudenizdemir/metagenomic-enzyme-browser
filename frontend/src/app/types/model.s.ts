// types/models.d.ts
export interface Biome {
  biome_name: string;
  samples: number;
}

export interface Study {
  study_num_id: number;
  study_unique_id: string;
  title: string;
  description: string;
  submitter_name: string;
  submission_date: string; // ISO 8601 format
  publication_link: string | null;
  short_study_name: string;
  samples: Sample[];
}

export interface Sample {
  sample_num_id: number;
  sample_unique_id: string;
  prozomix_id: string | null;
  study_num_id: number;
  biome_num_id: number | null;
  collection_date: string; // ISO 8601 format
  location: Location;
  environment: string;
  short_sample_name: string;
  description: string;
}

export interface Location {
  lat: number;
  lng: number;
  region: string;
}

export interface SequencingRun {
  run_num_id: number;
  run_unique_id: string;
  prep_num_id: number;
  sequence_provider_id: string;
  sequencing_platform: string;
  read_length: number;
  number_of_reads: number;
  quality_score_avg: number;
  sequencing_method: string;
  total_base_pairs: number;
}

export interface DNAPrep {
  prep_num_id: number;
  prep_unique_id: string;
  sample_num_id: number;
  prep_date: string | null;
  technician: string;
  kit_used: string;
  concentration: number | null;
  user_identifier: string;
  sequencing_runs: SequencingRun[];
}

export interface Assembly {
  assembly_num_id: number;
  assembly_unique_id: string;
  sample_num_id: number;
  assembler_tool: string;
  assembly_version: string;
  contig_count: number;
  largest_contig: number;
  N50: number;
  GC_content: number;
  total_assembled_length: number;
}

export interface Geolocation {
  geolocation_num_id: number;
  geolocation_unique_id: string;
  sample_num_id: number;
  latitude: number;
  longitude: number;
  altitude: number;
  depth: number;
  country: string;
  region: string;
  additional_info: string;
}

export interface Biome {
  biome_num_id: number;
  biome_unique_id: string;
  biome_name: string;
  environment_ontology: string;
}
