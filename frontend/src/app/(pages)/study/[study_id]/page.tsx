"use client";

import Breadcrumb from "@/app/components/Breadcrumb";
import FlexCard from "@/app/components/FlexCard";
import Loading from "@/app/components/Loading";
import Maps from "@/app/components/Maps";
import { BreadcrumbProps, MapData } from "@/app/types/gen.s";
import { Sample, type Study } from "@/app/types/model.s";
import axios from "axios";
import Link from "next/link";
import React, { use, useEffect } from "react";

function Study( { params }: { params: { study_id: string } } ) {
  const [studyData, setStudyData] = React.useState<Study>();
  const [locations, setLocations] = React.useState<MapData[] | null>(null);
  const [breadcrumbItems, setBreadcrumbItems] = React.useState<BreadcrumbProps["items"]>([]);
  const fetchStudy = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}:8080/api/study`, {
        params: {
          study_id: params.study_id,
        },
      });
      console.log(response.data);
      setStudyData(response.data);

      const locations: MapData[] = response.data.samples.filter(( sample: Sample) => sample.location.lat && sample.location.lng !== null ).map(
        (sample: Sample) => ( {
          sampleID: sample.prozomix_id,
          location: sample.location,
          sampleNumID: sample.sample_num_id,
        })
      )
      // console.log(locations);

      setLocations(locations);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setBreadcrumbItems([
      { name: "Home", path: "/landing" },
      { name: studyData?.title },
    ]);
  }, [studyData]);
  useEffect(() => {
    fetchStudy();
  }, []);

  return (
    <div>
{studyData ? (
<div className="flex flex-col space-y-4 mb-3">
      <Breadcrumb items={breadcrumbItems} />
      <FlexCard flexDir="flex-col" custom="py-9">
      <div className="flex w-full">          
            <div className="w-3/4 h-96 bg-white">
              <Maps locations={locations as MapData[]} link={`/study/${params.study_id}`} />{" "}
            </div>
            <div className="w-1/2 px-5 flex flex-col justify-start h-96">
              <p className="font-extralight text-3xl">{studyData.title}</p>
              <p className="text-lg">{studyData.description}</p>
              <p>
                The study, {studyData.title} (study ID: {studyData.study_unique_id}), submitted by {studyData.submitter_name} on {new Date(studyData.submission_date).toDateString()}, involves acomprehensive sampling trip across various regions. The study is referred to by its short name, {studyData.short_study_name}, and encompasses a total of {studyData.samples.length} samples.  </p>
            </div>

      </div>
      </FlexCard>
  <FlexCard>
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
                {studyData.samples.map((sample, index) => (
                  <tr
                    key={sample.sample_num_id}
                    className={`bg-opacity-100 ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                    }`}
                  >
                    <td className="px-3 py-2 text-center">{index + 1}</td>
                    <td className="px-3 py-2 text-center">{sample.prozomix_id}</td>
                    <td className="px-3 py-2 text-center text-blue-700 "><Link href={`/study/${params.study_id}/sample/${sample.sample_num_id}`}>{sample.short_sample_name} </Link></td>
                    <td className="px-3 py-2 w-1/5 text-center">{sample.description}</td>
                    <td className="px-3 py-2 w-1/6 text-center">{sample.environment}</td>
                    <td className="px-3 py-2 w-1/5 text-center">{sample.location.region}</td>
                    <td className="px-3 py-2 w-1/6 text-center">{sample.collection_date}</td>
                    {/* This should be a string or number */}
                  </tr>
                ))}
              </tbody>
            </table>
  </FlexCard>
  </div>
        ) : (
          <FlexCard>
            <Loading />
          </FlexCard>
        )}
    
    </div>
  );
}

export default Study;
