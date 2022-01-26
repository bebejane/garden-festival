import styles from "./Event.module.scss"
import contentStyles from "../Content.module.scss"
import Link from "next/link";
import cn from "classnames";
import { format } from "date-fns";
import StructuredContent from "/components/blocks"
import ContentHeader from "/components/content/ContentHeader";
import ContentMain from "/components/content/ContentMain";
import Markdown from "/components/common/Markdown";
import { useAppState } from "/lib/context/appstate";
import { formatInTimeZone } from "date-fns-tz";

export default function Event({ event, events, show, symbolSize }) {
  if (!event) return null
  const [appState, setAppState] = useAppState();
  const related = events.filter((ev) => ev.participant.id === event.participant.id && ev.id !== event.id)

  return (
    <div className={cn(styles.event, !show && styles.hide)}>
      <div className={styles.info}>
        <ContentHeader responsiveImage={event.image?.responsiveImage} color={event.participant.color}>
          <header>
            <section className="meta">
              <span className="meta">
                {format(new Date(event.startTime), 'EEE MMM d ')} {formatInTimeZone(new Date(event.startTime), appState.zone.timeZone, 'HH:mm')}
              </span>
            </section>
            <figure>
              <img
                id={`event-symbol-${event?.id}`}
                eventid={event?.id}
                participantid={event?.participant?.id}
                src={`${event.symbol.url}?w=${symbolSize * 2}`}
                className={cn(styles.symbol, contentStyles.placeholderSymbol, event.inactive && contentStyles.inactive)}
              />
            </figure>
            <h1>{event.title}</h1>
            <h1 className={cn(styles.sub, "sub")}>{event.subTitle}</h1>
          </header>
          <section className={styles.by}>
            <span className="meta">
              By <Link prefetch={false} href={`/${event.participant.slug}`}><a>{event.participant.title}</a></Link>
            </span>
          </section>
        </ContentHeader>

        <ContentMain>
          <section className={styles.contentBox}>
            <header>
              <p className="summary">
                <Markdown>
                  {event.summary}
                </Markdown>
              </p>
              {event.register && <a className={styles.register} target="new" href="https://www.trippus.net/the-community-garden-festival">To the festival registration <span>→</span></a>}
            </header>
            {(process.env.NEXT_PUBLIC_EDITOR_MODE || !event.inactive) &&
              <>
                <StructuredContent content={event.content} />
                {related.length > 0 &&
                  <div className={styles.related}>
                    <h2>Related</h2>
                    {related.map((ev, idx) =>
                      <Link prefetch={false} key={idx} href={`/${ev.participant.slug}/${ev.slug}`}>
                        <a>
                          <div className={styles.relatedEvent}>
                            <h3>{ev.title}</h3>
                            <p>{ev.summary}</p>
                          </div>
                        </a>
                      </Link>
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