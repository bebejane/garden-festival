import styles from "./Symbol.module.scss";
import contentStyles from "./Content.module.scss";
import PopUp from './PopUp'

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

export default Symbol;
