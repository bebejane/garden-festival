import styles from "./Footer.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link"

export default function Footer({abouts, setAbout}) {
	return (
		<footer className={styles.footer}>
			<ul>
				{abouts && abouts.map((a, idx) =>
					<Link key={idx} href={`/about/${a.slug}`}>
						<a ><li>{a.title}</li></a>
					</Link>
				)}
			</ul>
		</footer>
	);
}