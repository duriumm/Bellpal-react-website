import React from "react";

const StateButton = ({ id, changeOpacityAndStateOnClick, text }) => {
  return (
    <button
      id={id}
      onClick={() => changeOpacityAndStateOnClick(id)}
      type="button"
      class="btn btn-primary btn-circle btn-xl m-2"
      // Style skriver över app.css styles :)
    >
      {text}
    </button>
  );
};

export default StateButton;
