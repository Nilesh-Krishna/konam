import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  memo,
  useRef,
} from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { FaHome, FaBuilding, FaHotel } from "react-icons/fa";
import { getFeaturedProjects } from "../data/projects";
import ImagePreloader from "../components/ImagePreloader";
import OptimizedImage from "../components/OptimizedImage";
import VirtualizedGallery from "../components/VirtualizedGallery";
import PerformanceMonitor from "../components/PerformanceMonitor";

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    var(--background-light) 0%,
    var(--neutral-light) 50%,
    var(--background-light) 100%
  );
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(184, 92, 56, 0.08) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(212, 165, 116, 0.08) 0%,
        transparent 50%
      );
    pointer-events: none;
  }

  contain: layout style paint;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  transform: translateZ(0);
  backface-visibility: hidden;
  overscroll-behavior: contain;

  /* Performance optimizations during scroll */
  &.scrolling {
    * {
      pointer-events: none !important;
    }

    .carousel-container {
      pointer-events: auto !important;
    }
  }

  &.aggressive-scroll {
    .service-card,
    .project-card {
      transform: translateZ(0);
      backface-visibility: hidden;
      will-change: auto;
    }
  }

  @keyframes loading {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const HeroSection = styled.section`
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const CarouselContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  contain: layout style paint;
  background: #000000;
`;

const CarouselSlide = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  background: #000000;
  /* Optimize for performance */
  contain: layout style paint;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    loading: "eager"; /* Changed from lazy for instant loading */
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
    backface-visibility: hidden;
    /* Optimize image rendering */
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    /* Ensure smooth loading */
    content-visibility: auto;
    contain-intrinsic-size: 100%;
    /* Additional performance optimizations */
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    decoding: async;
  }
`;

const CarouselOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.6)
  );
  backdrop-filter: blur(1px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const HeroContent = styled.div`
  text-align: center;
  color: var(--text-light);
  max-width: 1000px;
  padding: 0 20px;
  z-index: 2;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 6rem);
  margin-bottom: 2rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  color: var(--text-light);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  will-change: transform, opacity;
  position: relative;

  /* Typing cursor effect - always visible and blinking */
  &::after {
    content: "|";
    animation: blink 1s infinite;
    color: var(--text-light);
    margin-left: 2px;
    font-weight: 300;
  }

  @keyframes blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0;
    }
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  line-height: 1.6;
  font-family: "Montserrat", sans-serif;
  color: var(--text-light);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  margin: 0 auto;
  will-change: transform, opacity;
`;

const CarouselDots = styled.div`
  position: fixed;
  bottom: 30px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  pointer-events: auto;
  will-change: auto;
`;

const CarouselCounter = styled.div`
  color: #ffffff;
  font-family: "Montserrat", sans-serif;
  font-size: 0.85rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 500;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const CarouselControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CarouselButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-family: "Montserrat", sans-serif;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.05)
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CarouselLoading = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--secondary-color) 100%
  );
  z-index: 10;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: #ffffff;
  font-family: "Montserrat", sans-serif;
  font-size: 1.1rem;
  margin-top: 20px;
  text-align: center;
`;

// Enhanced Optimized Image Component with onLoad callback
const CarouselOptimizedImage = memo(
  ({ src, alt, onError, onLoad, className, style, priority = false }) => {
    return (
      <OptimizedImage
        src={src}
        alt={alt}
        className={className}
        style={style}
        onError={onError}
        onLoad={onLoad}
        priority={priority}
      />
    );
  }
);

const Dot = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid #ffffff;
  background: ${(props) => (props.active ? "#f8f9fa" : "transparent")};
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, background-color;
  backface-visibility: hidden;
  /* Protect carousel dots from scroll optimizations */
  pointer-events: auto;
  transform: translateZ(0);

  &:hover {
    transform: scale(1.2);
  }
`;

