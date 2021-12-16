import styles from "./Community.module.scss"
import contentStyles from "../Content.module.scss"
import cn from "classnames";
import Link from "next/link"
import LinkButton from "../LinkButton";

export default function Community({ participants, show }) {
  if (!show) return null

  return (
    <div key={'community'} className={styles.container}>
      <h1>Participants</h1>
      <div className={styles.community}>
        {[...participants].map((p, idx) =>
          <a href={`/${p.slug}`} key={idx} className={styles.participant}>
            <div className={styles.symbols}>
              <Link href={`/${p.slug}`}>
                <img
                  id={`community-symbol-${p.id}`}
                  participantid={p.id}
                  src={`${p.symbol.url}?w=200`}
                  className={contentStyles.placeholderSymbol}
                />
              </Link>
            </div>
            <div className={styles.participantInfo}>
              <h2>{p.title}</h2>
              <p>{p.summary.split(".")[0]}</p>
              {/*<LinkButton href={`/${p.slug}`}>View</LinkButton>*/}
            </div>
          </a>
        )}
      </div>
    </div>
  );
}