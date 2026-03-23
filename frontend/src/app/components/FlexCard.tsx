


function FlexCard({ children, width, flexDir, custom } : { children: any, width?: string, flexDir?: string, custom?: string }) {
    return (
        <div data-aos="fade-up" className={`flex ${flexDir || ""} ${width || "w-full"} justify-center items-center min-h-64 bg-light-blue px-10 py-6  ${custom || ''}`}>
            {children}
        </div>
    )
}


export default FlexCard

