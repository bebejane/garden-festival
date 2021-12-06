import styles from "./Event.module.scss"
import contentStyles from "../Content.module.scss"
import cn from "classnames";
import { format } from "date-fns";
import StructuredContent from "/components/blocks"
import LinkButton from "/components/LinkButton";

export default function Event({event, events, show}) {
  if(!event) return null

  const related = events.filter((ev) => ev.participant.id === event.participant.id && ev.id !== event.id)

	return (
		<div className={cn(styles.event, !show && styles.hide)}>
      <div className={styles.info}>
        <h1>{event.title}</h1>
        {format(new Date(event.startTime), 'EEEE MMMM d, yyyy ')}
        <p>{event.summary}</p>
        <StructuredContent content={event.content}/>
        <div className={styles.related}>
          <h2>Related</h2>
          {related.length ? related.map((ev)=>
            <div className={styles.relatedEvent}>
              <h3>{ev.title}</h3>
              <p>{ev.summary}</p>
              <p>
              <LinkButton href={`/${ev.participant.slug}/${ev.slug}`}>Go to event</LinkButton>
              </p>
            </div>
          ):
            <span>There are now realted events...</span>
          }
        </div>
      </div>
      <div className={styles.symbol}>
        <img 
          id={`event-symbol-${event?.id}`} 
          src={event.participant.symbol.url} 
          className={cn(styles.symbol, contentStyles.placeholderSymbol)}
        />
      </div>
		</div>
	);
}