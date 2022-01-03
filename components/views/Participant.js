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

        <div className={styles.events}>
          <h2 className={styles.first}>Events</h2>
          {events.map((ev) =>
            <a href={`${ev.participant.slug}/${ev.slug}`} className={styles.event}>
              <div className={styles.symbol}>
                <img
                  id={`participant-symbol-${ev.id}`}
                  participantid={participant.id}
                  eventid={ev.id}
                  src={`${ev.symbol.url}?w=${symbolSize * 2}`}
                  className={contentStyles.placeholderSymbol}
                />
              </div>
              <div className={styles.info}>
                <p>
                  {ev.startTime &&
                    <span className="metaLight">
                      {format(new Date(ev.startTime), 'EEEE MMMM d')} • {ev.typeOfEvent?.title}
                    </span>
                  }
                  <br />
                  <h2>{ev.title}</h2>
                  <h2 className="sub">{ev.subTitle}</h2>
                  <br />
                  <p className="summary">{ev.summary}</p>
                </p>
              </div>
            </a>
          )}
        </div>
      </ContentMain>


    </div>
  )
}