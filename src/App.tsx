import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Professional from './pages/Professional';
import Personal from './pages/Personal';
import Contact from './pages/Contact';
import { content, pageList, pages } from './data/content';
import { useReducedMotionSafe } from './lib/motion';
import GridBackground from "./components/GridBackground";


function Layout() {
  const location = useLocation();
  const { pageTransition } = useReducedMotionSafe();

  useEffect(() => {
    const current = pageList.find((page) => page.path === location.pathname);
    document.title = (current ?? pages.professional).title;
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-pill focus-visible:border focus-visible:bg-surface focus-visible:px-4 focus-visible:py-2 focus-visible:text-text"
      >
        {content.ui.skipToContent}
      </a>

      <GridBackground />
      <Navbar />

      <main id="main" tabIndex={-1} className="relative z-10 focus:outline-none">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={location.pathname}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Routes location={location}>
              <Route path={pages.professional.path} element={<Professional />} />
              <Route path={pages.personal.path} element={<Personal />} />
              <Route path={pages.contact.path} element={<Contact />} />
              <Route path="*" element={<Navigate to={pages.professional.path} replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}