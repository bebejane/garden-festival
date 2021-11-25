import styles from "./Event.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";
import Link from "next/link"

export default function Event({event, show}) {
  if(!show || !event) return null
	return (
		<div className={styles.event}>
      <div className={styles.info}>
        <h3>{event.title}</h3>
        {event.startTime}
        <p>{event.summary}</p>
      </div>
      <div className={styles.symbol}>
        <img id={`evsymbol-${event.id}`} src={event.participant.symbol.url}/>
      </div>
		</div>
	);
}