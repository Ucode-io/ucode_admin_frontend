import React, { useState, useRef, useEffect } from 'react';
import { LayoutTemplate, Paperclip, ArrowUp, Plus, Mic, Sparkles, X, Terminal, PenTool, Database, } from 'lucide-react';
import TemplateModal from './TemplateModal';
import { samplePrompts } from './mockData';
import { useFileUpload } from "@/hooks/useFileUpload";
import './styles.css';

// Prompt Modal Component
const PromptLibraryModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="prompt-modal-overlay" onClick={onClose}>
      <div
        className="prompt-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="prompt-modal-header">
          <div className="prompt-modal-title">
            <Sparkles size={20} color="#4299E1" />
            <span>Prompt Library</span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="prompt-grid">
          {samplePrompts.map((p, index) => (
            <div
              key={index}
              className="prompt-card"
              onClick={() => onSelect(p)}
            >
              <div className="prompt-card-icon">
                <Terminal size={18} />
              </div>
              <div className="prompt-card-text">{p}</div>
              <div className="prompt-card-category">Development</div>
            </div>
          ))}
          {/* Adding more dummy prompts to show scalar */}
          <div
            className="prompt-card"
            onClick={() =>
              onSelect("Generate a dark mode color palette for a fintech app.")
            }
          >
            <div className="prompt-card-icon">
              <PenTool size={18} />
            </div>
            <div className="prompt-card-text">
              Generate a dark mode color palette for a fintech app.
            </div>
            <div className="prompt-card-category">Design</div>
          </div>
          <div
            className="prompt-card"
            onClick={() =>
              onSelect(
                "Write a SQL schema for a multi-tenant SaaS application."
              )
            }
          >
            <div className="prompt-card-icon">
              <Database size={18} />
            </div>
            <div className="prompt-card-text">
              Write a SQL schema for a multi-tenant SaaS application.
            </div>
            <div className="prompt-card-category">Data</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = ({ prompt, setPrompt, onSubmit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPromptLibraryOpen, setIsPromptLibraryOpen] = useState(false);
  // const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const textareaRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [prompt]);

  // Handle recommendations
  useEffect(() => {
    if (prompt.trim().length > 0) {
      const filtered = samplePrompts
        .filter(
          (p) =>
            p.toLowerCase().includes(prompt.toLowerCase()) &&
            p.toLowerCase() !== prompt.toLowerCase()
        )
        .slice(0, 5); // Limit to top 5

      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [prompt]);

  // Click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = () => {
    if (!prompt.trim()) return;
    console.log("User Prompt:", prompt);
    onSubmit({ images: images.map((img) => img.url) });
    setPrompt("");
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (showSuggestions) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        handlePromptSelect(suggestions[selectedIndex]);
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      } else if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    } else {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  const handlePromptSelect = (selectedPrompt) => {
    setPrompt(selectedPrompt);
    setIsPromptLibraryOpen(false);
    setShowSuggestions(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Set cursor to end
      setTimeout(() => {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
          selectedPrompt.length;
      }, 0);
    }
  };

  const {
    fileInputRef,
    images,
    handlePickClick,
    onFileUpload,
    dragDropProps,
    onPaste,
    removeImage,
  } = useFileUpload();

  return (
    <>
      <div className="background-glow"></div>

      <div className="home-container">
        <div className="home-content-wrapper">
          {/* <div className="blue-pill">
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                width: "6px",
                height: "6px",
              }}
            ></span>
            New: Introducing Smart Templates
          </div> */}

          <h1 className="home-title">Build something</h1>
          <p className="home-subtitle">
            Create appropriate Admin Panel for your business with Ucode AI
          </p>

          <div
            className="prompt-container"
            {...dragDropProps}
            onPaste={onPaste}
          >
            <div style={{ position: "relative", width: "100%" }}>
              {images.length > 0 && (
                <div className="input-images-container">
                  {images.map((img) => (
                    <div key={img.id} className="input-image-preview-wrapper">
                      <img
                        src={img.url}
                        alt="uploaded"
                        className="input-image-preview"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(img.id);
                        }}
                        className="input-image-remove"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <textarea
                ref={textareaRef}
                className="prompt-textarea"
                placeholder="Ask u-code to create an internal tool..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() =>
                  prompt.trim() &&
                  suggestions.length > 0 &&
                  setShowSuggestions(true)
                }
                onKeyDown={handleKeyDown}
                rows={1}
              />

              {showSuggestions && (
                <div className="search-suggestions" ref={suggestionsRef}>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`suggestion-item ${
                        index === selectedIndex ? "selected" : ""
                      }`}
                      onClick={() => handlePromptSelect(suggestion)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <Sparkles size={14} className="suggestion-icon" />
                      <span className="suggestion-text">
                        {/* Highlight the matching part if we want to be fancy, but simple for now */}
                        {suggestion}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="prompt-footer">
              <div className="prompt-actions-left">
                {/* <button className="action-btn" title="Add File">
                  <Plus size={18} />
                </button> */}

                <button
                  className="action-btn"
                  title="Attach"
                  onClick={handlePickClick}
                >
                  <Paperclip size={16} />
                  <span>Attach</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onFileUpload}
                  style={{ display: "none" }}
                />
                <button
                  className={`action-btn ${
                    isPromptLibraryOpen ? "active" : ""
                  }`}
                  onClick={() => setIsPromptLibraryOpen(true)}
                  title="Open Prompt Library"
                >
                  <Sparkles size={16} />
                  <span>Prompts</span>
                </button>
                <button
                  className="action-btn templates-btn-inline"
                  onClick={() => setIsModalOpen(true)}
                  title="Browse Templates"
                >
                  <LayoutTemplate size={16} />
                  <span>Templates</span>
                </button>
              </div>

              <div className="prompt-actions-right">
                {/* <button className="action-btn" title="Voice Input">
                  <Mic size={18} />
                </button> */}
                <button
                  className="send-btn-circle"
                  onClick={() => handleSend()}
                  disabled={!prompt.trim()}
                >
                  <ArrowUp size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <PromptLibraryModal
        isOpen={isPromptLibraryOpen}
        onClose={() => setIsPromptLibraryOpen(false)}
        onSelect={handlePromptSelect}
      />
    </>
  );
};

export default HomePage;
