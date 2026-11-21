import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Copy } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import IconButton from '../components/IconButton';
import InfoCard from '../components/InfoCard';
import Pill from '../components/Pill';
import Reveal from '../components/Reveal';
import { content } from '../data/content';
import type { ContactLine } from '../data/content';
import { EASE_OUT, useReducedMotionSafe } from '../lib/motion';
import { cn, isExternalHref } from '../lib/utils';

const COPIED_RESET_MS = 1800;

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers or contexts without the async clipboard API.
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    }
    document.body.removeChild(area);
    return copied;
  }
}

/** Status dot. The ring pulses with opacity + transform only. */
function StatusDot({ active }: { active: boolean }) {
  const { reduced } = useReducedMotionSafe();

  return (
    <span aria-hidden="true" className="relative inline-flex h-2.5 w-2.5">
      {active && !reduced ? (
        <motion.span
          className="absolute inset-0 rounded-full bg-accent"
          style={{ willChange: 'transform, opacity' }}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: [0.6, 0], scale: [1, 2.6] }}
          transition={{ duration: 1.8, ease: EASE_OUT, repeat: Infinity }}
        />
      ) : null}
      <span
        className={cn(
          'relative h-2.5 w-2.5 rounded-full',
          active ? 'bg-accent shadow-glow' : 'bg-muted',
        )}
      />
    </span>
  );
}

interface DirectLineRowProps {
  line: ContactLine;
  copied: boolean;
  onCopy: () => void;
}

function DirectLineRow({ line, copied, onCopy }: DirectLineRowProps) {
  const { scaleIn } = useReducedMotionSafe();
  const external = isExternalHref(line.href);

  return (
    <li className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="font-mono text-label uppercase text-muted">{line.label}</p>
        <a
          href={line.href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="mt-1.5 block break-all rounded-sm text-base text-text transition-colors duration-fast ease-out-strong [@media(hover:hover)]:hover:text-accent"
        >
          {line.value}
        </a>
      </div>

      <IconButton
        label={`${content.contact.copyLabel} ${line.label}`}
        onClick={onCopy}
      >
        <motion.span
          key={copied ? 'copied' : 'copy'}
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="inline-flex"
        >
          {copied ? <Check /> : <Copy />}
        </motion.span>
      </IconButton>
    </li>
  );
}

function DirectLines() {
  const { directLines, copiedLabel } = content.contact;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleCopy = async (line: ContactLine): Promise<void> => {
    const ok = await copyText(line.value);
    if (!ok) return;
    setCopiedId(line.id);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopiedId(null), COPIED_RESET_MS);
  };

  const copiedLine = directLines.find((line) => line.id === copiedId);

  return (
    <>
      <ul role="list" className="flex flex-col divide-y">
        {directLines.map((line) => (
          <DirectLineRow
            key={line.id}
            line={line}
            copied={copiedId === line.id}
            onCopy={() => {
              void handleCopy(line);
            }}
          />
        ))}
      </ul>
      <p role="status" aria-live="polite" className="sr-only">
        {copiedLine ? `${copiedLabel}: ${copiedLine.label}` : ''}
      </p>
    </>
  );
}

export default function Contact() {
  const { contact } = content;
  const statusLabel = contact.availableForHire
    ? 'Available for Hire'
    : contact.unavailableLabel;

  return (
    <div className="container-page grid gap-12 py-10 sm:py-16 lg:grid-cols-2 lg:items-start lg:gap-12 lg:py-24">
      {/* Left column */}
      <Reveal stagger className="flex flex-col gap-6">
        <Reveal as="p" className="eyebrow">
          INQUIRIES
        </Reveal>

        <Reveal
          as="h1"
          className="text-display font-bold uppercase text-white"
          style={{ fontSize: 'clamp(3rem, 1.2rem + 7vw, 7rem)' }}
        >
          LET&rsquo;S WORK.
        </Reveal>

        <div className="mt-2 flex flex-col gap-4">
          <Reveal>
            <InfoCard label="CURRENT POSITION">
              <p className="text-lg font-medium tracking-tight text-text">
                {contact.currentPosition}
              </p>
            </InfoCard>
          </Reveal>

          <Reveal>
            <InfoCard label="DIRECT LINES">
              <DirectLines />
            </InfoCard>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal className="h-full">
              <InfoCard label="FROM" className="h-full">
                <p className="text-base text-text">{contact.from}</p>
              </InfoCard>
            </Reveal>

            <Reveal className="h-full">
              <InfoCard label="LANGUAGE" className="h-full">
                <ul role="list" className="flex flex-wrap gap-2">
                  {contact.languages.map((language) => (
                    <li key={language}>
                      <Pill>{language}</Pill>
                    </li>
                  ))}
                </ul>
              </InfoCard>
            </Reveal>
          </div>

          <Reveal>
            <InfoCard
              label={statusLabel}
              adornment={<StatusDot active={contact.availableForHire} />}
            >
              <p className="text-sm leading-relaxed text-muted">
                {contact.availabilityNote}
              </p>
            </InfoCard>
          </Reveal>
        </div>
      </Reveal>

      {/* Right column */}
      <Reveal delay={0.2}>
        <ContactForm />
      </Reveal>
    </div>
  );
}