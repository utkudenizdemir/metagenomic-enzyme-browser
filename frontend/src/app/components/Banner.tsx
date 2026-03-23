import Link from "next/link"


function Banner() {
  return (
    <div className='flex justify-center py-14 bg-[url("/banner2.png")] bg-cover bg-center'>
        <div className="w-3/4">
            <Link href={"/landing"}><h1 className='text-5xl text-deep-blue font-extrabold'>Prozomigo2</h1> </Link>
            <p className="text-3xl font-bold text-deep-blue">Metagenome Browser</p>
        </div>
      </div>
      
  )
}

export default Banner

