import GlassCard from '../GlassCard';
import Reveal from '../Reveal';
import SectionHeading from '../SectionHeading';
import { content } from '../../data/content';

export default function Education() {
  const copy = content.sections.education;

  return (
    <section
      aria-labelledby="education-heading"
      className="container-page pb-section"
    >
      <Reveal>
        <SectionHeading
          id="education-heading"
          label={copy.label}
          heading={copy.heading}
          subtext={copy.subtext}
        />
      </Reveal>

      <Reveal
        as="ul"
        stagger
        role="list"
        className="mt-10 grid gap-4 sm:mt-14 md:grid-cols-2 lg:grid-cols-3"
      >
        {content.education.map((item) => (
          <Reveal as="li" key={item.id} className="h-full">
            <GlassCard as="article" className="flex h-full flex-col gap-4">
              <p className="font-mono text-label uppercase text-accent">
                {item.period}
              </p>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-title text-text">{item.degree}</h3>
                <p className="text-base font-medium text-text/80">
                  {item.institution}
                </p>
              </div>
              {item.description ? (
                <p className="text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              ) : null}
            </GlassCard>
          </Reveal>
        ))}
      </Reveal>
    </section>
  );
}