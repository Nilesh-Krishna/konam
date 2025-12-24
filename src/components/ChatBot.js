import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaComments,
  FaTimes,
  FaRobot,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";

const ChatContainer = styled.div`
  font-family: "Montserrat", sans-serif;
  pointer-events: auto;
`;

const ChatToggle = styled(motion.button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
  border: none;
  color: var(--text-light);
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(184, 92, 56, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  pointer-events: auto;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
    border-radius: 50%;
  }

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 35px rgba(184, 92, 56, 0.4);
  }

  @media (max-width: 768px) {
    width: 55px;
    height: 55px;
    font-size: 20px;
  }
`;

const ChatWindow = styled(motion.div)`
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 380px;
  height: 500px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(184, 92, 56, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 9999999;
  pointer-events: auto;

  @media (max-width: 768px) {
    width: 320px;
    height: 450px;
    bottom: 85px;
    right: 15px;
  }

  @media (max-width: 400px) {
    width: calc(100vw - 30px);
    right: 15px;
  }
`;

const ChatHeader = styled.div`
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
  color: var(--text-light);
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
  }
`;

const ChatTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 1.1rem;
  position: relative;
  z-index: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 2px;
  }
`;

const Message = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  ${(props) => (props.$isUser ? "flex-direction: row-reverse;" : "")}
`;

const MessageIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) =>
    props.$isUser ? "var(--primary-color)" : "var(--secondary-color)"};
  color: var(--text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
`;

const MessageBubble = styled.div`
  background: ${(props) =>
    props.$isUser ? "var(--primary-color)" : "rgba(245, 242, 235, 0.8)"};
  color: ${(props) =>
    props.$isUser ? "var(--text-light)" : "var(--text-dark)"};
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 240px;
  font-size: 0.9rem;
  line-height: 1.4;
  ${(props) =>
    props.$isUser
      ? "border-bottom-right-radius: 6px;"
      : "border-bottom-left-radius: 6px;"}
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  white-space: pre-line;
`;

const QuestionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 10px;
`;

const QuestionButton = styled.button`
  background: rgba(184, 92, 56, 0.1);
  border: 1px solid rgba(184, 92, 56, 0.2);
  color: var(--primary-color);
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  line-height: 1.3;

  &:hover {
    background: rgba(184, 92, 56, 0.2);
    border-color: rgba(184, 92, 56, 0.3);
    transform: translateY(-1px);
  }
`;

const ContactInfo = styled.div`
  background: rgba(184, 92, 56, 0.05);
  border-radius: 12px;
  padding: 12px;
  margin-top: 10px;
  border: 1px solid rgba(184, 92, 56, 0.1);
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.85rem;
  color: var(--text-dark);

  &:last-child {
    margin-bottom: 0;
  }
`;

const ContactIcon = styled.div`
  color: var(--primary-color);
  font-size: 12px;
  width: 16px;
`;

const ActionButton = styled.button`
  background: var(--primary-color);
  color: var(--text-light);
  border: none;
  padding: 8px 16px;
  border-radius: 12px;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  justify-content: center;

  &:hover {
    background: var(--accent-color);
    transform: translateY(-1px);
  }
`;

const TypingIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--neutral-dark);
  font-size: 0.8rem;
  font-style: italic;
`;

