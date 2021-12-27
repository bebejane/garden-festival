import styles from "./Menu.module.scss";
import cn from "classnames";
import { FESTIVAL_START_DATE, FESTIVAL_END_DATE, timeZones } from "lib/utils/constant";
import Link from "next/link"
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { format, eachDayOfInterval, isSameDay } from 'date-fns'
import { useAppState, AppAction } from "/lib/context/appstate";
import { useIntervalWhen } from "rooks";

export default function Menu({ view, onSelectDate, onSelectTimezone, weekday, showProgram = false }) {

  const [appState, setAppState] = useAppState();
  const { pathname } = useRouter()
  const [date, setDate] = useState(FESTIVAL_START_DATE)
  const [tz, setTimezone] = useState(timeZones[0]);
  const [time, setTime] = useState(format(new Date(), 'HH:mm'))

  useEffect(() => setAppState({ type: AppAction.SET_DATE, value: date }), [date])
  useEffect(() => setAppState({ type: AppAction.SET_TIMEZONE, value: tz }), [tz])
  useIntervalWhen(() => setTime(format(new Date(), 'HH:mm')), 1000, true, true);

  return (
    <div id="menu" className={cn(styles.container, view === 'about' && styles.invert)} >
      <div className={styles.wrapper}>
        <nav className={styles.menu} >
          <ul>
            <li>{time}</li>
          </ul>
        </nav>
        <nav className={styles.menu} >
          <ul>
            <Link href={'/community'}><li className={pathname === '/community' ? styles.selected : undefined}>Community</li></Link>
            <Link href={'/'}><li className={pathname === '/' ? styles.selected : undefined}>Garden</li></Link>
            <Link href={'/festival'}><li className={pathname.startsWith('/festival') ? styles.selected : undefined}>Festival</li></Link>
            <MobileMenu />
          </ul>
        </nav>
        <nav className={styles.menu} >
          <ul>
            <Link href={'/about/about-us'}><li className={pathname.startsWith('/about') ? styles.selected : undefined}>About</li></Link>
          </ul>
        </nav>
       
      </div>
      {['festival', 'weekday'].includes(view) &&
        <nav className={styles.festivalMenu}>
          <ul>
            <Link href={`/festival/pre-party`}>
              <li className={weekday === 'pre-party' ? styles.selected : undefined}>Pre Party</li>
            </Link>
            {eachDayOfInterval({ start: FESTIVAL_START_DATE, end: FESTIVAL_END_DATE }).map((d, idx) =>
              <Link key={`wlink-${idx}`} href={`/festival/${format(d, 'EEEE').toLowerCase()}`}>
                <li
                  className={weekday === format(d, 'EEEE').toLowerCase() ? styles.selected : undefined}
                >
                  {format(d, 'EE')} {format(d, 'MMM dd')}
                </li>
              </Link>
            )}
            <Link href={`/festival/after-party`}>
              <li className={weekday === 'after-party' ? styles.selected : undefined}>After Party</li>
            </Link>
          </ul>
        </nav>
      }
    </div>
  );
}

function MobileMenu() {
  const ref = useRef()
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const menu = [{label:'Community', slug:'community'}, {label:'Garden', slug:''}, {label:'Festival', slug:'festival'}]
  const selected = menu.filter( m => router.pathname === `/${m.slug}`)[0]
  
  return (
    <>
      <li className={cn(styles.mobileMenu, open && styles.open)} ref={ref} onClick={() => setOpen(!open)}>
        {selected?.label}
        <div className={cn(styles.items, open && styles.open)}>
          {menu.filter(m => m.slug !== selected?.slug).map((m) =>
            <Link href={`/${m.slug}`}>
              <div className={cn(styles.item)}>
                {m.label}
              </div>
            </Link>
          )}
        </div>
        <div className={cn(styles.arrow, open && styles.open)}>↓</div>
      </li>
    </>

  )
}


function TimeZoneDropdown({ setTimezone, tz }) {
  const ref = useRef()
  const tzRef = useRef()
  const [open, setOpen] = useState(false)

  return (
    <>
      <li className={cn(styles.mobileMenu, open && styles.open)} ref={ref} onClick={() => setOpen(!open)}>
        Timezone
        <br />
        {tz.label}
        <div ref={tzRef} className={cn(styles.items, open && styles.open)}>
          {timeZones.map((t) =>
            <div
              className={cn(styles.item)}
              onClick={() => setTimezone(t)}
            >
              {t.city} ({t.label})
            </div>
          )}
        </div>
      </li>

    </>

  )
}