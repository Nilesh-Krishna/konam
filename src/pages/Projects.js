import React, {
  memo,
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getProjects } from "../data/projects";
import OptimizedImage from "../components/OptimizedImage";
import { FaEye, FaArrowRight, FaImages, FaMapMarkerAlt } from "react-icons/fa";

const ProjectsContainer = styled.div`
  min-height: 100vh;
  padding: 120px 50px 80px;
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

  @keyframes loading {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @media (max-width: 768px) {
    padding: 100px 20px 60px;
  }
`;

const PageHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto 80px;
  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const PageTitle = styled(motion.h1)`
  font-size: 3.5rem;
  text-align: center;
  margin-bottom: 60px;
  color: var(--text-dark);
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(
      90deg,
      var(--primary-color),
      var(--secondary-color)
    );
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 40px;

    &::after {
      width: 60px;
      height: 3px;
    }
  }
`;

const PageDescription = styled.p`
  font-size: 1.3rem;
  color: var(--neutral-dark);
  max-width: 800px;
  margin: 2rem auto 0;
  line-height: 1.8;
  font-family: "Montserrat", sans-serif;
  text-align: center;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 1.5rem auto 0;
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 40px;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 0;
  }
`;

const ProjectCard = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(198, 93, 33, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      var(--primary-color),
      var(--secondary-color),
      var(--primary-color)
    );
    background-size: 200% 100%;
    animation: gradientShift 3s ease-in-out infinite;
    z-index: 2;
  }

  &:hover {
    transform: translateY(-15px) scale(1.02);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15),
      0 12px 24px rgba(184, 92, 56, 0.2);
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

  @media (max-width: 768px) {
    height: 400px;
  }
`;

const ProjectImage = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

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

  ${ProjectCard}:hover & img {
    transform: scale(1.05);
  }
`;

const ProjectInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  color: #ffffff;
  z-index: 1;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    transparent 100%
  );
  transform: translateY(20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${ProjectCard}:hover & {
    transform: translateY(0);
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.95) 0%,
      rgba(0, 0, 0, 0.8) 50%,
      transparent 100%
    );
  }

  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const ProjectTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 15px;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 50px;
    height: 2px;
    background: linear-gradient(
      90deg,
      var(--primary-color),
      var(--secondary-color)
    );
    border-radius: 1px;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
`;

const ProjectDescription = styled.p`
  font-size: 1.1rem;
  margin-bottom: 25px;
  color: rgba(255, 255, 255, 0.95);
  font-family: "Montserrat", sans-serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  line-height: 1.6;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 20px;
    line-height: 1.5;
  }
`;

const ViewMoreButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #c65d21 0%, #8b4513 100%);
  color: #ffffff;
  text-decoration: none;
  border-radius: 30px;
  font-family: "Montserrat", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
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
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(198, 93, 33, 0.3);

    &::before {
      left: 100%;
    }
  }

  @media (max-width: 768px) {
    padding: 12px 28px;
    font-size: 0.95rem;
    margin: 0 auto 16px auto;
    max-width: 90%;
    display: flex;
    justify-content: center;
  }
`;

const TabsBar = styled.div`
  max-width: 1200px;
  margin: 0 auto 40px;
  display: flex;
  gap: 12px;
  padding: 0 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const TabButton = styled.button`
  background: ${(props) => (props.active ? "#c65d21" : "transparent")};
  color: ${(props) => (props.active ? "#fff" : "var(--text-dark)")};
  border: 1px solid ${(props) => (props.active ? "#c65d21" : "#e6e6e6")};
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.18s;
  font-family: "Montserrat", sans-serif;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  }
`;

const Projects = memo(() => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Load projects from Firebase
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const hasProjects = useMemo(
    () => Array.isArray(projects) && projects.length > 0,
    [projects]
  );

  // derive categories from projects
  const categories = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));
  }, [projects]);

  // reset selected category if it disappears
  useEffect(() => {
    if (selectedCategory !== "All" && !categories.includes(selectedCategory)) {
      setSelectedCategory("All");
    }
  }, [categories, selectedCategory]);

  const filteredProjects = useMemo(() => {
    return selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  const handleImageError = useCallback((e) => {
    if (e && e.target) {
      e.target.onerror = null;
      e.target.src = "https://via.placeholder.com/800x600?text=Image+Not+Found";
    }
  }, []);

  if (loading) {
    return (
      <ProjectsContainer>
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
          Loading Projects...
        </div>
      </ProjectsContainer>
    );
  }

  return (
    <ProjectsContainer>
      <PageHeader>
        <PageTitle
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          OUR PROJECTS
        </PageTitle>
        <PageDescription
          as={motion.p}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          Explore our portfolio of thoughtfully designed spaces that blend
          functionality with aesthetic excellence. Each project reflects our
          commitment to creating environments that inspire and endure.
        </PageDescription>
      </PageHeader>
      {hasProjects ? (
        <>
          {categories.length > 1 && (
            <TabsBar>
              <TabButton
                active={selectedCategory === "All"}
                onClick={() => setSelectedCategory("All")}
              >
                All
              </TabButton>
              {categories.map((c) => (
                <TabButton
                  key={c}
                  active={selectedCategory === c}
                  onClick={() => setSelectedCategory(c)}
                >
                  {c}
                </TabButton>
              ))}
            </TabsBar>
          )}
          <ProjectsGrid
            as={motion.div}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                <ProjectImage>
                  <OptimizedImage
                    src={project.images[0]}
                    alt={project.title}
                    onError={handleImageError}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                      willChange: "transform",
                    }}
                  />
                </ProjectImage>
                <ProjectInfo>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectDescription>{project.description}</ProjectDescription>
                  <ViewMoreButton to={`/project/${project.id}`}>
                    <FaEye />
                    View Project
                    <FaArrowRight />
                  </ViewMoreButton>
                </ProjectInfo>
              </ProjectCard>
            ))}
          </ProjectsGrid>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          style={{
            textAlign: "center",
            color: "#C65D21",
            fontSize: "1.3rem",
            marginTop: "60px",
            padding: "40px",
            background: "linear-gradient(145deg, #ffffff 0%, #fefefe 100%)",
            borderRadius: "20px",
            boxShadow:
              "0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(198, 93, 33, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <FaImages size={48} style={{ marginBottom: "20px", opacity: 0.6 }} />
          <br />
          No projects to display at the moment. Please check back later!
        </motion.div>
      )}
    </ProjectsContainer>
  );
});

export default Projects;
