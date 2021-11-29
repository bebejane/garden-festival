import styles from "./Menu.module.scss";
import cn from "classnames";
import { FESTIVAL_START_DATE, FESTIVAL_END_DATE, timeZones } from "lib/utils/constant";
import Link from "next/link"
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Select from 'react-select'
import { format, eachDayOfInterval, isSameDay } from 'date-fns'
import { parseFromTimeZone, formatToTimeZone } from 'date-fns-timezone'
import { useAppState, AppAction } from "/lib/context/appstate";

export default function Menu({onSelectDate, onSelectTimezone, showProgram = false}) {

  const [appState, setAppState] = useAppState();
  const router = useRouter()
  const [date, setDate] = useState(FESTIVAL_START_DATE)
  const [tz, setTimezone] = useState(timeZones[0]);

  useEffect(()=> setAppState({ type: AppAction.SET_DATE, value:date }), [date])
  useEffect(()=> setAppState({ type: AppAction.SET_TIMEZONE, value:tz }), [tz])
  
	return (
		<div className={styles.container} >
      <div className={styles.menu} >
        <ul>
          <Link href={'/'}><li className={router.pathname === '/' ? styles.selected : undefined }>Garden</li></Link>
          <Link href={'/program'}><li className={router.pathname === '/program' ? styles.selected : undefined }>Program</li></Link>
          <Link href={'/participants'}><li className={router.pathname === '/participants' ? styles.selected : undefined }>Participants</li></Link>
        </ul>
      </div>
      {showProgram && 
        <div className={styles.programMenu}>
          <ul>
            {eachDayOfInterval({start: FESTIVAL_START_DATE, end: FESTIVAL_END_DATE}).map( (d, idx) =>
              <li 
                key={idx} 
                className={isSameDay(d, date) ? styles.selected : undefined }
                onClick={()=>setDate(d)} 
              >
                {format(d, 'EEEE')}<br/>{format(d, 'MMMM dd')}
              </li>
            )}
            <TimeZoneDropdown setTimezone={setTimezone} tz={tz} />
          </ul>  
        </div>
        }
		</div>
	);
}


function TimeZoneDropdown({setTimezone, tz}){
  const ref = useRef()
  const tzRef = useRef()
  const [open, setOpen] = useState(false)

  return (
    <>
      <li className={cn(styles.timezone, open && styles.open)} ref={ref} onClick={()=>setOpen(!open)}>
        Timezone
        <br/>
        {tz.label}
        <div ref={tzRef} className={cn(styles.items, open && styles.open)}>
          {timeZones.map((t)=>
            <div 
              className={cn(styles.item, t.value === tz.value && styles.selected)}
              onClick={()=>setTimezone(t)}
            >
              {t.city} ({t.label})
            </div>
          )}
        </div>
      </li>
      
    </>

  )
}