const ServicesSection = styled.section`
  padding: 100px 50px;
  background: linear-gradient(
    135deg,
    var(--background-light) 0%,
    var(--neutral-light) 50%,
    var(--background-light) 100%
  );
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 30% 70%,
        rgba(184, 92, 56, 0.03) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 70% 30%,
        rgba(212, 165, 116, 0.03) 0%,
        transparent 50%
      );
    pointer-events: none;
  }

  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: clamp(2.5rem, 5vw, 4rem);
  color: var(--text-dark);
  margin-bottom: 3rem;
  text-align: center;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &::after {
    content: "";
    position: absolute;
    bottom: -15px;
    width: 100px;
    height: 3px;
    background: linear-gradient(
      to right,
      var(--primary-color),
      var(--secondary-color)
    );
  }

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const ServiceCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2);
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(184, 92, 56, 0.1);
  opacity: 0;
  transform: translateY(20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 350px;
  will-change: transform, box-shadow;
  /* Optimize for scroll performance */
  contain: layout style paint;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(184, 92, 56, 0.02),
      rgba(212, 165, 116, 0.02)
    );
    border-radius: 20px;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(184, 92, 56, 0.2);
    border-color: rgba(184, 92, 56, 0.2);
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
  }

  @media (max-width: 768px) {
    padding: 30px 20px;
    min-height: 300px;
  }
`;

const ServiceIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 25px;
  color: var(--primary-color);
  background: rgba(184, 92, 56, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(184, 92, 56, 0.15);
  border: 1px solid rgba(184, 92, 56, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  will-change: transform, box-shadow;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(184, 92, 56, 0.05),
      rgba(212, 165, 116, 0.05)
    );
    border-radius: 50%;
  }

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 30px rgba(184, 92, 56, 0.25);
    background: rgba(184, 92, 56, 0.15);
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    width: 70px;
    height: 70px;
    margin-bottom: 20px;
  }
`;

const ServiceTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: var(--text-dark);
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  text-align: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 12px;
  }
`;

const ServiceDescription = styled.p`
  font-size: 1.1rem;
  color: var(--neutral-dark);
  line-height: 1.6;
  font-family: "Montserrat", sans-serif;
  text-align: center;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0 10px;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
    padding: 0 5px;
  }
`;

const ProjectsSection = styled.section`
  padding: 100px 50px;
  background: linear-gradient(
    135deg,
    var(--neutral-light) 0%,
    var(--background-light) 50%,
    var(--neutral-light) 100%
  );
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 40% 60%,
        rgba(184, 92, 56, 0.02) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 60% 40%,
        rgba(212, 165, 116, 0.02) 0%,
        transparent 50%
      );
    pointer-events: none;
  }

  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 50px;
  max-width: 1800px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 0;
  }
`;

const ProjectCard = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 600px;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateY(20px);
  will-change: transform, box-shadow;
  /* Optimize for scroll performance */
  contain: layout style paint;
  backface-visibility: hidden;
  transform-style: preserve-3d;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(184, 92, 56, 0.2);
  }

  @media (max-width: 768px) {
    height: 400px;
  }
`;

const ProjectImage = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  will-change: transform;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0.8)
    );
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
    will-change: transform;
    loading: "eager";
    /* Optimize image rendering */
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    /* Ensure smooth loading */
    content-visibility: auto;
    contain-intrinsic-size: 100%;
    /* Additional performance optimizations */
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    decoding: async;
  }
`;

const ProjectContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  color: #ffffff;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ProjectTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 10px;
  color: var(--text-light);
  font-family: "Montserrat", sans-serif;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ProjectDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  font-family: "Montserrat", sans-serif;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 15px;
  }
`;

const ViewProjectButton = styled(Link)`
  display: inline-block;
  padding: 12px 30px;
  background: rgba(184, 92, 56, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #ffffff;
  text-decoration: none;
  border-radius: 25px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(184, 92, 56, 0.3);
  border: 1px solid rgba(184, 92, 56, 0.2);
  will-change: transform, box-shadow;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    background: rgba(184, 92, 56, 0.95);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(184, 92, 56, 0.4);
    border-color: rgba(184, 92, 56, 0.3);

    &::before {
      left: 100%;
    }
  }

  @media (max-width: 768px) {
    padding: 10px 25px;
    font-size: 0.9rem;
    margin: 0 auto 16px auto;
    max-width: 90%;
    display: block;
  }
