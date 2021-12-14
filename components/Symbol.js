import styles from "./Symbol.module.scss";
import contentStyles from "./Content.module.scss";
import React, { useState, useEffect } from "react";
import cn from "classnames";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { useHover } from "/lib/hooks";

const Symbol = (props) => {
	
	const { event, symbolSize, index } = props;
	const router = useRouter();
	const [disabled, setDisabled] = useState(false);
	const [to, setTo] = useState();
	const [ref, hovering] = useHover();
	
	const togglePopup = (on) => {
		clearTimeout(to);
		if (disabled) return;
		
		let timeout = setTimeout(
			() => {
				const eventId = ref.current.getAttribute("eventid");
				const popup = document.getElementById(`garden-popup-${eventId}`);
				const { offsetTop: top, offsetLeft: left, clientWidth: width, clientHeight:height } = ref.current;
				const { clientWidth: windowWidth } = document.body;
				const t = top - (symbolSize / 1.5)
				const l = (left + width) - (symbolSize / 3);

				popup.style.top = `${Math.max(t, 0)}px`;
				popup.style.left = `${Math.min(l, windowWidth-width)}px`;
				popup.classList.toggle(styles.show, on);
			},
			on ? 100 : 0
		);
		setTo(timeout)
	};

	const disablePopup = () => {
		const popup = document.getElementById(`garden-popup-${event.id}`);
		popup.classList.remove(styles.show);
		setDisabled(true);
		setTimeout(() => setDisabled(false), 2000);
	};
	useEffect(() => {
		router.events.on("routeChangeStart", disablePopup);
		return () => router.events.off("routeChangeStart", disablePopup);
	}, []);

	useEffect(() => togglePopup(hovering), [hovering]);

	return (
		<>
			<Link href={`/${event.participant?.slug}/${event.slug}`}>
				<a>
					<img
						id={`garden-symbol-${event.id}`}
						key={`garden-symbol-${index}`}
						ref={ref}
						src={`${event.participant?.symbol.url}?w=${symbolSize}`}
						eventid={event.id}
						participantid={event.participant?.id}
						className={cn(styles.symbol, styles.garden, contentStyles.placeholderSymbol)}
					/>
				</a>
			</Link>
			<div id={`garden-popup-${event.id}`} className={styles.symbolPopup}>
				<h3>{event.title}</h3>
				<p>{event.summary.split(".")[0]}</p>
				{format(new Date(event.startTime), "EEEE MMMM d, yyyy ")}
			</div>
			<img
				id={`symbol-${event.id}`}
				key={`symbol-${index}`}
				src={`${event.participant?.symbol.url}?w=${symbolSize}`}
				eventid={event.id}
				preload={"true"}
				participantid={event.participant?.id}
				className={cn(styles.symbol)}
			/>
		</>
	);
};

export default Symbol;
