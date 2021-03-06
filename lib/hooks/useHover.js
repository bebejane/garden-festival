import { useState, useEffect, useRef } from "react";
import {primaryInput} from 'detect-it';

export default function useHover(){
  
  const [value, setValue] = useState(false);
  const ref = useRef(null);
  const handleMouseOver = () => primaryInput !== 'touch' && setValue(true);
  const handleMouseLeave =  () => primaryInput !== 'touch' && setValue(false);
  
  useEffect(() => {
      const node = ref.current;
      if (node) {
        node.addEventListener("mouseenter", handleMouseOver);
        node.addEventListener("mouseleave", handleMouseLeave);
        node.addEventListener("mouseover", handleMouseOver);

        return () => {
          node.removeEventListener("mouseenter", handleMouseOver);
          node.removeEventListener("mouseleave", handleMouseLeave);
          node.removeEventListener("mouseover", handleMouseOver);
        };
      }
    },
    [ref.current] // Recall only if ref changes
  );

  return [ref, value];
}