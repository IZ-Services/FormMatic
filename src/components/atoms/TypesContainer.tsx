import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import "./TypesContainer.css";

const TypeContainer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1200);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setIsOpen(true); 
      } else {
        setIsOpen(false); 
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`type-container-wrapper ${isOpen ? "open" : ""}`}>
      <button className="side-tab" onClick={() => setIsOpen(true)}>
        <span>Add-ons</span>
      </button>

      <div className={`type-container ${isOpen ? "show" : ""}`}>
        <button className="close-button" onClick={() => setIsOpen(false)}>
          <XMarkIcon className="close-icon" />
        </button>

        <label className="checkbox-label">
          <input type="checkbox" className="checkbox" /> Gift
        </label>
        <label className="checkbox-label">
          <input type="checkbox" className="checkbox" /> Family transfer
        </label>

        <div className="section-break"></div>

        <label className="checkbox-label">
          <input type="checkbox" className="checkbox" /> Duplicate title
        </label>
        <label className="checkbox-label">
          <input type="checkbox" className="checkbox" /> Duplicate plates and sticker
        </label>

        <div className="section-break"></div>

        <label className="checkbox-label">
          <input type="checkbox" className="checkbox" /> Smog exempt
        </label>

        <div className="section-break"></div>

        <label className="checkbox-label">
          <input type="checkbox" className="checkbox" /> Lien holder addition
        </label>
        <label className="checkbox-label">
          <input type="checkbox" className="checkbox" /> Lien holder removal
        </label>

        <div className="section-break"></div>

        <label className="checkbox-label">
          <input type="checkbox" className="checkbox" /> Commercial vehicle
        </label>
      </div>
    </div>
  );
};

export default TypeContainer;
