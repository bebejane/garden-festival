import Symbol from "./Symbol"
import styles from "./Garden.module.scss"
import symbolStyles from "./Symbol.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";
import useVisibility from "lib/hooks/useVisibility";
import { useWindowSize } from "rooks";

export default function Garden({events, setEvent, event, view}) {
	
	const batikRef = useRef();
	const totalPages = 10;
	const symbolWidth = 200;
	const [loaded, setLoaded] = useState(0);
	const [loading, setLoading] = useState(true);	
	const [page, setPage] = useState(1);
	const [bounds, setBounds] = useState({});
	const [positions, setPositions] = useState();
	const [scrollRef, { scroll, scrollStep, scrollStepRatio, totalSteps }] = useVisibility("scroller",0,10);
	const { innerWidth } = useWindowSize();

	const [symbols, setSymbols] = useState(
		(events || []).map((ev, i) => {
			return {
				event: ev,
				index: i,
				ref: React.createRef(),
				url: ev.participant.symbol.url + '?w=' + symbolWidth,
				state: "map",
				style: {
					width: `${symbolWidth}px`
				},
			};
		})
	);

	const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
	const getBounds = () => {
		const { clientWidth: w, clientHeight: h, offsetTop: y, offsetLeft: x } = batikRef.current;
		const pad = 100;
		return { w: w - pad * 2, h: h - pad * 2, x: x + pad, y: y + pad };
	};

	

	const toggleView = (view) => {
		window.scrollTo(0,0);
		console.log('transition to', view)
		const targets = document.querySelectorAll(`.${symbolStyles.symbol}`);
		anime.set(targets, {visibility:'visible'})
		switch (view) {
			case 'program':
				toProgram()
				break;
			case 'garden':
				toGarden()
				break;
			case 'participants':
				toParticipants()
				break;
			case 'event':
				toEvent()
				break;
			default:
				break;
		}
	}
	
	const initSymbols = () => {
		const bounds = getBounds();
		const targets = document.querySelectorAll(`.${symbolStyles.symbol}`);
		const totalsymbolWidth = symbols.reduce((acc, t) => t.ref.current.clientWidth + acc, 0);

		let positions = [];
		const rows = 1;
		const cols = symbols.length / rows;
		const colWidth = bounds.w / cols;
		const colHeight = bounds.h / rows;

		targets.forEach((el, idx) => {
			const { clientHeight: h, clientWidth: w } = el;
			const row = Math.ceil(((idx + 1) / (rows * cols)) * rows);
			const col = idx + 1 - (row - 1) * cols;
			const left = bounds.x + randomInt((col - 1) * colWidth, ((col - 1) * colWidth) + (colWidth - w));
			const top = bounds.y + randomInt((row - 1) * colHeight, ((row -1) * colHeight) + (colHeight - h)); 
			positions.push({ left, top });
		});

		positions = positions.sort((a, b) => Math.random() > 0.5);

		anime.set(targets, {
			left: (el, i) => positions[i].left,
			top: (el, i) => positions[i].top,
			width: symbolWidth,
			visibility:'hidden'
		});
		setPositions(positions);
	}

	const toMap = async (page) => {
		
		const targets = document.querySelectorAll(`.${symbolStyles.symbol}`);
		anime.set(targets, {
			translateY:'-100vh',
			visibility:'visible'
		})
		await anime.timeline({
			targets,
			delay: (el, i) => i * 20,
			duration:1000,
			easing: "spring(0.4, 100, 10, 0)",
			
		}).add({ 
			translateY: 0,
		}).finished	
		setPage(page);

	};
	
	const toGarden = async () => {
		
		if(!positions || !positions.length) return
		const targets = document.querySelectorAll("[id^='gasymbol-']")
		targets.forEach(el => el.style.visibility = 'visible')
		anime({
			targets,
			left: (el, i) => positions[i].left,
			top: (el, i) => positions[i].top,
			width: symbolWidth,
			delay: (el, i) => i * 20,
			duration: 500,
			easing: "easeOutExpo",
			scale: 1,
		});
	};

	const toEvent = async () => {
		
		const isSelected = (el) => el.getAttribute('eventid') === event.id
		const targets = document.querySelectorAll("[id^='gasymbol-']")
		const endTarget = document.querySelector(`[id^='evsymbol-${event.id}']`)
		const bounds = endTarget.getBoundingClientRect()
		endTarget.style.visibility = 'hidden'
		targets.forEach(el => el.style.visibility = 'visible')
		await anime({
			targets,
			left: (el, i) => isSelected(el) ? bounds.left : false,
			top: (el, i) => isSelected(el) ? bounds.top : false,
			height: (el, i) =>  isSelected(el) ? bounds.height: false,
			width: (el, i) => isSelected(el) ? bounds.width: false,
			scale: (el, i) => isSelected(el) ? 1 : 0,
			delay: (el, i) => isSelected(el) ? 0 : i * 100,
			duration: 500,
			easing: "easeOutExpo"
		}).finished
		endTarget.style.visibility = 'visible'
		targets.forEach(el => el.style.visibility = 'hidden')
	};

	const toProgram = async () => {

		const targets = document.querySelectorAll("[id^='gasymbol-']")
		const endTargets = document.querySelectorAll("[id^='prsymbol-']")
		
		const eventToPart = (el) => {
			const participantId = el.getAttribute('participantid');
			const eventId = el.getAttribute('eventid');
			let element = null;
			endTargets.forEach((elt)=>{
				if(participantId === elt.getAttribute('participantid') && eventId === elt.getAttribute('eventid')){
					element = elt;
				}	
			})
			return element
		}

		endTargets.forEach(el => el.style.visibility = 'hidden')
		targets.forEach(el => el.style.visibility = 'visible')

		await anime({
			targets,
			left: (el, i) => eventToPart(el).getBoundingClientRect().left,
			top: (el, i) => eventToPart(el).getBoundingClientRect().top,
			height: (el, i) =>  eventToPart(el).clientHeight,
			width: (el, i) => eventToPart(el).clientWidth,
			delay: (el, i) => i * 20,
			duration: 500,
			easing: "easeOutExpo",
			loop: false,
			scale: 1,
		}).finished
		
		endTargets.forEach(el => el.style.visibility = 'visible')
		targets.forEach(el => el.style.visibility = 'hidden')

	};

	const toParticipants = async () => {
		const targets = document.querySelectorAll("[id^='gasymbol-']")
		const endTargets = document.querySelectorAll("[id^='pasymbol-']")

		const eventToPart = (el) => {
			const participantId = el.getAttribute('participantid');
			let element = null;
			endTargets.forEach((elt)=>{
				if(participantId === elt.getAttribute('participantid')){
					element = elt;
				}	
			})
			return element
		}
		endTargets.forEach(el => el.style.visibility = 'hidden')
		targets.forEach(el => el.style.visibility = 'visible')
		await anime({
			targets,
			left: (el, i) => eventToPart(el).getBoundingClientRect().left,
			top: (el, i) => eventToPart(el).getBoundingClientRect().top,
			height: (el, i) =>  eventToPart(el).clientHeight,
			width: (el, i) => eventToPart(el).clientWidth,
			delay: (el, i) => i * 20,
			duration: 500,
			easing: "easeOutExpo",
			loop: false,
			scale: 1,
		}).finished
		endTargets.forEach(el => el.style.visibility = 'visible')
		targets.forEach(el => el.style.visibility = 'hidden')
	};
	
	useEffect(() => {
		if (!positions || view !== 'garden') return;
		const p = Math.ceil(scroll * totalSteps + 0.5);
		const targets = document.querySelectorAll(`.${symbolStyles.symbol}`);
		const { innerHeight } = window;
		if (scrollStep !== page) return toMap(p);
		anime({
			targets,
			top: (el, i) => {
				const top = positions[i].top - (innerHeight / 2) * (1 - scrollStepRatio);
				return top < 100 ? -innerHeight : top;
			},
			duration: (el, i) => {
				return 1000;
			},
		});
	}, [scroll, scrollStep, scrollStepRatio]);

	useEffect(() => {
		if(loaded < (symbols.length+1)) return 
		setBounds(getBounds());
		initSymbols();
		setLoading(false)
		if(view === 'garden') toMap(1)
	}, [loaded]);

	useEffect(() => {
		//setBounds(getBounds());
		//toMap(page)
	}, [innerWidth]);

	useEffect(() => {
		let preLoaded = 0;
		const images = symbols.map((i)=> i.ref).concat(batikRef);
		images.forEach((ref) => {
			if(ref.current.complete)
			 	setLoaded(++preLoaded)
			else 
				ref.current.onload = () => { setLoaded(++preLoaded)}
		})
	},[])

	useEffect(() => !loading && toggleView(view), [loading, view]);

	return (
		<>
			<div className={styles.container} style={ view === 'garden' ? { minHeight:`${totalPages * 100}vh`} : { }}>
				<div className={styles.scroller} ref={scrollRef}></div>
				<div className={styles.diggi}>
					<img 
						src={"https://www.datocms-assets.com/58832/1637937430-diggibatik.png"} 
						ref={batikRef} 
						className={cn(styles.batik, loading && styles.loading)} 
					/>
				</div>
				{loading && <div className={styles.loader}>loading...</div>}
			</div>
			{symbols.map((t, index) => (
				<Symbol
					key={index}
					{...t}
					event={t.event}
					index={index}
					ref={t.ref}
					setEvent={setEvent}
					selectedEvent={event}
				/>
			))}
		</>
	);
}