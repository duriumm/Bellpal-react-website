import React from "react";

import Arrow, { DIRECTION, HEAD } from "react-arrows"

const StateArrow = ({ id, fromBtn, toBtn, extrudeDir,
  attachDir, curvFrom1, curvFrom2, curvTo1, curvTo2 }) => {
  return (
    <Arrow
      arwId={id}
      className="arrow"
      from={{
        direction: extrudeDir,
        node: () => document.getElementById(fromBtn),
        translation: [curvFrom1, curvFrom2]
      }}
      to={{
        direction: attachDir,
        node: () => document.getElementById(toBtn),
        translation: [curvTo1, curvTo2], // Ändra detta för att få curvature på pilen
      }}
      head={
        HEAD.NORMAL
      }
    >
    </Arrow>

  );
};

export default StateArrow;