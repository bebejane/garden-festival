import Tree from "./Tree"
import styles from "./Menu.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";
import Link from "next/link"
import {useRouter} from "next/router";

export default function Menu({setView, view}) {
  const router = useRouter()
  
	return (
		<div className={styles.container} >
      <h1 className={styles.header}>
        The Community Garden Festival
      </h1>
			<ul>
        <li onClick={()=>setView('garden')} className={view === 'garden' && styles.selected}>Garden</li>
        <li onClick={()=>setView('participants')}className={view === 'participants' && styles.selected}>Participants</li>
        <li onClick={()=>setView('program')}className={view === 'program' && styles.selected}>Program</li>
      </ul>
		</div>
	);
}