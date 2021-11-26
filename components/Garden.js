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
	const padding = 10;

	const [loaded, setLoaded] = useState(0);
	const [showMenu, setShowMenu] = useState(false);
	
	const [page, setPage] = useState(1);
	const [bounds, setBounds] = useState({});
	const [showBounds, setShowBounds] = useState(false);
	const [positions, setPositions] = useState();
	const [scrollRef, { scroll, scrollStep, scrollStepRatio, totalSteps }] = useVisibility("scroller",0,10);
	const { innerWidth } = useWindowSize();

	const [symbols, setSymbols] = useState(
		(events || []).map((ev, i) => {
			return {
				event:ev,
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

	const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);


	const dripIt = () => {
		window.scroll(0, 0);
		toMap();
	};

	const toggleView = (view) => {
		window.scrollTo(0,0);
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
	
	useEffect(() => setTimeout(()=>toggleView(view), 100), [view]);

	const toMap = (page) => {
		const bounds = getBounds();
		const targets = document.querySelectorAll(`.${symbolStyles.symbol}`);
		const totalsymbolWidth = symbols.reduce((acc, t) => t.ref.current.clientWidth + acc, 0);

		let pos = [];
		const rows = 1;
		const cols = symbols.length / rows;
		const colWidth = bounds.w / cols;
		const colHeight = bounds.h / rows;

		targets.forEach((el, idx) => {
			const { clientHeight: h, clientWidth: w } = el;
			const row = Math.ceil(((idx + 1) / (rows * cols)) * rows);
			const col = idx + 1 - (row - 1) * cols;
			const left = bounds.x + randomInt((col - 1) * colWidth, ((col - 1) * colWidth) + (colWidth - w));
			const top = bounds.y + randomInt((row - 1) * colHeight, ((row -1) * colHeight) + (colHeight - h)); //((row-1)*colHeight)
			pos.push({ left, top });
		});

		pos = pos.sort((a, b) => Math.random() > 0.5);

		anime.set(targets, {
			translateY: () => "-100vh",
			left: (el, i) => pos[i].left,
			top: (el, i) => pos[i].top,
			width: symbolWidth
		});

		anime.timeline({
			targets,
			delay: (el, i) => i * 20,
			easing: "spring(0.4, 100, 10, 0)",
			loop: false,
		}).add({ translateY: 0 });

		setShowMenu(false);
		setPositions(pos);
		setPage(page);
	};

	
	const toGarden = async () => {

		if(!positions) return
		
		anime({
			targets: `.${symbolStyles.symbol}`,
			left: (el, i) => positions[i].left,
			top: (el, i) => positions[i].top,
			width: symbolWidth,
			delay: (el, i) => i * 20,
			duration: 500,
			easing: "easeOutExpo",
			loop: false,
			scale: 1,
		});
	};

	const toEvent = async () => {
		
		const isSelected = (el) => el.getAttribute('eventId') === event.id
		const targets = document.querySelectorAll("[id^='gasymbol-']")
		const endTarget = document.querySelector(`[id^='evsymbol-${event.id}']`)
		const bounds = endTarget.getBoundingClientRect()
		
		//endTarget.style.visibility = 'hidden'

		anime({
			targets,
			left: (el, i) => isSelected(el) ? bounds.left : false,
			top: (el, i) => isSelected(el) ? bounds.top : false,
			height: (el, i) =>  isSelected(el) ? bounds.height: false,
			width: (el, i) => isSelected(el) ? bounds.width: false,
			scale: (el, i) => isSelected(el) ? 1 : 0,
			delay: (el, i) => isSelected(el) ? 0 : i * 100,
			duration: 500,
			easing: "easeOutExpo"
		});
	};
	const toProgram = async () => {
		const targets = document.querySelectorAll("[id^='gasymbol-']")
		const endTargets = document.querySelectorAll("[id^='prsymbol-']")
		anime({
			targets,
			left: (el, i) => endTargets[i].getBoundingClientRect().left,
			top: (el, i) => endTargets[i].getBoundingClientRect().top,
			height: (el, i) =>  endTargets[i].clientHeight,
			width: (el, i) => endTargets[i].clientWidth,
			delay: (el, i) => i * 20,
			duration: 500,
			easing: "easeOutExpo",
			loop: false,
			scale: 1,
		});
	};

	const toParticipants = async () => {
		const targets = document.querySelectorAll("[id^='gasymbol-']")
		const endTargets = []

		targets.forEach((el) =>{
			const t = document.querySelector(`[id='pasymbol-${el.getAttribute('participant')}']`)
			const b = t.getBoundingClientRect()
			endTargets.push({
				left:b.left,
				top:b.top,
			})			
		})
		
		anime({
			targets,
			left: (el, i) => endTargets[i].left,
			top: (el, i) => endTargets[i].top,
			width: (el, i) =>  symbolWidth,
			delay: (el, i) => i * 20,
			duration: 500,
			easing: "easeOutExpo",
			loop: false,
			scale: 1,
		});
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
		setBounds(getBounds());
		toMap(1);
	}, [loaded]);
	useEffect(() => {
		dripIt();
		setBounds(getBounds());
	}, [innerWidth]);

	
	
	return (
		<>
			<div className={styles.container} style={ view === 'garden' ? { minHeight:`${totalPages * 100}vh`} : { }}>
				<div className={styles.scroller} ref={scrollRef}></div>
				<div className={styles.diggi}>
					<img src={"/diggibatik.png"} ref={batikRef} className={cn(styles.batik, styles.diggity)} />
					{showBounds && (
						<div
							className={styles.bounds}
							style={{ left: bounds.x, top: bounds.y, width: bounds.w, height: bounds.h }}
						></div>
					)}
				</div>
				<div className={styles.controller}>
					<button onClick={dripIt}>dripp</button>
					
					<button onClick={() => setShowBounds(!showBounds)}>bounds</button>
				</div>
			</div>
			{symbols.map((t, index) => (
				<Symbol
					{...t}
					event={t.event}
					index={index}
					ref={t.ref}
					menu={showMenu}
					setLoaded={setLoaded}
					setEvent={setEvent}
					selectedEvent={event}
				/>
			))}
		</>
	);
}