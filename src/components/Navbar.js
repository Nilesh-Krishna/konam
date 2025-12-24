import React, { useState, useEffect, useCallback, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  background: var(--accent-color);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10000;
  box-sizing: border-box;

  @media (max-width: 768px) {
    height: 70px;
    padding: 0 20px;
  }
`;

const LogoWrapper = styled(motion(Link))`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-decoration: none;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
  margin-right: 8px;
  height: auto;
  width: auto;
`;

const LogoImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid
    ${(props) =>
      props.scrolled ? "rgba(184, 92, 56, 0.8)" : "rgba(245, 242, 235, 0.9)"};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;

const LogoText = styled.span`
  font-size: 32px;
  font-weight: 700;
  color: var(--text-light);
  letter-spacing: 2px;
  font-family: "Montserrat", sans-serif !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  border: none;
  outline: none;
  will-change: color, text-shadow;
  margin-left: 14px;

  &:hover {
    color: var(--neutral-light);
  }

  @media (max-width: 768px) {
    font-size: 20px;
    margin-left: 8px;
  }
`;

const NavLinks = styled(motion.div)`
  display: flex;
  gap: 40px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: rgba(245, 242, 235, 0.1);
  border: 2px solid rgba(245, 242, 235, 0.3);
  border-radius: 10px;
  cursor: pointer;
  padding: 8px;
  z-index: 10002; /* ensure mobile button stays above nav children */
  min-width: 44px;
  min-height: 44px;
  color: var(--text-light);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(245, 242, 235, 0.2);
    border-color: rgba(245, 242, 235, 0.5);
    color: var(--neutral-light);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  /* Solid dark background for better readability on open */
  background: linear-gradient(
    180deg,
    rgba(3, 3, 3, 1) 0%,
    rgba(18, 18, 18, 1) 100%
  );
  flex-direction: column;
  /* Start items at the top so the menu fills the screen and items are visible immediately */
  justify-content: flex-start;
  align-items: stretch;
  gap: 24px;
  z-index: 10006; /* place menu above nav (nav uses very high z-index) */
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  overflow-y: auto; /* allow scrolling if content exceeds viewport */
  -webkit-overflow-scrolling: touch;
  min-height: 100vh;
  padding-top: 88px; /* avoid overlapping fixed header */
  padding-bottom: 40px;

  /* Ensure links inside the mobile menu occupy full width and are clearly visible */
  a {
    width: 100%;
    display: block;
    text-align: center;
    padding: 20px 24px;
    box-sizing: border-box;
  }

  /* Provide a content container so links are centered horizontally with max width */
  .mobile-inner {
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 0 16px;
    box-sizing: border-box;
    align-items: stretch;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenuOverlay = styled(motion.div)`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* overlay dim behind solid menu - keep subtle */
  background: rgba(0, 0, 0, 0.45);
  z-index: 10004; /* under the mobile menu but above nav */

  @media (max-width: 768px) {
    display: block;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(184, 92, 56, 0.1);
  border: 2px solid rgba(184, 92, 56, 0.3);
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  z-index: 10007; /* ensure close button is above everything */
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(184, 92, 56, 0.2);
    border-color: rgba(184, 92, 56, 0.5);
    transform: scale(1.05);
  }

  svg {
    width: 24px;
    height: 24px;
    stroke: rgba(184, 92, 56, 1);
    transition: stroke 0.3s ease;
  }

  &:active,
  &:focus {
    outline: none;
    border: none;
  }
`;

const NavLink = styled(motion(Link))`
  color: var(--text-light);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  font-family: "Montserrat", sans-serif;
  position: relative;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  border: none;
  background: none;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    width: ${(props) => (props.active ? "100%" : "0")};
    height: 2px;
    background: linear-gradient(90deg, rgba(245, 242, 235, 0.9), rgba(232, 227, 219, 0.9));
    transform: translateX(-50%);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 1px;
  }

  &:hover {
    color: var(--neutral-light);
    background: rgba(245, 242, 235, 0.1);

    &::after {
      width: 100%;
    }
  }

  &.active,
  ${(props) =>
    props.active &&
    `
    color: var(--neutral-light);
    font-weight: 600;
    background: rgba(245, 242, 235, 0.15);

    &::after {
      width: 100%;
    }
  `}

  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    color: #F5F2EB;
    font-size: 1.8rem;
    font-family: "Montserrat", sans-serif;
    padding: 12px 20px;
    font-weight: 500;
    text-align: center;
    border-radius: 12px;

    &::after {
      background: linear-gradient(90deg, rgba(245, 242, 235, 0.9), rgba(232, 227, 219, 0.9));
      height: 3px;
      width: ${(props) => (props.active ? "100%" : "0")};
    }

    &:hover {
      color: var(--neutral-light);
      background: rgba(245, 242, 235, 0.1);

      &::after {
        width: 100%;
      }
    }

    &.active,
    ${(props) =>
      props.active &&
      `
      color: var(--neutral-light);
      font-weight: 600;
      background: rgba(245, 242, 235, 0.2);

      &::after {
        width: 100%;
        height: 4px;
      }
    `}
  }
`;

const Navbar = memo(() => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.1,
      },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const mobileMenuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Nav
      scrolled={scrolled}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <LogoWrapper
        to="/"
        scrolled={scrolled}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Home"
      >
        <LogoImage src="/Logo.jpeg" alt="KONAM Logo" scrolled={scrolled} />
        <LogoText scrolled={scrolled}>KONAM</LogoText>
      </LogoWrapper>
      <NavLinks>
        <AnimatePresence mode="wait">
          <NavLink
            key="home"
            to="/"
            scrolled={scrolled}
            className="montserrat"
            active={location.pathname === "/"}
            variants={linkVariants}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Home
          </NavLink>
          <NavLink
            key="projects"
            to="/projects"
            scrolled={scrolled}
            className="montserrat"
            active={location.pathname === "/projects"}
            variants={linkVariants}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Projects
          </NavLink>
          <NavLink
            key="about"
            to="/about"
            scrolled={scrolled}
            className="montserrat"
            active={location.pathname === "/about"}
            variants={linkVariants}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            About
          </NavLink>
          <NavLink
            key="contact"
            to="/contact"
            scrolled={scrolled}
            className="montserrat"
            active={location.pathname === "/contact"}
            variants={linkVariants}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Contact
          </NavLink>
        </AnimatePresence>
      </NavLinks>
      <MobileMenuButton
        onClick={toggleMobileMenu}
        whileTap={{ scale: 0.95 }}
        scrolled={scrolled}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isMobileMenuOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </MobileMenuButton>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <MobileMenuOverlay
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              onClick={toggleMobileMenu}
            />
            <MobileMenu
              id="mobile-menu"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              <CloseButton onClick={toggleMobileMenu} aria-label="Close menu">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </CloseButton>

              <div className="mobile-inner">
                <NavLink
                  to="/"
                  scrolled={true}
                  className="montserrat"
                  active={location.pathname === "/"}
                  onClick={toggleMobileMenu}
                  style={{ fontSize: "2.2rem" }}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/projects"
                  scrolled={true}
                  className="montserrat"
                  active={location.pathname === "/projects"}
                  onClick={toggleMobileMenu}
                  style={{ fontSize: "2.2rem" }}
                >
                  Projects
                </NavLink>
                <NavLink
                  to="/about"
                  scrolled={true}
                  className="montserrat"
                  active={location.pathname === "/about"}
                  onClick={toggleMobileMenu}
                  style={{ fontSize: "2.2rem" }}
                >
                  About
                </NavLink>
                <NavLink
                  to="/contact"
                  scrolled={true}
                  className="montserrat"
                  active={location.pathname === "/contact"}
                  onClick={toggleMobileMenu}
                  style={{ fontSize: "2.2rem" }}
                >
                  Contact
                </NavLink>
              </div>
            </MobileMenu>
          </>
        )}
      </AnimatePresence>
    </Nav>
  );
});

export default Navbar;
