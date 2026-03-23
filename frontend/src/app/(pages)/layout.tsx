import SearchBar from "../components/SearchBar"

export default function UserLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="flex flex-col w-3/4 py-2 mb-auto ">
        <SearchBar/>
   
        {children}
      </div>
    )
  }