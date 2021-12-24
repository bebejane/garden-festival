import styles from "./PopUp.module.scss";
import format from "date-fns/format";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const PopUp = ({ event, symbolSize, show }) => {

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
			const pad = -75;
			const el = document.getElementById(`garden-symbol-${event.id}`);
			const popup = document.getElementById(`garden-popup-${event.id}`);
			const { offsetTop: top, offsetLeft: left, clientWidth: width, clientHeight: height } = el;
			const { offsetWidth: popupWidth, offsetHeight: popupHeight } = popup
			const { clientWidth: windowWidth } = document.body;
			const t = top + symbolSize + pad;
			const l = left - ((popupWidth - width) / 2);
			popup.style.top = `${Math.max(t, pad)}px`;
			popup.style.left = `${Math.min(l, windowWidth - popupWidth)}px`;
			popup.classList.toggle(styles.show, on);
			console.log(popupWidth, Math.min(l, windowWidth - popupWidth), l, windowWidth - popupWidth)
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
			<span className="metaLight">{format(new Date(event.startTime), "EEEE MMMM d ")}</span>
			<h3>{event.title}</h3>
			<p>{event.summary.split(".")[0]}</p>
		</div>
	)
}

export default PopUp