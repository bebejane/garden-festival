import Tree from "./Tree"
import styles from "./Participants.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";
import Link from "next/link"

export default function Participants({participants, show}) {
  if(!show) return null
	return (
		<div className={styles.participants}>
      {participants.map(p =>
        <div className={styles.participant}>
          <div id={`pasymbol-${p.id}`} participant={p.id} className={styles.symbols}></div>
          <div className={styles.participantInfo}>
            <h3>{p.title}<  /h3>
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