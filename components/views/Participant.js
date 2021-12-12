import styles from "./Participant.module.scss"
import contentStyles from "../Content.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link"
import { format } from 'date-fns'
import LinkButton from "../LinkButton";
import ContentHeader from "/components/content/ContentHeader";
import ContentMain from "/components/content/ContentMain";

export default function Participant({ participant, events: evts, show }) {
  if (!show || !participant) return null

  const events = evts.filter((ev) => ev.participant.id === participant.id)

  return (
    <div className={styles.container}>
      <ContentHeader>
        <h1>{participant.title}</h1>
        <figure>
          <img
            id={`participant-symbol-${participant.id}`}
            participantid={participant.id}
            src={participant.symbol.url}
            className={contentStyles.placeholderSymbol}
          />
        </figure>
      </ContentHeader>
      <ContentMain>
        <header><p className="summary">{participant.summary}</p></header>
        <article>
          <p>
            <a href={participant.externalLink}>{participant.externalLink}</a>
          </p>
        </article>
      </ContentMain>

      <div className={styles.events}>
        <h2>Events</h2>
        {events.map((ev) =>
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