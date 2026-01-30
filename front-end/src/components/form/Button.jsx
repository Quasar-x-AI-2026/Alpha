import React from "react";

export default function Button(props) {
  const {
    className = "",
    onClick,
    type = "button",
    disabled = false,
    children,
  } = props;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded block active:scale-[0.99] ${className}`}
      style={{
        backgroundColor: disabled ? "#d1d5db" : undefined,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}
