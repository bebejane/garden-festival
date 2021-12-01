import styles from "./Menu.module.scss";
import cn from "classnames";
import { FESTIVAL_START_DATE, FESTIVAL_END_DATE, timeZones } from "lib/utils/constant";
import Link from "next/link"
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { format, eachDayOfInterval, isSameDay } from 'date-fns'
import { useAppState, AppAction } from "/lib/context/appstate";

export default function Menu({view, onSelectDate, onSelectTimezone, weekday, showProgram = false}) {

  const [appState, setAppState] = useAppState();
  const { pathname } = useRouter()
  const [date, setDate] = useState(FESTIVAL_START_DATE)
  const [tz, setTimezone] = useState(timeZones[0]);

  useEffect(()=> setAppState({ type: AppAction.SET_DATE, value:date }), [date])
  useEffect(()=> setAppState({ type: AppAction.SET_TIMEZONE, value:tz }), [tz])
  
	return (
		<div id="menu" className={styles.container} >
      <div className={styles.menu} >
        <ul>
          <Link href={'/'}><li className={pathname === '/' ? styles.selected : undefined }>Garden</li></Link>
          <Link href={'/festival'}><li className={pathname.startsWith('/festival') ? styles.selected : undefined }>Festival</li></Link>
          <Link href={'/community'}><li className={pathname === '/community' ? styles.selected : undefined }>Community</li></Link>
        </ul>
      </div>
      {['festival', 'weekday'].includes(view) && 
        <div className={styles.festivalMenu}>
          <ul>
            {eachDayOfInterval({start: FESTIVAL_START_DATE, end: FESTIVAL_END_DATE}).map( (d, idx) =>
              <Link href={`/festival/${format(d, 'EEEE').toLowerCase()}`}>
                <li 
                  key={idx} 
                  className={weekday === format(d, 'EEEE').toLowerCase() ? styles.selected : undefined }
                >
                  {format(d, 'EEEE')}<br/>{format(d, 'MMMM dd')}
                </li>
              </Link>
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