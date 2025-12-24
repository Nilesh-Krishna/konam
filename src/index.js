import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Ultra-fast global performance optimizations
const style = document.createElement("style");
style.textContent = `
  /* Optimize font loading with font-display: swap for instant render */
  @font-face {
    font-family: 'Poppins';
    font-display: swap;
  }

  @font-face {
    font-family: 'Playfair Display';
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    font-display: swap;
  }

  /* Global performance optimizations for instant loading */
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeSpeed;
    overscroll-behavior: none;
    scroll-behavior: auto;
  }

  html {
    scroll-behavior: auto;
    -webkit-overflow-scrolling: touch;
  }

  /* Optimize images for instant loading */
  img {
    max-width: 100%;
    height: auto;
    /* Optimize image rendering */
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }

  /* Optimize animations */
  * {
    /* GPU acceleration for better performance */
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
    /* Optimize containment */
    contain: layout style;
  }

  /* Optimize scrolling specifically */
  html, body {
    /* Prevent scroll chaining and improve performance */
    overscroll-behavior: none;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    /* Optimize text rendering */
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: subpixel-antialiased;
    /* Add momentum scrolling on iOS */
    -webkit-momentum-scrolling: auto;
  }

  body {
    /* Prevent layout shifts during scroll */
    position: relative;
    /* Optimize for GPU */
    transform: translateZ(0);
    will-change: scroll-position;
  }

  /* Optimize motion components */
  [data-projection-id] {
    will-change: transform;
    contain: layout style paint;
    /* Force GPU acceleration */
    transform: translateZ(0);
    backface-visibility: hidden;
  }

  /* Reduce motion for users who prefer it */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* AGGRESSIVE: Disable all animations during scroll */
  .scrolling * {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    /* Prevent layout recalculations */
    will-change: auto !important;
  }

  .scrolling [data-projection-id] {
    animation: none !important;
    transition: none !important;
    /* Force hardware acceleration off during scroll */
    transform: none !important;
    will-change: auto !important;
  }

  .scrolling img {
    /* Prevent image loading during scroll */
    content-visibility: auto;
  }

  /* Extra aggressive scroll mode */
  .aggressive-scroll * {
    /* Disable all visual effects */
    box-shadow: none !important;
    filter: none !important;
    backdrop-filter: none !important;
    /* Force minimal rendering */
    contain: layout style paint !important;
  }

  .aggressive-scroll [data-projection-id] {
    /* Completely disable framer-motion during aggressive scroll */
    display: block !important;
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }

  /* Protect carousel navigation from scroll optimizations */
  .carousel-container,
  .carousel-container *,
  .carousel-container button,
  .carousel-container .carousel-dots,
  .carousel-container .carousel-dots * {
    /* Keep carousel controls functional */
    pointer-events: auto !important;
    animation: initial !important;
    transition: initial !important;
    transform: initial !important;
    will-change: auto !important;
  }

  /* Performance mode optimizations */
  .performance-mode {
    /* Reduce paint frequency */
    contain: layout style paint;
    /* Force layer creation for smoother scrolling */
    transform: translateZ(0);
    /* Optimize for scrolling */
    will-change: scroll-position;
  }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance monitoring
reportWebVitals(console.log);
