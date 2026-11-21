import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { content, pageList, pages } from '../data/content';
import { useReducedMotionSafe } from '../lib/motion';
import { cn } from '../lib/utils';

const SCROLL_THRESHOLD = 8;

export default function Navbar() {
  const { layoutTransition } = useReducedMotionSafe();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    // layoutRoot: the bar is sticky, so the shared indicator ignores page scroll offsets.
    <motion.header layoutRoot className="sticky top-0 z-40">
      {/* Border + blur layer. Only its opacity changes on scroll. */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 -z-10 border-b bg-bg/70 backdrop-blur-lg',
          'transition-opacity duration-base ease-out-strong',
          scrolled ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div className="container-page grid grid-cols-1 gap-3 py-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:py-4">
        <Link
          to={pages.professional.path}
          className="justify-self-start rounded-sm py-1 text-base font-semibold tracking-tight text-text"
        >
          {content.name}
        </Link>

        <nav aria-label="Primary" className="sm:justify-self-center">
          <ul className="glass flex items-center gap-1 rounded-pill p-1">
            {pageList.map((page) => (
              <li key={page.path} className="flex-1 sm:flex-none">
                <NavLink
                  to={page.path}
                  end
                  className={({ isActive }) =>
                    cn(
                      'relative flex min-h-10 items-center justify-center rounded-pill px-4 text-sm font-medium tracking-tight',
                      'transition-[color,transform] duration-fast ease-out-strong',
                      'motion-safe:active:scale-[0.97]',
                      isActive
                        ? 'text-text'
                        : 'text-muted [@media(hover:hover)]:hover:text-text',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive ? (
                        <motion.span
                          layoutId="nav-indicator"
                          aria-hidden="true"
                          transition={layoutTransition}
                          className="absolute inset-0 bg-accent/15"
                          // Set via style so Motion corrects distortion during layout animation.
                          style={{
                            borderRadius: 9999,
                            boxShadow: 'inset 0 0 0 1px rgb(var(--accent) / 0.5)',
                          }}
                        />
                      ) : null}
                      <span className="relative z-10">{page.navLabel}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.header>
  );
}