import styles from "./Garden.module.scss"
import React, { useState, useEffect, useRef } from "react";
import cn from "classnames"
import anime from "animejs"
import Link from "next/link";

const Tree = React.forwardRef((props, ref) => {
	const { index, url, setLoaded, title, slug, participant, id, summary, loaded, setSelected, selected, setEvent, style, menu } = props;
	const [mouseDown, setMouseDown] = useState(false);

	const handleMouse = ({ type }) => {
		setSelected(type === "mousedown" && selected !== index ? index : false);
	};

	useEffect(() => {
		if (selected === undefined) return;
		anime({
			targets: ref.current,
			height: selected === index ? "150%" : "100%",
			duration: 200,
		});
	}, [selected]);

	const isSelected = selected === index;
	const labelStyle = isSelected || menu ? { visibility:'visible' } : { visibility:'hidden' };

	return (
		<div
			id={`gasymbol-${id}`}
			participant={participant.id}
			className={cn(styles.tree)}
			onMouseDown={handleMouse}
			style={isSelected ? { zIndex: 1000 } : { zIndex: 1 }}
		>
			<img  key={index} src={url} ref={ref} onLoad={(e) => setLoaded(loaded + 1)} />
			<div className={styles.label} style={labelStyle} onMouseDown={(e)=> e.stopPropagation()}>
				<h1><Link href={`/${participant.slug}/${slug}`}><a>{title}</a></Link></h1>
				{summary}
			</div>
		</div>
	);
});

export default Tree;