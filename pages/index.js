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
import { useWindowSize, useDebounce, useForkRef } from "rooks";
import { nodesToArray, randomInt } from "/lib/utils";
import { useRouter } from 'next/router';
import { sortNodeList } from 'lib/utils';

const symbolsPerPage = 6;
const symbolSize = 300;

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
	
	const router = useRouter()
	const [view, setView] = useState()
	const [bounds, setBounds] = useState({});
	const [loaded, setLoaded] = useState(0);
	const [ready, setReady] = useState(false);
	const [loading, setLoading] = useState(true);
	const [currentView, setCurrentView] = useState();
	const [currentAnimation, setCurrentAnimation] = useState();
	const [page, setPage] = useState(1);
	const [positions, setPositions] = useState();	
	const { innerWidth } = useWindowSize();
	//const [scrollRef, { scroll, scrollStep, scrollStepRatio, totalSteps }] = useVisibility("scroller",0,100);

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
		const pad = 0;
		return { width: w - (pad * 2), height: h - (pad) - (top), left: pad, top: top, pad, window: { width: window.innerWidth, height: window.innerHeight } };
	};

	const generatePositions = (totalRetries = 0) => {
		
		const bounds = getBounds();
		const targets = document.querySelectorAll(`[id^='garden-symbol-']`)
		const elements = nodesToArray(targets)
		const maxRetries = 100000;

		const positions = { bounds, items: []};
		const minX = bounds.left
		const maxX = bounds.left + bounds.width - symbolSize
		const minY = bounds.top
		const maxY = (bounds.top + bounds.height - symbolSize)

		const isOverlapping = (area) => {
			
			for (let i = 0; i < positions.items.length; i++) {
				let checkArea = positions.items[i];
				let bottom1 = area.top + area.height;
				let bottom2 = checkArea.top + checkArea.height;
				let top1 = area.top;
				let top2 = checkArea.top;
				let left1 = area.left;
				let left2 = checkArea.left;
				let right1 = area.left + area.width;
				let right2 = checkArea.left + checkArea.width;

				if (bottom1 < top2 || top1 > bottom2 || right1 < left2 || left1 > right2)
					continue;
				else{
					return true;
				}	
			}
			return false;
		}
		
		for (let i = 0, page = 0; i < elements.length; i++){	
			let el = elements[i]
			let randX = 0;
			let randY = 0;
			let area;
			let retries = 0;
			let pageMargin = (page*bounds.height)
			do {
				randX = Math.round(minX + ((maxX - minX) * (Math.random() % 1)));
				randY = Math.round((minY+pageMargin) + (((maxY+pageMargin) - (minY+pageMargin)) * (Math.random() % 1)));
				area = {
					id: el.id,
					left: randX,
					top: randY,
					width: el.clientWidth,
					height: el.clientHeight
				};
			} while (isOverlapping(area) && (++retries < maxRetries));
			positions.items.push(area);
			
			if(retries >= maxRetries && totalRetries < 10)
				return generatePositions(++totalRetries)
			
			page = Math.floor((i+1)/symbolsPerPage)
		}
		if(totalRetries >= 10) console.log('failed to randomly position')
		return positions;
	}

	const initSymbols = () => {
		console.log('init symbols')
		const targets = document.querySelectorAll(`[id^='garden-symbol-']`)
		const symbols = document.querySelectorAll(`[id^='symbol-']`)
		const positions = generatePositions()

		anime.set(targets, {
			opacity: 0,
			left: (el, i) => positions.items[i].left,
			top: (el, i) => positions.items[i].top,
			width: symbolSize,
		});
		anime.set(symbols, {
			opacity: 0,
			zIndex: 0,
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

	const transitionTo = async (targets, endTargets, opt = {}) => {
		
		if (currentAnimation) currentAnimation.pause()

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
			}
		})
		setCurrentAnimation(animation)
		return animation.finished
	}

	const saveViewPositions = () => {
		
		const elements = nodesToArray(document.querySelectorAll(`img[id^='${view}-symbol']`))
		const viewPositions = {
			view,
			scrollX:window.scrollX,
			scrollY:window.scrollY,
			targets:elements.map((el)=>{ return {
				id: el.id,
				eventId: parseInt(el.getAttribute('eventid')),
				participantId: parseInt(el.getAttribute('participantid')),
				left: el.offsetLeft,
				top: el.offsetTop,
				x: el.getBoundingClientRect().x,
				y: el.getBoundingClientRect().y,
			}})
		}
		
		localStorage.setItem('lastView', JSON.stringify(viewPositions))
		return viewPositions
	}

	const lastViewPositions = () => {
		return  localStorage.getItem('lastView') ? JSON.parse(localStorage.getItem('lastView')) : null
	}

	const repositionToLastView = (target, opt) => {

		const lastView = lastViewPositions()
		if(!lastView) return console.log('no last view')
		const lastElement = lastView.targets.filter((t) => opt.participantId ? t.participantId == opt.participantId : t.eventId == opt.eventId )[0]
		if(!lastElement) return console.log('no last element')
		anime.set(target, {
			top: `${lastElement.y + window.scrollY}px`,
			left:`${lastElement.x}px`,
		})
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
		const lastView = lastViewPositions()
		if(lastView && lastView.targets.length){
			const target = document.getElementById(`symbol-${lastView.targets[0].eventId}`)
			repositionToLastView(target, {eventId: lastView.targets[0].eventId})
		}
		const targets = sortTargetsByEventId(document.querySelectorAll("[id^='symbol-']"))
		const endTargets = sortTargetsByEventId(document.querySelectorAll("[id^='festival-symbol-']")).filter(t => (t))
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
		const lastView = lastViewPositions()
		if(lastView && lastView.targets.length && lastView.view === 'participant'){			
			const target = document.querySelector(`[id^='symbol-'][eventid='${lastView.targets[0].eventId}']`)
			repositionToLastView(target, {eventId: lastView.targets[0].eventId})
		}
		const targets = document.querySelectorAll("[id^='symbol-']")
		const endTargets = nodesToArray(targets).map(el => {
			const eventId = el.getAttribute('eventid');
			const eTargets = document.querySelectorAll("[id^='community-symbol-']")
			for (let i = 0; i < eTargets.length; i++) {
				if (eventId == eTargets[i].getAttribute('eventid')){
					return eTargets[i];
				}
			}
		})
		console.log(targets, endTargets)
		return transitionTo(targets, endTargets)
	};

	const toParticipant = async () => {
		const targets = document.querySelectorAll(`[id^='symbol-'][participantid='${participant.id}']`)
		const endTargets = document.querySelectorAll(`[id^='participant-symbol-'][participantid='${participant.id}']`)
		repositionToLastView(targets[0], {participantId:participant.id})
		return transitionTo(targets, endTargets, {popup:true})
	};

	const toEvent = async () => {
		const target = document.getElementById(`symbol-${event.id}`)
		repositionToLastView(target, {eventId:event.id})
		const endTarget = document.getElementById(`event-symbol-${event.id}`)
		!target ? anime.set(endTarget, { opacity: 1 }) : transitionTo([target], [endTarget], {popup:true})
	};

	useEffect(() => setBounds(getBounds()), [innerWidth])
	useEffect(() => resizePositions(), [innerWidth])	
	useEffect(() => setView(defaultView), [defaultView])
	useEffect(() => ready && view && toggleView(view), [view, ready]);
	useEffect(() => {
		router.events.on('routeChangeStart', saveViewPositions)
		return () => router.events.off('routeChangeStart', saveViewPositions)
	},[view])
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

	return (
		<div className={styles.container}>
			<Menu
				view={view}
				setView={setView}
				weekday={weekday}
			/>
			<Content
				show={view !== 'garden'}
				view={view}
				popup={['event', 'participant', 'about'].includes(view)}
				abouts={abouts}
			>
				<Festival
					show={view === 'festival' || view === 'weekday'}
					events={events}
					dayEvents={dayEvents}
					weekday={weekday}
				/>
				<Community participants={participants} events={events} show={view === 'community'} />
				<Participant participant={participant} events={events} show={view === 'participant'} />
				<Event event={event} events={events} show={view === 'event'} />
				<About about={about} abouts={abouts} show={view === 'about'}/>
			</Content>
			<Garden
				participant={participant}
				participants={participants}
				events={events}
				view={view}
				symbolSize={symbolSize}
				bounds={bounds}
			/>
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