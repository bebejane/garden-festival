import styles from "./Garden.module.scss"
import Symbol from "../Symbol";
import cn from "classnames";
import useScrollPosition from '@react-hook/window-scroll'
import { useEffect, useState } from "react";

export default function Garden({ events, participant, view, symbolSize }) {
	
	return (
		<>
			<div className={styles.garden}>
				<GardenHeader view={view} />
			</div>
			<div className={cn(styles.symbols, view !== 'garden' && styles.inactive)}>
				{events && events.map((event, index) =>
					<Symbol
						key={index}
						index={index}
						event={event}
						symbolSize={symbolSize}
					/>
				)}
			</div>
		</>
	);
}



const GardenHeader = ({view}) => {

	const maxWeight = 700
	const minWeight = 200
	const header = {
		community:{
			tag: 'h1',
			text:'Community'
		},
		date: {
			tag:'h2',
			text:'12 - 17 Feb 2020',
		},
		garden:{
			tag:'h1',
			text:'Garden',
		},
		presented:{
			tag:'h2',
			text:'Presented by the SeedBox',
		},
		festival:{
			tag:'h1',
			text:'Festival'
		}
	}
	
	const [ratio, setRatio] = useState(1)
	const scrollY = useScrollPosition(60)

	useEffect(()=>{
		const { scrollTopMax } = document.documentElement;
		const step = (scrollY/scrollTopMax)*1
		const ratio = step-Math.floor(step)
		setRatio(ratio > 0.5 ? 0.5-(ratio-0.5) : ratio)
	}, [scrollY])
	
	const generateLetters = (head) =>{
		return head.text.split('').map((c, idx) => 
			head.tag === 'h1' ?
				<span key={idx} style={ generateWeightStyle(idx % 2 === 0 ? ratio : (0.5-ratio) )}>{c}</span>
			:
				<span key={idx} style={ generateWeightStyle((0.5-ratio), 300,700)}>{c}</span>
		)
	}
	const generateWeightStyle = (ratio, min = minWeight, max = maxWeight) => {
		const weight = (max-min)*(ratio*2)+min
		return { fontVariationSettings: '\'wght\' ' +  weight}
	}

	return (
		<div className={cn(styles.header, view !== 'garden' && styles.hidden)} >
			{Object.keys(header).map((k, idx) => 
					header[k].tag === 'h1' ? 
						<h1 key={idx}>{generateLetters(header[k])}</h1> 
					: 
						<h2 key={idx}>{generateLetters(header[k])}</h2>
			)}
		</div>
	)
}