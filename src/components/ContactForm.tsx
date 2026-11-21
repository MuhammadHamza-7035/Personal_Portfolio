import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check } from 'lucide-react';
import Button from './Button';
import GlassCard from './GlassCard';
import { content } from '../data/content';
import {
  DISTANCE,
  DURATION,
  EASE_OUT,
  ENTER_SCALE,
  useReducedMotionSafe,
} from '../lib/motion';
import { cn } from '../lib/utils';

type FieldName = 'name' | 'email' | 'message';
type FormValues = Record<FieldName, string>;
type FormErrors = Partial<Record<FieldName, string>>;
type TouchedFields = Record<FieldName, boolean>;
type Status = 'idle' | 'submitting' | 'success';

const FIELD_ORDER: FieldName[] = ['name', 'email', 'message'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const EMPTY_VALUES: FormValues = { name: '', email: '', message: '' };
const NOTHING_TOUCHED: TouchedFields = { name: false, email: false, message: false };
const EVERYTHING_TOUCHED: TouchedFields = { name: true, email: true, message: true };

function validateField(field: FieldName, value: string): string | undefined {
  const { errors, minMessageLength } = content.contact.form;
  const trimmed = value.trim();

  switch (field) {
    case 'name':
      return trimmed ? undefined : errors.nameRequired;
    case 'email':
      if (!trimmed) return errors.emailRequired;
      return EMAIL_PATTERN.test(trimmed) ? undefined : errors.emailInvalid;
    case 'message':
      if (!trimmed) return errors.messageRequired;
      return trimmed.length >= minMessageLength
        ? undefined
        : errors.messageTooShort.replace('{min}', String(minMessageLength));
  }
}

function validateAll(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  for (const field of FIELD_ORDER) {
    const message = validateField(field, values[field]);
    if (message) errors[field] = message;
  }
  return errors;
}

const labelClasses = 'font-mono text-label uppercase text-muted';

const controlClasses =
  'w-full rounded-md border bg-white/5 px-4 py-3 text-base text-text placeholder:text-muted/80 ' +
  'transition-[border-color,background-color] duration-fast ease-out-strong ' +
  'focus-visible:border-accent/60 focus-visible:bg-white/[0.07] ' +
  '[@media(hover:hover)]:hover:border-white/20 disabled:opacity-60';

const invalidClasses = 'border-accent/70';

/** Space is always reserved so errors appearing never shift the layout. */
function FieldError({ id, message }: { id: string; message?: string }) {
  const { reduced } = useReducedMotionSafe();

  return (
    <div className="min-h-5" aria-live="polite">
      <AnimatePresence initial={false} mode="wait">
        {message ? (
          <motion.p
            key={message}
            id={id}
            className="text-sm text-accent"
            initial={
              reduced ? { opacity: 0 } : { opacity: 0, y: -DISTANCE.pageExit }
            }
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: DURATION.fast, ease: EASE_OUT },
            }}
            exit={{
              opacity: 0,
              transition: { duration: DURATION.micro, ease: EASE_OUT },
            }}
          >
            {message}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function blockMotion(reduced: boolean) {
  return {
    initial: reduced
      ? { opacity: 0 }
      : { opacity: 0, y: DISTANCE.reveal },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.base, ease: EASE_OUT },
    },
    exit: {
      opacity: 0,
      transition: { duration: DURATION.micro, ease: EASE_OUT },
    },
  };
}

