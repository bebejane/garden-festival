import styles from "./Symbol.module.scss"
import contentStyles from "./Content.module.scss";
import React, { useState, useEffect } from "react";
import cn from "classnames"
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/router";

const Symbol = React.forwardRef((props, ref) => {

	const {event, symbolSize, index} = props
	const timeout = null;
	const router = useRouter()

	const togglePopup = ({type, target, target : {id, attributes}}) => {
		clearTimeout(timeout)
		timeout = setTimeout(()=>{
			const eventId = target.getAttribute('eventid');
			const popup = document.getElementById(`garden-popup-${eventId}`)
			const {offsetTop : top, offsetLeft : left, clientWidth: width} = target
			popup.style.top = `${top-(popup.clientHeight/1.5)}px`;
			popup.style.left = `${left+width-(50)}px`;
			popup.classList.toggle(styles.show, type === 'mouseenter')
		}, type === 'mouseenter' ? 300 : 0)
		
	}
	const clearPopup = () => {
		const popup = document.getElementById(`garden-popup-${event.id}`)
		popup.classList.remove(styles.show)
	}
	useEffect(() => {
		router.events.on('routeChangeStart', clearPopup)
    return () => router.events.off('routeChangeStart', clearPopup)
  }, [])

	return (
		<>
			<Link href={`/${event.participant.slug}/${event.slug}`} >
				<a>
					<img 
						id={`garden-symbol-${event.id}`}
						key={`garden-symbol-${index}`}
						src={`${event.participant.symbol.url}?w=${symbolSize}`}
						eventid={event.id}
						participantid={event.participant.id}
						className={cn(styles.symbol, styles.garden, contentStyles.placeholderSymbol)}
						onMouseEnter={togglePopup} onMouseLeave={togglePopup}
					/>
				</a>
			</Link>
			<div id={`garden-popup-${event.id}`} className={styles.symbolPopup}>
				<h3>{event.title}</h3>
				<p>{event.summary.split('.')[0]}</p>
				{format(new Date(event.startTime), 'EEEE MMMM d, yyyy ')}
			</div>
			<img 
				id={`symbol-${event.id}`}
				key={`symbol-${index}`}
				src={`${event.participant.symbol.url}?w=${symbolSize}`}
				eventid={event.id}
				preload={true}
				participantid={event.participant.id}
				className={cn(styles.symbol)}
			/>
		</>
	);
});

export default Symbol;