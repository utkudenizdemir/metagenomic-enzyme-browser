"use client";

import React from "react";
import FlexCard from "../../components/FlexCard";
import SearchBar from "../../components/SearchBar";


const studies =  [
  {
    "ID": 1,
    "Biome": "Marine",
    "Study Name": "Global Ocean Microbiome Study",
    "Total Samples": 1500
  },
  {
    "ID": 2,
    "Biome": "Aquatic",
    "Study Name": "Freshwater Lake Microbiomes",
    "Total Samples": 850
  },
  {
    "ID": 3,
    "Biome": "Marine",
    "Study Name": "Deep Sea Hydrothermal Vents Microbiome Study 2024 Round 3 Subdivsion 18 Part 2 of 3 (Final) (Revised) (Final) (Revised)",  
    "Total Samples": 1200
  },
  {
    "ID": 4,
    "Biome": "Aquatic",
    "Study Name": "Riverine Microbial Diversity",
    "Total Samples": 940
  },
  {
    "ID": 5,
    "Biome": "Marine",
    "Study Name": "Coral Reef Microbiome Survey",
    "Total Samples": 1100
  }
]




function Results() {
  return (
    <>
      <FlexCard width="w-full" custom="bg-opacity-50" >
      <table className="border-separate border-spacing-x-2  border-slate-500 w-full py-2">
              <thead>
                <tr className="bg-deep-blue text-white">
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Biome</th>
                  <th className="px-3 py-2">Study Name</th>
                  <th className="px-3 py-2">Total Samples</th>
                </tr>

              </thead>
              <tbody>
                {studies.map((study, index) => (
                  <tr
                    key={study.ID}
                    className={`bg-opacity-90 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-200"
                    }`}
                  >
                    <td className="px-3 py-2 text-center">{study.ID}</td>
                    <td className="px-3 py-2">{study.Biome}</td>
                    <td className="px-3 py-2 w-2/3">{study["Study Name"]}</td>
                    <td className="px-3 py-2 text-center">{study["Total Samples"]}</td>
                    {/* This should be a string or number */}
                  </tr>
                ))}
              </tbody>
            </table>
      </FlexCard>
    </>
  );
}

export default Results;
