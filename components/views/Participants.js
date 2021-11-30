import styles from "./Participants.module.scss"
import contentStyles from "../Content.module.scss"
import cn from "classnames";
import Link from "next/link"
import Button from "../Button";

export default function Participants({participants, show}) {
  if(!show) return null
  
	return (
		<div className={styles.container}>
      <h1>Participants</h1>
      <div className={styles.participants}>
        {participants.map((p, idx) =>
          <div key={idx} className={styles.participant}>
            <div className={styles.symbols}>
              <Link href={`/${p.slug}`}>
                <a>
                  <img 
                    id={`participants-symbol-${p.id}`} 
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
                <Button href={`/${p.slug}`}>Go to participant</Button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
	);
}