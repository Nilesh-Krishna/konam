import React, {
  memo,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FaQuoteLeft,
  FaQuoteRight,
  FaUsers,
  FaAward,
  FaHeart,
} from "react-icons/fa";

const AboutContainer = styled.div`
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

const AboutSection = styled.section`
  max-width: 1200px;
  margin: 0 auto 100px;

  @media (max-width: 768px) {
    margin-bottom: 60px;
  }
`;

const AboutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const AboutText = styled.div`
  font-family: "Montserrat", sans-serif;
`;

const AboutTitle = styled.h2`
  font-size: 2rem;
  color: var(--text-dark);
  margin-bottom: 1.5rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 15px;

  &::before {
    content: "";
    width: 40px;
    height: 3px;
    background: linear-gradient(
      90deg,
      var(--primary-color),
      var(--secondary-color)
    );
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
    gap: 10px;

    &::before {
      width: 30px;
    }
  }
`;

const AboutDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: #34495e;
  margin-bottom: 1.5rem;
  font-family: "Montserrat", sans-serif;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const AboutImage = styled.div`
  flex: 1;
  height: 400px;
  border-radius: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;

  img {
    max-width: 80%;
    max-height: 80%;
    width: auto;
    height: auto;
    object-fit: contain;
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

  @media (max-width: 768px) {
    height: 300px;
  }
`;

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

const MessageSection = styled(motion.section)`
  max-width: 1200px;
  margin: 0 auto 80px;
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
    margin-bottom: 60px;
    padding: 35px 25px;
    border-radius: 16px;
  }
`;

const MessageWithImageSection = styled(motion.section)`
  max-width: 1200px;
  margin: 0 auto 80px;
  display: grid;
  grid-template-columns: ${(props) =>
    props.$imageRight ? "1fr 400px" : "400px 1fr"};
  gap: 60px;
  align-items: center;
  background: linear-gradient(145deg, #ffffff 0%, #fefefe 100%);
  border-radius: 20px;
  padding: 50px;
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
    grid-template-columns: 1fr;
    gap: 40px;
    margin-bottom: 60px;
    padding: 35px 25px;
    border-radius: 16px;
  }
`;

const MessageContent = styled.div`
  order: ${(props) => (props.$imageRight ? "1" : "2")};

  @media (max-width: 768px) {
    order: 1;
  }
`;

const MessageImageContainer = styled.div`
  order: ${(props) => (props.$imageRight ? "2" : "1")};
  width: 100%;
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(198, 93, 33, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  position: relative;

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
    z-index: 2;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    content-visibility: auto;
    contain-intrinsic-size: 100%;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    decoding: async;
    object-position: center 20%;
  }

  @media (max-width: 768px) {
    height: 400px;
    order: 2;
  }
`;

const MessageTitle = styled.h3`
  font-size: 1.8rem;
  color: var(--text-dark);
  margin-bottom: 20px;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }
`;

const MessageText = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: #34495e;
  font-family: "Montserrat", sans-serif;
  text-align: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 15px;
  }
`;

const MessageAuthor = styled.div`
  text-align: center;
  margin-top: 30px;

  h4 {
    font-size: 1.3rem;
    color: #c65d21;
    margin-bottom: 5px;
    font-family: "Playfair Display", serif;
  }

  p {
    font-size: 1rem;
    color: #7f8c8d;
    font-family: "Montserrat", sans-serif;
  }

  @media (max-width: 768px) {
    margin-top: 20px;

    h4 {
      font-size: 1.2rem;
    }

    p {
      font-size: 0.9rem;
    }
  }
`;

