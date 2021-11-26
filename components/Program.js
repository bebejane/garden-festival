import styles from "./Program.module.scss"
import contentStyles from "./Content.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link"
import { format } from 'date-fns'
import { parseFromTimeZone, formatToTimeZone } from 'date-fns-timezone'
import Select from 'react-select'

const timeZones = [
  { value: 'GMT', label: 'GMT', timeZone: 'Europe/London' },
  { value: 'CET', label: 'CET', timeZone: 'Europe/London' },
  { value: 'EST', label: 'EST', timeZone: 'America/New_York' }
]

const isSameDay = (d1, d2) =>{
  if(!d1 || !d2) return false
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

export default function Program({events, participants, show}) {
  if(!show) return null
  
  const [tz, setTZ] = useState(timeZones[0]);

  let currentDate;
  events = events.sort((a,b) => a.startTime > b.startTime)
  
  const program = events.map((ev) => {
    
    let eventDate;
    if(!isSameDay(currentDate, new Date(ev.startTime))){
      currentDate = new Date(ev.startTime);
      eventDate = currentDate;
    }

    const fDate = formatToTimeZone(ev.startTime, 'HH:mm', { timeZone: tz.value })

    return (
      <>
        <div className={styles.event}>
          <div className={styles.symbol}>
            <img id={`prsymbol-${ev.id}`} src={ev.participant.symbol.url} className={contentStyles.placeholderSymbol}/>
          </div>
          <div className={styles.info}>
            {eventDate && <h2 className={styles.weekday}>{format(eventDate, 'EEEE MMMM d, yyyy ')}</h2>}
            <p>
              {ev.startTime && <span>{fDate} ({tz.value}) </span>}
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
          value={tz}
          onChange={setTZ}
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