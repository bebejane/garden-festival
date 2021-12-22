import styles from "./Garden.module.scss"
import Symbol from "../Symbol";
import cn from "classnames";
import { useVisibility } from "lib/hooks";
import useScrollPosition from '@react-hook/window-scroll'
import { useEffect, useState } from "react";

export default function Garden({ events, participant, view, symbolSize }) {

	return (
		<>
			<div className={styles.container}>
				<GardenHeader view={view} />
			</div>
			{events && events.map((event, index) =>
				<Symbol
					key={index}
					index={index}
					event={event}
					symbolSize={symbolSize}
				/>
			)}
		</>
	);
}

const GardenHeader = ({view}) => {

	const maxWeight = 1000
	const minWeight = 200

	const [step, setStep] = useState(1)
	const [ratio, setRatio] = useState(1)
	const scrollY = useScrollPosition(60)

	useEffect(()=>{
		const {scrollHeight} = document.documentElement;
		const ratioTotal = (scrollY+document.body.clientHeight)/scrollHeight
		const step = ratioTotal*2
		const ratio = step-Math.floor(step)
		setStep(Math.ceil(step))
		setRatio(ratio > 0.5 ? 0.5-(ratio-0.5) : ratio)
	}, [scrollY])
	
	const generateStyle = (ratio, min = minWeight, max = maxWeight) => {
		const weight = (max-min)*ratio
		//console.log(weight)
		return {
			fontVariationSettings: '\'wght\' ' +  weight
		}
	}
	const styleCommunity = generateStyle(ratio)
	const styleDate = generateStyle((0.5-ratio))
	const styleGarden = generateStyle(ratio)
	const stylePresented = generateStyle((0.5-ratio))
	const styleFestival = generateStyle(ratio)

	return (
		<div className={cn(styles.header, view !== 'garden' && styles.hidden)} >
			<h1 style={styleCommunity}>Community</h1>
			<h2 style={styleDate}>12 - 17 Feb 2020</h2>
			<h1 style={styleGarden}>Garden</h1>
			<h2 style={stylePresented}>Presented by the SeedBox</h2>
			<h1 style={styleFestival}>Festival</h1>
		</div>
	)
}