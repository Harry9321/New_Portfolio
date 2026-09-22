import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Insights } from "@/components/Insights";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";

export default function Home() {
  return (
    <main className="relative">
      <BackgroundGlow />
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Insights />
      <Contact />
      <Footer />
    </main>
  );
}
