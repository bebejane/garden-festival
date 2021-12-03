import styles from "./Background.module.scss"
import cn from "classnames";
import { useEffect, useState } from "react";
import anime from "animejs";
import React from "react";
import { randomInt } from "/lib/utils";

const defaultViews = {
  garden:{},
  festival:{},
  community:{},
  participant:{},
  event:{},
  weekday:{},
  about:{}
}

export default function Background({view}) {
	const [views, setViews] = useState(defaultViews)
  const [lastView, setLastView] = useState()
  const handleRef = (name, ref) => {
    views[name].ref = ref;
    setViews(views)
  }
  useEffect(async ()=>{
    const last = document.getElementById(`background-${lastView}`)
    const next = document.getElementById(`background-${view}`)
    const rest = document.querySelectorAll(`.${styles.image}:not([id='${next?.id}']):not([id='${last?.id}'])`)
    setLastView(view)
    anime.set(rest, {opacity:0, rotate:0, scale:1})    
    anime({targets:next, opacity:1, easing:'easeInOutQuad', duration: !last ? 0 : 2000})
    await anime({
      targets:last, 
      opacity:0, 
      scale:2,
      filter:`hue-rotate(${randomInt(60, 360)}deg)`, 
      duration:2000,
      easing:'easeInOutQuad',
      complete:()=>{
        anime.set(last, {filter:'hue-rotate(0deg)',  scale:1, opacity:0})
      }
    }).finished
  }, [view])
	return (	
    <div className={styles.background}>
      {Object.keys(views).map((name, idx) => 
        <img 
          id={`background-${name}`}
          className={cn(styles.image)} 
          key={idx}
          ref={(ref)=>handleRef(name, ref)} 
          src={`/images/digitalbatik-${name}.png`} 
        />
      )}
     </div>
	);
}