"use client"

import Breadcrumb from '@/app/components/Breadcrumb';
import FlexCard from '@/app/components/FlexCard';
import Loading from '@/app/components/Loading';
import Maps from '@/app/components/Maps';
import Title from '@/app/components/Title';
import { BreadcrumbProps, MapData, SampleData } from '@/app/types/gen.s';
import axios from 'axios';
import React from 'react'

function SampleID( { params }: { params: { study_id: string , sample_id: string} }) {
  const [sampleData, setSampleData] = React.useState<SampleData>();
  const [activeSection, setActiveSection] = React.useState("details");

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<BreadcrumbProps["items"]>([]);

  const sections = [
    { id: "details", label: "Sample Metadata" },
    { id: "geolocation", label: "Geolocation" },
    // { id: "analysis", label: "Analysis" },
  ];




  const fetchSample = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}:8080/api/sample`, {
        params: {
          "sample_id": params.sample_id,
        },
      });
      console.log(response.data);
      setSampleData(response.data);

    } catch (error) {
      console.error(error);
    }
  };


  React.useEffect(() => {
    
  const studyName = sampleData?.study.title;
  const sampleName = sampleData?.prozomix_id;

  setBreadcrumbItems([
    { name: "Home", path: "/landing" },
    { name: studyName, path: `/study/${params.study_id}` },
    { name: sampleName }, // Current page, no path
  ]);
  }, [sampleData]);
  React.useEffect(() => {
    fetchSample();
  }, []);  

  return (
    <>    {sampleData ? (
    <div className='flex flex-col space-y-4 mb-3'>

      <Breadcrumb items={breadcrumbItems} /> 
      <FlexCard flexDir='flex-col' custom='space-y-4'>

        <Title text={`Sample ${sampleData.prozomix_id}`} />
        <div className="flex flex-row w-full space-x-2">
          <Maps locations={[{sampleID: sampleData.prozomix_id,
                             location: { lat: sampleData.geolocation.latitude,
                                         lng: sampleData.geolocation.longitude,
                                        region: sampleData.geolocation.region, },
                              sampleNumID: sampleData.sample_num_id}
                              ]}  />
          <div className="flex flex-col w-full space-y-2">
            {/* NavBar   */}
            <div className="flex flex-row bg-deep-blue  text-white w-full transition-all ease-in-out">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`p-4 text-md border-y-4 border-y-deep-blue transition-all ease-in-out duration-500 hover:border-b-white ${
                    activeSection === section.id ? "border-b-white" : ""
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* Main Content */}
            {/* Sample Metadata */}
            <div className="flex w-full p-4 bg-white h-full text-lg">
              { activeSection === "details" && (
                <div className="w-full" data-aos="fade-in-out">

                  <div>
                    <ul>Sample ID: {sampleData.prozomix_id}</ul>
                    <ul>Short Name: {sampleData.short_sample_name}</ul>
                    <ul>Collection Date: {sampleData.collection_date}</ul>
                    <ul>Environment: {sampleData.environment}</ul>
                    <ul>Enviroment Ontology: {sampleData.biome.environment_ontology}</ul>
                    <ul>Biome: {sampleData.biome.biome_name}</ul>
                    <ul>Study: {sampleData.study.title}</ul>
                    <ul>Submitted by: {sampleData.study.submitter_name}</ul>

                  </div>
                </div>
              )}
              { activeSection === "geolocation" && (
                <div className="w-full " data-aos="fade-in-out">
                  <p>

                    <ul>Latitude: {sampleData.geolocation.latitude}</ul>
                    <ul>Longitude: {sampleData.geolocation.longitude}</ul>
                    <ul>Region: {sampleData.geolocation.region}</ul>
                    <ul>Altitude: {sampleData.geolocation.altitude}</ul>
                    <ul>Depth: {sampleData.geolocation.depth}</ul>
                    <ul>Country: {sampleData.geolocation.country}</ul>
                    <ul>Additional Info: {sampleData.geolocation.additional_info}</ul>
                  </p>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </FlexCard>
      {/* Analysis */}
      <FlexCard flexDir='flex-col' custom='space-y-4'>
        <Title text="Analysis" />
            <div className="w-full">
            <div className="w-full">
              <h1 className="text-2xl">Assemblies</h1>
              <div className="w-full">

              <table className="border-separate border-spacing-y-1  border-slate-500 w-full py-2">
                  <thead>
                    <tr className="bg-deep-blue text-white">
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2">Assembly ID</th>
                      <th className="px-3 py-2">Assembly Version</th>
                      <th className="px-3 py-2">Assembler Tool</th>
                      <th className="px-3 py-2">N50 (bp)</th>
                      <th className="px-3 py-2">GC Content</th>
                      <th className="px-3 py-2">Total Assembled Length (bp)</th>
                      <th className="px-3 py-2">Largest Contig (bp)</th>
                      <th className="px-3 py-2">Contig Count (bp)</th>
                    </tr>

                  </thead>
                  <tbody>
                    {sampleData.assemblies.map((assembly, index) => (
                      <tr
                        key={assembly.sample_num_id}
                        className={`bg-opacity-90 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-200"
                        }`}
                      >
                        <td className="px-3 py-2 text-center">{index + 1}</td>
                        <td className="px-3 py-2 text-center">{assembly.assembly_unique_id}</td>
                        <td className="px-3 py-2 text-center">{assembly.assembly_version}</td>
                        <td className="px-3 py-2 text-center">{assembly.assembler_tool}</td>
                        <td className="px-3 py-2 text-center">{assembly.N50}</td>
                        <td className="px-3 py-2 text-center">{assembly.GC_content}%</td>
                        <td className="px-3 py-2 text-center ">{assembly.total_assembled_length}</td>
                        <td className="px-3 py-2 text-center">{assembly.largest_contig}</td>
                        <td className="px-3 py-2 text-center">{assembly.contig_count}</td>
                        {/* This should be a string or number */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </FlexCard>
    </div>
    ) : (
      <FlexCard> <Loading /> </FlexCard>
      )
    }
  </>

  )
}

export default SampleID