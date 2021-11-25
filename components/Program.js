import styles from "./Program.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link"
import { format } from 'date-fns'
import Select from 'react-select'

const timeZones = [
  { value: 'CET', label: 'CET' },
  { value: 'EST', label: 'EST' }
]

const isSameDay = (d1, d2) =>{
  if(!d1 || !d2) return false
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

export default function Program({events, participants, show}) {
  if(!show) return null
  
  const [tz, setTZ] = useState('CET');

  let currentDate;
  events = events.sort((a,b) => a.startTime > b.startTime)
  
  const program = events.map((ev) =>{
    let eventDate;
    if(!isSameDay(currentDate, new Date(ev.startTime))){
      currentDate = new Date(ev.startTime);
      eventDate = currentDate;
    }
    return (
      <>
        <div className={styles.event}>
          <div className={styles.symbol}>
            <img id={`prsymbol-${ev.id}`} src={ev.participant.symbol.url}/>
          </div>
          <div className={styles.info}>
            {eventDate && <h2 className={styles.weekday}>{format(eventDate, 'EEEE MMMM d, yyyy ')}</h2>}
            <p>
              {ev.startTime && <span>{format(new Date(ev.startTime), 'HH:mm')} ({tz}) </span>}
              <h3>{ev.title}</h3>
              <br/>
              {ev.summary}
            </p>
            <p>
              <Link href={`${ev.participant.slug}/${ev.slug}`}>
                <a>Go to event</a>
              </Link>
            </p>
          </div>
        </div>
      </>      
    )
  })

	return (
		<div className={styles.program}>
      <div className={styles.timezone}>
        <Select  
          value={timeZones[0]}
          defaultValue={tz}
          options={timeZones}
        />
      </div>
      <div className={styles.program}>
        {program}
      </div>
		</div>
	);
}