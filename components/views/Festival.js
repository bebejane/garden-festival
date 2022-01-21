import styles from "./Festival.module.scss"
import contentStyles from "../Content.module.scss"
import cn from "classnames";
import { useAppState } from "/lib/context/appstate"
import { format, isSameDay, intervalToDuration, formatDuration } from 'date-fns'
import { formatToTimeZone } from 'date-fns-timezone'
import Link from "next/link"
import Markdown from "/components/common/Markdown";


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
    const durationUntil = intervalToDuration({start: new Date(), end: new Date(ev.startTime)})
    const isLaunched = durationUntil.hours <= 0 && durationUntil.days <= 0;

    return (
      <>
        {eventDate &&
          <h1 key={`ehead-${idx}`} id={format(eventDate, 'yyyy-MM-d')} className={styles.weekday}>
            {format(eventDate, 'EEEE')}<br />{format(eventDate, 'MMMM d')}
          </h1>
        }
        <Link key={`elink-${idx}`} href={`/${ev.participant.slug}/${ev.slug}`}>
          <a className={cn(styles.event, !ev.register && !isLaunched && styles.blocked)}>
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
                    {formatToTimeZone(ev.startTime, 'ddd HH:mm', { timeZone: appState.zone.timeZone })} • {ev.typeOfEvent?.title} • By {ev.participant.title}
                  </span>
                }
                <h2>{ev.title}</h2>
                <h2 className={cn(styles.sub, "sub")}>{ev.subTitle}</h2>
                <p className="summary">
                  <Markdown>
                    {ev.summary}
                  </Markdown></p>
              </p>
              {!isLaunched &&
                <span className={cn(styles.launch, "meta")}>
                  {ev.register ? 
                    <span>PRE REGISTER TO PARTICIPATE IN THIS EVENT</span>
                  :
                    <span>UPCOMING - THIS EVENT WILL BE LAUNCHED IN {formatDuration({days:durationUntil.days})} AND {formatDuration({hours:durationUntil.hours})}</span>
                  }
                </span>
              }
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