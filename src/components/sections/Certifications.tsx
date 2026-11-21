import { ArrowUpRight } from 'lucide-react';
import GlassCard from '../GlassCard';
import Reveal from '../Reveal';
import SectionHeading from '../SectionHeading';
import { content } from '../../data/content';

export default function Certifications() {
  const copy = content.sections.certifications;

  return (
    <section
      aria-labelledby="certifications-heading"
      className="container-page pb-section"
    >
      <Reveal>
        <SectionHeading
          id="certifications-heading"
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
        {content.certifications.map((cert) => (
          <Reveal as="li" key={cert.id} className="h-full">
            <GlassCard as="article" className="flex h-full flex-col gap-4">
              <p className="font-mono text-label uppercase text-accent">
                {cert.year}
              </p>
              <div className="flex flex-1 flex-col gap-1.5">
                <h3 className="text-title text-text">{cert.title}</h3>
                <p className="text-base text-muted">{cert.issuer}</p>
              </div>
              {cert.credentialUrl ? (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${content.ui.viewCredential}: ${cert.title}`}
                  className="inline-flex min-h-11 w-fit items-center gap-1.5 rounded-sm text-sm font-medium text-text transition-[color,transform] duration-fast ease-out-strong motion-safe:active:scale-[0.97] [@media(hover:hover)]:hover:text-accent"
                >
                  {content.ui.viewCredential}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : null}
            </GlassCard>
          </Reveal>
        ))}
      </Reveal>
    </section>
  );
}