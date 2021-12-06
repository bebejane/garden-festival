import { FESTIVAL_START_DATE } from "lib/utils/constant";
import styles from "./Clock.module.scss"
import cn from 'classnames';
import React, { useState, useEffect } from "react";
import { useInterval } from "rooks";
import { differenceInDays, differenceInHours } from "date-fns";
import { useHover } from "lib/hooks";

const clockSize = 90;
const clockBorder = 4;

const defaultStyles = {
  hour:{
    height:5
  },
  minute:{
    height:4
  },
  second:{
    height:2
  }
}

const getAngle = (cx, cy, ex, ey) => {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  //if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}

const generateTicks = () => {
  const centerX = (clockSize-(clockBorder*2))/2
  const centerY = (clockSize-(clockBorder*2))/2
  const radius = (clockSize-(clockBorder))/2
  const steps = 60;
  const coords = []

  for (var i = 1, angle = 90; i <= steps; i++) {
    //if([1,14,30,45].includes(i))
      coords.push({
        x: (centerX + radius * Math.cos(2 * Math.PI * i / steps)),
        y: (centerY + radius * Math.sin(2 * Math.PI * i / steps)),
        a: getAngle((centerX + radius * Math.cos(2 * Math.PI * i / steps)), (centerY + radius * Math.sin(2 * Math.PI * i / steps)), centerX, centerY)
      })
  }
  
  return coords;
}


const generateStyles = (style) => {
  const d = new Date()
  const h = (d.getHours()/12)*360
  const m = (d.getMinutes()/60)*360
  const s = (d.getSeconds()/60)*360
  return {
    hour: {...style.hour, transform: `rotate(${h}deg) translateY(${(clockSize - style.hour.height)/2}px) translateX(${clockSize/2}px)`},
    minute: {...style.minute, transform: `rotate(${m}deg) translateY(${(clockSize - style.minute.height)/2}px) translateX(${clockSize/2}px)`},
    second: {...style.second, transform: `rotate(${s}deg) translateY(${(clockSize - style.second.height)/2}px) translateX(${clockSize/2}px)`},
  }
}

export default function Clock() {

  const [ ref, hovering ] = useHover()
  const [ didHover, setDidHover ] = useState(false)
  const [ show, setShow ] = useState(false)
  const [ style, setStyle ] = useState({})
  const { start, stop } = useInterval(() => setStyle(generateStyles(style)), 1000);  

  useEffect(()=> {
    start(); 
    setShow(true);
    setStyle(generateStyles(defaultStyles))
    return stop;
  }, [])
  useEffect(()=> hovering && !didHover && setDidHover(true), [hovering])

	return (
    <div className={styles.container}>
      <div className={cn(styles.clock, show && styles.show)} ref={ref}>
        <div className={styles.circle}>
          <div className={styles.center}></div>
          <div className={styles.marks}>
            <svg className={styles.ticks} height={clockSize} width={clockSize}>
              {generateTicks().map(({x,y,a}, i) => 
                <line 
                  x1={x} 
                  y1={y} 
                  x2={clockSize/2} 
                  y2={clockSize/2} 
                  pathLength="10"
                  style={{stroke: 'rgb(25,133,145)', opacity:0.0, strokeWidth:2}}
                />
              )}
              </svg> 
              <div className={styles.mask}></div>
          </div>
        </div>
        <div className={styles.hour} style={style.hour}></div>
        <div className={styles.minute} style={style.minute}></div>
        <div className={styles.second} style={style.second}></div>
        
      </div>
      <div className={cn(styles.countdown, hovering ? styles.show : didHover && styles.hide)}>
        {differenceInDays(FESTIVAL_START_DATE, new Date())} days and {FESTIVAL_START_DATE.getHours()} hours to go
      </div>
    </div>
	);
}