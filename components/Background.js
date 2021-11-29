import styles from "./Background.module.scss"
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import anime from "animejs";
import React from "react";
import { vi } from "date-fns/locale";
import { style } from "dom-helpers";

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const defaultViews = {
  garden:{},
  program:{},
  participants:{},
  participant:{},
  event:{}
}
export default function Background({view}) {
	const [views, setViews] = useState(defaultViews)
  const [lastView, setLastView] = useState()
  const [current, setCurrent] = useState()
  const handleRef = (name, ref) => {
    views[name].ref = ref;
    setViews(views)
  }
  useEffect(async ()=>{
    const last = document.getElementById(`background-${lastView}`)
    const next = document.getElementById(`background-${view}`)
    const rest = document.querySelectorAll(`.${styles.image}:not([id='${next?.id}']):not([id='${last?.id}'])`)
    setLastView(view)
    anime.set(rest, {opacity:0})    
    anime({targets:next, opacity:1, duration:4000})
    await anime({targets:last, opacity:0, rotate:3, scale:1.2, filter:'hue-rotate(360deg)', duration:4000}).finished
    anime.set(last, {filter:'hue-rotate(0deg)', opacity:0, rotate:0, scale:1})
    
  }, [view])
	return (	
    <div className={styles.background}>
      {Object.keys(views).map((name) => 
        <img 
          id={`background-${name}`}
          className={cn(styles.image)} 
          ref={(ref)=>handleRef(name, ref)} 
          src={`/images/digitalbatik-${name}.png`} 
        />
      )}
     </div>
	);
}