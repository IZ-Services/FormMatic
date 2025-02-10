import React from "react";
import "./TypesContainer.css";

const TypeContainer: React.FC = () => {
  return (
    <div className="type-container-wrapper">
      <div className="type-container">
        <label className="checkbox-label"><input type="checkbox" className="checkbox" /> Gift</label>
        <label className="checkbox-label"><input type="checkbox" className="checkbox" /> Family transfer</label>

        <div className="section-break"></div>

        <label className="checkbox-label"><input type="checkbox" className="checkbox" /> Duplicate title</label>
        <label className="checkbox-label"><input type="checkbox" className="checkbox" /> Duplicate plates and sticker</label>

        <div className="section-break"></div>

        <label className="checkbox-label"><input type="checkbox" className="checkbox" /> Smog exempt</label>

        <div className="section-break"></div>

        <label className="checkbox-label"><input type="checkbox" className="checkbox" /> Lien holder addition</label>
        <label className="checkbox-label"><input type="checkbox" className="checkbox" /> Lien holder removal</label>

        <div className="section-break"></div>

        <label className="checkbox-label"><input type="checkbox" className="checkbox" /> Commercial vehicle</label>
      </div>
    </div>
  );
};

export default TypeContainer;
