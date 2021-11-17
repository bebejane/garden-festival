import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import React, { useState, useEffect, useRef } from 'react'
import anime from 'animejs';
import useVisibility from 'lib/hooks/useVisibility'
import {useWindowSize} from "rooks"

export default function Home() {

  const batikRef = useRef()
  const treeHeight = 170;
  const padding = 10;
  
  const [loaded, setLoaded] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  const [selected, setSelected] = useState()
  const [page, setPage] = useState(1)
  const [bounds, setBounds] = useState({})
  const [showBounds, setShowBounds] = useState(false)
  const [positions, setPositions] = useState()
  const [scrollRef, {scroll, scrollStep, scrollStepRatio, totalSteps}] = useVisibility('scroller', 0, 4)
  const { innerWidth } = useWindowSize();

  let menuAnimation;

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
    const pad = 100;
    return {w:w-(pad*2), h:h-(pad*2), x:x+pad, y:y+pad}
  }
  const randomInt= (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  const dripIt = () => {
    window.scroll(0,0); 
    toMap();
  }
  const toMap = (page) => {
    
    
    
    const bounds = getBounds()
    const targets = document.querySelectorAll(`.${styles.tree}`)
    const totalTreeWidth = trees.reduce((acc, t) => t.ref.current.clientWidth + acc, 0)

    let pos = []
    const rows = 3;
    const cols = trees.length/rows;
    const colWidth = bounds.w/cols
    const colHeight = bounds.h/rows

    targets.forEach((el, idx)=>{
      const row = Math.ceil((idx+1)/(rows*cols)*(rows))
      const col = (idx+1)-((row-1)*cols)
      const { clientHeight : h, clientWidth: w} = el;
      const left = bounds.x + randomInt((col-1)*colWidth, (((col-1)*colWidth)+colWidth)-w)
      const top = bounds.y + randomInt((row-1)*colHeight, (((row-1)*colHeight)+colHeight)-h) //((row-1)*colHeight)
      pos.push({left, top})  
    })
    
    pos = pos.sort((a, b)=> Math.random() > 0.5)

    anime.set(`.${styles.label}`, {width: 0, marginLeft:0})
    anime.set(targets, {
      translateY: () =>  '-100vh',
      left: (el, i) => pos[i].left,
      top: (el, i) => pos[i].top,
      height: treeHeight,
      filter:`hue-rotate(${page*45}deg)`
    });
    
    anime.timeline({
      targets,
      delay: (el, i) => i * 70,
      easing: 'spring(0.4, 100, 10, 0)',
      loop: false,
    })
    .add({translateY: 0})
    setShowMenu(false)
    setPositions(pos)
    setPage(page)
  }

  const toMenu = () => {
    if(showMenu) return toMapFromMenu()
    const menuTreeHeight = treeHeight/2;
    const maxTreeWidth = trees.sort((a,b) => a.ref.current.clientWidth < b.ref.current.clientWidth)[0].ref.current.clientWidth
    
    anime({
      targets: `.${styles.tree}`,
      left: (el, i) => ((maxTreeWidth - el.clientWidth)/2)+padding,
      height: menuTreeHeight,
      top: anime.stagger([padding, trees.length*((menuTreeHeight)+padding)]),
      delay: (el, i) => i * 20,
      duration: 500,
      easing: 'easeOutExpo',
      loop: false,
      scale: 1
    }); 
    
    anime.set({
      targets: `.${styles.label}`,
      width:200,
      marginLeft:20,
      loop: false,
      easing: 'spring(0.4, 100, 10, 0)',
    }); 
    setShowMenu(true)
  }
  const toMapFromMenu = () => {
    const menuTreeHeight = treeHeight/2;
    anime.set({
      targets: `.${styles.label}`,
      width:0,
      marginLeft:0,
      loop: false
    });
    anime({
      targets: `.${styles.tree}`,
      left:(el, i) => positions[i].left,
      top: (el, i) => positions[i].top,
      height:treeHeight,
      delay: (el, i) => i * 20,
      duration: 500,
      easing: 'easeOutExpo',
      loop: false,
      scale: 1,
    }); 
     
    setShowMenu(false)
  }
  
  useEffect(()=> {
    if(!positions) return
    const p = Math.ceil((scroll*totalSteps)+0.5)
    const targets = document.querySelectorAll(`.${styles.tree}`)
    const { innerHeight } = window;
    if(scrollStep !== page) return toMap(p)
    anime({
      targets,
      top: (el, i) => {
        const top = positions[i].top - ((innerHeight/2) * (1-scrollStepRatio))
        return top < 100 ?  - innerHeight : top
      },
      duration:(el, i) => {
        return 1000
      }
    })
  }, [scroll, scrollStep, scrollStepRatio])
  
  useEffect(()=> {
    setBounds(getBounds())
    toMap(1)
  }, [loaded])
  useEffect(()=> {
    dripIt()
    setBounds(getBounds())
  }, [innerWidth])

  return (
    <div className={styles.container}>
      <div className={styles.scroller} ref={scrollRef}></div>
      <div className={styles.menu}>
        <button onClick={dripIt}>dripp</button>
        <button onClick={toMenu}>menu</button>
        <button onClick={()=> setShowBounds(!showBounds)}>bounds</button>
      </div>
      <div className={styles.diggi} >
        <img src={'/diggibatik.png'} ref={batikRef} className={cn(styles.batik, styles.diggity)}/>
        {showBounds && <div className={styles.bounds} style={{left:bounds.x, top:bounds.y, width:bounds.w, height:bounds.h}}></div> }
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