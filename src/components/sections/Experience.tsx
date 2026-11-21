import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import GlassCard from '../GlassCard';
import Reveal from '../Reveal';
import SectionHeading from '../SectionHeading';
import { content } from '../../data/content';
import { useReducedMotionSafe } from '../../lib/motion';

export default function Experience() {
  const copy = content.sections.experience;
  const { reduced } = useReducedMotionSafe();

  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 70%', 'end 60%'],
  });
  const lineProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
  });

  return (
    <section
      aria-labelledby="experience-heading"
      className="container-page pb-section"
    >
      <Reveal>
        <SectionHeading
          id="experience-heading"
          label={copy.label}
          heading={copy.heading}
          subtext={copy.subtext}
        />
      </Reveal>

      <div ref={timelineRef} className="relative mt-10 sm:mt-14">
        {/* Connecting line: faint track plus a red line drawn with scaleY on scroll. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-[7px] top-10 w-px [mask-image:linear-gradient(to_bottom,#000_88%,transparent)]"
        >
          <div className="absolute inset-0 bg-white/10" />
          <motion.div
            className="absolute inset-0 origin-top bg-accent"
            style={{
              scaleY: reduced ? 1 : lineProgress,
              willChange: reduced ? undefined : 'transform',
            }}
          />
        </div>

        <ol role="list" className="flex flex-col gap-6 sm:gap-8">
          {content.experience.map((item) => (
            <Reveal as="li" key={item.id} className="relative pl-10 sm:pl-14">
              <span
                aria-hidden="true"
                className="absolute left-0 top-8 h-[15px] w-[15px] rounded-full bg-accent shadow-[0_0_14px_var(--accent-glow)] ring-4 ring-bg"
              />

              <GlassCard as="article" className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <p className="font-mono text-label uppercase text-accent">
                    {item.period}
                  </p>
                  <h3 className="text-title text-text">{item.role}</h3>
                  <p className="text-base font-medium text-text/80">
                    {item.company}
                    <span aria-hidden="true" className="px-2 text-muted">
                      /
                    </span>
                    <span className="font-normal text-muted">{item.location}</span>
                  </p>
                </div>

                {item.summary ? (
                  <p className="text-sm leading-relaxed text-muted sm:text-base">
                    {item.summary}
                  </p>
                ) : null}

                <ul role="list" className="flex flex-col gap-2.5">
                  {item.highlights.map((highlight, index) => (
                    <li
                      key={`${item.id}-h${index}`}
                      className="flex items-start gap-3 text-sm leading-relaxed text-text/80 sm:text-base"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-muted"
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}