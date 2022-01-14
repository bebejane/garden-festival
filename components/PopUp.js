import styles from "./PopUp.module.scss";
import format from "date-fns/format";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppState } from "/lib/context/appstate";
import { formatToTimeZone } from "date-fns-timezone";

const PopUp = ({ event, symbolSize, show }) => {

	const [to, setTo] = useState();
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
		clearTimeout(to);
		if (disabled) return;

		let timeout = setTimeout(() => {
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
		}, on ? 100 : 0);
		setTo(timeout)
	};
	useEffect(() => togglePopup(show), [show])
	useEffect(() => {
		router.events.on("routeChangeStart", disablePopup);
		return () => router.events.off("routeChangeStart", disablePopup);
	}, []);

	return (
		<div id={`garden-popup-${event.id}`} className={styles.popup}>
			<span className="metaLight">{format(new Date(event.startTime), 'EEE MMM d ')} {formatToTimeZone(event.startTime, 'HH:mm', { timeZone: appState.zone.timeZone })}</span>
			<h3>{event.title}</h3>
			<p className="small">{event.summary.split(".")[0]}</p>
		</div>
	)
}

export default PopUp