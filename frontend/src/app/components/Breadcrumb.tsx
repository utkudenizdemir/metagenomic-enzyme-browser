import React from "react";
import Link from "next/link";
import { BreadcrumbProps } from "../types/gen.s";


const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="w-full p-2 bg-deep-blue text-lg">
    <nav className="breadcrumb">
      <ul className="flex items-center space-x-2 text">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.path ? (
              <Link href={item.path} className="text-white hover:underline">
                {item.name}
              </Link>
            ) : (
              <span className="text-white font-bold ">{item.name}</span>
            )}
            {index < items.length - 1 && (
              <span className="mx-2 text-white"> &gt; </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
    </div>
  );
};

export default Breadcrumb;