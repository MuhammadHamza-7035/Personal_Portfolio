import Reveal from '../Reveal';
import SectionHeading from '../SectionHeading';
import { content } from '../../data/content';
import CircularGallery from '../CircularGallery';

export default function Projects() {
  const copy = content.sections.projects;

  return (
    <section
      aria-labelledby="projects-heading"
      className="container-page pb-section"
    >
      <Reveal>
        <SectionHeading
          id="projects-heading"
          label={copy.label}
          heading={copy.heading}
          subtext={copy.subtext}
        />
      </Reveal>

      <Reveal className="mt-10 sm:mt-14">
        <CircularGallery
          items={content.projects.map((p) => ({
            title: p.title,
            description: p.description,
            tags: p.tags,
            image: p.image,
            repoUrl: p.repoUrl,
          }))}
        />
      </Reveal>
    </section>
  );
}