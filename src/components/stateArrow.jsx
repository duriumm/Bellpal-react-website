import React from "react";

import Arrow, { DIRECTION, HEAD } from "react-arrows"

const StateArrow = ({ fromState, toState }) => {
  return (
    <Arrow
      className="arrow"
      from={{
        direction: DIRECTION.BOTTOM,
        node: () => document.getElementById({ fromState }),
        translation: [-0.5, 0.5]
      }}
      to={{
        direction: DIRECTION.TOP,
        node: () => document.getElementById({ toState }),
        translation: [0, -0.8] // Ändra detta för att få curvature på pilen

      }}
    >
    </Arrow>

  );
};

export default StateArrow;