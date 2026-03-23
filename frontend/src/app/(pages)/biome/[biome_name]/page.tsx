"use client";

import Breadcrumb from "@/app/components/Breadcrumb";
import FlexCard from "@/app/components/FlexCard";
import Loading from "@/app/components/Loading";
import Maps from "@/app/components/Maps";
import { BiomeData, BreadcrumbProps, MapData, SampleData } from "@/app/types/gen.s";
import { Sample } from "@/app/types/model.s";
import axios from "axios";
import Link from "next/link";
import React from "react";

function Biome({ params }: { params: { biome_name: string } }) {
  const [biomeData, setBiomeData] = React.useState<BiomeData>();
  const [locations, setLocations] = React.useState<MapData[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [breadcrumbItems, setBreadcrumbItems] = React.useState<BreadcrumbProps["items"]>([]);

  const fetchAPI = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}:8080/api/biome`, {
        params: {
          biome_name: params.biome_name,
        },
      }
      
    );
      // console.log(response.data);
      setBiomeData(response.data);
        
      const locations: MapData[] = response.data.samples.filter(( sample: SampleData) => sample.geolocation.latitude && sample.geolocation.longitude !== null ).map(
        (sample: SampleData) => ( {
          sampleID: sample.prozomix_id,
          location: { lat: sample.geolocation.latitude, lng: sample.geolocation.longitude, region: sample.geolocation.region }, //sample.location,
          sampleNumID: sample.sample_num_id,
          studyID: sample.study_num_id
        })
      )
      // console.log(locations);
      setLocations(locations);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
    
  }
  React.useEffect(() => {
    
  const biomeName = biomeData?.biome_name;

  setBreadcrumbItems([
    { name: "Home", path: "/landing" },
    { name: biomeName }, // Current page, no path
  ]);
  }, [biomeData]);
  React.useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>
    {isLoading ? (<FlexCard width="w-full"><Loading /></FlexCard>) :
    (
    <div className='flex flex-col space-y-4 mb-3'>
      <Breadcrumb items={breadcrumbItems} />
      <FlexCard width="w-full" custom="space-x-5 space-y-5">
        {locations?.length !== 0 && (
        <div className="w-3/4 h-96 bg-white">
          <Maps locations={locations as MapData[]} />
        </div> )}
        <div className="w-full h-96 flex flex-col">
          <h1 className="text-4xl font-light">{biomeData?.biome_name}</h1>
          <div>
            <ul>Environment Ontology : {biomeData?.environment_ontology}</ul>
            <ul>Total Samples : {(biomeData?.samples)?.length}</ul>
          </div>
        </div>
      </FlexCard>
      <FlexCard width="w-full">

      <table className="border-separate border-spacing-x-1  border-slate-500 w-full py-2">
              <thead>
                <tr className="bg-deep-blue text-white">
                  <th className="px-3 py-2"></th>
                  <th className="px-3 py-2">Prozomix <br/> ID</th>
                  <th className="px-3 py-2">Sample <br/> Name</th>
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2">Environment</th>
                  <th className="px-3 py-2">Location</th>
                  <th className="px-3 py-2">Collection Date</th>
                </tr>

              </thead>
              <tbody>
                {biomeData?.samples.map((sample, index) => (
                  <tr
                    key={sample.sample_num_id}
                    className={`bg-opacity-90 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-200"
                    }`}
                  >
                    <td className="px-3 py-2 text-center">{index + 1}</td>
                    <td className="px-3 py-2 text-center">{sample.prozomix_id}</td>
                    <td className="px-3 py-2 text-center text-blue-500 "><Link href={`/study/${sample.study_num_id}/sample/${sample.sample_num_id}`}>{sample.short_sample_name} </Link></td>
                    <td className="px-3 py-2 w-1/4">{sample.description}</td>
                    <td className="px-3 py-2 text-center">{sample.environment}</td>
                    <td className="px-3 py-2 text-center">{sample.geolocation.region}</td>
                    <td className="px-3 py-2 w-1/6 text-center">{sample.collection_date}</td>
                    {/* This should be a string or number */}
                  </tr>
                ))}
              </tbody>
            </table>
      </FlexCard>
    </div>
    )}
    </>
  );
}

export default Biome;
