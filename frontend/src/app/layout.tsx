import Banner from "./components/Banner";
import { DM_Sans } from "next/font/google";
import "./global.css";
import SessionWrapper from "./components/SessionWrapper";
import Footer from "./components/Footer";
import { AOSInit } from "./aos/aos";
export const metadata = {
  title: "Prozomigo2",
  description: "Prozomigo2 Metagenome Browser",
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // All weights
  display: "swap", // Improves loading performance
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <AOSInit />
      <body>
        <SessionWrapper>
          <div className=" flex flex-col min-h-screen">
            <Banner />
            <div className="flex-grow flex justify-center items-center bg-deep-blue">
              {children}
            </div>
            <Footer />
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}
