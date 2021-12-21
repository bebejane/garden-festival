import styles from "./Event.module.scss"
import contentStyles from "../Content.module.scss"
import cn from "classnames";
import { format } from "date-fns";
import StructuredContent from "/components/blocks"
import LinkButton from "/components/LinkButton";
import ContentHeader from "/components/content/ContentHeader";
import ContentMain from "/components/content/ContentMain";

export default function Event({ event, events, show }) {
  if (!event) return null

  const related = events.filter((ev) => ev.participant.id === event.participant.id && ev.id !== event.id)

  return (
    <div className={cn(styles.event, !show && styles.hide)}>
      <div className={styles.info}>
        <ContentHeader responsiveImage={event.image?.responsiveImage}>
          <header>
            <section className="meta"><span className="meta">{format(new Date(event.startTime), 'EEEE MMMM d, yyyy ')}</span></section>
            <h1>{event.title}<br />{event.subTitle}</h1>
          </header>
          <figure>
            <img
              id={`event-symbol-${event?.id}`}
              eventid={event?.id}
              participantid={event?.participant?.id}
              src={event.symbol.url}
              className={cn(styles.symbol, contentStyles.placeholderSymbol)}
            />
          </figure>
          <section className={styles.by}><span className="meta">By {event.participant.title}</span></section>
        </ContentHeader>

        <ContentMain>
          <section className={styles.contentBox}>
            <header>
              <p className="summary">{event.summary}</p>
            </header>
            <StructuredContent content={event.content} />
            <div className={styles.related}>
              <h2>Related</h2>
              {related.length ? related.map((ev) =>
                <div className={styles.relatedEvent}>
                  <h3>{ev.title}</h3>
                  <p>{ev.summary}</p>
                  {/*
                  <p>
                    <LinkButton href={`/${ev.participant.slug}/${ev.slug}`}>Go to event</LinkButton>
                  </p>
                  */}
                </div>
              ) :
                <span>There are now realted events...</span>
              }
            </div>
          </section>
        </ContentMain>
      </div >
    </div >
  );
}