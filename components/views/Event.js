import styles from "./Event.module.scss"
import contentStyles from "../Content.module.scss"
import cn from "classnames";
import { format } from "date-fns";
import StructuredContent from "/components/blocks"
import LinkButton from "/components/LinkButton";
import ContentHeader from "/components/content/ContentHeader";
import ContentMain from "/components/content/ContentMain";

export default function Event({ event, events, show, symbolSize }) {
  if (!event) return null

  const related = events.filter((ev) => ev.participant.id === event.participant.id && ev.id !== event.id)

  return (
    <div className={cn(styles.event, !show && styles.hide)}>
      <div className={styles.info}>
        <ContentHeader responsiveImage={event.image?.responsiveImage} color={event.participant.color}>
          <header>
            <section className="meta"><span className="meta">{format(new Date(event.startTime), 'EEEE MMMM d, yyyy ')}</span></section>
            <figure>
              <img
                id={`event-symbol-${event?.id}`}
                eventid={event?.id}
                participantid={event?.participant?.id}
                src={`${event.symbol.url}?w=${symbolSize * 2}`}
                className={cn(styles.symbol, contentStyles.placeholderSymbol)}
              />
            </figure>
            <h1>{event.title}</h1>
            <h1 className={cn(styles.sub, "sub")}>{event.subTitle}</h1>
          </header>
          <section className={styles.by}><span className="meta">By {event.participant.title}</span></section>
        </ContentHeader>

        <ContentMain>
          <section className={styles.contentBox}>
            <header>
              <p className="summary">{event.summary}</p>
            </header>
            {process.env.NEXT_PUBLIC_EDITOR_MODE &&
              <>
                <StructuredContent content={event.content} />
                {related.length &&
                  <div className={styles.related}>
                    <h2>Related</h2>
                    {related.map((ev, idx) =>
                      <div key={idx} className={styles.relatedEvent}>
                        <h3>{ev.title}</h3>
                        <p>{ev.summary}</p>
                        {/*
                        <p>
                          <LinkButton href={`/${ev.participant.slug}/${ev.slug}`}>Go to event</LinkButton>
                        </p>
                        */}
                      </div>
                    )}
                  </div>
                }
              </>
            }
          </section>
        </ContentMain>

      </div>
    </div>
  );
}