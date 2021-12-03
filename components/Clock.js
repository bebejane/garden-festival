import { FESTIVAL_START_DATE } from "lib/utils/constant";
import styles from "./Clock.module.scss"
import cn from 'classnames';
import React, { useState, useEffect, useRef, useReducer } from "react";
import { useInterval } from "rooks";
import { differenceInDays, differenceInHours } from "date-fns";
import { useHover } from "lib/hooks";

const clockSize = 90;

const defaultStyles = {
  hour:{
    height:4
  },
  minute:{
    height:2
  },
  second:{
    height:1
  }
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

  const [ref, hovering] = useHover()
  const [ style, setStyle ] = useState(generateStyles(defaultStyles))
  const { start, stop } = useInterval(() => setStyle(generateStyles(style)), 1000);  
  useEffect(()=> {
    start()
    return stop
  }, [])

	return (
    <>
		<div className={styles.clock} ref={ref}>
      <div className={styles.circle}>
        <div className={styles.center}></div>
      </div>
      <div className={styles.hour} style={style.hour}></div>
      <div className={styles.minute} style={style.minute}></div>
      <div className={styles.second} style={style.second}></div>
		</div>
    <div className={cn(styles.countdown, hovering && styles.show)}>
      {differenceInDays(FESTIVAL_START_DATE, new Date())} days
      <br/>
      and
      <br/>
      {differenceInHours(new Date(), new Date().setHours(8))} hours
      <br/>
      to go
    </div>
    </>
	);
}