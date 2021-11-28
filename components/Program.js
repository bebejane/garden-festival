import { FESTIVAL_START_DATE, FESTIVAL_END_DATE } from "lib/utils/constant";
import styles from "./Program.module.scss"
import contentStyles from "./Content.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link"
import Select from 'react-select'
import { format, eachDayOfInterval, isSameDay } from 'date-fns'
import { parseFromTimeZone, formatToTimeZone } from 'date-fns-timezone'

const timeZones = [
  { value: 'GMT', label: 'GMT', timeZone: 'Europe/London' },
  { value: 'CET', label: 'CET', timeZone: 'Europe/London' },
  { value: 'EST', label: 'EST', timeZone: 'America/New_York' }
]

export default function Program({events, participants, show}) {
  if(!show) return null

  const [tz, setTZ] = useState(timeZones[0]);
  const [date, setDate] = useState(FESTIVAL_START_DATE)

  useEffect(()=>{
    const id = format(date, 'yyyy-MM-d')
    console.log(id)
    document.getElementById(`${id}`)?.scrollIntoView({ 
      behavior: "smooth" 
    });
  }, [date])

  
  let currentDate;
  const program = events.sort((a,b) => new Date(a.startTime) > new Date(b.startTime)).map((ev, idx) => {    
    let eventDate;
    if(!isSameDay(currentDate, new Date(ev.startTime))){
      currentDate = new Date(ev.startTime);
      eventDate = currentDate;
    }
    const fDate = formatToTimeZone(ev.startTime, 'HH:mm', { timeZone: tz.value })
    return (
      <div key={idx} className={styles.event}>
        <div className={styles.symbol}>
          <Link href={`${ev.participant.slug}/${ev.slug}`}>
            <a>
            <img 
              id={`program-symbol-${ev.id}`}
              eventid={ev.id}
              participantid={ev.participant.id}
              src={ev.participant.symbol.url} 
              className={contentStyles.placeholderSymbol}
            />
            </a>
          </Link>
        </div>
        <div className={styles.info}>
          {eventDate && 
            <h2 id={format(eventDate, 'yyyy-MM-d')} className={styles.weekday}>
              {format(eventDate, 'EEEE MMMM d, yyyy ')}
            </h2>
          }
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
    )
  })
	return (
		<div className={styles.program}>
      <div className={styles.menu}>
        <ul>
          {eachDayOfInterval({start: FESTIVAL_START_DATE, end: FESTIVAL_END_DATE}).map( (d, idx) =>
            <li 
              key={idx} 
              className={isSameDay(d, date) ? styles.selected : undefined }
              onClick={()=>setDate(d)} 
            >
              {format(d, 'EEE MM/dd')}
            </li>
          )}
        </ul>
        <div className={styles.timezone}>
          <Select  
            value={tz}
            onChange={setTZ}
            defaultValue={tz}
            options={timeZones}
          />
        </div>
      </div>
      <div className={styles.program}>
        {program}
      </div>
		</div>
	);
}