import React, { useState } from "react";
import { usePopper } from "react-popper";
import mStyles from "./tooltipforsettings.module.scss";

const TooltipForSettings = ({ text, children }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "left",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, -70], // Дополнительное смещение, если это необходимо
        },
      },
    ],
  });

  const showTooltip = () => {
    setTooltipVisible(true);
  };

  const hideTooltip = () => {
    setTooltipVisible(false);
  };

  return (
    <div
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      ref={setReferenceElement}
    >
      {children}
      {tooltipVisible && (
        <div
          className={mStyles.tooltip}
          ref={setPopperElement}
          style={{ ...styles.popper }}
          {...attributes.popper}
        >
          <div className="tooltip-content">{text}</div>
        </div>
      )}
    </div>
  );
};

export default TooltipForSettings;
