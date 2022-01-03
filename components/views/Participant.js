import styles from "./Participant.module.scss"
import contentStyles from "../Content.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link"
import { format } from 'date-fns'
import LinkButton from "../LinkButton";
import ContentHeader from "/components/content/ContentHeader";
import ContentMain from "/components/content/ContentMain";
import Markdown from "/components/common/Markdown";

export default function Participant({ participant, events: evts, show, symbolSize }) {
  if (!show || !participant) return null

  const events = evts.filter((ev) => ev.participant.id === participant.id)

  return (
    <div className={styles.container}>
      <ContentHeader>
        <h1>{participant.title}</h1>
      </ContentHeader>
      <ContentMain>
        <header>
          <p className="summary">
            <Markdown>{participant.summary}</Markdown>
          </p>
        </header>
        <article>
          <p>
            {participant.externalLinks.map((link) =>
              <a href={link.url}>
                {link.linkText}
              </a>
            )}
            <a href={participant.externalLink}>{participant.externalLink}</a>
          </p>
        </article>
      </ContentMain>

      <div className={styles.events}>
        <h2>Events</h2>
        {events.map((ev) =>
          <div className={styles.event}>
            <div className={styles.symbol}>
              <img
                id={`participant-symbol-${ev.id}`}
                participantid={participant.id}
                eventid={ev.id}
                src={`${ev.symbol.url}?w=${symbolSize*2}`}
                className={contentStyles.placeholderSymbol}
              />
            </div>
            <div className={styles.info}>
              {format(new Date(ev.startTime), 'EEEE MMMM d, yyyy')}
              <h3>{ev.title}</h3>
              <p><Markdown>{ev.summary}</Markdown></p>
              <LinkButton href={`${ev.participant.slug}/${ev.slug}`}>Go to event</LinkButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}