import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import Nav from "@/components/Nav";
import Projects from "@/components/Projects";
import Reveal from "@/components/Reveal";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import Skills from "@/components/Skills";
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
        <Skills />
        <Journey />
      </main>
      <Footer />
      <Reveal />
      <SvgSymbols />
    </>
  );
}
