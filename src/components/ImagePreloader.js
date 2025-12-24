import React, { useEffect } from "react";

// Image preloader utility
export const preloadImages = (imageSources) => {
  return Promise.all(
    imageSources.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => reject(src);
        img.src = src;
        img.loading = "eager";
        img.decoding = "sync";
        img.fetchPriority = "high";
      });
    })
  );
};

// React component for preloading images
const ImagePreloader = ({ images, onComplete }) => {
  useEffect(() => {
    if (!images || images.length === 0) return;

    preloadImages(images)
      .then(() => {
        console.log("✅ All critical images preloaded successfully");
        if (onComplete) onComplete();
      })
      .catch((failedSrc) => {
        console.warn("⚠️ Some images failed to preload:", failedSrc);
        if (onComplete) onComplete(); // Still call onComplete even if some fail
      });
  }, [images, onComplete]);

  return null; // This component doesn't render anything
};

export default ImagePreloader;
