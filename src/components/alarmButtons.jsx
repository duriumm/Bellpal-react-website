import React from "react";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

const AlarmButton = ({ id, onHoverText, className, onClickFunctionName, buttonsText }) => {
  return (
  <Tippy content={
    <div>
      {onHoverText}
    </div>}>
    <button
      id={id}
      onClick={onClickFunctionName} // <- how should i use the brackets 
      className={className}                 // to say there should be a function here :D
    >
      {buttonsText}
    </button>
  </Tippy>
  );
};

export default AlarmButton;

