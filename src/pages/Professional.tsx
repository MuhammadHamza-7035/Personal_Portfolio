import Hero from '../components/sections/Hero';
import StatsRow from '../components/sections/StatsRow';
import Education from '../components/sections/Education';
import Experience from '../components/sections/Experience';
import Skills from '../components/sections/Skills';
import Certifications from '../components/sections/Certifications';
import Projects from '../components/sections/Projects';
import { content } from '../data/content';

export default function Professional() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* Every section below ends with pb-section, which keeps the vertical rhythm even. */}
      <Hero />
      <StatsRow />
      <Education />
      <Experience />
      <Skills />
      <Certifications />
      <Projects />

      <footer className="container-page">
        <div className="border-t py-8">
          <p className="font-mono text-label text-muted">
            &copy; {year} {content.name}. {content.ui.footerNote}
          </p>
        </div>
      </footer>
    </>
  );
}