// src/components/PanelCard.jsx
import React from "react";
import "../styles/PainelCard.css";

export default function PanelCard({ icon: Icon, label, onClick, disabled = false }) {
  return (
    <div
      className={`panel-card ${disabled ? "disabled" : ""}`}
      onClick={!disabled ? onClick : undefined}
    >
      <Icon size={45} className="panel-card-icon" />
      <span className="panel-card-label">{label}</span>
    </div>
  );
}
