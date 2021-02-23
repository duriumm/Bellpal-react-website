import React from "react";

const StateButton = ({ id, text }) => {
  return (
    <button
      id={id}
      type="button"
      className="btn btn-circle btn-xl m-4 shadow-none"
      style={{ color: "black" }}
    // Style skriver över app.css styles :)
    >
      {text}
    </button>

  );
};

export default StateButton;
