import React, { useState, useRef, memo, useCallback } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaClock,
} from "react-icons/fa";

const ContactContainer = styled.div`
  padding: 120px 50px 80px;
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

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  @media (max-width: 768px) {
    gap: 30px;
  }
`;

const ContactForm = styled(motion.form)`
  background: linear-gradient(145deg, #ffffff 0%, #fefefe 100%);
  padding: 50px;
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

const FormGroup = styled.div`
  margin-bottom: 25px;
  position: relative;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 8px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e8d5c4;
  border-radius: 12px;
  font-size: 1rem;
  font-family: "Montserrat", sans-serif;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);

  &:focus {
    outline: none;
    border-color: #c65d21;
    box-shadow: 0 0 0 3px rgba(198, 93, 33, 0.1);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: #adb5bd;
    font-style: italic;
  }

  @media (max-width: 768px) {
    padding: 14px 16px;
    font-size: 0.95rem;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e8d5c4;
  border-radius: 12px;
  font-size: 1rem;
  font-family: "Montserrat", sans-serif;
  min-height: 160px;
  resize: vertical;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  line-height: 1.6;

  &:focus {
    outline: none;
    border-color: #c65d21;
    box-shadow: 0 0 0 3px rgba(198, 93, 33, 0.1);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: #adb5bd;
    font-style: italic;
  }

  @media (max-width: 768px) {
    padding: 14px 16px;
    font-size: 0.95rem;
    min-height: 140px;
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, #c65d21 0%, #8b4513 100%);
  color: #ffffff;
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 30px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 8px 20px rgba(198, 93, 33, 0.3);

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
    background: linear-gradient(135deg, #b54d11 0%, #6b2f0a 100%);
    box-shadow: 0 12px 30px rgba(198, 93, 33, 0.4);
    transform: translateY(-3px);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 14px 24px;
    font-size: 1rem;
    margin-top: 25px;
  }
`;

const ContactInfo = styled(motion.div)`
  background: linear-gradient(145deg, #ffffff 0%, #fefefe 100%);
  padding: 50px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(139, 69, 19, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: radial-gradient(
      circle,
      rgba(198, 93, 33, 0.1) 0%,
      transparent 70%
    );
    border-radius: 50%;
    transform: translate(30px, -30px);
  }

  @media (max-width: 768px) {
    padding: 35px 25px;
    border-radius: 16px;
  }
`;

const InfoTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 25px;
  color: var(--text-dark);
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #c65d21, #8b4513);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 20px;
    gap: 10px;
  }
`;

const InfoText = styled.p`
  color: #5a6c7d;
  margin-bottom: 20px;
  font-size: 1.1rem;
  line-height: 1.7;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 15px;
  }
`;

const InfoItem = styled.div`
  margin-bottom: 35px;
  padding: 25px;
  background: rgba(248, 249, 250, 0.8);
  border-radius: 16px;
  border: 1px solid rgba(198, 93, 33, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    border-color: rgba(198, 93, 33, 0.2);
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 25px;
    padding: 20px;
  }
`;

const StatusMessage = styled(motion.div)`
  padding: 16px 20px;
  margin: 15px 0;
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  background: ${(props) =>
    props.success
      ? "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)"
      : props.error
      ? "linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)"
      : "linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)"};
  color: ${(props) =>
    props.success ? "#155724" : props.error ? "#721c24" : "#856404"};

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 12px 16px;
    margin: 12px 0;
  }
`;

const Contact = memo(() => {
  const form = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: false, message: "" });

    try {
      // Format the complete message with all details
      const formattedMessage = `
KONAM INTERIORS - NEW INQUIRY
${new Date().toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
  dateStyle: "long",
  timeStyle: "short",
})}

───────────────────────────────────────────

CLIENT INFORMATION

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

───────────────────────────────────────────

PROJECT INQUIRY

${formData.message}

───────────────────────────────────────────

This inquiry was submitted through the Konam Interiors website contact form.
Please respond within 24 hours to maintain service standards.
      `.trim();

      // Send email with formatted message
      const result = await emailjs.send(
        "service_9qxf9mo",
        "template_brca5ca",
        {
          email: formData.email,
          name: formData.name,

          email: formData.email,
          phone: formData.phone,
          message: formattedMessage,
          to_name: "Konam Interiors",
        },
        "l5q2eXv0h2jTqEsh6"
      );

      if (result.text === "OK") {
        setStatus({
          submitting: false,
          success: true,
          error: false,
          message: "Message sent successfully! We'll get back to you soon.",
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      }
    } catch (error) {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: "Failed to send message. Please try again.",
      });
    }
  };

  return (
    <ContactContainer>
      <PageTitle
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        Contact Us
      </PageTitle>
      <ContactGrid>
        <ContactForm
          ref={form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              pattern="[0-9+\s-]*"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="message">Your Message</Label>
            <TextArea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your project requirements, timeline, and budget..."
              required
            />
          </FormGroup>
          {status.message && (
            <StatusMessage
              success={status.success}
              error={status.error}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {status.message}
            </StatusMessage>
          )}
          <SubmitButton
            type="submit"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 12px 30px rgba(198, 93, 33, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            disabled={status.submitting}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            {status.submitting ? "Sending..." : "Send Message"}
          </SubmitButton>
        </ContactForm>

        <ContactInfo
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <InfoItem>
            <InfoTitle>
              <FaMapMarkerAlt style={{ color: "#c65d21" }} />
              Our Location
            </InfoTitle>
            <InfoText>
              5-119, Mythri Nagar
              <br />
              Madinaguda
              <br />
              Hyderabad, Telangana 500049
            </InfoText>
          </InfoItem>

          <InfoItem>
            <InfoTitle>
              <FaPhone style={{ color: "#c65d21" }} />
              Contact Information
            </InfoTitle>
            <InfoText>
              <strong>Phone:</strong>{" "}
              <a
                href="tel:9573797994"
                style={{
                  color: "#c65d21",
                  textDecoration: "none",
                  fontWeight: "700",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                9573797994
              </a>{" "}
              /{" "}
              <a
                href="tel:9949032651"
                style={{
                  color: "#c65d21",
                  textDecoration: "none",
                  fontWeight: "700",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                9949032651
              </a>
              <br />
              <strong>Email:</strong>{" "}
              <a
                href="mailto:konamarchitecture@gmail.com"
                style={{
                  color: "#c65d21",
                  textDecoration: "none",
                  fontWeight: "700",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                admin@konam.in
              </a>
              <br />
              <strong>
                <FaClock style={{ color: "#c65d21", marginRight: "8px" }} />
              </strong>
              All day (24/7)
            </InfoText>
          </InfoItem>

          <InfoItem>
            <InfoTitle>
              <FaInstagram style={{ color: "#c65d21" }} />
              Follow Us
            </InfoTitle>
            <InfoText>
              <strong>Instagram:</strong>{" "}
              <a
                href="https://instagram.com/studio_konam"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#c65d21",
                  textDecoration: "none",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                @studio_konam
              </a>
            </InfoText>
          </InfoItem>
        </ContactInfo>
      </ContactGrid>
    </ContactContainer>
  );
});

export default Contact;
