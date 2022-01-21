import styles from "./Footer.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link"

export default function Footer({ view, abouts, setAbout }) {
	return (
		<footer className={cn(styles.footer, view === 'event' || view === 'participant' && styles.margin)}>
			{(view === 'festival' || view === 'weekday') && <a href="/api/calendar" title="Download festival calendar">Calendar</a>}
			<a href="https://discord.gg/b4Ys2t7uag" target="new">DISCUSS</a>
		</footer>
	);
}