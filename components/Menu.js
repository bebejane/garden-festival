import styles from "./Menu.module.scss";
import cn from "classnames";
import { FESTIVAL_START, FESTIVAL_END, timeZones } from "lib/utils/constant";
import Link from "next/link"
import DropDown from "./common/DropDown";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { format, eachDayOfInterval } from 'date-fns'
import { formatInTimeZone,toDate, utcToZonedTime} from "date-fns-tz";
import { useAppState, AppAction } from "/lib/context/appstate";
import { useIntervalWhen } from "rooks";
import { getDefaultTimezone } from "/lib/utils";

const menu = [{label:'Community', slug:'community'}, {label:'Garden', slug:''}, {label:'Festival', slug:'festival'}, {label:'About', slug:'about/about-us'}]

export default function Menu({ view, weekday}) {
  
  const [appState] = useAppState();
  const router = useRouter()
  const { pathname } = router;
  const { timeZone } = appState.zone;
  const timeZoneCode = appState.zone.label.toLowerCase();
  const [mobileOpen, setMobileOpen] = useState(false)
  const inverted = view === 'about';
  
  return (
    <div id="menu" className={cn(styles.container, inverted && styles.invert)} >
      <div className={styles.wrapper}>
        <DropDown
          id="mobile-menu" 
          className={styles.mobileMenuDropDown} 
          label={view === 'event' ? 'Festival' : view === 'participant' ? 'Community' : undefined}
          options={menu} 
          setOpen={setMobileOpen} 
          open={mobileOpen} 
          inverted={inverted}
        />
        <TimeZoneDropdown mobileOpen={mobileOpen} inverted={inverted}/>
        <nav className={styles.menu} >
          <ul>
            <Link href={'/community'}>
              <a><li className={pathname === '/community' || view === 'participant' ? styles.selected : undefined}>Community</li></a>
            </Link>
            <Link href={'/'}>
              <a>
                <li className={pathname === '/' ? styles.selected : undefined}>Garden</li>
              </a>
            </Link>
            <Link href={'/festival'}>
              <a> 
                <li className={pathname.startsWith('/festival') || view === 'event' ? styles.selected : undefined}>Festival</li>
              </a>
            </Link>
          </ul>
        </nav>
        <nav className={styles.menu} >
          <ul>
            <Link href={'/about/about-us'}>
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
            <Link href={`/festival/pre-party/${timeZoneCode}`}>
              <a><li className={weekday === 'pre-party' ? styles.selected : undefined}>Pre Party</li></a>
            </Link>
            {eachDayOfInterval({ start: utcToZonedTime(toDate(FESTIVAL_START), timeZone), end: utcToZonedTime(toDate(FESTIVAL_END), timeZone)}).map((d, idx) =>
              <Link key={`wlink-${idx}`} href={`/festival/${format(d, 'EEEE').toLowerCase()}/${timeZoneCode}`}>
                <a><li className={weekday === format(d, 'EEEE').toLowerCase() ? styles.selected : undefined}>
                  { format(d, 'EE')} { format(d, 'MMM dd')}
                </li></a>
              </Link>
            )}
            <Link href={`/festival/after-party/${timeZoneCode}`}>
              <a><li className={weekday === 'after-party' ? styles.selected : undefined}>After Party</li></a>
            </Link>
          </ul>
        </nav>
      }
    </div>
  );
}

function TimeZoneDropdown({mobileOpen, inverted}) {

  const defaultTimezone = getDefaultTimezone()
  const [appState, setAppState] = useAppState();
  const [time, setTime] = useState(format(new Date(), 'HH:mm'))
  const [open, setOpen] = useState(false)
  const [tz, setTimezone] = useState(defaultTimezone);
  
  useIntervalWhen(() => setTime(formatInTimeZone(new Date(), appState.zone.timeZone , 'HH:mm'), 1000, true, true));
  useEffect(() => {
    localStorage?.setItem('tz', JSON.stringify(tz));
    setAppState({ type: AppAction.SET_TIMEZONE, value: tz })
  }, [tz])
  
  return (
    <DropDown 
      className={cn(styles.timezoneDropDown, mobileOpen && styles.mobileOpen)}
      options={timeZones.map((t) => { return {label:t.city}})}
      label={`${time} ${tz.label}`}
      setOpen={setOpen}
      open={open}
      inverted={inverted}
      onSelect={({label}) => setTimezone(timeZones.filter(t => t.city === label)[0])}
    />
  )
}