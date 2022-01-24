import styles from "./EventBox.module.scss"
import contentStyles from "../Content.module.scss"
import cn from "classnames";
import { useAppState } from "/lib/context/appstate"
import { intervalToDuration, formatDuration } from 'date-fns'
import { formatToTimeZone } from 'date-fns-timezone'
import { useState } from "react";
import Link from "next/link"
import Markdown from "/components/common/Markdown";
import anime from "animejs";

const EventBox = ({event, view, symbolSize}) => {

  const [appState] = useAppState();
  const durationUntil = intervalToDuration({ start: new Date(), end: new Date(event.startTime) })
  const [remember, setRemember] = useState(false)
  
  const handleClick = (e) => {
    if(!event.inactive) return 
  
    setRemember(event.id)
    setTimeout(()=>setRemember(false), 1000)
    const target = document.getElementById(`${view}-symbol-${event.id}`)
    anime({
      targets:target,
      scale:[{
        value: 0.97, 
        duration:200, 
        easing:'easeOutElastic(0.1,4)'
      }, {
        value: 1, 
        duration:300, 
        easing:'easeOutElastic(0.5,0.4)'
      }]
    })
  }
  
  const eventContent = (
    <a className={cn(styles.event, event.inactive && styles.inactive, remember && styles.remember)} onClick={handleClick}>
      <div className={styles.upcoming}><span class="meta">UPCOMING</span></div>
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
            <span className="metaLight">
              {formatToTimeZone(event.startTime, 'ddd HH:mm', { timeZone: appState.zone.timeZone })} • {event.typeOfEvent?.title} • By {event.participant.title}
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
          <span className={cn(styles.launch, remember === event.id && styles.remember, "metaLight")} onTouchEnd={handleClick}>
            <span>
            {event.register ?
              <>PRE REGISTER TO PARTICIPATE IN THIS EVENT</>
            :
              <>THIS EVENT WILL BE LAUNCHED IN {formatDuration({ days: durationUntil.days })} AND {formatDuration({ hours: durationUntil.hours })}</>
            }
            </span>
          </span>
        }
      </div>
    </a>
  )

  return event.register || event.launched ?
    <Link href={`/${event.participant.slug}/${event.slug}`}>
      {eventContent}
    </Link>
    :
    <>
      {eventContent}
    </>

}

export default EventBox;