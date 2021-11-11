import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import React, { useState, useEffect, useRef } from 'react'
import anime from 'animejs';

export default function Home() {
  const batikRef = useRef()
  const [loaded, setLoaded] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [animated, setAnimated] = useState(0)

  const treeHeight = 150;
  const padding = 20;

  const [trees, setTrees] = useState(new Array(12).fill(0).map((x, i) => { 
    return {
      title : 'Project ' + i,
      index: i,
      ref: React.createRef(),
      url: `/trees/tree${i+1}.png`, 
      state:'map',
      style:{
        height:`${treeHeight}px`,
        top:`${treeHeight*i}px`,
      }
    }
  }))
  const getBounds = () => {
    const{ clientWidth : w, clientHeight : h, offsetTop : y, offsetLeft: x} = batikRef.current
    return {w,h,x,y}
  }

  const toMenu = () => {

    var tl = anime({
      targets: `.${styles.tree}`,
      delay: (el, i) => i * 20,
      duration: 500,
      easing: 'easeOutExpo',
      left:padding,
      height:treeHeight/2,
      top: anime.stagger([padding, trees.length*((treeHeight/2)+padding)]),
      loop: false 
    }); 
    anime({
      targets: `.${styles.label}`,
      width:200,
      loop: false 
    }); 
    setShowMenu(true)
  }
  
  const toMap = () => {
    anime.set(`.${styles.label}`, {width: () =>  0})
    
    const bounds = getBounds()
    const targets = document.querySelectorAll(`.${styles.tree}`)
    const totalTreeWidth = trees.reduce((acc, t) => t.ref.current.clientWidth + acc, 0)
    const space = (bounds.w-totalTreeWidth)/trees.length
    
    let currentX = bounds.x;
    anime.set(targets, {
      translateY: () =>  '-100vh',
      height:treeHeight,
      left: (el, i) => {
        const left = currentX;
        currentX += el.clientWidth + space
        return left
      },
      top: (el) => {
        const top = Math.max(bounds.y+treeHeight, ((Math.random()*bounds.h)-treeHeight+bounds.y)-treeHeight)
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
    setShowMenu(false)
  }
  useEffect(()=> toMap(), [loaded])
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <button onClick={toMap}>dropped</button>
        <button onClick={toMenu}>menu</button>
      </div>
      <div className={styles.diggi} >
        <img src={'/diggiBatik.png'} ref={batikRef} className={cn(styles.batik, styles.diggity)}/>
        <div className={styles.trees}>
        {trees.map(t => <Tree {...t} ref={t.ref} menu={showMenu} setLoaded={setLoaded}/>)}
        </div>
      </div>
    </div>
  )
}

const Tree = React.forwardRef((props, ref) => {
  const { index, url, setLoaded, loaded, style, menu } = props;
  const [labelStyle, setLabelStyle] = useState({})
  const [hovering, setHovering] = useState(false)
  
  const handleHover = ({type}) => {
    setHovering(type === 'mouseenter')
  }

  return (
    <div 
      className={cn(styles.tree)} 
      onMouseEnter={handleHover} 
      onMouseLeave={handleHover}
      style={hovering ? {zIndex:100} : {zIndex:1}}
    >
      <img
        key={index}
        src={url} 
        ref={ref} 
        onLoad={(e)=>setLoaded(loaded+1)}
      />
      <div className={styles.label} style={hovering || menu ? {width:200} : {width:0}}>
        <h1>Project {index}</h1>
        Blah blah blahe Blah blah blahe Blah blah bllaalah blah blahe
      </div>
    </div>
  )

})