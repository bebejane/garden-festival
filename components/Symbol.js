import styles from "./Symbol.module.scss";
import contentStyles from "./Content.module.scss";
import PopUp from './PopUp'
import cn from "classnames";
import Link from "next/link";
import { useHover } from "/lib/hooks";

const Symbol = (props) => {
	const { event, symbolSize, index } = props;
	const [ref, hovering] = useHover();

	return (
		<>
			<Link href={`/${event.participant?.slug}/${event.slug}`}>
				<a>
					<img
						id={`garden-symbol-${event.id}`}
						key={`garden-symbol-${index}`}
						ref={ref}
						src={`${event.symbol.url}?w=${symbolSize*2}`}
						width={symbolSize}
						height={symbolSize}
						eventid={event.id}
						participantid={event.participant?.id}
						starttime={event.startTime}
						className={cn(styles.symbol, styles.garden, contentStyles.placeholderSymbol)}
					/>
				</a>
			</Link>
			<PopUp event={event} show={hovering} symbolSize={symbolSize}/>
			<img
				id={`symbol-${event.id}`}
				key={`symbol-${index}`}
				src={`${event.symbol.url}?w=${symbolSize*2}`}
				eventid={event.id}
				preload={"true"}
				width={symbolSize}
				height={symbolSize}
				participantid={event.participant?.id}
				className={cn(styles.symbol)}
			/>
		</>
	);
};

export default Symbol;
