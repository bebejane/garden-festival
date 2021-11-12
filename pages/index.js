import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import React, { useState, useEffect, useRef } from 'react'
import anime from 'animejs';
import useVisibility from 'lib/hooks/useVisibility'
import diggiBatik from '../public/diggibatik.png'

export default function Home() {

  const batikRef = useRef()
  const treeHeight = 120;
  const padding = 20;

  const [loaded, setLoaded] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  const [selected, setSelected] = useState()
  const [scrollRef, {scroll, scrollStep, totalSteps}] = useVisibility('scroller', 0, 4)

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
    return {w, h, x, y}
  }

  
  
  const toMap = () => {
    
    anime.set(`.${styles.label}`, {width: 0, marginLeft:0})
    const pad = 100;
    const bounds = getBounds()
    const targets = document.querySelectorAll(`.${styles.tree}`)
    const totalTreeWidth = trees.reduce((acc, t) => t.ref.current.clientWidth + acc, 0)
    const space = ((bounds.w-totalTreeWidth)-(pad*2))/trees.length
    let currentX = bounds.x + pad;
    
    anime.set(targets, {
      translateY: () =>  '-100vh',
      height:treeHeight,
      left: (el, i) => {
        return ((bounds.w-(pad))*Math.random())+bounds.x;
        const left = currentX;
        currentX += el.clientWidth + space
        return left
      },
      top: (el) => {
        const top = Math.max(bounds.y+treeHeight, ((Math.random()*bounds.h)-treeHeight+bounds.y)-treeHeight)
        return top
      },
      filter:`hue-rotate(${scrollStep*90}deg)`
    });
    
    var tl = anime.timeline({
      targets,
      delay: function(el, i) { return i * 20 },
      easing: 'easeOutExpo',
      easing: 'spring(0.4, 100, 10, 0)',
      loop: false,  
      
    })
    .add({
      translateY: 0,
      //translateZ : (el, i) => { return Math.random()*100 }    
    })
    
    setShowMenu(false)
  }
  const toMenu = () => {
    const menuTreeHeight = treeHeight/2;
    var tl = anime({
      targets: `.${styles.tree}`,
      delay: (el, i) => i * 20,
      duration: 500,
      easing: 'easeOutExpo',
      left:padding,
      height:menuTreeHeight,
      top: anime.stagger([padding, trees.length*((menuTreeHeight)+padding)]),
      loop: false,
      scale: 1,
    }); 
    anime({
      targets: `.${styles.label}`,
      width:200,
      marginLeft:20,
      loop: false,
      
    }); 
    setShowMenu(true)
  }
  useEffect(()=> toMap(1), [loaded])

  useEffect(()=> {
    const t = 1/totalSteps;

    toMap(scrollStep)
  }, [scrollStep])
  
  return (
    <div className={styles.container}>
      <div className={styles.scroller} ref={scrollRef}></div>
      
      <div className={styles.menu}>
        <button onClick={toMap}>dripp</button>
        <button onClick={toMenu}>menu</button>
      </div>
      <div className={styles.diggi} >
        <img src={'/diggibatik.png'} ref={batikRef} className={cn(styles.batik, styles.diggity)}/>
        <div className={styles.trees}>
          {trees.map(t => 
            <Tree 
              {...t} 
              ref={t.ref} 
              menu={showMenu} 
              setLoaded={setLoaded} 
              selected={selected} 
              setSelected={(index)=>setSelected(index)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const Tree = React.forwardRef((props, ref) => {
  const { index, url, setLoaded, loaded, setSelected, selected, style, menu } = props; 
  const [mouseDown, setMouseDown] = useState(false)
  
  const handleMouse = ({type}) => {
    setSelected(type === 'mousedown' && selected !== index ? index : false)
  }

  useEffect(()=>{
    if(selected === undefined) return
    if(selected === index) console.log('selected:',selected, index)
    anime({
      targets : ref.current,
      height : selected === index ? '150%' : '100%',
      duration:200
    })
  }, [selected])

  const isSelected = selected === index;
  const labelStyle = isSelected || menu ? {width:200, marginLeft:20} : {width:0, zIndex:1}

  return (
    <div 
      className={cn(styles.tree)} 
      onMouseDown={handleMouse} 
      //onMouseUp={handleMouse}
      style={isSelected ? {zIndex:1000} : {zIndex:1}}
    >
      <img
        key={index}
        src={url} 
        ref={ref} 
        onLoad={(e)=>setLoaded(loaded+1)}
      />
      <div className={styles.label} style={labelStyle}>
        <h1>Project {index}</h1>
        Blah blah blahe Blah blah blahe Blah blah bllaalah blah blahe
      </div>
    </div>
  )

})