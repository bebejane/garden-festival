import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import React, { useState, useEffect, useRef } from 'react'


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
        height:`${Math.max(75, (Math.random()*300))}px`
      }
    }
  }))
  const positionTrees = () => {

    return setShowProjects(true)
    let y = 0;
    const posTrees = trees.map((t)=> {
      const {clientWidth : w, clientHeight : h} = t.ref.current;
      t.style = {
        ...t.style, 
        left: `${0}px`,
        top: `${y}px`,
      }
      y += h + 10
      
      return t
    })
    setTrees(posTrees)
  }

  const randomizePositions = () => {
    const {
      clientWidth : bgW, 
      clientHeight : bgH, 
      offsetTop : bgY, 
      offsetLeft: bgX 
    } = batikRef.current
    
    const totalTreeWidth = trees.reduce((acc, t) => t.ref.current.clientWidth + acc, 0)
    const space = (bgW-totalTreeWidth)/trees.length
    
    let x = bgX;

    const posTrees = trees.sort((a,b)=> Math.random() > 0.5).map((t)=> {
      const {clientWidth : w, clientHeight : h} = t.ref.current;
      const left = x;
      const top = Math.min(Math.random()*bgH, bgH-treeHeight-padding);

      t.style = {
        ...t.style, 
        left: `${left}px`,
        top: `${top}px`,
        transform: `translateY(-2000px)`,
        animationDelay:`${(t.index*30)/1000}s`

      }
      x += w + space
      return t
    })
    setAnimated(0)
    setTrees(posTrees)
    setDropdown(false)
    setTimeout(()=>setDropdown(true), 200)
    
  }

  useEffect(()=>{
    const {clientWidth : w, clientHeight : h, offsetTop : y, offsetLeft: x } = batikRef.current
    console.log(w,h, x, y)
  }, [batikRef])

  useEffect(()=>{
    randomizePositions()
  }, [loaded])

  useEffect(()=>{
    if(animated < trees.length) return 

    const posTrees = trees.map((t)=> {
      t.style = {
        ...t.style, 
        transform: `translateY(0px)`
      }
      return t
    })
    setTrees(posTrees)

  }, [animated])

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <button onClick={randomizePositions}>Pos</button>
        <button onClick={positionTrees}>Manubutton</button>
      </div>
      <div className={cn(styles.projects, showProjects ? styles.show : styles.hide)}>
        {trees.map(t => 
          <img 
            key={'_' + t.index}
            className={cn(styles.project)} 
            style={t.style}
            src={t.url} 
          />
        )}
      </div>
      <div className={styles.diggi} >
        <img src={'/diggiBatik.png'} ref={batikRef} className={styles.batik}/>
        {trees.map(t => 
          <img 
            key={t.index}
            className={cn(styles.tree, dropdown && styles.dropdown )} 
            style={t.style}
            src={t.url} 
            ref={t.ref} 
            onLoad={(e)=>setLoaded(loaded+1)}
            onAnimationEnd={(e)=>setAnimated(animated+1)}
          />
          //<Tree {...t} setLoaded={setLoaded} loaded={loaded} />
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