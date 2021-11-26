import styles from "./Tree.module.scss"
import React, { useState, useEffect } from "react";
import cn from "classnames"
import anime from "animejs"
import Link from "next/link";

const Tree = React.forwardRef((props, ref) => {
	
	const { index, url, event, selectedEvent, setLoaded, loaded, setEvent, menu } = props;
	const { id, title, summary, slug, participant} = event;

	const isSelected = () => selectedEvent && selectedEvent.id === id;
	const handleMouse = ({ type }) => setEvent(type === "mousedown" && !isSelected() ? event : undefined);

	const labelStyle = isSelected() || menu ? { visibility:'hidden' } : { visibility:'hidden' };

	useEffect(() => {
		if (selectedEvent === undefined) return;
		anime({
			targets: ref.current,
			height: isSelected() ? "150%" : "100%",
			duration: 200,
		});
	}, [event]);
	
	return (
		<Link href={`${event.participant.slug}/${event.slug}`}>
		<div
			id={`gasymbol-${id}`}
			eventId={event.id}
			participant={participant.id}
			className={cn(styles.tree)}
			//onMouseDown={handleMouse}
		>
			<img 
				key={index}
				src={url} 
				ref={ref} 
				onLoad={(e) => setLoaded(loaded + 1)} 
			/>
		</div>
		</Link>
	);
});

export default Tree;