import Tree from "./Tree"
import styles from "./Content.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";
import Link from "next/link"

export default function Content({show, children, setShow}) {

  if(!show ) return null
	return (
		<div className={styles.contentWrap}>
      <div className={styles.content}>
				{children}
				<div 
					className={styles.close} 
					onClick={()=>setShow && setShow(false)}
				>×</div>
			</div>
			
		</div>
	);
}