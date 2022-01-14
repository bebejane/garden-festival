import styles from "./Festival.module.scss"
import contentStyles from "../Content.module.scss"
import cn from "classnames";
import { useAppState, AppAction } from "/lib/context/appstate"
import { format, isSameDay } from 'date-fns'
import { formatToTimeZone } from 'date-fns-timezone'
import Link from "next/link"

export default function Festival({ events, dayEvents, participants, date, timeZone, show, symbolSize }) {
  if (!show) return null

  const [appState, setAppState] = useAppState();
  const view = dayEvents ? 'weekday' : 'festival';

  let currentDate;
  
  const schedule = [...(dayEvents || events)].map((ev, idx) => {
    let eventDate;
    if (!isSameDay(currentDate, new Date(ev.startTime))) {
      currentDate = new Date(ev.startTime);
      eventDate = currentDate;
    }
    
    return (
      <>
        {eventDate &&
          <h1 key={`ehead-${idx}`} id={format(eventDate, 'yyyy-MM-d')} className={styles.weekday}>
            {format(eventDate, 'EEEE')}<br />{format(eventDate, 'MMMM d')}
          </h1>
        }
        <Link key={`elink-${idx}`} href={`/${ev.participant.slug}/${ev.slug}`}>
          <a className={styles.event}>
            <div className={styles.symbol}>
              <img
                id={`${view}-symbol-${ev.id}`}
                eventid={ev.id}
                participantid={ev.participant.id}
                src={`${ev.symbol.url}?w=${symbolSize * 2}`}
                className={contentStyles.placeholderSymbol}
              />
            </div>
            <div className={styles.info}>
              <p>
                {ev.startTime &&
                  <span className="metaLight">
                    {formatToTimeZone(ev.startTime, 'HH:mm', { timeZone: appState.zone.timeZone })} • {ev.typeOfEvent?.title} • By {ev.participant.title}
                  </span>
                }
                <h2>{ev.title}</h2>
                <h2 className={cn(styles.sub, "sub")}>{ev.subTitle}</h2>
                <br />
                <p className="summary">{ev.summary}</p>
              </p>
            </div>
          </a>
        </Link>
      </>
    )
  })
  return (
    <div className={styles.festival}>
      {schedule}
    </div>
  );
}