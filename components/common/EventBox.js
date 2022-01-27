import styles from "./EventBox.module.scss"
import contentStyles from "../Content.module.scss"
import cn from "classnames";
import { useAppState } from "/lib/context/appstate"
import { intervalToDuration, formatDuration } from 'date-fns'
import { formatInTimeZone } from "date-fns-tz";
import { useState } from "react";
import Link from "next/link"
import Markdown from "/components/common/Markdown";
import anime from "animejs";

const EventBox = ({ event, view, symbolSize }) => {

  const [appState] = useAppState();
  const durationUntil = intervalToDuration({ start: new Date(), end: new Date(event.startTime) })
  const [remember, setRemember] = useState(false)

  const handleClick = (e) => {
    if (!event.inactive) return

    setRemember(event.id)
    setTimeout(() => setRemember(false), 1000)
    const target = document.getElementById(`${view}-symbol-${event.id}`)
    anime({
      targets: target,
      scale: [{
        value: 0.97,
        duration: 200,
        easing: 'easeOutElastic(0.1,4)'
      }, {
        value: 1,
        duration: 300,
        easing: 'easeOutElastic(0.5,0.4)'
      }]
    })
  }
  const releaseInfo = event.register ?
    'Pre register to participate in this event'
  :
    `This event will be launched in ${formatDuration({ days: durationUntil.days })} ${durationUntil.hours && ` and ${formatDuration({ hours: durationUntil.hours })}`}`
  
  const eventContent = (
    <a className={cn(styles.event, event.inactive && styles.inactive, remember && styles.remember)} onClick={handleClick}>
      <div className={styles.upcoming}><span className="meta">Upcoming!</span></div>
      <div className={styles.symbol}>
        <img
          id={`${view}-symbol-${event.id}`}
          eventid={event.id}
          participantid={event.participant.id}
          src={`${event.symbol.url}?w=${symbolSize * 2}`}
          className={contentStyles.placeholderSymbol}
        />
      </div>
      <div className={styles.info}>
        <p>
          {event.startTime &&
            <span className="meta">
              {formatInTimeZone(new Date(event.startTime), appState.zone.timeZone, 'EEE HH:mm')} • {event.typeOfEvent?.title} • By {event.participant.title}
            </span>
          }
          <h2>{event.title}</h2>
          <h2 className={cn(styles.sub, "sub")}>{event.subTitle}</h2>
          <p className="summary">
            <Markdown>
              {event.summary}
            </Markdown>
          </p>
        </p>
        {!event.launched &&
          <span className={cn(styles.launch, remember === event.id && styles.remember, "meta")} onTouchEnd={handleClick}>
            <span>
              {releaseInfo}
            </span>
          </span>
        }
      </div>
    </a>
  )

  return event.register || event.launched ?
    <Link prefetch={false} href={`/${event.participant.slug}/${event.slug}`}>
      {eventContent}
    </Link>
    :
    <>
      {eventContent}
    </>

}

export default EventBox;