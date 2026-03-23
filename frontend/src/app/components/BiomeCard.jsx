import Link from "next/link"

function BiomeCard({ biomeName, biomeStudies, biomeImage, index }) {
    return (
            <div className="col-span-1">
                <div className="flex flex-col  items-center gap-1 px-1 py-1 transition-all duration-200 scale-100 hover:scale-110">

                    <Link href={`/biome/${biomeName}`}>
                    <img src={biomeImage}
                        className="w-20 h-20 object-center object-cover rounded-full "
                        onError={(e) => (e.target.src = "undefined.svg")}
                    />
                    <div className="w-20 text-center">
                        <div className="h-16 flex flex-col items-center justify-center">
                        <h1 className="text-deep-blue font-bold leading-tight ">
                            {biomeName}
                        </h1>
                        <p className="text-blue-800">({biomeStudies})</p>
                        </div>
                    </div>
                    </Link>
                </div>
            </div>
            
        
    )
}

export default BiomeCard