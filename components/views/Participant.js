import styles from "./Participant.module.scss"
import contentStyles from "../Content.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link"
import { format } from 'date-fns'
import StructuredContent from "/components/blocks"
import LinkButton from "../LinkButton";
import ContentHeader from "/components/content/ContentHeader";
import ContentMain from "/components/content/ContentMain";
import Markdown from "/components/common/Markdown";

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
            <Link href={`${ev.participant.slug}/${ev.slug}`}>
              <a className={styles.event}>
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
                    <h2>{ev.title}</h2>
                    {ev.subTitle && <h2 className="sub">{ev.subTitle}</h2>}
                    <p>{ev.summary}</p>
                  </p>
                </div>
              </a>
            </Link>
          )}
        </div>
        <header>
          <p className="summary">
            <Markdown>{participant.summary}</Markdown>
          </p>
        </header>
        <StructuredContent content={participant.content} />
        <article>
          <p>
            {participant.externalLinks.map((link) =>
              <a href={link.url}>
                {link.linkText}
              </a>
            )}
          </p>
        </article>

      </ContentMain>


    </div >
  )
}