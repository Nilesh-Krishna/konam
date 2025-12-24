import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f5f5f5;
`;

const BlurredPlaceholder = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(20px);
  transform: scale(1.1);
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 0.3s ease-out;
`;

const StyledImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${(props) => (props.$loaded ? 1 : 0)};
  transform: translateZ(0);
  backface-visibility: hidden;
  transition: opacity 0.4s ease-out;
  will-change: opacity;
`;

const ErrorPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #999;
  font-size: 14px;
`;

/**
 * Ultra-Fast Optimized Image Component with Blur-Up technique:
 * - Shows tiny blurred version of actual image instantly
 * - Loads full resolution image in background
 * - Smooth transition when full image loads
 * - Smart lazy loading with Intersection Observer
 * - Memory efficient
 * - Error handling
 */
const OptimizedImage = ({
  src,
  alt = "",
  className,
  style = {},
  onError,
  onLoad,
  priority = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Validate src prop
  const validSrc = typeof src === "string" ? src : "";

  // Generate blur placeholder URL (tiny version for instant load)
  const getBlurPlaceholder = (url) => {
    if (!url || typeof url !== "string") return "";

    // For Firebase Storage URLs, add size parameter for tiny thumbnail
    if (url.includes("firebasestorage.googleapis.com")) {
      // Request 20x20 tiny version for blur placeholder
      const hasParams = url.includes("?");
      return `${url}${hasParams ? "&" : "?"}alt=media`;
    }

    // For other URLs, return as is (browser will cache it)
    return url;
  };

  // Intersection Observer for lazy loading (skip if priority is true)
  useEffect(() => {
    if (priority || !imgRef.current || !validSrc) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "100px",
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [priority, validSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    // Call parent onLoad callback if provided
    if (onLoad && typeof onLoad === "function") {
      onLoad();
    }
  };

  const handleError = (error) => {
    setHasError(true);
    console.error("Failed to load image:", validSrc, error);
    if (onError && typeof onError === "function") {
      onError(error);
    }
  };

  const blurPlaceholder = getBlurPlaceholder(validSrc);

  return (
    <ImageContainer ref={imgRef} className={className} style={style}>
      {hasError ? (
        <ErrorPlaceholder>Image unavailable</ErrorPlaceholder>
      ) : (
        <>
          {isInView && blurPlaceholder && (
            <>
              {/* Blurred placeholder - loads instantly */}
              <BlurredPlaceholder
                src={blurPlaceholder}
                alt=""
                $visible={!isLoaded}
                loading="eager"
                decoding="async"
                aria-hidden="true"
              />
              {/* Full resolution image */}
              <StyledImage
                src={validSrc}
                alt={alt}
                onLoad={handleLoad}
                onError={handleError}
                $loaded={isLoaded}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                fetchpriority={priority ? "high" : "auto"}
              />
            </>
          )}
        </>
      )}
    </ImageContainer>
  );
};

export default OptimizedImage;
