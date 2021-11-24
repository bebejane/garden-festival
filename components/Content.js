import Tree from "./Tree"
import styles from "./Content.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";
import Link from "next/link"

export default function Content({show, children, setShow}) {
	const [internalShow, setInternalShow] = useState(true)

  if(!show || !internalShow) return null
	return (
		<div className={styles.contentWrap}>
      <div className={styles.content}>
				{children}
				<div className={styles.close} onClick={()=>setInternalShow(false)}>CLOSE</div>
			</div>
			
		</div>
	);
}