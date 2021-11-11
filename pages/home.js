import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import React, { useState, useEffect, useRef } from 'react'
import anime from 'animejs';

export default function Home() {
  const batikRef = useRef()
  const [loaded, setLoaded] = useState(0)
  const [showProjects, setShowProjects] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [animated, setAnimated] = useState(0)
  const treeHeight = 150;
  const padding = 100;

  const [trees, setTrees] = useState(new Array(12).fill(0).map((x, i) => { 
    return {
      title : 'Project ' + i,
      index: i,
      ref: React.createRef(),
      url: `/trees/tree${i+1}.png`, 
      style:{
        height:`${treeHeight}px`,
        top:`${treeHeight*i}px`,
      }
    }
  }))
  const positionTrees = () => {

    var tl = anime({
      targets: `.${styles.tree}`,
      delay: (el, i) => i * 20,
      duration: 500,
      easing: 'easeOutExpo',
      left:0,
      top: anime.stagger([0, trees.length*treeHeight]),
      loop: false // Is not inherited

    });
    
  }
  
  const randomizePositions = () => {
    const {
      clientWidth : bgW, 
      clientHeight : bgH, 
      offsetTop : bgY, 
      offsetLeft: bgX 
    } = batikRef.current
    
    const targets = document.querySelectorAll(`.${styles.tree}`)
    const totalTreeWidth = trees.reduce((acc, t) => t.ref.current.clientWidth + acc, 0)
    const space = (bgW-totalTreeWidth)/trees.length

    let currentX = bgX;
    anime.set(targets, {
      translateY: () =>  -2000,
      left: (el, i) => {
        const left = currentX;
        currentX += el.clientWidth + space
        return left
      },
      top: (el) => {
        const top = Math.max(bgY+padding, ((Math.random()*bgH)-treeHeight+bgY)-padding)
        return top
      }
    });
    var tl = anime.timeline({
      targets,
      delay: function(el, i) { return i * 20 },
      easing: 'easeOutExpo',
      easing: 'spring(0.4, 100, 10, 0)',
      loop: false,      
    }).add({translateY: 0})
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <button onClick={randomizePositions}>Pos</button>
        <button onClick={positionTrees}>Manubutton</button>
      </div>
      <div className={styles.diggi} >
        <img src={'/diggiBatik.png'} ref={batikRef} className={cn(styles.batik, styles.diggity)}/>
        {trees.map(t => 
          <img 
            key={t.index}
            className={cn(styles.tree)} 
            style={t.style}
            src={t.url} 
            ref={t.ref} 
            onLoad={(e)=>setLoaded(loaded+1)}
          />
        )}
      </div>
    </div>
  )
}

const Tree = (props) => {
  const { ref, index, url, setLoaded, loaded } = props;
  return (
    <img 
      className={styles.tree} 
      src={url} 
      ref={ref} 
      onLoad={(e)=>setLoaded(loaded+1)}
    />
  )
}