import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import React, { useState, useEffect, useRef } from 'react'

export default function Home() {
  const batikRef = useRef()
  const [loaded, setLoaded] = useState(0)
  
  const [trees, setTrees] = useState(new Array(12).fill(0).map((x, i) => { 
    return {
      index: i,
      ref: React.createRef(),
      url: `/trees/tree${i+1}.png`, 
      style:{
        height:'150px'
      }
    }
  }))
  
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

    const posTrees = trees.map((t)=> {
      const {clientWidth : w, clientHeight : h} = t.ref.current;
      const left = x;
      const top = Math.min(Math.random()*bgH, bgH-150);

      t.style = {
        ...t.style, 
        left: `${left}px`,
        top: `${top}px`,
      }
      x += w + space
      return t
    })
    setTrees(posTrees)
  }

  useEffect(()=>{
    const {clientWidth : w, clientHeight : h, offsetTop : y, offsetLeft: x } = batikRef.current
    console.log(w,h, x, y)
  }, [batikRef])

  useEffect(()=>{
    randomizePositions()
  }, [loaded])
  //console.log(loaded)
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <button onClick={randomizePositions}>Pos</button>
      </div>
      <div className={styles.diggi} >
        <img src={'/diggiBatik.png'} ref={batikRef} className={styles.batik}/>
        {trees.map(t => 
          <img 
            key={t.index}
            className={styles.tree} 
            style={t.style}
            src={t.url} 
            ref={t.ref} 
            onLoad={(e)=>setLoaded(loaded+1)}
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