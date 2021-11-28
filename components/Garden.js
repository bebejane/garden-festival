import styles from "./Garden.module.scss"
import contentStyles from "./Content.module.scss";
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";
import Link from "next/link";
import useVisibility from "lib/hooks/useVisibility";
import { useWindowSize, useDebounce  } from "rooks";

const sortNodeList = (list, sorter) => Array.prototype.slice.call(list, 0).sort(sorter);
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export default function Garden({events, setEvent, event, view, defaultView}) {
	
	const batikRef = useRef();
	const totalPages = 10;
	const symbolWidth = 200;
	const [loaded, setLoaded] = useState(0);
	const [ready, setReady] = useState(false);
	const [loading, setLoading] = useState(true);
	const [currentView, setCurrentView] = useState();
	const [currentAnimation, setCurrentAnimation] = useState();
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
	
	const getBounds = () => {
		const { clientWidth: w, clientHeight: h, offsetTop: y, offsetLeft: x } = batikRef.current;
		const pad = 100;
		return { w: w - pad * 2, h: h - pad * 2, x: x + pad, y: y + pad };
	};

	const initSymbols = async () => {
		
		//const totalsymbolWidth = symbols.reduce((acc, t) => t.ref.current.clientWidth + acc, 0);
		let positions = [];

		const { innerHeight } = window
		const bounds = getBounds();
		const targets = document.querySelectorAll(`[id^='garden-symbol-']`)
		const symbols = document.querySelectorAll(`[id^='symbol-']`)		

		const rows = 2;
		const cols = 4;
		const colWidth = bounds.w / cols;
		const colHeight = bounds.h / rows;
		let row = 0
		let col = -1

		targets.forEach((el, idx) => {
			const { clientHeight: h, clientWidth: w } = el;
			let page = Math.floor(idx/(rows*cols))
			row = row >= rows ? 0 : Math.floor((idx-(page*(cols*rows)))/cols);
			col = col+1 >= cols ? 0 : ++col
			let left = bounds.x + randomInt((col) * colWidth, ((col) * colWidth) + (colWidth - w));
			let top = bounds.y + randomInt((row) * colHeight, ((row) * colHeight) + (colHeight - h)); 
			positions.push({ left, top: top + (page*innerHeight)});
		});

		positions = positions.sort((a, b) => Math.random() > 0.5);
		
		anime.set(targets, {
			opacity: 0,
			left: (el, i) => positions[i].left,
			top: (el, i) => positions[i].top,
			width: symbolWidth,
		});
		anime.set(symbols, {
			opacity: 0,
			left: (el, i) => positions[i].left,
			top: (el, i) => positions[i].top,
			width: symbolWidth,
		});
		setPositions(positions);
		setReady(true)
		console.log('done init ', view)
	}

	const initMap = async (page = 1) => {
		const targets = document.querySelectorAll(`[id^='garden-symbol-']`)
		anime.set(targets, {opacity:1})
		await anime.timeline({
			targets,
			delay: (el, i) => i * 20,
			duration:1000,
			top:(el, i) => `${positions[i].top}px`,
			easing: "spring(0.4, 100, 10, 0)",
		}).finished	
		setPage(page);
	}

	const toggleView = (view, force) => {
		if(!ready) return
		window.scrollTo(0,0);
		switch (view) {
			case 'program':
				toProgram()
				break;
			case 'garden':
				toGarden()
				break;
			case 'map':
				initMap()
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
	
	const transitionTo = async (targets, endTargets, opt = {}) => {
		
		if(currentAnimation) 
			currentAnimation.pause()

		const defaultDuration = 800;
		const defaultDelay = 0;

		const lastTargets = document.querySelectorAll(`[id^='${currentView}-symbol-']`)
		anime.set(lastTargets, {opacity:0})
		anime.set(endTargets, {opacity:0})
		anime.set(targets, {opacity:1})
		
		const animation = anime({
			targets,
			left: (el, i) => endTargets[i].getBoundingClientRect().left,
			top: (el, i) => endTargets[i].getBoundingClientRect().top,
			height: (el, i) =>  endTargets[i].clientHeight,
			width: (el, i) => endTargets[i].clientWidth,
			delay: (el, i) => i * defaultDelay,
			easing: "easeOutExpo",
			scale: 1,
			duration: !currentView ? 0 : defaultDuration,
			...opt,
			complete: () =>{
				anime.set(endTargets, {opacity:1})
				anime.set(targets, {opacity:0})
				setCurrentAnimation(undefined)
				setCurrentView(view);
				console.log('transition from', currentView, '>', view, opt)		
			}
		})
		setCurrentAnimation(animation)
		return animation.finished
	}

	const toGarden = async () => {
		if(!positions || !positions.length) return
		const targets = document.querySelectorAll("[id^='symbol-']")
		const endTargets = document.querySelectorAll("[id^='garden-symbol-']")
		
		if(!currentView && view === 'garden'){
			anime.set(targets, {translateY:'-100vh'})
			await transitionTo(targets, endTargets, {
				translateY:'0vh', 
				duration:700,
				delay : (el, i) => i*10,
				easing: 'spring(0.7, 100, 10, 0)'
			})
		}
		transitionTo(targets, endTargets)
	};
	
	const toProgram = async () => {
		const targets = document.querySelectorAll("[id^='symbol-']")
		const endTargets = document.querySelectorAll("[id^='program-symbol-']")
		
		const eTargets = Array.prototype.slice.call(targets, 0).map(el => {
			const participantId = el.getAttribute('participantid');
			const eventId = el.getAttribute('eventid');
			for (let i = 0; i < endTargets.length; i++) {
				if(participantId === endTargets[i].getAttribute('participantid') && eventId === endTargets[i].getAttribute('eventid'))
					return endTargets[i];
			}
		})
		return transitionTo(targets, eTargets)
	};

	const toParticipants = async () => {
		const targets = document.querySelectorAll("[id^='symbol-']")
		const endTargets = document.querySelectorAll("[id^='participant-symbol-']")

		const eTargets = Array.prototype.slice.call(targets, 0).map(el => {
			const participantId = el.getAttribute('participantid');
			for (let i = 0; i < endTargets.length; i++) {
				if(participantId === endTargets[i].getAttribute('participantid'))
					return endTargets[i];
			}
		})
		return transitionTo(targets, eTargets)
	};

	const toEvent = async () => {
		const targets = document.querySelectorAll(`[id^='symbol-']:not([eventid='${event.id}'])`)
		const endTargets = document.querySelectorAll(`[id^='event-symbol-']:not([eventid='${event.id}'])`)
		const target = document.getElementById(`symbol-${event.id}`)
		const endTarget = document.getElementById(`event-symbol-${event.id}`)
		console.log(event.id, target, endTarget)

		if(!target)
			anime.set(endTarget, {opacity:1})
		else
			transitionTo([target], [endTarget])

		transitionTo(targets, targets, {scale:0})
	};

	useEffect(() => ready && view && toggleView(view), [view, ready]);
	
	// wait for images to load then init
	useEffect(async () => {
		const images = symbols.map((i)=> i.ref).concat(batikRef);
		if(loaded < images.length) return 
		
		await initSymbols();
		setLoading(false)
	}, [loaded]);

	// check loading of images
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
	useEffect(() => {
		return
		if (!positions || view !== 'garden') return;
		
		const targets = document.querySelector(`[id^='symbol-']`)
		const p = Math.ceil(scroll * totalSteps + 0.5);
		const { innerHeight } = window;

		if (scrollStep !== page) 
			return initMap(p);

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
	//const debounceResize = useDebounce(initSymbols, 100);
	//useEffect(() => debounceResize(), [innerWidth]);

	return (
		<>
			<div className={styles.container}>
				<div className={styles.scroller} ref={scrollRef}></div>
				<div className={styles.diggi}>
					<img 
						src={"https://www.datocms-assets.com/58832/1637937430-diggibatik.png"} 
						ref={batikRef} 
						className={cn(styles.batik, loading && styles.loading)} 
					/>
				</div>
			</div>
			{symbols.map((t, index) => (
				<>					
					<img 
						id={`garden-symbol-${t.event.id}`}
						key={`garden-symbol-${index}`}
						src={t.url}
						ref={t.ref}
						eventid={t.event.id}
						participantid={t.event.participant.id}
						className={cn(styles.symbol, styles.garden, contentStyles.placeholderSymbol)}
					/>
					<Link href={`/${t.event.participant.slug}/${t.event.slug}`}>
						<a>
							<img 
								id={`symbol-${t.event.id}`}
								key={`symbol-${index}`}
								src={t.url}
								eventid={t.event.id}
								participantid={t.event.participant.id}
								className={cn(styles.symbol)}
							/>
						</a>
					</Link>
				</>
			))}
		</>
	);
}


