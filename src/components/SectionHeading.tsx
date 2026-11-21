import { cn } from '../lib/utils';

export type SectionHeadingLevel = 1 | 2 | 3;

export interface SectionHeadingProps {
  /** Small red uppercase mono label. */
  label: string;
  heading: string;
  subtext?: string;
  /** Heading element level. Use 1 only once per page. Defaults to 2. */
  level?: SectionHeadingLevel;
  align?: 'left' | 'center';
  /** Applied to the heading element, e.g. for aria-labelledby. */
  id?: string;
  className?: string;
}

const sizeClasses: Record<SectionHeadingLevel, string> = {
  1: 'text-display',
  2: 'text-headline',
  3: 'text-title',
};

export default function SectionHeading({
  label,
  heading,
  subtext,
  level = 2,
  align = 'left',
  id,
  className,
}: SectionHeadingProps) {
  const Heading = level === 1 ? 'h1' : level === 3 ? 'h3' : 'h2';
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        centered && 'items-center text-center',
        className,
      )}
    >
      <p className="eyebrow">{label}</p>
      <Heading id={id} className={cn(sizeClasses[level], 'max-w-3xl text-text')}>
        {heading}
      </Heading>
      {subtext ? (
        <p className="max-w-2xl text-lead text-muted">{subtext}</p>
      ) : null}
    </div>
  );
}