const About = memo(() => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Ensure content is visible immediately
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <AboutContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            color: "#c65d21",
            fontSize: "1.2rem",
          }}
        >
          Loading...
        </div>
      </AboutContainer>
    );
  }

  return (
    <AboutContainer>
      <PageTitle
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        ABOUT THE STUDIO
      </PageTitle>

      <AboutSection>
        <AboutContent
          as={motion.div}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <AboutText>
            <AboutTitle>Konam Interiors</AboutTitle>
            <AboutDescription>
              With experience across diverse regions of India, the journey so
              far has been shaped by a deep appreciation for context, culture,
              and detail. This venture was born from a desire to create spaces
              that are both thoughtful and personal — where design goes beyond
              aesthetics to truly reflect how people live and feel.
            </AboutDescription>
            <AboutDescription>
              At the heart of it all is a commitment to craft, collaboration,
              and meaningful design.
            </AboutDescription>
          </AboutText>
          <AboutImage>
            <OptimizedImage
              src="/Logo.jpeg"
              alt="KONAM Interiors Logo"
              onError={() => {}}
              style={{
                maxWidth: "300px",
                maxHeight: "300px",
                width: "300px",
                height: "300px",
                objectFit: "cover",
                background: "transparent",
                mixBlendMode: "multiply",
                filter: "contrast(1.1) brightness(1.1)",
                borderRadius: "50%",
                border: "3px solid rgba(198, 93, 33, 0.2)",
                boxShadow: "0 8px 20px rgba(198, 93, 33, 0.15)",
              }}
            />
          </AboutImage>
        </AboutContent>
      </AboutSection>

      <MessageWithImageSection
        $imageRight={true}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <MessageContent $imageRight={true}>
          <MessageTitle>Founder's Message</MessageTitle>
          <MessageText>
            "Every region we've worked in has shaped our belief that design
            should celebrate life as it's truly lived — valuing each corner,
            each moment, and each detail."
          </MessageText>
          <MessageText>
            "KONAM was born from this vision: to create spaces that do more than
            look beautiful — they resonate, reflect, and become part of your
            story."
          </MessageText>
          <MessageText>
            "It's a journey guided by craft, collaboration, and a passion for
            making design deeply personal."
          </MessageText>
          <MessageAuthor>
            <h4>Sai Neeraj</h4>
            <p>Founder, KONAM</p>
          </MessageAuthor>
        </MessageContent>
        <MessageImageContainer $imageRight={true}>
          <OptimizedImage
            src="/Founder.jpeg"
            alt="Sai Neeraj - Founder"
            onError={() => {}}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
            }}
          />
        </MessageImageContainer>
      </MessageWithImageSection>

      <MessageWithImageSection
        $imageRight={false}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <MessageContent $imageRight={false}>
          <MessageTitle>Co-founder's Message</MessageTitle>
          <MessageText>
            With experience across diverse regions of India, the journey so far
            has been shaped by a deep appreciation for context, culture, and
            detail. This venture was born from a desire to create spaces that
            are both thoughtful and personal — where design goes beyond
            aesthetics to truly reflect how people live and feel.
          </MessageText>
          <MessageText>
            At the heart of it all is a commitment to craft, collaboration, and
            meaningful design.
          </MessageText>
          <MessageAuthor>
            <h4>Anshu Dama</h4>
            <p>Co-founder, KONAM</p>
          </MessageAuthor>
        </MessageContent>
        <MessageImageContainer $imageRight={false}>
          <OptimizedImage
            src="/Co-Founder.jpg"
            alt="Anshu Dama - Co-founder"
            onError={() => {}}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </MessageImageContainer>
      </MessageWithImageSection>

      <MessageWithImageSection
        $imageRight={true}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <MessageContent $imageRight={true}>
          <MessageTitle>Co-founder's Message</MessageTitle>
          <MessageText>
            With an academic foundation from the IIT Kharagpur and professional
            experience spanning diverse regions of India, my journey has been
            shaped by a deep understanding of context, culture, and detail. This
            venture was founded with a vision to create spaces that go beyond
            aesthetics — spaces that resonate with people, reflect their
            lifestyles, and enhance their everyday experiences.
          </MessageText>
          <MessageText>
            At the core of our practice lies a commitment to craft,
            collaboration, and purposeful design — where every project becomes a
            dialogue between creativity, functionality, and emotion.
          </MessageText>
          <MessageAuthor>
            <h4>D. Sumanth</h4>
            <p>Co-founder, KONAM</p>
          </MessageAuthor>
        </MessageContent>
        <MessageImageContainer $imageRight={true}>
          <OptimizedImage
            src="/coFounder2.jpeg"
            alt="D. Sumanth - Co-founder"
            onError={() => {}}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </MessageImageContainer>
      </MessageWithImageSection>
    </AboutContainer>
  );
});

export default About;