`;

const AboutSection = styled.section`
  padding: 100px 50px;
  background: linear-gradient(
    135deg,
    var(--neutral-light) 0%,
    var(--background-light) 50%,
    var(--neutral-light) 100%
  );
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at 50% 50%,
      rgba(184, 92, 56, 0.03) 0%,
      transparent 50%
    );
    pointer-events: none;
  }
`;

const AboutContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const AboutTitle = styled.h2`
  font-size: clamp(2.5rem, 5vw, 4rem);
  color: var(--text-dark);
  margin-bottom: 2rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
`;

const AboutDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: var(--neutral-dark);
  max-width: 800px;
  margin: 0 auto;
  font-family: "Montserrat", sans-serif;
`;

const ContactSection = styled.section`
  padding: 100px 50px;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)),
    url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80");
  background-size: cover;
  background-position: center;
  background-attachment: scroll;
  background-repeat: no-repeat;
  color: #ffffff;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(1px);
    -webkit-backdrop-filter: blur(1px);
  }
`;

const ContactContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const ContactTitle = styled.h2`
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 2rem;
  color: var(--text-light);
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
`;

const ContactDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 3rem;
  font-family: "Montserrat", sans-serif;
`;

const ContactButton = styled(Link)`
  display: inline-block;
  padding: 15px 40px;
  background: rgba(184, 92, 56, 0.9);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  color: #ffffff;
  text-decoration: none;
  border-radius: 35px;
  font-family: "Montserrat", sans-serif;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(184, 92, 56, 0.3);
  box-shadow: 0 4px 15px rgba(184, 92, 56, 0.3);
  will-change: transform, box-shadow;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    background: rgba(184, 92, 56, 0.95);
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 25px rgba(184, 92, 56, 0.4);
    border-color: rgba(184, 92, 56, 0.4);

    &::before {
      left: 100%;
    }
  }