const Dot = styled(motion.span)`
  width: 4px;
  height: 4px;
  background: var(--primary-color);
  border-radius: 50%;
`;

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: 1,
            text: "Hello! 👋 Welcome to KONAM Interiors. I'm here to help you learn about our services and projects. How can I assist you today?",
            isUser: false,
            showQuestions: true,
          },
        ]);
      }, 500);
    }
  }, [isOpen, messages.length]);

  const addMessage = (text, isUser = true, options = {}) => {
    const newMessage = {
      id: Date.now(),
      text,
      isUser,
      ...options,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleTyping = (callback, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const predefinedQuestions = [
    {
      question: "Show Projects",
      answer:
        "Here are our featured projects! We specialize in residential, commercial, and hospitality interior design. Each project reflects our commitment to creating beautiful, functional spaces.",
      action: () => navigate("/projects"),
      showProjects: true,
    },
    {
      question: "About KONAM",
      answer:
        "KONAM is an interior design studio driven by clarity, craft, and care. We take on a select number of projects each year, allowing us to work closely and deliberately—shaping spaces that are both intelligent and quietly expressive.",
      showAboutActions: true,
    },
    {
      question: "Our Services",
      answer:
        "We offer comprehensive interior design services including:\n\n🏠 Residential Design - Creating homes that reflect your lifestyle\n🏢 Commercial Design - Enhancing productivity and brand identity\n🏨 Hospitality Design - Crafting memorable experiences",
      showServices: true,
    },
    {
      question: "Contact Us",
      answer: "We'd love to hear from you! Here's how you can reach us:",
      showContact: true,
    },
  ];

  const handleQuestionClick = (questionData) => {
    addMessage(questionData.question, true);

    handleTyping(() => {
      addMessage(questionData.answer, false, {
        showProjects: questionData.showProjects,
        showContact: questionData.showContact,
        showServices: questionData.showServices,
        showAboutActions: questionData.showAboutActions,
      });
    });

    if (questionData.action) {
      setTimeout(() => {
        questionData.action();
      }, 2000);
    }
  };

  const handleContactAction = (type) => {
    switch (type) {
      case "call":
        window.open("tel:9573797994");
        break;
      case "email":
        window.open("mailto:konamarchitecture@gmail.com");
        break;
      case "contact-page":
        navigate("/contact");
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleProjectsAction = () => {
    navigate("/projects");
    setIsOpen(false);
  };

  const handleAboutAction = () => {
    navigate("/about");
    setIsOpen(false);
  };

  const renderQuestions = () => (
    <QuestionGrid>
      {predefinedQuestions.map((q, index) => (
        <QuestionButton key={index} onClick={() => handleQuestionClick(q)}>
          {q.question}
        </QuestionButton>
      ))}
    </QuestionGrid>
  );

  const renderContactInfo = () => (
    <ContactInfo>
      <ContactItem>
        <ContactIcon>
          <FaPhone />
        </ContactIcon>
        <span>9573797994 / 9949032651</span>
      </ContactItem>
      <ContactItem>
        <ContactIcon>
          <FaEnvelope />
        </ContactIcon>
        <span>konamarchitecture@gmail.com</span>
      </ContactItem>
      <ContactItem>
        <ContactIcon>
          <FaMapMarkerAlt />
        </ContactIcon>
        <span>Hyderabad, Telangana</span>
      </ContactItem>
      <ActionButton onClick={() => handleContactAction("call")}>
        Call Now
      </ActionButton>
      <ActionButton onClick={() => handleContactAction("contact-page")}>
        Visit Contact Page <FaArrowRight />
      </ActionButton>
    </ContactInfo>
  );

  return (
    <ChatContainer>
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <ChatHeader>
              <ChatTitle>
                <FaComments />
                KONAM Assistant
              </ChatTitle>
              <CloseButton onClick={() => setIsOpen(false)}>
                <FaTimes />
              </CloseButton>
            </ChatHeader>

            <ChatMessages>
              {messages.map((message) => (
                <Message key={message.id} $isUser={message.isUser}>
                  <MessageIcon $isUser={message.isUser}>
                    {message.isUser ? <FaUser /> : <FaRobot />}
                  </MessageIcon>
                  <div>
                    <MessageBubble $isUser={message.isUser}>
                      {message.text}
                    </MessageBubble>
                    {message.showQuestions && renderQuestions()}
                    {message.showContact && renderContactInfo()}
                    {message.showProjects && (
                      <ActionButton onClick={handleProjectsAction}>
                        View All Projects <FaArrowRight />
                      </ActionButton>
                    )}
                    {message.showAboutActions && (
                      <ActionButton onClick={handleAboutAction}>
                        Learn More About Us <FaArrowRight />
                      </ActionButton>
                    )}
                  </div>
                </Message>
              ))}

              {isTyping && (
                <Message $isUser={false}>
                  <MessageIcon>
                    <FaRobot />
                  </MessageIcon>
                  <TypingIndicator>
                    Typing
                    <Dot
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                    />
                    <Dot
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    />
                    <Dot
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    />
                  </TypingIndicator>
                </Message>
              )}
              <div ref={messagesEndRef} />
            </ChatMessages>
          </ChatWindow>
        )}
      </AnimatePresence>

      <ChatToggle
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? <FaTimes /> : <FaComments />}
      </ChatToggle>
    </ChatContainer>
  );
};

export default ChatBot;
