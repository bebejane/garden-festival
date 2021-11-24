import Tree from "./Tree"
import styles from "./Program.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";
import Link from "next/link"

export default function Program({events, participants}) {

	return (
		<div className={styles.program}>
      {events.map(ev =>
        <div className={styles.event}>
          <h3>{ev.title}</h3>
          <p>{ev.summary}</p>
        </div>
      )}
		</div>
	);
}