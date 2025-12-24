import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import OptimizedImage from "./OptimizedImage";

const GalleryContainer = styled.div`
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-top: 0;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
`;

const ImageSlider = styled.div`
  display: flex;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  height: 90vh;
`;

const ImageSlide = styled.div`
  min-width: 100%;
  height: 90vh;
  position: relative;
  background: #000;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #000;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  /* Dark overlay for better text visibility */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, ${(props) => props.$overlayOpacity || 0});
    z-index: 1;
    pointer-events: none;
  }

  &:hover img {
    transform: scale(1.02);
  }
`;

const NavigationButton = styled.button`
  position: absolute;
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
  display: grid;
  place-items: center;
  font-size: 40px;
  line-height: 0;
  font-weight: 200;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 100;
  /* Ensure gallery controls sit above other page chrome like back button */
  z-index: 10008;
  padding: 0;
  margin: 0;

  /* Optical adjustment for chevron characters */
  padding-bottom: 2px;

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
    padding-bottom: 1px;
    ${(props) => (props.$direction === "left" ? "left: 1rem;" : "right: 1rem;")}
  }
`;

const ImageCounter = styled.div`
  position: absolute;
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
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 10008; /* keep counter above other page chrome */

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 0.6rem 1.2rem;
    bottom: 1rem;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  pointer-events: none;
  width: 100%;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const GalleryTitle = styled.h1`
  font-size: 5rem;
  font-weight: 700;
  font-family: "Montserrat", sans-serif;
  color: white;
  margin: 0 0 1rem 0;
  letter-spacing: 4px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.7);
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    letter-spacing: 2px;
  }
`;

const GalleryCategory = styled.p`
  font-size: 1.4rem;
  font-family: "Montserrat", sans-serif;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  letter-spacing: 3px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7);
  text-transform: uppercase;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

/**
 * Modern Image Gallery with:
 * - Smooth sliding transitions
 * - Image preloading for instant display
 * - Title and category overlay on first image
 * - Previous/Next navigation buttons
 * - Keyboard support
 * - Configurable dark overlay opacity
 */
const VirtualizedGallery = ({
  images = [],
  title = "",
  category = "",
  overlayOpacity = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Preload adjacent images for instant display
  useEffect(() => {
    const preloadImages = [];
    const indicesToPreload = [
      currentIndex - 1,
      currentIndex,
      currentIndex + 1,
      currentIndex + 2,
    ].filter((i) => i >= 0 && i < images.length);

    indicesToPreload.forEach((index) => {
      if (images[index]) {
        const img = new Image();
        img.src = images[index];
        preloadImages.push(img);
      }
    });

    return () => {
      preloadImages.forEach((img) => {
        img.src = "";
      });
    };
  }, [currentIndex, images]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = Math.max(0, prev - 1);
      if (newIndex !== prev) {
        setDirection(-1);
      }
      return newIndex;
    });
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = Math.min(images.length - 1, prev + 1);
      if (newIndex !== prev) {
        setDirection(1);
      }
      return newIndex;
    });
  }, [images.length]);

  if (!images || images.length === 0) {
    return <div>No images available</div>;
  }

  return (
    <GalleryContainer>
      <ImageSlider style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <ImageSlide key={index}>
            <ImageContainer $overlayOpacity={overlayOpacity}>
              <OptimizedImage
                src={image}
                alt={
                  title
                    ? `${title} - Image ${index + 1}`
                    : `Gallery image ${index + 1}`
                }
              />

              {title && index === 0 && (
                <ImageOverlay>
                  <GalleryTitle>{title}</GalleryTitle>
                  {category && <GalleryCategory>{category}</GalleryCategory>}
                </ImageOverlay>
              )}
            </ImageContainer>
          </ImageSlide>
        ))}
      </ImageSlider>

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
    </GalleryContainer>
  );
};

export default VirtualizedGallery;
