import styles from "./Community.module.scss"
import contentStyles from "../Content.module.scss"
import cn from "classnames";
import Link from "next/link"
import LinkButton from "../LinkButton";

export default function Community({participants, show}) {
  if(!show) return null
  
	return (
		<div key={'community'} className={styles.container}>
      <h1>Participants</h1>
      <div className={styles.community}>
        {participants.map((p, idx) =>
          <div key={idx} className={styles.participant}>
            <div className={styles.symbols}>
              <Link href={`/${p.slug}`}>
                <a>
                  <img 
                    id={`community-symbol-${p.id}`} 
                    participantid={p.id} 
                    src={p.symbol.url} 
                    className={contentStyles.placeholderSymbol}
                  />
                </a>
              </Link>
            </div>
            <div className={styles.participantInfo}>
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
              <p>
                <Link href={p.externalLink}>
                  <a href={p.externalLink}>{p.externalLink}</a>
                </Link>
              </p>
              <p>
                <LinkButton href={`/${p.slug}`}>Go to participant</LinkButton>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
	);
}