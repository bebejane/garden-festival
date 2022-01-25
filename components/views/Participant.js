import styles from "./Participant.module.scss"
import StructuredContent from "/components/blocks"
import ContentHeader from "/components/content/ContentHeader";
import ContentMain from "/components/content/ContentMain";
import Markdown from "/components/common/Markdown";
import EventBox from "components/common/EventBox";

export default function Participant({ participant, events: evts, show, symbolSize }) {
  if (!show || !participant) return null

  const events = evts.filter((ev) => ev.participant.id === participant.id)

  return (
    <div className={styles.container}>
      <ContentHeader responsiveImage={participant.image?.responsiveImage} color={participant.color} type="participant">
        <h1>{participant.title}</h1>
        <h1 className="sub">{participant.subTitle}</h1>
      </ContentHeader>

      <ContentMain color={participant.color} type="participant">
        <div className={styles.events}>
          {events.map((ev) =>
            <EventBox event={ev} view={'participant'} symbolSize={symbolSize} />
          )}
        </div>
        <header>
          <p className="summary">
            <Markdown>{participant.summary}</Markdown>
          </p>
        </header>
        <StructuredContent content={participant.content} />
        <article>
          {participant.externalLinks.length > 0 &&
            <p className={styles.externalLinks}>
              <strong>EXTERNAL LINKS</strong><br />
              {participant.externalLinks.map((link) =>
                <a className={styles.externalLink} target="new" href={link.url}>
                  {link.linkText}
                </a>
              )}
            </p>
          }
          {participant.additional && <p className={styles.additional}><span class="metaLight">{participant.additional}</span></p>}
        </article>
      </ContentMain>
    </div >
  )
}