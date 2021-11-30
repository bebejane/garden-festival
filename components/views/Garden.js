import styles from "./Garden.module.scss"
import Symbol from "../Symbol";
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";
import useVisibility from "lib/hooks/useVisibility";
import { useWindowSize, useDebounce  } from "rooks";
import { nodesToArray, randomInt } from "lib/utils";
import { et } from "date-fns/locale";

const symbolsPerPage = 16;
const symbolSize = 200;
const isDev = process.env.NODE_ENV === 'development'

export default function Garden({events, event, participant, view, defaultView}) {
	
	const [bounds, setBounds] = useState({});
	const [loaded, setLoaded] = useState(0);
	const [ready, setReady] = useState(false);
	const [loading, setLoading] = useState(true);
	const [currentView, setCurrentView] = useState();
	const [currentAnimation, setCurrentAnimation] = useState();
	const [page, setPage] = useState(1);
	const [positions, setPositions] = useState();
	const [scrollRef, { scroll, scrollStep, scrollStepRatio, totalSteps }] = useVisibility("scroller",0,100);
	const { innerWidth } = useWindowSize();
  
	const toggleView = (view, force) => {
		if(!ready) return
		switch (view) {
			case 'program':
				toProgram()
				break;
			case 'weekday':
				toWeekday()
				break;
			case 'garden':
				toGarden()
				break;
			case 'participant':
				toParticipant()
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

	const getBounds = () => {
		const menu = document.getElementById('menu')
		const { clientHeight : h, clientWidth : w } = document.body;
		const top = menu.offsetTop + menu.clientHeight;
		const pad = 40;
		return {width: w-(pad*2), height: h-(pad)-(top), left: pad, top: top, pad, window:{width: window.innerWidth, height: window.innerHeight}};
	};

	const initSymbols = async () => {		
		
		const bounds = getBounds();
		const targets = document.querySelectorAll(`[id^='garden-symbol-']`)
		const symbols = document.querySelectorAll(`[id^='symbol-']`)		
		
		const minX = bounds.left
		const maxX = bounds.left + bounds.width - symbolSize
		const minY = bounds.top
		const maxY = bounds.top + bounds.height - symbolSize
		
		const positions = {
			bounds,
			items:[]
		};

		const checkOverlap = (area) => {
			for (let i = 0; i < positions.length; i++) {
				 let checkArea = positions.items[i];
				 let bottom1 = area.top + area.height;
				 let bottom2 = checkArea.top + checkArea.height;
				 let top1 = area.top;
				 let top2 = checkArea.top;
				 let left1 = area.left;
				 let left2 = checkArea.left;
				 let right1 = area.left + area.width;
				 let right2 = checkArea.left + checkArea.width;

				 if (bottom1 <= top2 || top1 >= bottom2 || right1 <= left2 || left1 >= right2)
					 continue;
				 else
					 return true;
			}
			return false;
		}
		nodesToArray(targets).slice(0, symbolsPerPage*2).forEach((el, idx) => {
			let randX = 0;
			let randY = 0;
			let area;
			let tries = 0;
			do {
				randX = Math.round(minX + ((maxX - minX) * (Math.random() % 1)));
				randY = Math.round(minY + ((maxY - minY) * (Math.random() % 1)));
				area = {
					id:el.id,
					left: randX,
					top: randY,
					width: el.clientWidth,
					height: el.clientHeight
				};
			} while (checkOverlap(area));
			positions.items.push(area);
		})
		
		anime.set(targets, {
			opacity: 0,
			left: (el, i) => positions.items[i].left,
			top: (el, i) => positions.items[i].top,
			width: symbolSize,
		});
		anime.set(symbols, {
			opacity: 0,
			left: (el, i) => positions.items[i].left,
			top: (el, i) => positions.items[i].top,
			width: symbolSize,
		});
		setPositions(positions);
		setReady(true)
		console.log('done init ', view)
	}
	const resizeGarden = () => {
		if(!positions) return

		const bounds = getBounds()
		const { bounds : lastBounds, items} = positions;
		const widthDiff = bounds.window.width/lastBounds.window.width
		const heightDiff = bounds.window.height/lastBounds.window.clientHeight
		const newPositions = {
			bounds,
			items:positions.items.map(({left, top, id})=>{
				const el = document.getElementById(`${id}`)
				el.style.left = `${left*widthDiff}px`
				el.style.top = `${left*heightDiff}px`
				return {
					left: left*widthDiff,
					top: top*heightDiff,
					id
				}
			})
		}
		setPositions(newPositions)
	}

	const transitionTo = async (targets, endTargets, opt = {}) => {
		
		if(currentAnimation) 
			currentAnimation.pause()

		const defaultDuration = 800;
		const defaultDelay = 0;
		const lastTargets = document.querySelectorAll(`[id^='${currentView}-symbol-']`)
		const elementByIndex = (i) => {
			return Array.isArray(endTargets) || endTargets instanceof NodeList ? endTargets[i] : endTargets
		}
		
		anime.set(lastTargets, {opacity:0})
		anime.set(endTargets, {opacity:0})
		anime.set(targets, {opacity:1, zIndex:5})

		const animation = anime({
			targets,
			left: (el, i) => elementByIndex(i).getBoundingClientRect().left,
			top: (el, i) => elementByIndex(i).getBoundingClientRect().top + window.scrollY,
			height: (el, i) =>  elementByIndex(i).clientHeight,
			width: (el, i) => elementByIndex(i).clientWidth,
			delay: (el, i) => i * defaultDelay,
			easing: "easeOutExpo",
			scale: 1,
			duration: !currentView ? 0 : defaultDuration,
			...opt,
			complete: () =>{
				anime.set(targets, {opacity:0, zIndex:0})
				anime.set(endTargets, {opacity:1})
				setCurrentAnimation(undefined)
				setCurrentView(view);
				console.log(currentView, '>', view, opt)		
			}
		})
		setCurrentAnimation(animation)
		return animation.finished
	}
	const sortTargetSymbols = (targets, endTargets) => {
		endTargets = nodesToArray(endTargets)
		const eTargets = []
		targets.forEach((target)=>{
			eTargets.push(endTargets.filter(t => t.getAttribute('eventid') === target.getAttribute('eventid'))[0]);
		})
		return eTargets; 
	}
	const toGarden = async () => {
		if(!positions || !positions.items.length) return
		
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
		return transitionTo(targets, endTargets)
	};
	
	const toProgram = async () => {
		const targets = document.querySelectorAll("[id^='symbol-']")
		const endTargets = sortTargetSymbols(targets, document.querySelectorAll("[id^='program-symbol-']"))
		/*
		const eTargets = nodesToArray(targets).map(el => {
			const participantId = el.getAttribute('participantid');
			const eventId = el.getAttribute('eventid');
			for (let i = 0; i < endTargets.length; i++) {
				if(participantId === endTargets[i].getAttribute('participantid') && eventId === endTargets[i].getAttribute('eventid'))
					return endTargets[i];
			}
		})
		console.log(targets)
		console.log(eTargets)
		return transitionTo(targets, eTargets)
		*/
		return transitionTo(targets, endTargets)
	};

	const toWeekday = async () => {
		const targets = document.querySelectorAll("[id^='symbol-']")
		const endTargets = document.querySelectorAll("[id^='program-symbol-']")
		
		const eTargets = nodesToArray(targets).map(el => {
			const participantId = el.getAttribute('participantid');
			const eventId = el.getAttribute('eventid');
			for (let i = 0; i < endTargets.length; i++) {
				if(participantId === endTargets[i].getAttribute('participantid') && eventId === endTargets[i].getAttribute('eventid'))
					return endTargets[i];
			}
		}).filter(el => el)
		const rTargets = nodesToArray(targets).filter((el) => eTargets.filter((elt)=> elt.getAttribute('eventid') === el.getAttribute('eventid')).length > 0)
		return transitionTo(rTargets, eTargets)
	};
	
	const toParticipants = async () => {
		const targets = document.querySelectorAll("[id^='symbol-']")
		const endTargets = document.querySelectorAll("[id^='participants-symbol-']")

		const eTargets = nodesToArray(targets).map(el => {
			const participantId = el.getAttribute('participantid');
			for (let i = 0; i < endTargets.length; i++) {
				if(participantId === endTargets[i].getAttribute('participantid'))
					return endTargets[i];
			}
		})
		return transitionTo(targets, eTargets)
	};

	const toParticipant = async () => {
		const targets = document.querySelectorAll(`[id^='symbol-'][participantid='${participant.id}']`)
		const endTarget = document.getElementById(`participant-symbol-${participant.id}`)
		return transitionTo(targets, endTarget)
	};

	const toEvent = async () => {
		const targets = document.querySelectorAll(`[id^='symbol-']:not([eventid='${event.id}'])`)
		const endTargets = document.querySelectorAll(`[id^='event-symbol-']:not([eventid='${event.id}'])`)
		const target = document.getElementById(`symbol-${event.id}`)
		const endTarget = document.getElementById(`event-symbol-${event.id}`)
		
		if(!target)
			anime.set(endTarget, {opacity:1})
		else
			transitionTo([target], [endTarget])

		transitionTo(targets, targets, {scale:0})
	};

	useEffect(()=> setBounds(getBounds()), [innerWidth])
	useEffect(()=> resizeGarden(), [innerWidth])
	useEffect(() => ready && view && toggleView(view), [view, ready]);
	useEffect(async () => { // wait for images to load then init
		const images = document.querySelectorAll(`img[preload='true']`)	
		if(loaded < images.length || !loading) return 
		
		setTimeout(async ()=>{
			await initSymbols();
			setLoading(false)
		},200);
		
	}, [loaded]);

	useEffect(() => { // check loading of images
		let preLoaded = 0;
		const images = document.querySelectorAll(`img[preload='true']`)	
		images.forEach((ref) => {
			if(ref.complete)
			 	setLoaded(++preLoaded)
			else 
				ref.onload = () => { setLoaded(++preLoaded)}
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

	return (
		<>
			{view === 'garden' && isDev && <div className={styles.bounds} style={bounds}></div>}
			<div className={styles.scroller} ref={scrollRef} style={{height:'100%'}}></div>
			<div className={styles.container}>
				<div className={cn(styles.header, view !== 'garden' && styles.hidden)}>
					<img src={'/images/The Community Garden Festival.png'}/>
				</div>
			</div>
			
			{events && events.map((event, index) => <Symbol event={event} symbolSize={symbolSize}/>)}
		</>
	);
}


