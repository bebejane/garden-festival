import styles from "./Menu.module.scss"
import { FESTIVAL_START_DATE, FESTIVAL_END_DATE } from "lib/utils/constant";
import Link from "next/link"
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Select from 'react-select'
import { format, eachDayOfInterval, isSameDay } from 'date-fns'
import { parseFromTimeZone, formatToTimeZone } from 'date-fns-timezone'
import { useUI, UIAction } from "/lib/context/ui";

const timeZones = [
  { value: 'GMT', label: 'GMT', timeZone: 'Europe/London' },
  { value: 'CET', label: 'CET', timeZone: 'Europe/London' },
  { value: 'EST', label: 'EST', timeZone: 'America/New_York' }
]


export default function Menu({onSelectDate, onSelectTimezone, showProgram = false}) {

  const [ui, setUI] = useUI();
  const router = useRouter()
  const [date, setDate] = useState(FESTIVAL_START_DATE)
  const [tz, setTZ] = useState({ value: 'GMT', label: 'GMT', timeZone: 'Europe/London' });

  useEffect(()=> setUI({ type: UIAction.SET_DATE, value:date }), [date])
  useEffect(()=> setUI({ type: UIAction.SET_TIMEZONE, value:tz }), [tz])
  
	return (
		<div className={styles.container} >
      <div className={styles.mainMenu} >
        <ul>
          <Link href={'/'}><li className={router.pathname === '/' ? styles.selected : undefined }>Garden</li></Link>
          <Link href={'/participants'}><li className={router.pathname === '/participants' ? styles.selected : undefined }>Participants</li></Link>
          <Link href={'/program'}><li className={router.pathname === '/program' ? styles.selected : undefined }>Program</li></Link>
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
                {format(d, 'EEE MM/dd')}
              </li>
            )}
            <li>GMT</li>
            {/*
            <div className={styles.timezone}>
              <Select  
                value={tz}
                onChange={setTZ}
                defaultValue={tz}
                options={timeZones}
              />
            </div>
            */}
          </ul>  
        </div>
        }
		</div>
	);
}