import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Projects from "@/components/Projects";
import Reveal from "@/components/Reveal";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import SvgSymbols from "@/components/SvgSymbols";

export default function Home() {
  return (
    <>
      <ScrollProgressBar />
      <Cursor />
      <Nav />
      <Hero />
      <main className="wrap">
        <Projects />
      </main>
      <Footer />
      <Reveal />
      <SvgSymbols />
    </>
  );
}
