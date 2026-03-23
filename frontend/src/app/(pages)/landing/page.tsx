"use client";

import FlexCard from "../../components/FlexCard";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import BiomeCard from "../../components/BiomeCard";
import SearchBar from "../../components/SearchBar";
import { useSession } from "next-auth/react";
import { Study } from "@/app/types/model.s";
import Link from "next/link";
import Loading from "@/app/components/Loading";
import { MapData } from "@/app/types/gen.s";
import Maps from "@/app/components/Maps";
import { biomes } from "@/app/dummydata/data";
import styles from "@/app/styles/Landing.module.scss";

function Landing() {
  // type Response = {
  //     [key: string]: string | number;
  //   }; This is the type of the object that is returned from the API and is defined inside the <> of useState.

  const [stats, setStats] = useState<{ [key: string]: string | number }>({});
  const [biomeInfo, setBiomeInfo] = useState<
    { biome_name: string; samples: number }[]
  >([]);
  const [studies, setStudies] = useState<Study[]>([]);
  const [sampleCoords, setSampleCoords] = useState<MapData[]>([]);
  [];
  const [fetchStatus, setFetchStatus] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  const fetchAPI = async () => {
    try {
      const [statsRes, biomeInfoRes, studiesRes, sampleCoordsRes] =
        await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}:8080/api/stats`),
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}:8080/api/biomeinfo`),
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}:8080/api/studies`),
          axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}:8080/api/samplecoords`
          ),
        ]);
      // console.log(Object.keys(response.data));
      setStats(statsRes.data);
      // console.log(biomeInfoRes.data);
      setBiomeInfo(biomeInfoRes.data);
      // console.log(studiesRes.data);
      setStudies(studiesRes.data);
      // console.log(sampleCoordsRes.data);
      setSampleCoords(sampleCoordsRes.data);
      setFetchStatus(true);
    } catch (error) {
      console.error(error);
    }
    // console.log(array)
    //
  };
  const { data: session } = useSession();
  session ? console.log(session) : console.log("No session");

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>
      {fetchStatus ? (
        <div className="transition-all ease-in-out">
          <div className=" flex flex-col items-center space-y-5 my-3">
            <FlexCard flexDir={"flex-col"} custom={"space-y-5"}>
              <div className="flex flex-col items-center w-full space-y-1 text-center">
                <p className="font-extralight text-4xl">Samples Overview</p>
              </div>
              <Maps locations={sampleCoords} height="800px" />
            </FlexCard>
            <div className=" flex w-full min-h-64 space-x-5">
              <FlexCard flexDir={"flex-col"}>
                <div className="flex flex-col items-center w-full space-y-1 text-center">
                  <p className="font-extralight text-3xl text-center">Biomes</p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Facilis, temporibus.
                  </p>
                </div>
                <div className={styles.circleContainer}>
                  {biomeInfo.map((biome, index) => (
                    <BiomeCard
                      key={index}
                      biomeName={biome.biome_name}
                      biomeStudies={biome.samples}
                      biomeImage={`${biome.biome_name}.svg`}
                      index={index}
                    />
                  ))}
                </div>
              </FlexCard>
              <FlexCard
                width={"w-2/3"}
                flexDir={"flex-col"}
                custom={"space-y-3"}
              >
                <p className="font-extralight text-3xl">Latest Stats</p>

                <table className="border-separate border-spacing-x-1">
                  <thead></thead>
                  <tbody>
                    {Object.keys(stats).map((key, index) => (
                      <tr
                        key={key}
                        className={`py-10  ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-200"
                        }`}
                      >
                        <td className="px-3 py-2">{key}</td>
                        <td className="px-3 py-2">{stats[key]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </FlexCard>
            </div>
            <FlexCard flexDir={"flex-col"} custom={"space-y-5"}>
              <div className="w-full text-center ">
                <p className="font-extralight text-3xl">Studies</p>
              </div>
               <div className="w-full text-lg px-10 pb-10">
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out space-y-3 ${
                    showMore ? "max-h-[500px] opacity-100" : "max-h-[200px] opacity-90"
                  }`}
                >
                  {studies.map((study, index) => (
                    <div key={index} className="p-4 border-b-8 border-r-8 bg-white border-deep-blue flex flex-row justify-between items-center">
                      <div className="w-1/2">
                        <Link href={`/study/${study.study_num_id}`}>
                          <p className="font-semibold">{study.title}</p>
                        </Link>
                        <p className="text-sm">{study.description}.</p>
                      </div>
                      <div className="w-1/2 flex justify-end text-xl">
                        <p>Samples : {study.samples.length}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  className="text-deep-blue underline hover:cursor-pointer mt-4 block"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? "Show less..." : "Show more..."}
                </a>
              </div>
            </FlexCard>
          </div>
        </div>
      ) : (
        <FlexCard>
          <Loading />
        </FlexCard>
      )}
    </>
  );
}

export default Landing;
