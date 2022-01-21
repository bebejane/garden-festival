import styles from "./Symbol.module.scss";
import contentStyles from "./Content.module.scss";
import { useEffect, useState } from "react";
import PopUp from './PopUp'
import cn from "classnames";
import Link from "next/link";
import { useHover } from "/lib/hooks";
import { randomInt } from "lib/utils";
import anime from "animejs";

const Symbol = (props) => {

	const { event, symbolSize, index, view } = props;
	const [ref, hovering] = useHover();
	const [bounce, setBounce] = useState()
	const [hide, setHide] = useState(false)
	const endDelay = 10000;

	const bounceActive = () => {
		if( view !== 'garden'){
			if(bounce){
				bounce.pause()
				bounce.seek(0)
			}
			return
		}	
		else if(bounce) 
			return bounce.play()
		
		const target = document.getElementById(`garden-symbol-${event.id}`)
		const delay = randomInt(1000, 6000)
		const startTime = new Date(event.startTime)

		if (startTime > new Date(2022, 1, 8, 7)) return

		const animation = anime({
			targets: target,
			translateY: [
				{ value: 0, duration: delay },
				{ value: innerWidth < 768 ? -50 : -randomInt(75, 100), duration: 350, easing: 'easeInOutExpo' },
				{ value: 0, duration: 700, easing: 'easeOutElastic(0.5,0.4)' },
				{ value: 0, duration: delay + endDelay },
			],
			scale: [
				{ value: 1, duration: delay },
				{ value: 1.3, duration: 250, easing: 'easeInExpo' },
				{ value: 0.97, duration: 200, easing: 'easeOutExpo' },
				{ value: 1, duration: delay + 500 + endDelay },
			],
			rotate: [
				{ value: 0, duration: delay },
				{ value: 0, duration: 350 },
				{ value: 3, duration: 200, easing: 'easeOutExpo' },
				{ value: -2, duration: 200, easing: 'easeOutExpo' },
				{ value: 1, duration: 100, easing: 'easeOutExpo' },
				{ value: 0, duration: 100, easing: 'easeOutExpo' },
				{ value: 0, duration: 100, easing: 'easeOutExpo' },
				{ value: 0, duration: delay + endDelay }
			],
			loop: true
		})
		setBounce(animation)
	}

	useEffect(()=>{
		bounceActive()
		setHide(view !== 'garden')
	}, [view])
	
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
						className={cn(styles.symbol, styles.garden, hide && styles.hide, contentStyles.placeholderSymbol)}
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
