import styles from '/styles/Home.module.scss'

import Menu from "/components/Menu"
import Garden from "/components/views/Garden"
import Community from "/components/views/Community";
import Participant from "/components/views/Participant";
import Event from "/components/views/Event";
import Festival from "/components/views/Festival";
import About from "/components/views/About";
import Background from "/components/Background"
import Content from "/components/Content";
import Clock from '/components/Clock';

import { useEffect, useState, } from "react";
import { withGlobalProps } from "/lib/utils";
import anime from "animejs";
import useVisibility from "/lib/hooks/useVisibility";
import { useWindowSize, useDebounce } from "rooks";
import { nodesToArray, randomInt } from "/lib/utils";

import Path from 'svg-path-generator';
const SvgPath = require('path-svg/svg-path');

const symbolsPerPage = 16;
const symbolSize = 200;

export default function Home(props) {
	const {
		events,
		participants,
		participant,
		event,
		dayEvents,
		weekday,
		abouts,
		about,
		defaultView = "garden",
	} = props;

	const [view, setView] = useState()
	const [bounds, setBounds] = useState({});
	const [loaded, setLoaded] = useState(0);
	const [ready, setReady] = useState(false);
	const [loading, setLoading] = useState(true);
	const [currentView, setCurrentView] = useState();
	const [currentAnimation, setCurrentAnimation] = useState();
	const [page, setPage] = useState(1);
	const [positions, setPositions] = useState();
	//const [scrollRef, { scroll, scrollStep, scrollStepRatio, totalSteps }] = useVisibility("scroller",0,100);
	const { innerWidth } = useWindowSize();

	const toggleView = (view, force) => {
		if (!ready) return
		switch (view) {
			case 'festival':
				toFestival()
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
			case 'community':
				toCommunity()
				break;
			case 'event':
				toEvent()
				break;
			case 'abouts':
				break;
			default:
				break;
		}
	}

	const getBounds = () => {
		const menu = document.getElementById('menu')
		const { clientHeight: h, clientWidth: w } = document.body;
		const top = menu.offsetTop + menu.clientHeight;
		const pad = 40;
		return { width: w - (pad * 2), height: h - (pad) - (top), left: pad, top: top, pad, window: { width: window.innerWidth, height: window.innerHeight } };
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
			items: []
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
		nodesToArray(targets).slice(0, symbolsPerPage).forEach((el, idx) => {
			let randX = 0;
			let randY = 0;
			let area;
			let tries = 0;
			do {
				randX = Math.round(minX + ((maxX - minX) * (Math.random() % 1)));
				randY = Math.round(minY + ((maxY - minY) * (Math.random() % 1)));
				area = {
					id: el.id,
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
		console.log('done init garden')
	}
	const resizePositions = () => {
		if (!positions) return

		const bounds = getBounds()
		const { bounds: lastBounds, items } = positions;
		const widthDiff = bounds.window.width / lastBounds.window.width
		const heightDiff = bounds.window.height / lastBounds.window.clientHeight
		const newPositions = {
			bounds,
			items: positions.items.map(({ left, top, id }) => {
				const el = document.getElementById(`${id}`)
				el.style.left = `${left * widthDiff}px`
				el.style.top = `${left * heightDiff}px`
				return {
					left: left * widthDiff,
					top: top * heightDiff,
					id
				}
			})
		}
		setPositions(newPositions)
	}
	/*
		const transitionTo = async (targets, endTargets, opt = {}) => {
			
			if(currentAnimation) currentAnimation.pause()
			
			targets = sortTargetsByEventId(targets)
			endTargets = sortTargetsByEventId(endTargets)
	
			const defaultDuration = 800;
			const defaultDelay = 0;
			const lastTargets = document.querySelectorAll(`[id^='${currentView}-symbol-']`)
	
			const elementByIndex = (i, el) => {
				const endEl =  Array.isArray(endTargets) || endTargets instanceof NodeList ? endTargets.length === 1 ? endTargets[0] : endTargets[i] : endTargets
				return endEl
			}
			
			const generatePath = (el, i) => {
				console.log(el)
				const b1 = el.getBoundingClientRect()
				const b2 = elementByIndex(i).getBoundingClientRect()
	
				console.log(b1.x, b1.y, b2.x, b2.y)
				var path2 = SvgPath().to(b1).rel().bezier3(b1.x, b1.y, b2.x, b2.y).str();
				console.log(path2)
				const p = document.getElementById('svgpath')
				p.setAttribute('d', path2)
				
				const path = Path()
					.moveTo(b1.x, b1.y)
					.bezierCurveTo(b2.x, b2.y)
					.end();
				console.log(path)
				
				return anime.path('#svgpath');
			}
			
			anime.set(lastTargets, {opacity:0})
			anime.set(endTargets, {opacity:0})
			anime.set(targets, {opacity:1, zIndex:5})
			console.log('start', currentView, '>', view)	
	
			const animation = anime({
				targets,
				//left: (el, i) => elementByIndex(i, el).getBoundingClientRect().left,
				//top: (el, i) => elementByIndex(i, el).getBoundingClientRect().top + window.scrollY,
				//height: (el, i) =>  elementByIndex(i, el).clientHeight,
				//width: (el, i) => elementByIndex(i, el).clientWidth,
				delay: (el, i) => i * defaultDelay,
				top: (el, i)=> generatePath(el, i),
				left: (el, i)=> generatePath(el, i),
				//rotate: (el, i)=> generatePath(el, i),
				easing: "linear",//"easeOutExpo",
				scale: 1,
				duration: 1000,//!currentView ? 0 : defaultDuration,
				...opt,
				complete: () =>{
					anime.set(targets, {opacity:0, zIndex:0})
					anime.set(endTargets, {opacity:1})
					setCurrentAnimation(undefined)
					setCurrentView(view);
					console.log('complete', currentView, '>', view)		
				}
			})
			setCurrentAnimation(animation)
			return animation.finished
		}
		*/
	const transitionTo = async (targets, endTargets, opt = {}) => {

		if (currentAnimation) currentAnimation.pause()

		targets = sortTargetsByEventId(targets)
		endTargets = sortTargetsByEventId(endTargets).filter(t => (t))

		const defaultDuration = 800;
		const defaultDelay = 0;
		const lastTargets = document.querySelectorAll(`[id^='${currentView}-symbol-']`)

		const elementByIndex = (i, el) => {
			const target = Array.isArray(endTargets) || endTargets instanceof NodeList ? endTargets.length === 1 ? endTargets[0] : endTargets[i] : endTargets
			return target;
		}
		
		anime.set(lastTargets, { opacity: 0 })
		anime.set(endTargets, { opacity: 0 })
		anime.set(targets, { opacity: 1, zIndex: 5 })
		console.log('start', currentView, '>', view)

		const animation = anime({
			targets,
			left: (el, i) => elementByIndex(i, el)?.getBoundingClientRect().left + window.scrollX,
			top: (el, i) => elementByIndex(i, el)?.getBoundingClientRect().top + window.scrollY,
			height: (el, i) => elementByIndex(i, el)?.clientHeight,
			width: (el, i) => elementByIndex(i, el)?.clientWidth,
			delay: (el, i) => i * defaultDelay,
			easing: "easeInOutQuad",//"easeOutExpo",
			scale: 1,
			duration: !currentView ? 0 : defaultDuration,
			...opt,
			complete: () => {
				anime.set(targets, { opacity: 0, zIndex: 0 })
				anime.set(endTargets, { opacity: 1 })
				setCurrentAnimation(undefined)
				setCurrentView(view);
				console.log('complete', currentView, '>', view)
			}
		})
		setCurrentAnimation(animation)
		return animation.finished
	}

	const sortTargetsByEventId = (targets) => {
		return nodesToArray(targets).sort((a, b) => parseInt(a.getAttribute('eventid')) < parseInt(b.getAttribute('eventid')))
	}
	const toGarden = async () => {
		if (!positions || !positions.items.length) return

		const targets = document.querySelectorAll("[id^='symbol-']")
		const endTargets = document.querySelectorAll("[id^='garden-symbol-']")

		if (!currentView && view === 'garden') {
			anime.set(targets, { translateY: '-100vh' })
			await transitionTo(targets, endTargets, {
				translateY: '0vh',
				duration: 700,
				delay: (el, i) => i * 10,
				easing: 'spring(0.7, 100, 10, 0)'
			})
		}
		return transitionTo(targets, endTargets)
	};

	const toFestival = async () => {
		const targets = document.querySelectorAll("[id^='symbol-']")
		const endTargets = document.querySelectorAll("[id^='festival-symbol-']")
		return transitionTo(targets, endTargets)
	};

	const toWeekday = async () => {
		const targets = document.querySelectorAll("[id^='symbol-']")
		const endTargets = document.querySelectorAll("[id^='festival-symbol-']")

		const eTargets = nodesToArray(targets).map(el => {
			const participantId = el.getAttribute('participantid');
			const eventId = el.getAttribute('eventid');
			for (let i = 0; i < endTargets.length; i++) {
				if (participantId === endTargets[i].getAttribute('participantid') && eventId === endTargets[i].getAttribute('eventid'))
					return endTargets[i];
			}
		}).filter(el => el)
		const rTargets = nodesToArray(targets).filter((el) => eTargets.filter((elt) => elt.getAttribute('eventid') === el.getAttribute('eventid')).length > 0)
		return transitionTo(rTargets, eTargets)
	};

	const toCommunity = async () => {
		const targets = document.querySelectorAll("[id^='symbol-']")
		const endTargets = document.querySelectorAll("[id^='community-symbol-']")

		const eTargets = nodesToArray(targets).map(el => {
			const participantId = el.getAttribute('participantid');
			for (let i = 0; i < endTargets.length; i++) {
				if (participantId === endTargets[i].getAttribute('participantid'))
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
		const target = document.getElementById(`symbol-${event.id}`)
		const endTarget = document.getElementById(`event-symbol-${event.id}`)
		!target ? anime.set(endTarget, { opacity: 1 }) : transitionTo([target], [endTarget])
	};

	useEffect(() => setBounds(getBounds()), [innerWidth])
	useEffect(() => resizePositions(), [innerWidth])

	useEffect(async () => { // wait for images to load then init
		const images = document.querySelectorAll(`img[preload='true']`)
		if (loaded < images.length || !loading) return

		setTimeout(async () => {
			await initSymbols();
			setLoading(false)
		}, 200);

	}, [loaded]);

	useEffect(() => { // check loading of images
		let preLoaded = 0;
		const images = document.querySelectorAll(`img[preload='true']`)
		images.forEach((ref) => {
			if (ref.complete)
				setLoaded(++preLoaded)
			else
				ref.onload = () => { setLoaded(++preLoaded) }
		})
	}, [])

	useEffect(() => setView(defaultView), [defaultView])
	useEffect(() => ready && view && toggleView(view), [view, ready]);

	return (
		<div className={styles.container}>
			<Menu
				view={view}
				setView={setView}
				weekday={weekday}
			/>
			<Content
				show={view !== 'garden'}
				popup={['event', 'participant'].includes(view)}
				abouts={abouts}
			>
				<Festival
					show={view === 'festival' || view === 'weekday'}
					events={events}
					dayEvents={dayEvents}
					weekday={weekday}
				/>
				<Community participants={participants} show={view === 'community'} />
				<Participant participant={participant} events={events} show={view === 'participant'} />
				<Event event={event} events={events} show={view === 'event'} />
			</Content>
			<Garden
				participant={participant}
				participants={participants}
				events={events}
				view={view}
				symbolSize={symbolSize}
				bounds={bounds}
			/>
			<Clock />
			<About about={about} />
			<Background view={view} />
		</div>
	)
}

export const getStaticProps = withGlobalProps(async ({ props, revalidate }) => {
	return {
		props,
		revalidate,
	};
});