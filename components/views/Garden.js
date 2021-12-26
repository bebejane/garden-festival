import styles from "./Garden.module.scss"
import Symbol from "../Symbol";
import cn from "classnames";
import anime from "animejs";
import useScrollPosition from '@react-hook/window-scroll'
import { useWindowSize } from "rooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { nodesToArray } from "lib/utils";

export default function Garden({ event, events, participant, view, symbolSize }) {

	const router = useRouter()
	const [loaded, setLoaded] = useState(0);
	const [ready, setReady] = useState(false);
	const [loading, setLoading] = useState(true);
	const [currentView, setCurrentView] = useState();
	const [currentAnimation, setCurrentAnimation] = useState();
	const [positions, setPositions] = useState();	
	const { innerWidth, innerHeight } = useWindowSize();

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
		const height =  (h - (pad) - (top))
		return { width: w - (pad * 2), height, left: pad, top: top, pad, window: { width: window.innerWidth, height: window.innerHeight } };
	};

	const generatePositions = (totalRetries = 0) => {
		
		const bounds = getBounds();
		const targets = document.querySelectorAll(`[id^='garden-symbol-']`)
		const elements = nodesToArray(targets)
		const maxRetries = 10000;
		const symbolsPerPage = Math.floor((Math.floor(bounds.height/symbolSize) * Math.floor(bounds.width/symbolSize)/2))
		const positions = { bounds, items: []};
		const minX = bounds.left
		const maxX = bounds.left + bounds.width - symbolSize
		const minY = bounds.top
		const maxY = (bounds.top + bounds.height - symbolSize)
		
		const isOverlapping = (area) => {
			
			for (let i = 0; i < positions.items.length; i++) {
				const checkArea = positions.items[i];			
				const rect1VerticalReach = area.top + area.height;
    		const rect1HorizontalReach = area.left + area.width;
    		const rect2VerticalReach = checkArea.top + checkArea.height;
    		const rect2HorizontalReach = checkArea.left + checkArea.width;

    		if((checkArea.top < rect1VerticalReach && area.top < rect2VerticalReach) && (checkArea.left < rect1HorizontalReach && area.left < rect2HorizontalReach))
					return true;
    		else
					continue;
			}
			return false;
		}
		
		for (let i = 0, page = 0; i < elements.length; i++){	
			const el = elements[i]
			const randX = 0;
			const randY = 0;
			const retries = 0;
			const pageMargin = (page*bounds.height)
			let area;

			do {
				randX = Math.round(minX + ((maxX - minX) * (Math.random() % 1)));
				randY = Math.round((minY+pageMargin) + (((maxY+pageMargin) - (minY+pageMargin)) * (Math.random())));
				area = {
					id: el.id,
					left: randX,
					top: randY,
					width: el.height,
					height: el.width
				};
			} while (isOverlapping(area) && (++retries < maxRetries));
			
			if(retries >= maxRetries && totalRetries < 10)
				return generatePositions(++totalRetries)
			
			page = Math.floor((i+1)/symbolsPerPage)
			positions.items.push(area);
		}
		if(totalRetries >= 10) 
			console.log('failed to randomly position')
		return positions;
	}

	const initSymbols = (reinit) => {
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
		anime.set(targets[0]?.parentNode, { opacity: 1, zIndex: 5 })

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
				anime.set(endTargets, { opacity: 1 })
				anime.set(targets[0]?.parentNode, { opacity: 1, zIndex: 1 })
				anime.set(targets, { opacity: 0, zIndex: 0 })
				
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

		const lastView = lastViewPositions()
		if(lastView && lastView.targets.length){
			const target = document.getElementById(`symbol-${lastView.targets[0].eventId}`)
			repositionToLastView(target, {eventId: lastView.targets[0].eventId})
		}
		
		const targets = document.querySelectorAll("[id^='symbol-']")
		const endTargets = document.querySelectorAll("[id^='garden-symbol-']")

		if (!currentView && view === 'garden') {
			const maxOffset = nodesToArray(targets).sort((a, b) => a.offsetTop < b.offsetTop)[0].offsetTop
			
			anime.set(targets, { opacity:1, translateY: `-${maxOffset+symbolSize}px` })
			await transitionTo(targets, endTargets, {
				translateY: '0px',
				duration: 2000,
				delay: (el, i) => i * 20,
				easing: 'spring(0.8, 1000, 10, 0)'
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

	

	useEffect(() => ready && view && toggleView(view), [view, ready]);
	useEffect(() => {
		router.events.on('routeChangeStart', saveViewPositions)
		return () => router.events.off('routeChangeStart', saveViewPositions)
	},[view])
	useEffect(async () => { // wait for images to load then init
		const images = document.querySelectorAll(`img[preload='true']`)
		if (loaded < images.length || !loading) return
		await initSymbols();
		setLoading(false)
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


	useEffect(() => resizePositions(), [innerWidth])
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

	const [ratio, setRatio] = useState(1)
	const scrollY = useScrollPosition(60)
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
	
	const generateLetters = (head) =>{
		return head.text.split('').map((c, idx) => 
			head.tag === 'h1' ?
				<span key={idx} style={ generateWeightStyle(idx % 2 === 0 ? ratio : (1.0-ratio) )}>{c}</span>
			:
				<span key={idx} style={ generateWeightStyle((1.0-ratio), 300,700)}>{c}</span>
		)
	}
	const generateWeightStyle = (ratio, min = minWeight, max = maxWeight) => {
		const weight = (max-min)*(ratio*2)+min
		return { fontVariationSettings: `'wght' ${weight}`}
	}

	useEffect(()=>{
		const { scrollTopMax } = document.documentElement;
		const step = (scrollY/scrollTopMax)
		const ratio = step-Math.floor(step)
		const r = 1-((ratio > 0.5 ? 0.5-(ratio-0.5) : ratio)*2)
		setRatio(r)
	}, [scrollY])
	
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