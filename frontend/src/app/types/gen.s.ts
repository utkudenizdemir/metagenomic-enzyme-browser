import { Assembly, DNAPrep, Study, Location, Geolocation, Biome, Sample } from "./model.s";


export interface MapData {
  sampleID: string;
  location: Location;
  sampleNumID: number;
  studyID?: number
}

export interface BiomeData {
  biome_num_id: number;
  biome_unique_id: string;
  biome_name: string;
  environment_ontology: string;
  samples: (Sample & {
    geolocation: Geolocation
  }) [];
  
}

export interface SampleData {
  sample_num_id: number;
  sample_unique_id: string;
  prozomix_id: string;
  study_num_id: number;
  biome_num_id: number | null;
  collection_date: string;
  location: Geolocation;
  environment: string;
  short_sample_name: string;
  description: string;
  study: Study;
  biome: Biome;
  geolocation: Geolocation;
  dna_preps: DNAPrep[];
  assemblies: Assembly[];
}

export interface BreadcrumbProps {
  items: { name: string | undefined; path?: string }[]; // Array of breadcrumb items
}