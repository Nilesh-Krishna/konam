import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Projects"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));

const AppContainer = styled.div`
  font-family: "Poppins", sans-serif;
  background-color: #f5f0e6; /* Warm off-white background */
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  color: #2c3e50; /* Dark blue-gray for text */
  scroll-behavior: smooth;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  position: relative;
`;

const LoadingContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f0e6; /* Warm off-white background */
  z-index: 9999;
`;

const LoadingSpinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 3px solid #e8d5c4; /* Light warm accent */
  border-top: 3px solid #c65d21; /* Pizza pie color */
  border-radius: 50%;
`;

const PageTransitionLoader = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f5f0e6 0%, #f8f9fa 50%, #e8f4f8 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9998;
  pointer-events: none;
`;

const TransitionBar = styled(motion.div)`
  width: 200px;
  height: 3px;
  background: linear-gradient(90deg, #c65d21, #8b4513);
  border-radius: 2px;
`;

const LoadingScreen = () => {
  return (
    <LoadingContainer
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    />
  );
};

// Page transition variants - optimized for speed and navbar visibility
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -10,
  },
};

const pageTransition = {
  type: "tween",
  ease: [0.25, 0.46, 0.45, 0.94],
  duration: 0.25, // Even faster for better UX
};

// Animated Routes Component
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <>
      <AnimatePresence initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Home />
              </motion.div>
            }
          />
          <Route
            path="/projects"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Projects />
              </motion.div>
            }
          />
          <Route
            path="/project/:id"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <ProjectDetails />
              </motion.div>
            }
          />
          <Route
            path="/about"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <About />
              </motion.div>
            }
          />
          <Route
            path="/contact"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Contact />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>

      <AnimatePresence>
        {location.pathname && (
          <PageTransitionLoader
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.05, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContainer>
        <Navbar />
        <Suspense fallback={<LoadingScreen />}>
          <AnimatedRoutes />
        </Suspense>
      </AppContainer>
    </Router>
  );
}

export default App;
