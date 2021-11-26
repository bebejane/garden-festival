import styles from "./Participants.module.scss"
import contentStyles from "./Content.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link"

export default function Participants({participants, show}) {
  if(!show) return null
  
	return (
		<div className={styles.participants}>
      {participants.map((p, idx) =>
        <div key={idx} className={styles.participant}>
          <div className={styles.symbols}>
            <img 
              id={`pasymbol-${p.id}`} 
              participantid={p.id} 
              src={p.symbol.url} 
              className={contentStyles.placeholderSymbol}
            />
          </div>
          <div className={styles.participantInfo}>
            <h3>{p.title}</h3>
            <p>{p.summary}</p>
            <p>
              <Link href={p.externalLink}>
                <a href={p.externalLink}>{p.externalLink}</a>
              </Link>
            </p>
          </div>
        </div>
      )}
		</div>
	);
}