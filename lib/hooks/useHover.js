import { useState, useEffect, useRef } from "react";
import {primaryInput} from 'detect-it';

export default function useHover(){
  const [value, setValue] = useState(false);
  const ref = useRef(null);

  const handleMouseOver = ({isTouch}) => primaryInput !== 'touch' && setValue(true);
  const handleMouseLeave =  ({isTouch}) => primaryInput !== 'touch' && setValue(false);
  
  useEffect(() => {
      const node = ref.current;
      if (node) {
        node.addEventListener("mouseenter", handleMouseOver);
        node.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          node.removeEventListener("mouseenter", handleMouseOver);
          node.removeEventListener("mouseleave", handleMouseLeave);
        };
      }
    },
    [ref.current] // Recall only if ref changes
  );

  return [ref, value];
}