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
	const [ref, hovering] = useHover();
	
	//useEffect(() => togglePopup(hovering), [hovering]);

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
			<PopUp event={event} show={hovering} symbolSize={symbolSize}/>
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


const PopUp = ({event, symbolSize, show}) =>{

	const [to, setTo] = useState();
	const [disabled, setDisabled] = useState(false);
	const router = useRouter();

	const disablePopup = () => {
		const popup = document.getElementById(`garden-popup-${event.id}`);
		popup.classList.remove(styles.show);
		setDisabled(true);
		setTimeout(() => setDisabled(false), 2000);
	};

	const togglePopup = (on) => {
		clearTimeout(to);
		if (disabled) return;
		
		let timeout = setTimeout(() => {
				const pad = 20;
				const el = document.getElementById(`garden-symbol-${event.id}`);
				const popup = document.getElementById(`garden-popup-${event.id}`);
				const { offsetTop: top, offsetLeft: left, clientWidth: width, clientHeight:height } = el;
				const { clientWidth : popupWidth, clientHeight : popupHeight } = popup
				const { clientWidth: windowWidth } = document.body;
				const t = top + symbolSize + pad;
				const l = left//(left) - ((popupWidth - width)/2);
				//console.log(((popupWidth - width)/2), popupWidth, width, popup)

				popup.style.top = `${Math.max(t, 0)}px`;
				popup.style.left = `${Math.min(l, windowWidth-width)}px`;
				popup.classList.toggle(styles.show, on);
		}, on ? 100 : 0);
		setTo(timeout)
	};
	useEffect(()=>togglePopup(show), [show])
	useEffect(() => {
		router.events.on("routeChangeStart", disablePopup);
		return () => router.events.off("routeChangeStart", disablePopup);
	}, []);

	return (
		<div id={`garden-popup-${event.id}`} className={styles.symbolPopup}>
			<h3>{event.title}</h3>
			<p>{event.summary.split(".")[0]}</p>
			{format(new Date(event.startTime), "EEEE MMMM d, yyyy ")}
		</div>
	)
}

export default Symbol;
