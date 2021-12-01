import styles from "./Participant.module.scss"
import contentStyles from "../Content.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link"
import { format } from 'date-fns'
import LinkButton from "../LinkButton";

export default function Participant({participant, events : evts, show}) {
  if(!show || !participant) return null
  
  const events = evts.filter((ev) => ev.participant.id === participant.id)

	return (
    <div className={styles.container}>
      <div className={styles.participant}>
        <div className={styles.participantInfo}>
          <h1>{participant.title}</h1>
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
      <div className={styles.events}>
        <h2>Events</h2>
        {events.map((ev)=>
          <div className={styles.event}>
            {format(new Date(ev.startTime), 'EEEE MMMM d, yyyy')}
            <h3>{ev.title}</h3>
            <p>{ev.summary}</p>
            <LinkButton href={`${ev.participant.slug}/${ev.slug}`}>Go to event</LinkButton>
          </div>
        )}
      </div>
    </div>
  )
}