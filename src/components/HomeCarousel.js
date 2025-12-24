import React, { useState, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

const CarouselWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  z-index: 1;
`;

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
`;

const Slide = styled.div`
  position: relative;
  min-width: 100%;
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  background: #000;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  pointer-events: none;
`;

const DarkOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, ${(props) => props.$opacity || 0.5});
  z-index: 2;
  pointer-events: none;
`;

const NavigationButton = styled.button`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  ${(props) => (props.$direction === "left" ? "left: 2rem;" : "right: 2rem;")}
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 200;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 100;
  padding: 0;
  margin: 0;
  line-height: 1;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.4);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(-50%) scale(1.05);
  }

  &:disabled {
    opacity: 0;
    cursor: default;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 32px;
    ${(props) => (props.$direction === "left" ? "left: 1rem;" : "right: 1rem;")}
  }
`;

const ImageCounter = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 1px;
  z-index: 100;
  margin: 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 0.6rem 1.2rem;
    bottom: 1rem;
  }
`;

/**
 * HomeCarousel - Optimized carousel specifically for home page
 * Features:
 * - Aggressive image preloading
 * - Smooth sliding transitions
 * - Dark overlay for text visibility
 * - Keyboard navigation
 * - Touch support
 */
const HomeCarousel = ({ images = [], overlayOpacity = 0.5 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const sliderRef = useRef(null);
  const preloadedImages = useRef(new Set());

  // Preload all images aggressively
  useEffect(() => {
    if (images.length === 0) return;

    const loadImages = async () => {
      const promises = images.map((src, index) => {
        return new Promise((resolve) => {
          if (preloadedImages.current.has(src)) {
            resolve(src);
            return;
          }

          const img = new Image();
          img.onload = () => {
            preloadedImages.current.add(src);
            resolve(src);
          };
          img.onerror = () => resolve(null);
          img.src = src;
          // Prioritize first 3 images
          if (index < 3) {
            img.fetchPriority = "high";
          }
        });
      });

      await Promise.all(promises);
      setIsLoading(false);
    };

    loadImages();
  }, [images]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevious, handleNext]);

  if (isLoading || images.length === 0) {
    return (
      <CarouselWrapper>
        <Slide
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1a1a1a",
          }}
        >
          <div style={{ color: "white", fontSize: "1.5rem" }}>Loading...</div>
        </Slide>
      </CarouselWrapper>
    );
  }

  return (
    <CarouselWrapper>
      <SliderContainer
        ref={sliderRef}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <Slide key={index}>
            <SlideImage
              src={src}
              alt={`Slide ${index + 1}`}
              loading={index < 2 ? "eager" : "lazy"}
              decoding={index < 2 ? "sync" : "async"}
            />
            <DarkOverlay $opacity={overlayOpacity} />
          </Slide>
        ))}
      </SliderContainer>

      <NavigationButton
        $direction="left"
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        aria-label="Previous image"
      >
        ‹
      </NavigationButton>

      <NavigationButton
        $direction="right"
        onClick={handleNext}
        disabled={currentIndex === images.length - 1}
        aria-label="Next image"
      >
        ›
      </NavigationButton>

      <ImageCounter>
        {currentIndex + 1} / {images.length}
      </ImageCounter>
    </CarouselWrapper>
  );
};

export default HomeCarousel;
