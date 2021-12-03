import styles from "./Clock.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef, useReducer } from "react";
import Link from "next/link"
import { useForkRef, useInterval } from "rooks";

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    default:
      return state;
  }
}

export default function Clock() {
  
  const clockSize = 90;
  const [ style, setStyle ] = useState({
    hour:{
      height:4
    },
    minute:{
      height:2
    },
    second:{
      height:1
    }
  })
  const { start, stop } = useInterval(() => updateTime(), 1000);

  const updateTime = () => { 
    
    const d = new Date()
    const h = (d.getHours()/12)*360
    const m = (d.getMinutes()/60)*360
    const s = (d.getSeconds()/60)*360

    setStyle({
      hour: {...style.hour, transform: `rotate(${h}deg) translateY(${(clockSize - style.hour.height)/2}px) translateX(${clockSize/2}px)`},
      minute: {...style.minute, transform: `rotate(${m}deg) translateY(${(clockSize - style.minute.height)/2}px) translateX(${clockSize/2}px)`},
      second: {...style.second, transform: `rotate(${s}deg) translateY(${(clockSize - style.second.height)/2}px) translateX(${clockSize/2}px)`},
    })
  }

  useEffect(()=> start(), [])
  
	return (
		<div className={styles.clock}>
      <div className={styles.circle}>
        <div className={styles.center}></div>
      </div>
      <div className={styles.hour} style={style.hour}></div>
      <div className={styles.minute} style={style.minute}></div>
      <div className={styles.second} style={style.second}></div>
		</div>
	);
}