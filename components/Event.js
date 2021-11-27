import styles from "./Event.module.scss"
import contentStyles from "./Content.module.scss"
import cn from "classnames";
import { format } from "date-fns";
import StructuredContent from "/components/blocks"

export default function Event({event, show}) {
  
  //console.log(event)

	return (
		<div className={cn(styles.event, !show && styles.hide)}>
      <div className={styles.info}>
        {event &&
          <>
            <h3>{event.title}</h3>
            {format(new Date(event.startTime), 'EEEE MMMM d, yyyy ')}
            <p>{event.summary}</p>
            <StructuredContent content={event.content}/>
          </>
        }
      </div>
      <div className={styles.symbol}>
        <img 
          id={`evsymbol-${event?.id}`} 
          src={event?.participant.symbol.url} 
          className={contentStyles.placeholderSymbol}
        />
      </div>
		</div>
	);
}