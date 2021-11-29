import styles from "./Participant.module.scss"
import contentStyles from "./Content.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link"

export default function Participant({participant, show}) {
  if(!show || !participant) return null
  
	return (
		<div className={styles.participant}>
      <div className={styles.participantInfo}>
        <h3>{participant.title}</h3>
        <p>{participant.summary}</p>
        <p>
          <Link href={participant.externalLink}>
            <a href={participant.externalLink}>{participant.externalLink}</a>
          </Link>
        </p>
      </div>
      <div className={styles.symbol}>
        <img 
          id={`participant-symbol-${participant.id}`} 
          participantid={participant.id}
          src={participant.symbol.url} 
          className={contentStyles.placeholderSymbol}
        />
      </div>
    </div>
  )
}