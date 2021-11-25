import styles from "./Garden.module.scss"
import React, { useState, useEffect, useRef } from "react";
import cn from "classnames"
import anime from "animejs"

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
		<div
			id={`gasymbol-${id}`}
			eventId={event.id}
			participant={participant.id}
			className={cn(styles.tree)}
			onMouseDown={handleMouse}
			//style={isSelected ? { zIndex: 1000 } : { zIndex: 1 }}
		>

			<img key={index} src={`${url}?h=500`} ref={ref} onLoad={(e) => setLoaded(loaded + 1)} />
			<div className={styles.label} style={labelStyle} onMouseDown={(e)=> e.stopPropagation()}>
				<h1><a onClick={()=>setEvent(event)}>{title}</a></h1>
				{summary}
			</div>
		</div>
	);
});

export default Tree;