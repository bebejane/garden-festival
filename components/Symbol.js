import styles from "./Symbol.module.scss"
import contentStyles from "./Content.module.scss";
import React, { useState, useEffect } from "react";
import cn from "classnames"
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { useHover } from "/lib/hooks";

let timeout = null;

const Symbol = ((props) => {

	const {event, symbolSize, index} = props
	
	const router = useRouter()
	const [disabled, setDisabled] = useState(false)
	const [ref, hovering] = useHover()

	const togglePopup = (on) => {
		clearTimeout(timeout)
		if(disabled) return
		timeout = setTimeout(()=>{
			const eventId = ref.current.getAttribute('eventid');
			const popup = document.getElementById(`garden-popup-${eventId}`)
			const {offsetTop : top, offsetLeft : left, clientWidth: width} = ref.current
			popup.style.top = `${top-(symbolSize/1.5)}px`;
			popup.style.left = `${left+width-(symbolSize/3)}px`;
			popup.classList.toggle(styles.show, on)
		}, on ? 300 : 0)
	}
	const disablePopup = () => {
		const popup = document.getElementById(`garden-popup-${event.id}`)
		popup.classList.remove(styles.show)
		setDisabled(true)
		setTimeout(()=>setDisabled(false), 1000)
	}
	useEffect(() => {
		router.events.on('routeChangeStart', disablePopup)
    return () => router.events.off('routeChangeStart', disablePopup)
  }, [])

	useEffect(()=> togglePopup(hovering), [hovering])

	return (
		<>
			<Link  href={`/${event.participant.slug}/${event.slug}`} >
				<a>
					<img 
						id={`garden-symbol-${event.id}`}
						key={`garden-symbol-${index}`}
						ref={ref}
						src={`${event.participant.symbol.url}?w=${symbolSize}`}
						eventid={event.id}
						participantid={event.participant.id}
						className={cn(styles.symbol, styles.garden, contentStyles.placeholderSymbol)}
						
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
				preload={'true'}
				participantid={event.participant.id}
				className={cn(styles.symbol)}
			/>
		</>
	);
});

export default Symbol;
