import styles from "./Menu.module.scss";
import cn from "classnames";
import { FESTIVAL_START_DATE, FESTIVAL_END_DATE, timeZones } from "lib/utils/constant";
import Link from "next/link"
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { format, eachDayOfInterval } from 'date-fns'
import { formatToTimeZone } from "date-fns-timezone";
import { useAppState, AppAction } from "/lib/context/appstate";
import { useIntervalWhen } from "rooks";

export default function Menu({ view, onSelectDate, onSelectTimezone, weekday, showProgram = false }) {
  const { pathname } = useRouter()
  
  return (
    <div id="menu" className={cn(styles.container, view === 'about' && styles.invert)} >
      <div className={styles.wrapper}>
        <MobileMenu view={view}/>
        <TimeZoneDropdown />
        <nav className={styles.menu} >
          <ul>
            <Link href={'/community'}>
              <a><li className={pathname === '/community' ? styles.selected : undefined}>Community</li></a>
            </Link>
            <Link href={'/'}>
              <a>
                <li className={pathname === '/' ? styles.selected : undefined}>Garden</li>
              </a>
            </Link>
            <Link href={'/festival'}>
              <a> 
                <li className={pathname.startsWith('/festival') ? styles.selected : undefined}>Festival</li>
              </a>
            </Link>
          </ul>
        </nav>
        <nav className={styles.menu} >
          <ul>
            <Link href={'/about'}>
              <a>
                <li className={pathname.startsWith('/about') ? styles.selected : undefined}>About</li>
              </a>
            </Link>
          </ul>
        </nav>
      </div>
      {['festival', 'weekday'].includes(view) &&
        <nav className={styles.festivalMenu}>
          <ul>
            <Link href={`/festival/pre-party`}>
              <a><li className={weekday === 'pre-party' ? styles.selected : undefined}>Pre Party</li></a>
            </Link>
            {eachDayOfInterval({ start: FESTIVAL_START_DATE, end: FESTIVAL_END_DATE }).map((d, idx) =>
              <Link key={`wlink-${idx}`} href={`/festival/${format(d, 'EEEE').toLowerCase()}`}>
                <a><li
                  className={weekday === format(d, 'EEEE').toLowerCase() ? styles.selected : undefined}
                >
                  {format(d, 'EE')} {format(d, 'MMM dd')}
                </li></a>
              </Link>
            )}
            <Link href={`/festival/after-party`}>
              <a><li className={weekday === 'after-party' ? styles.selected : undefined}>After Party</li></a>
            </Link>
          </ul>
        </nav>
      }
    </div>
  );
}

const MobileMenu = ({view}) => {

  const menu = [{label:'Community', slug:'community'}, {label:'Garden', slug:''}, {label:'Festival', slug:'festival'}, {label:'About', slug:'about'}]
  const ref = useRef()
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const selected = menu.filter( m => router.asPath === `/${m.slug}`)[0]
  
  return (
    <nav className={styles.mobileMenu} >
      <ul>
        <a>
          <li className={cn(open && styles.open)} ref={ref} onClick={() => setOpen(!open)}>
            {selected ? selected.label : 'Menu' }
            <div className={cn(styles.arrow, open && styles.open)}>↓</div>
          </li>
        </a>
      </ul>
      <ul className={cn(styles.items, open && styles.open)}>
        {menu.map((m, idx) =>
          <Link key={idx} href={`/${m.slug}`}>
            <a onClick={()=>setOpen(false)}>
              <li>{m.label}</li>
            </a>
          </Link>
        )}
      </ul>
    </nav>
  )
}

function TimeZoneDropdown() {
  const ref = useRef()
  const tzRef = useRef()
  const [appState, setAppState] = useAppState();
  const [time, setTime] = useState(format(new Date(), 'HH:mm'))
  const [open, setOpen] = useState(false)
  const [tz, setTimezone] = useState(timeZones[0]);
  
  useIntervalWhen(() => setTime(formatToTimeZone(new Date(), 'HH:mm', { timeZone: tz.timeZone }), 1000, true, true));
  useEffect(() => setAppState({ type: AppAction.SET_TIMEZONE, value: tz }), [tz])

  return (
    <nav className={cn(styles.menu, styles.clock)} >
      <ul>
        <a>
          <li className={cn(styles.clock, open && styles.open)} ref={ref} onClick={() => setOpen(!open)}>
            {time}
            <div ref={tzRef} className={cn(styles.cities, open && styles.open)}>
              {timeZones.map((t) =>
                <div
                  className={cn(styles.city)}
                  onClick={() => setTimezone(t)}
                >
                  {t.city}
                </div>
              )}
            </div>
            <div className={cn(styles.arrow, open && styles.open)}>↓</div>
          </li>
        </a>
      </ul>
    </nav>
  )
}