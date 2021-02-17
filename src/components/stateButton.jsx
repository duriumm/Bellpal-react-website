import React from "react";

const StateButton = ({ id, changeStateOnClick, text}) => {
  return (
    <button
      id={id}
      onClick={() => changeStateOnClick(id)}
      type="button"
      className="btn btn-primary btn-circle btn-xl m-2"
      // Style skriver över app.css styles :)
    >
      {text}
    </button>
  );
};

export default StateButton;
