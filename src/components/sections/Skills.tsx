import GlassCard from '../GlassCard';
import Pill from '../Pill';
import Reveal from '../Reveal';
import SectionHeading from '../SectionHeading';
import { content } from '../../data/content';

export default function Skills() {
  const copy = content.sections.skills;

  return (
    <section
      aria-labelledby="skills-heading"
      className="container-page pb-section"
    >
      <Reveal>
        <SectionHeading
          id="skills-heading"
          label={copy.label}
          heading={copy.heading}
          subtext={copy.subtext}
        />
      </Reveal>

      <Reveal
        as="ul"
        stagger
        role="list"
        className="mt-10 grid gap-4 sm:mt-14 md:grid-cols-2"
      >
        {content.skills.map((group) => (
          <Reveal as="li" key={group.id} className="h-full">
            <GlassCard as="article" className="flex h-full flex-col gap-5">
              <h3 className="text-title text-text">{group.label}</h3>
              <ul role="list" className="flex flex-wrap gap-2">
                {group.tags.map((tag, index) => (
                  <li key={`${group.id}-t${index}`}>
                    <Pill>{tag}</Pill>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
        ))}
      </Reveal>
    </section>
  );
}