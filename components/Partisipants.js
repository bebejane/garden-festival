import Tree from "./Tree"
import styles from "./Participants.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";
import Link from "next/link"

export default function Participants({participants}) {

	return (
		<div className={styles.participants}>
      {participants.map(p =>
        <div className={styles.participant}>
          <div className={styles.participantInfo}>
            <h3>{p.title}</h3>
            <p>{p.summary}</p>
            <p>
              <Link href={p.externalLink}>
                <a href={p.externalLink}>{p.externalLink}</a>
              </Link>
            </p>
          </div>
          <div className={styles.symbol}>
            <img src={p.symbol.url} />
          </div>
        </div>
      )}
    
		</div>
	);
}