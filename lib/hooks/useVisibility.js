import { useEffect, useState } from 'react';
import { useInView } from "react-intersection-observer";
import useScrollPosition from '@react-hook/window-scroll'

const initialState = {
  ratio: 0,
  scrollRatio: 0,
  step: 0,
  wasVisible: false, 
  wasPassed: false, 
  isVisible: false, 
  isPassed: false, 
  direction: undefined
}
const useVisibility = (id, threshold = 0, steps = 100) => {
  const scrollY = useScrollPosition(60)
  const [state, setState] = useState({id, ...initialState})
  const { ref, entry } = useInView({ trackVisibility:true, delay: 100, threshold: threshold || new Array(steps).fill(0).map((x,t)=> (t/steps))});
  const { intersectionRatio: ratio , intersectionRect : pos, boundingClientRect : bounds  } = entry || {};
  
  useEffect(()=>{
    if(ratio === undefined) return 

    const { innerHeight } = window;
    const { clientHeight, offsetTop } = entry.target;
    const scrollRatio = Math.min(1, Math.max(0, (scrollY+innerHeight)-(offsetTop)) / (innerHeight+clientHeight));
    const scroll = Math.min((scrollY/(document.body.clientHeight-innerHeight)), 1.0)
    
    const newState = {
      id,
      ratio,
      scrollRatio,
      scroll,
      scrollY,
      scrollStep: Math.max(1, Math.ceil( scroll * steps)),
      scrollStepRatio: Math.max(Math.ceil( scroll * steps ),1) - (scroll*steps),
      step: Math.ceil(ratio*steps),
      totalSteps:steps,
      isVisible: ratio > 0,
      isPassed: scrollRatio === 1,
      wasVisible: state.wasVisible || ratio ? true : false,
      wasPassed: state.wasPassed || ratio >= 0.90 ? true : false,
      direction: (bounds.top < 0) ? 'out' : 'in'
    }
    
    if(JSON.stringify(newState) !== JSON.stringify(state)){
      setState(newState)
    }
  }, [ratio, scrollY])
  
  return [ref, state]
}

export default useVisibility