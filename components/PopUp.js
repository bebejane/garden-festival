import styles from "./PopUp.module.scss";
import format from "date-fns/format";
import cn from 'classnames'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppState } from "/lib/context/appstate";
import { formatToTimeZone } from "date-fns-timezone";
import { truncateString } from "/lib/utils";
import { primaryInput } from 'detect-it';
import Markdown from '/components/common/Markdown'

const PopUp = ({ event, symbolSize, show }) => {

	const [disabled, setDisabled] = useState(false);
	const [appState, setAppState] = useAppState();
	const router = useRouter();

	const disablePopup = () => {
		const popup = document.getElementById(`garden-popup-${event.id}`);
		popup.classList.remove(styles.show);
		setDisabled(true);
		setTimeout(() => setDisabled(false), 2000);
	};

	const togglePopup = (on) => {
		if (disabled) return;

		const pad = -75;
		const el = document.getElementById(`garden-symbol-${event.id}`);
		const popup = document.getElementById(`garden-popup-${event.id}`);
		popup.classList.toggle(styles.show, on);
		
		const { offsetTop: top, offsetLeft: left, clientWidth: width, clientHeight: height } = el;
		const { offsetWidth: popupWidth, offsetHeight: popupHeight } = popup
		const { clientWidth: windowWidth } = document.body;
		const t = Math.max(top + symbolSize + pad, pad);
		const l = Math.min(Math.max(0, left - ((popupWidth - width) / 2)), windowWidth - popupWidth);
		popup.style.top = `${t}px`;
		popup.style.left = `${l}px`;
	};
	useEffect(() => togglePopup(show), [show])
	useEffect(() => {
		router.events.on("routeChangeStart", disablePopup);
		return () => router.events.off("routeChangeStart", disablePopup);
	}, []);
	
	return (
		<div id={`garden-popup-${event.id}`} className={cn(styles.popup, primaryInput === 'touch' && styles.touch)} onTouchEnd={()=>togglePopup(false)}>
			<span className="metaLight">
			{!event.register && event.inactive && 'Upcoming – '} {format(new Date(event.startTime), 'EEE MMM d ')} {formatToTimeZone(event.startTime, 'HH:mm', { timeZone: appState.zone.timeZone })} {event.register && ' – Register now!'}
			</span>
			<h3>{event.title}</h3>
			<p className="small"><Markdown truncate={150}>{ event.summary}</Markdown></p>
		</div>
	)
}

export default PopUp