import styles from "./Community.module.scss"
import contentStyles from "../Content.module.scss"
import cn from "classnames";
import Link from "next/link"
import LinkButton from "../LinkButton";

export default function Community({ participants, events, show, symbolSize }) {
  if (!show) return null

  return (
    <div key={'community'} className={styles.container}>
      <h1>Community</h1>
      <div className={styles.community}>
        {[...participants].map((p, idx) => {
          const participantEvents = events.filter(e => e.participant.id === p.id);
          return (
            <Link key={`plink-${idx}`} href={`/${p.slug}`}>
              <a className={styles.participant}>
                <div className={cn(styles.symbols, participantEvents.length <= 1 ? styles.single : undefined)}>
                  {participantEvents.map((event, idx) =>
                    <img
                      id={`community-symbol-${event.id}`}
                      key={`pimage-${idx}`}
                      eventid={event.id}
                      participantid={event.participant.id}
                      src={`${event.symbol.url}?w=${symbolSize * 2}`}
                      className={contentStyles.placeholderSymbol}
                    />
                  )}
                </div>
                <div className={styles.participantInfo}>
                  <h2>{p.title}</h2>
                  {p.subTitle && <h2 className="sub">{p.subTitle}</h2>}
                  <p>{p.summary}</p>
                </div>
              </a>
            </Link>
          )
        }
        )}
      </div>
    </div>
  );
}