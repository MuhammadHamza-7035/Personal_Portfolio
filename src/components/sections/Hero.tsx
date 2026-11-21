import type { ComponentType, SVGProps } from 'react';
import Button from '../Button';
import IconButton from '../IconButton';
import Reveal from '../Reveal';
import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedinIcon,
} from '../icons/BrandIcons';
import { content } from '../../data/content';
import type { SocialLinks } from '../../data/content';
import FlipName from '../FlipName';
import ProfileCard from '../ProfileCard';

interface SocialEntry {
  key: keyof SocialLinks;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const socialEntries: SocialEntry[] = [
  { key: 'github', label: 'GitHub', Icon: GitHubIcon },
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedinIcon },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'facebook', label: 'Facebook', Icon: FacebookIcon },
];

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="container-page grid items-center gap-12 py-10 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:py-24"
    >
      {/* Left column: staggered fade-up */}
      <Reveal stagger className="flex flex-col items-start gap-6">
        <Reveal
          as="h1"
          id="hero-heading"
          className="text-display text-white"
          style={{ fontSize: 'clamp(2.75rem, 0.9rem + 5.6vw, 6.75rem)' }}
        >
          <FlipName
            front={content.name.split(" ")}
            back={["AI / ML", "Engineer"]}
          />
        </Reveal>

        <Reveal as="p" className="max-w-xl text-lead text-muted">
          {content.bio}
        </Reveal>

        <Reveal className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
          <Button href={content.cvUrl} target="_blank" size="lg">
            VIEW CV
          </Button>

          <ul role="list" className="flex items-center gap-3">
            {socialEntries.map(({ key, label, Icon }) => (
              <li key={key}>
                <IconButton href={content.socials[key]} label={label}>
                  <Icon />
                </IconButton>
              </li>
            ))}
          </ul>
        </Reveal>
      </Reveal>

      {/* Right column: profile image with orbiting electrons and breathing red aura */}
        <ProfileCard
          name={content.name}
          role="AI / ML Engineer"
          handle="@muhammadhamza-7035]"
        />
    </section>
  );
} 