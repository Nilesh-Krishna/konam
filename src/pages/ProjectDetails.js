import React, { useState, useEffect, useRef, memo } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { getProjectById } from "../data/projects";
import VirtualizedGallery from "../components/VirtualizedGallery";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTools,
  FaHome,
} from "react-icons/fa";

const ProjectDetailsContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f0e6 0%, #f8f9fa 50%, #e8f4f8 100%);
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
        rgba(198, 93, 33, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(139, 69, 19, 0.1) 0%,
        transparent 50%
      );
    pointer-events: none;
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

const BackButton = styled(Link)`
  position: fixed;
  top: 100px;
  left: 30px;
  z-index: 99999;
  padding: 4px 12px;
  width: 140px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  color: #2c3e50;
  text-decoration: none;
  border-radius: 12px;
  font-family: "Montserrat", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.25);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  min-width: auto;
  height: auto;
  line-height: 1.2;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1),
      rgba(198, 93, 33, 0.05),
      rgba(255, 255, 255, 0.1)
    );
    border-radius: 12px;
  }

  &::after {
    content: "";
    position: absolute;
    top: -25%;
    left: -25%;
    width: 150%;
    height: 150%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.08) 0%,
      transparent 70%
    );
    border-radius: 12px;
  }

  &:hover {
    background: rgba(198, 93, 33, 0.15);
    backdrop-filter: blur(35px);
    -webkit-backdrop-filter: blur(35px);
    color: #c65d21;
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(198, 93, 33, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    animation-play-state: paused;

    &::before {
      animation: liquidFlow 2s ease-in-out infinite;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(198, 93, 33, 0.2),
        rgba(255, 255, 255, 0.3),
        rgba(198, 93, 33, 0.2),
        transparent
      );
    }

    &::after {
      animation: liquidRotate 4s linear infinite;
      opacity: 0.8;
    }
  }

  @media (max-width: 768px) {
    top: 90px;
    left: 20px;
    padding: 3px 8px;
    width: 120px;
    font-size: 0.7rem;
  }
`;

const ImageCarousel = styled.div`
  width: 100%;
  height: 80vh;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 60vh;
  }
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

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    will-change: transform;
    backface-visibility: hidden;
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

const CarouselOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 60px 50px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    transparent 100%
  );
  color: #ffffff;
  z-index: 2;
  backdrop-filter: blur(5px);

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const ProjectTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-family: "Playfair Display", serif;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  text-align: left;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #c65d21, #8b4513);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;

    &::after {
      width: 60px;
      height: 2px;
    }
  }
`;

const ProjectCategory = styled.p`
  font-size: 1.3rem;
  font-family: "Montserrat", sans-serif;
  opacity: 0.7;
  color: #34495e;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 3rem;

  &::before {
    content: "";
    width: 20px;
    height: 2px;
    background: linear-gradient(90deg, #c65d21, #8b4513);
    border-radius: 1px;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CarouselControls = styled.div`
  position: absolute;
  bottom: 30px;
  right: 50px;
  display: flex;
  gap: 15px;
  z-index: 3;

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    gap: 10px;
  }
`;

const CarouselButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.8);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 300;
  backdrop-filter: blur(12px);
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
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.05)
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: #ffffff;
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    font-size: 1.2rem;
  }
`;

const CarouselDots = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 3;

  @media (max-width: 768px) {
    bottom: 20px;
  }
`;

const Dot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(props) =>
    props.active ? "#ffffff" : "rgba(255, 255, 255, 0.3)"};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.2);
  }

  @media (max-width: 768px) {
    width: 8px;
    height: 8px;
  }
`;

const ContentSection = styled.section`
  padding: 0 0 100px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 0 0 60px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 50px;
  margin-top: 4rem;

  @media (max-width: 768px) {
    padding: 0 20px;
    margin-top: 2rem;
  }
`;

const ProjectDescription = styled.div`
  font-size: 1.3rem;
  line-height: 1.8;
  color: #34495e;
  margin-bottom: 60px;
  font-family: "Montserrat", sans-serif;
  white-space: pre-line;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 40px;
  }
`;

const ProjectMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-top: 60px;
  padding: 50px;
  background: linear-gradient(145deg, #ffffff 0%, #fefefe 100%);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(198, 93, 33, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #c65d21, #8b4513, #c65d21);
    background-size: 200% 100%;
    animation: gradientShift 3s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    gap: 30px;
    margin-top: 40px;
    padding: 35px 25px;
    border-radius: 16px;
  }

  @keyframes gradientShift {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
`;

const MetaItem = styled.div`
  h3 {
    font-size: 1.2rem;
    color: #2c3e50;
    margin-bottom: 12px;
    font-family: "Playfair Display", serif;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  p {
    font-size: 1.1rem;
    color: #34495e;
    font-family: "Montserrat", sans-serif;
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 1.1rem;
      margin-bottom: 8px;
      gap: 8px;
    }

    p {
      font-size: 1rem;
    }
  }
`;

const ServicesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const ServiceTag = styled.span`
  padding: 8px 18px;
  background: linear-gradient(135deg, #c65d21 0%, #8b4513 100%);
  color: #ffffff;
  border-radius: 25px;
  font-size: 0.95rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(198, 93, 33, 0.3);
  }

  @media (max-width: 768px) {
    padding: 6px 14px;
    font-size: 0.85rem;
  }
`;

const ErrorMessage = styled.div`
  padding: 100px 50px;
  text-align: center;
  color: #34495e;
  font-family: "Montserrat", sans-serif;
  font-size: 1.2rem;
  background: linear-gradient(145deg, #ffffff 0%, #fefefe 100%);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(198, 93, 33, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  margin: 50px auto;
  max-width: 600px;

  @media (max-width: 768px) {
    padding: 60px 20px;
    font-size: 1rem;
    margin: 30px 20px;
  }
`;

// Enhanced Optimized Image Component with advanced performance optimizations
// Enhanced Optimized Image Component with instant loading for optimized images
const OptimizedImage = memo(
  ({ src, alt, onError, className, style, priority = false }) => {
    const [imageState, setImageState] = useState("loading"); // 'loading', 'loaded', 'error'
    const [currentSrc, setCurrentSrc] = useState("");
    const imgRef = useRef(null);

    useEffect(() => {
      if (!src) return;

      setImageState("loading");

      // For optimized images, load immediately without intersection observer
      loadImage();

      function loadImage() {
        const img = new Image();

        // Shorter timeout for optimized images
        const timeout = setTimeout(() => {
          if (imageState === "loading") {
            setImageState("error");
            if (onError) onError();
          }
        }, 3000); // 3 second timeout for optimized images

        img.onload = () => {
          clearTimeout(timeout);
          setCurrentSrc(src);
          setImageState("loaded");
          if (imgRef.current) {
            imgRef.current.src = src;
          }
        };

        img.onerror = () => {
          clearTimeout(timeout);
          console.warn(`Failed to load optimized image: ${src}`);
          setImageState("error");
          if (onError) onError();
        };

        // Enhanced image loading with better format support
        img.src = src;
        img.loading = "eager"; // Always eager for optimized images
        img.decoding = "sync"; // Synchronous decoding for better performance
        img.fetchPriority = "high"; // High priority for all images

        // Add crossOrigin for better compatibility
        if (
          src.includes(".png") ||
          src.includes(".jpg") ||
          src.includes(".jpeg")
        ) {
          img.crossOrigin = "anonymous";
        }
      }
    }, [src, onError]);

    // Minimal loading state for optimized images
    if (imageState === "loading") {
      return (
        <div
          ref={imgRef}
          className={className}
          style={{
            ...style,
            background:
              "linear-gradient(90deg, #f8f9fa 25%, #e9ecef 50%, #f8f9fa 75%)",
            backgroundSize: "200% 100%",
            animation: "loading 0.8s infinite",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label={`Loading ${alt}`}
        />
      );
    }

    if (imageState === "error") {
      return (
        <div
          ref={imgRef}
          className={className}
          style={{
            ...style,
            background: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6c757d",
            fontSize: "12px",
            textAlign: "center",
          }}
          aria-label={`Failed to load ${alt}`}
        >
          Image unavailable
        </div>
      );
    }

    return (
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={className}
        style={{
          ...style,
          opacity: imageState === "loaded" ? 1 : 0,
          transition: "opacity 0.2s ease-in-out",
          willChange: "opacity",
        }}
        loading="eager"
        decoding="sync"
        fetchPriority="high"
      />
    );
  }
);

const ProjectDetails = memo(() => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load project data from Firebase
  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const data = await getProjectById(id);
        setProject(data);
      } catch (error) {
        console.error("Error loading project:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Show loading state
  if (loading) {
    return (
      <ProjectDetailsContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            fontSize: "1.5rem",
            color: "#2c3e50",
          }}
        >
          Loading Project...
        </div>
      </ProjectDetailsContainer>
    );
  }

  // Memoized carousel controls

  if (!project) {
    return (
      <ErrorMessage>
        <FaHome size={48} style={{ marginBottom: "20px", opacity: 0.6 }} />
        <h2>Project Not Found</h2>
        <p>The project you're looking for doesn't exist.</p>
      </ErrorMessage>
    );
  }

  return (
    <ProjectDetailsContainer>
      <BackButton to="/projects">
        <FaArrowLeft />
        Back to Projects
      </BackButton>

      <ContentSection
        as={motion.section}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <VirtualizedGallery images={project.images} />

        <ContentWrapper>
          {/* Modern header for project details (moved off the image) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            viewport={{ once: true }}
            style={{ marginBottom: "1.5rem" }}
          >
            <ProjectCategory>{project.category}</ProjectCategory>
            <ProjectTitle>{project.title}</ProjectTitle>
          </motion.div>

          <ProjectDescription
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {project.longDescription}
          </ProjectDescription>

          <ProjectMeta
            as={motion.div}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <MetaItem>
              <h3>
                <FaMapMarkerAlt />
                Location
              </h3>
              <p>{project.location}</p>
            </MetaItem>
            <MetaItem>
              <h3>
                <FaHome />
                Area
              </h3>
              <p>{project.area}</p>
            </MetaItem>
            <MetaItem>
              <h3>
                <FaCalendarAlt />
                Year
              </h3>
              <p>{project.year}</p>
            </MetaItem>
            <MetaItem>
              <h3>
                <FaTools />
                Services
              </h3>
              <ServicesList>
                {project.services.map((service, index) => (
                  <ServiceTag key={index}>{service}</ServiceTag>
                ))}
              </ServicesList>
            </MetaItem>
          </ProjectMeta>
        </ContentWrapper>
      </ContentSection>
    </ProjectDetailsContainer>
  );
});

export default ProjectDetails;