`;

const Home = memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [randomSeed, setRandomSeed] = useState(Date.now()); // Used to trigger re-randomization
  const [displayedText, setDisplayedText] = useState("");
  const [imagesLoaded, setImagesLoaded] = useState(true); // Track if carousel images are loaded
  const [initialLoadComplete, setInitialLoadComplete] = useState(true); // Track if initial load is done

  // Helper function to get a random image from project
  const getRandomImageFromProject = useCallback(
    (project, seed = randomSeed) => {
      if (!project.images || project.images.length === 0) return null;

      // Use seed to make randomization consistent until manually refreshed
      const randomIndex = Math.floor(
        (Math.sin(seed + project.id?.length || 0) + 1) *
          0.5 *
          project.images.length
      );
      const selectedImage = project.images[randomIndex];

      return {
        src: selectedImage,
        title: project.title || "Untitled Project",
        description: project.description || "No description available",
        projectId: project.id,
        imageIndex: randomIndex,
      };
    },
    [randomSeed]
  );

  // Load featured projects from Firebase
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setError(null);
        const projects = await getFeaturedProjects();
        setFeaturedProjects(projects);
      } catch (error) {
        console.error("Error loading featured projects:", error);
        setError("Failed to load projects. Please try again later.");
      }
    };

    loadProjects();
  }, []);

  // Typing animation effect for KONAM heading (looped)
  useEffect(() => {
    const text = "KONAM";
    let currentIndex = 0;
    let isDeleting = false;

    const typingInterval = setInterval(
      () => {
        if (!isDeleting) {
          // Typing forward
          setDisplayedText(text.substring(0, currentIndex + 1));
          currentIndex++;

          if (currentIndex === text.length) {
            // Pause at full text for 2 seconds before deleting
            setTimeout(() => {
              isDeleting = true;
            }, 2000);
          }
        } else {
          // Deleting backward
          setDisplayedText(text.substring(0, currentIndex));
          currentIndex--;

          if (currentIndex < 0) {
            // Reset to start typing again
            isDeleting = false;
            currentIndex = 0;
          }
        }
      },
      isDeleting ? 100 : 200
    ); // Faster deletion (100ms) than typing (200ms)

    return () => clearInterval(typingInterval);
  }, []);

  // Memoize the flattened images array to prevent recalculation on every render
  // Randomly select one image from each project using the helper function
  const allImages = useMemo(
    () =>
      featuredProjects
        .filter((project) => project.images && project.images.length > 0) // Only projects with images
        .map((project) => getRandomImageFromProject(project))
        .filter(
          (imageInfo) =>
            imageInfo && imageInfo.src && typeof imageInfo.src === "string"
        ), // Filter out invalid images
    [featuredProjects, getRandomImageFromProject]
  );

  // Image cache for instant loading
  const imageCache = useRef(new Map());

  useEffect(() => {
    // Instant image preloading with modern techniques
    const preloadImages = () => {
      if (allImages.length === 0) return;

      // Preload all images immediately using fetchpriority and modern loading hints
      allImages.forEach((imageInfo, index) => {
        if (!imageCache.current.has(imageInfo.src)) {
          const img = new Image();
          img.fetchPriority = index < 3 ? "high" : "auto";
          img.loading = "eager";
          img.decoding = "async";
          img.onload = () => imageCache.current.set(imageInfo.src, true);
          img.src = imageInfo.src;
        }
      });
    };

    preloadImages();
  }, [allImages]);

  // Performance mode: reduce updates during scroll
  const [performanceMode, setPerformanceMode] = useState(false);

  // Ultra-aggressive scroll throttling for maximum performance
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("down");
  const scrollTimeoutRef = useRef(null);
  const scrollFrameRef = useRef(null);
  const lastScrollUpdateRef = useRef(0);

  useEffect(() => {
    if (isScrolling && !performanceMode) {
      setPerformanceMode(true);
    } else if (!isScrolling && performanceMode) {
      // Small delay before exiting performance mode
      setTimeout(() => setPerformanceMode(false), 100);
    }
  }, [isScrolling, performanceMode]);

  // Disable animations during scroll for better performance
  const shouldAnimate = !isScrolling;

  // Memoize animation variants to prevent recreation
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: shouldAnimate ? 0.05 : 0, // Reduced stagger
          delayChildren: shouldAnimate ? 0.1 : 0, // Reduced delay
          duration: shouldAnimate ? 0.3 : 0.05, // Faster animations
        },
      },
    }),
    [shouldAnimate]
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 15 }, // Reduced movement
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: shouldAnimate ? 0.3 : 0.05, // Faster animations
          ease: [0.4, 0, 0.2, 1],
        },
      },
    }),
    [shouldAnimate]
  );

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    let scrollCount = 0;

    const handleScroll = () => {
      scrollCount++;

      // Throttle updates - only update every 3rd scroll event for better performance
      if (scrollCount % 3 !== 0 && !ticking) {
        return;
      }

      if (!ticking) {
        requestAnimationFrame(() => {
          const now = Date.now();
          // Only update scroll position every 50ms for maximum performance
          if (now - lastScrollUpdateRef.current > 50) {
            const currentScrollY = window.scrollY;
            setScrollY(currentScrollY);
            setScrollDirection(currentScrollY > lastScrollY ? "down" : "up");
            lastScrollY = currentScrollY;
            lastScrollUpdateRef.current = now;
          }
          ticking = false;
          scrollCount = 0;
        });
        ticking = true;
      }

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      setIsScrolling(true);

      // Add scrolling class to body for CSS optimizations
      document.body.classList.add("scrolling");
      document.body.classList.add("aggressive-scroll");

      // Set scrolling to false after 300ms of no scroll (increased for better UX)
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        document.body.classList.remove("scrolling");
        document.body.classList.remove("aggressive-scroll");
      }, 300);
    };

    // Use passive listener with capture for better performance
    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: false,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrameRef.current) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Optimized touch handlers to prevent scroll interference
  const handleTouchStart = useCallback((e) => {
    // Safely check if event and target exist
    if (!e || !e.target) return;

    // Only prevent default if it's a touch on the carousel
    if (e.target.closest(".carousel-container")) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    // Safely check if event and target exist
    if (!e || !e.target) return;

    // Only prevent default if it's a touch on the carousel
    if (e.target.closest(".carousel-container")) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    // Just handle touch end, no autoplay resuming
  }, []);

  const nextSlide = useCallback(() => {
    if (allImages.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevSlide = useCallback(() => {
    if (allImages.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  // Ensure currentSlide is within bounds when images change
  useEffect(() => {
    if (allImages.length > 0 && currentSlide >= allImages.length) {
      setCurrentSlide(0);
    }
  }, [allImages.length, currentSlide]);

  const handleImageError = useCallback((e) => {
    // Safely check if event and target exist
    if (!e || !e.target) return;

    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/1920x1080?text=Image+Not+Found";
  }, []);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (allImages.length === 0) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          prevSlide();
          break;
        case "ArrowRight":
          e.preventDefault();
          nextSlide();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, allImages.length]);

  // Preload adjacent images for smooth transitions
  const preloadAdjacentImages = useCallback(
    (currentIndex) => {
      if (
        allImages.length === 0 ||
        currentIndex < 0 ||
        currentIndex >= allImages.length
      )
        return;

      const adjacentIndices = [
        (currentIndex - 1 + allImages.length) % allImages.length,
        (currentIndex + 1) % allImages.length,
        (currentIndex - 2 + allImages.length) % allImages.length,
        (currentIndex + 2) % allImages.length,
      ];

      adjacentIndices.forEach((index) => {
        const imageInfo = allImages[index];
        if (imageInfo && imageInfo.src && typeof imageInfo.src === "string") {
          const img = new Image();
          img.src = imageInfo.src;
          img.loading = "eager";
          img.decoding = "async";
        }
      });
    },
    [allImages]
  );

  useEffect(() => {
    preloadAdjacentImages(currentSlide);
  }, [currentSlide, preloadAdjacentImages]);

  // Show error state if loading failed
  if (error) {
    return (
      <HomeContainer>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            fontSize: "1.2rem",
            color: "#e74c3c",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#c65d21",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      {/* Performance monitoring - only enable in development */}
      <PerformanceMonitor enabled={process.env.NODE_ENV === "development"} />

      {/* Preload critical images for instant loading */}
      <ImagePreloader
        images={allImages.slice(0, 6).map((img) => img.src)}
        onComplete={() => console.log("Hero images preloaded")}
      />

      <HeroSection>
        <CarouselContainer
          className="carousel-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {allImages.length > 0 && (
            <>
              <AnimatePresence mode="wait" initial={false}>
                <CarouselSlide
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.15, // Even faster transition
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  {allImages[currentSlide]?.src && (
                    <CarouselOptimizedImage
                      src={allImages[currentSlide].src}
                      alt={`${
                        allImages[currentSlide]?.title || "Project"
                      } - Image ${
                        (allImages[currentSlide]?.imageIndex || 0) + 1
                      }`}
                      onError={handleImageError}
                      priority={true}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        willChange: "transform",
                        backfaceVisibility: "hidden",
                        transform: "translateZ(0)",
                      }}
                    />
                  )}
                </CarouselSlide>
              </AnimatePresence>
            </>
          )}
          <CarouselOverlay>
            <HeroContent
              as={motion.div}
              variants={containerVariants}
              animate="visible"
            >
              <HeroTitle variants={itemVariants} as={motion.h1}>
                {displayedText}
              </HeroTitle>
              <HeroSubtitle variants={itemVariants} as={motion.p}>
                Interior Design Studio
                {allImages.length > 0 && allImages[currentSlide] && (
                  <span
                    style={{
                      display: "block",
                      marginTop: "1rem",
                      fontSize: "1rem",
                      opacity: 0.9,
                    }}
                  >
                    Currently viewing:{" "}
                    {allImages[currentSlide]?.title || "Featured Project"}
                  </span>
                )}
              </HeroSubtitle>
            </HeroContent>
          </CarouselOverlay>
          <CarouselDots>
            <CarouselControls>
              <CarouselButton
                onClick={prevSlide}
                disabled={allImages.length === 0}
                aria-label="Previous image"
              >
                ‹
              </CarouselButton>
              <CarouselCounter>
                {allImages.length > 0
                  ? `${currentSlide + 1} / ${allImages.length}`
                  : "0 / 0"}
              </CarouselCounter>
              <CarouselButton
                onClick={nextSlide}
                disabled={allImages.length === 0}
                aria-label="Next image"
              >
                ›
              </CarouselButton>
            </CarouselControls>
          </CarouselDots>
        </CarouselContainer>
      </HeroSection>

      <ServicesSection>
        <SectionTitle
          as={motion.h2}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          viewport={{ once: true, margin: "-50px" }}
        >
          OUR SERVICES
        </SectionTitle>
        <ServicesGrid
          as={motion.div}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
        >
          <ServiceCard
            className="service-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{
              y: -5,
              transition: {
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              },
            }}
          >
            <ServiceIcon>
              <FaHome />
            </ServiceIcon>
            <ServiceTitle>Residential</ServiceTitle>
            <ServiceDescription>
              Creating homes that reflect your lifestyle and aspirations
            </ServiceDescription>
          </ServiceCard>
          <ServiceCard
            className="service-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{
              y: -5,
              transition: {
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              },
            }}
          >
            <ServiceIcon>
              <FaBuilding />
            </ServiceIcon>
            <ServiceTitle>Commercial</ServiceTitle>
            <ServiceDescription>
              Designing spaces that enhance productivity and brand identity
            </ServiceDescription>
          </ServiceCard>
          <ServiceCard
            className="service-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{
              y: -5,
              transition: {
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              },
            }}
          >
            <ServiceIcon>
              <FaHotel />
            </ServiceIcon>
            <ServiceTitle>Hospitality</ServiceTitle>
            <ServiceDescription>
              Crafting memorable experiences through thoughtful design
            </ServiceDescription>
          </ServiceCard>
        </ServicesGrid>
      </ServicesSection>

      <ProjectsSection>
        <SectionTitle
          as={motion.h2}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          viewport={{ once: true, margin: "-50px" }}
        >
          FEATURED PROJECTS
        </SectionTitle>

        {/* Project cards grid */}
        <ProjectsGrid
          as={motion.div}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        >
          {featuredProjects.map((project, index) => (
            <ProjectCard
              className="project-card"
              key={project.id}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.6 + index * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
              whileHover={{
                y: -5,
                transition: {
                  duration: 0.2,
                  ease: [0.4, 0, 0.2, 1],
                },
              }}
            >
              <ProjectImage>
                {project.images && project.images.length > 0 && (
                  <OptimizedImage
                    src={getRandomImageFromProject(project)?.src}
                    alt={project.title || "Project Image"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                      willChange: "transform",
                    }}
                  />
                )}
              </ProjectImage>
              <ProjectContent>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <ViewProjectButton
                  to={`/project/${project.id}`}
                  as={motion(Link)}
                  whileHover={{
                    scale: 1.02,
                    transition: {
                      duration: 0.15,
                      ease: [0.4, 0, 0.2, 1],
                    },
                  }}
                  whileTap={{
                    scale: 0.98,
                    transition: {
                      duration: 0.1,
                      ease: [0.4, 0, 0.2, 1],
                    },
                  }}
                >
                  View Project
                </ViewProjectButton>
              </ProjectContent>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      </ProjectsSection>

      <AboutSection>
        <AboutContent>
          <AboutTitle>ABOUT US</AboutTitle>
          <AboutDescription>
            Konam is an interior design studio driven by clarity, craft, and
            care. We take on a select number of projects each year, allowing us
            to work closely and deliberately—shaping spaces that are both
            intelligent and quietly expressive.
          </AboutDescription>
        </AboutContent>
      </AboutSection>

      <ContactSection>
        <ContactContent>
          <ContactTitle>Let's Create Something Beautiful Together</ContactTitle>
          <ContactDescription>
            Get in touch with us to discuss your project and how we can help
            bring your vision to life.
          </ContactDescription>
          <ContactButton to="/contact">Contact Us</ContactButton>
        </ContactContent>
      </ContactSection>
    </HomeContainer>
  );
});

export default Home;
