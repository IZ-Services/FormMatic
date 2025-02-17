import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import "./TypesContainer.css";

const TypeContainer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1200);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setIsOpen(true); // Always open on large screens
      } else {
        setIsOpen(false); // Default to closed on smaller screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`type-container-wrapper ${isOpen ? "open" : ""}`}>
      {/* Side tab only showing text */}
      <button className="side-tab" onClick={() => setIsOpen(true)}>
        <span>Add-ons</span>
      </button>

      {/* Type Container */}
      <div className={`type-container ${isOpen ? "show" : ""}`}>
        {/* Close icon on top-right inside the container */}
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
