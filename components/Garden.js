import Symbol from "./Symbol"
import styles from "./Garden.module.scss"
import symbolStyles from "./Symbol.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";
import useVisibility from "lib/hooks/useVisibility";
import { useWindowSize, useDebounce  } from "rooks";

export default function Garden({events, setEvent, event, view, defaultView}) {
	
	const batikRef = useRef();
	const totalPages = 10;
	const symbolWidth = 200;
	const [loaded, setLoaded] = useState(0);
	const [ready, setReady] = useState(false);
	const [loading, setLoading] = useState(true);	
	const [page, setPage] = useState(1);
	const [currentView, setCurrentView] = useState();
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
	
	const getBounds = () => {
		const { clientWidth: w, clientHeight: h, offsetTop: y, offsetLeft: x } = batikRef.current;
		const pad = 100;
		return { w: w - pad * 2, h: h - pad * 2, x: x + pad, y: y + pad };
	};

	const toggleView = (view, force) => {
		if(!ready) return
		window.scrollTo(0,0);
		console.log('transition to', view, currentView, positions)
		
		const targets = document.querySelectorAll(`.${symbolStyles.symbol}`);
		//if(defaultView === view && !currentView ) return setCurrentView(view)
		anime.set(targets, {opacity:1})

		switch (view) {
			case 'program':
				toProgram()
				break;
			case 'garden':
				toGarden()
				break;
			case 'map':
				toMap()
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
		setCurrentView(view)
	}
	
	const initSymbols = async () => {
		
		const bounds = getBounds();
		const targets = document.querySelectorAll(`.${symbolStyles.symbol}`);
		const totalsymbolWidth = symbols.reduce((acc, t) => t.ref.current.clientWidth + acc, 0);

		const rows = 1;
		const cols = symbols.length / rows;
		const colWidth = bounds.w / cols;
		const colHeight = bounds.h / rows;

		let positions = [];

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
			opacity:0,
			left: (el, i) => positions[i].left,
			top: (el, i) => positions[i].top,
			width: symbolWidth,
		});
		
		setPositions(positions);
		if(view === 'garden') await toMap(1)
		setReady(true)
		toggleView(view)
		console.log('done init garden', view)
	}
	//const debounceResize = useDebounce(initSymbols, 100);
	//useEffect(() => debounceResize(), [innerWidth]);

	const toMap = async (page = 1) => {
		
		const targets = document.querySelectorAll(`.${symbolStyles.symbol}`);
		anime.set(targets, {
			translateY:'-100vh',
			opacity:1,
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
		targets.forEach(el => el.style.opacity = 1)
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
		endTarget.style.opacity = 0
		targets.forEach(el => el.style.opacity = 1)
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
		endTarget.style.opacity = 1
		targets.forEach(el => el.style.opacity = 0)
	};

	const toProgram = async () => {

		const targets = document.querySelectorAll("[id^='gasymbol-']")
		const endTargets = document.querySelectorAll("[id^='prsymbol-']")
		
		const eventToPart = (el) => {
			const participantId = el.getAttribute('participantid');
			const eventId = el.getAttribute('eventid');
			for (let i = 0; i < endTargets.length; i++) {
				if(participantId === endTargets[i].getAttribute('participantid') && eventId === endTargets[i].getAttribute('eventid'))
					return endTargets[i];
			}
		}
		endTargets.forEach(el => el.style.opacity = 0)
		targets.forEach(el => el.style.opacity = 1)

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
		
		endTargets.forEach(el => el.style.opacity = 1)
		targets.forEach(el => el.style.opacity = 0)

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
		endTargets.forEach(el => el.style.opacity = 0)
		targets.forEach(el => el.style.opacity = 1)
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
		endTargets.forEach(el => el.style.opacity = 1)
		targets.forEach(el => el.style.opacity = 0)
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
		const images = symbols.map((i)=> i.ref).concat(batikRef);
		if(loaded < images.length) return 
		setBounds(getBounds());
		initSymbols();
		setLoading(false)
	}, [loaded]);

	

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

const sortNodeList = (list, sorter) => {
	return Array.prototype.slice.call(list, 0).sort(sorter);
}
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const transitionTo = async (targets, endTargets, opt) => {
		
	targets.forEach(el => el.style.opacity = 1)
	endTargets.forEach(el => el.style.opacity = 0)

	await anime({
		targets,
		left: (el, i) => eventToPart(el).getBoundingClientRect().left,
		top: (el, i) => eventToPart(el).getBoundingClientRect().top,
		height: (el, i) =>  eventToPart(el).clientHeight,
		width: (el, i) => eventToPart(el).clientWidth,
		delay: (el, i) => i * 20,
		duration: 500,
		easing: "easeOutExpo",
		scale: 1,
	}).finished
	
	endTargets.forEach(el => el.style.opacity = 1)
	targets.forEach(el => el.style.opacity = 0)
}