import Navbar from "@/app/components/Navbar";
import FullScreenNav from "@/app/components/FullScreenNav";
import Footer from "@/app/components/Footer";
import { NavProvider } from "@/app/context/NavContext";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NavProvider>
      <div className="min-h-screen flex flex-col bg-white text-black selection:bg-[#D3FD50] selection:text-black">
        <Navbar />
        <FullScreenNav />
        <main className="flex-1 w-full flex flex-col">{children}</main>
        <Footer />
      </div>
    </NavProvider>
  );
}
