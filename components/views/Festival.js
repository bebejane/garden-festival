import styles from "./Festival.module.scss"
import { format, isSameDay } from 'date-fns'
import EventBox from "/components/common/EventBox";

export default function Festival({ events, dayEvents, participants, date, timeZone, show, symbolSize }) {
  if (!show) return null

  let currentDate;
  
  return (
    <div className={styles.festival}>
      {[...(dayEvents || events)].map((ev, idx) => {
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
            <EventBox event={ev} view={dayEvents ? 'weekday' : 'festival'} symbolSize={symbolSize}/>
          </>
        )
      })}
    </div>
  );
}