export default function ContactForm() {
  const { form, formIntro } = content.contact;
  const { reduced } = useReducedMotionSafe();

  const headingId = useId();
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const fieldIds: Record<FieldName, string> = {
    name: nameId,
    email: emailId,
    message: messageId,
  };

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [touched, setTouched] = useState<TouchedFields>(NOTHING_TOUCHED);
  const [status, setStatus] = useState<Status>('idle');

  const errors = useMemo(() => validateAll(values), [values]);
  const visibleError = (field: FieldName): string | undefined =>
    touched[field] ? errors[field] : undefined;

  const submitting = status === 'submitting';

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Move focus to the confirmation so keyboard and screen-reader users land on it.
  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const focusField = (field: FieldName) => {
    const refs = { name: nameRef, email: emailRef, message: messageRef };
    refs[field].current?.focus();
  };

  const handleChange =
    (field: FieldName) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = event.target.value;
      setValues((previous) => ({ ...previous, [field]: next }));
    };

  const handleBlur = (field: FieldName) => () => {
    setTouched((previous) => ({ ...previous, [field]: true }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (submitting) return;

    setTouched(EVERYTHING_TOUCHED);

    const firstInvalid = FIELD_ORDER.find((field) => errors[field]);
    if (firstInvalid) {
      focusField(firstInvalid);
      return;
    }

    setStatus('submitting');

    // TODO: replace with real endpoint
    // Simulated request: waits 1 second, then always succeeds.
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 1000);
    });

    if (isMounted.current) setStatus('success');
  };

  const reset = () => {
    setValues(EMPTY_VALUES);
    setTouched(NOTHING_TOUCHED);
    setStatus('idle');
  };

  return (
    <GlassCard padding="lg">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <motion.div
            key="success"
            ref={successRef}
            tabIndex={-1}
            role="status"
            {...blockMotion(reduced)}
            className="flex flex-col items-start gap-5 focus:outline-none"
          >
            <motion.span
              aria-hidden="true"
              className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent shadow-glow"
              initial={
                reduced ? { opacity: 0 } : { opacity: 0, scale: ENTER_SCALE }
              }
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  duration: DURATION.base,
                  ease: EASE_OUT,
                  delay: 0.1,
                },
              }}
            >
              <Check className="h-6 w-6" />
            </motion.span>

            <h2
              className="text-headline text-white"
              style={{ fontSize: 'clamp(1.75rem, 1.3rem + 1.4vw, 2.5rem)' }}
            >
              {form.success.title}
            </h2>
            <p className="max-w-md text-base text-muted">{form.success.body}</p>
            <Button variant="ghost" onClick={reset}>
              {form.success.reset}
            </Button>
          </motion.div>
        ) : (
          <motion.div key="form" {...blockMotion(reduced)}>
            <h2
              id={headingId}
              className="text-headline text-white"
              style={{ fontSize: 'clamp(1.75rem, 1.3rem + 1.4vw, 2.5rem)' }}
            >
              Get in Touch
            </h2>
            <p className="mt-3 max-w-md text-base text-muted">{formIntro}</p>

            <form
              noValidate
              aria-labelledby={headingId}
              onSubmit={(event) => {
                void submit(event);
              }}
              className="mt-8"
            >
              <p role="status" aria-live="polite" className="sr-only">
                {submitting ? form.submitting : ''}
              </p>

              <fieldset
                disabled={submitting}
                className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0"
              >
                <div className="grid gap-3 sm:grid-cols-2 sm:gap-5">
                  {/* NAME */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor={nameId} className={labelClasses}>
                      NAME
                    </label>
                    <input
                      ref={nameRef}
                      id={nameId}
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      maxLength={100}
                      value={values.name}
                      onChange={handleChange('name')}
                      onBlur={handleBlur('name')}
                      placeholder={form.placeholders.name}
                      aria-invalid={visibleError('name') ? true : undefined}
                      aria-describedby={
                        visibleError('name') ? `${fieldIds.name}-error` : undefined
                      }
                      className={cn(
                        controlClasses,
                        visibleError('name') && invalidClasses,
                      )}
                    />
                    <FieldError
                      id={`${fieldIds.name}-error`}
                      message={visibleError('name')}
                    />
                  </div>

                  {/* EMAIL ADDRESS */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor={emailId} className={labelClasses}>
                      EMAIL ADDRESS
                    </label>
                    <input
                      ref={emailRef}
                      id={emailId}
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      value={values.email}
                      onChange={handleChange('email')}
                      onBlur={handleBlur('email')}
                      placeholder={form.placeholders.email}
                      aria-invalid={visibleError('email') ? true : undefined}
                      aria-describedby={
                        visibleError('email') ? `${fieldIds.email}-error` : undefined
                      }
                      className={cn(
                        controlClasses,
                        visibleError('email') && invalidClasses,
                      )}
                    />
                    <FieldError
                      id={`${fieldIds.email}-error`}
                      message={visibleError('email')}
                    />
                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex flex-col gap-2">
                  <label htmlFor={messageId} className={labelClasses}>
                    CONTENT
                  </label>
                  <textarea
                    ref={messageRef}
                    id={messageId}
                    name="message"
                    rows={6}
                    required
                    maxLength={2000}
                    value={values.message}
                    onChange={handleChange('message')}
                    onBlur={handleBlur('message')}
                    placeholder={form.placeholders.message}
                    aria-invalid={visibleError('message') ? true : undefined}
                    aria-describedby={
                      visibleError('message')
                        ? `${fieldIds.message}-error`
                        : undefined
                    }
                    className={cn(
                      controlClasses,
                      'min-h-40 resize-y',
                      visibleError('message') && invalidClasses,
                    )}
                  />
                  <FieldError
                    id={`${fieldIds.message}-error`}
                    message={visibleError('message')}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  loading={submitting}
                  className="w-full sm:w-auto sm:self-start"
                >
                  {form.submit}
                </Button>
              </fieldset>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}