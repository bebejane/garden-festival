import Tree from "./Tree"
import styles from "./Garden.module.scss"
import cn from "classnames";
import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";
import useVisibility from "lib/hooks/useVisibility";
import { useWindowSize } from "rooks";

export default function Garden({events, setEvent, event, view}) {
	
	const batikRef = useRef();
	const totalPages = 10;
	const treeHeight = 160;
	const padding = 10;

	const [loaded, setLoaded] = useState(0);
	const [showMenu, setShowMenu] = useState(false);
	
	const [page, setPage] = useState(1);
	const [bounds, setBounds] = useState({});
	const [showBounds, setShowBounds] = useState(false);
	const [positions, setPositions] = useState();
	const [scrollRef, { scroll, scrollStep, scrollStepRatio, totalSteps }] = useVisibility("scroller",0,10);
	const { innerWidth } = useWindowSize();

	const [trees, setTrees] = useState(
		(events || []).map((ev, i) => {
			return {
				event:ev,
				index: i,
				ref: React.createRef(),
				url: ev.participant.symbol.url,
				state: "map",
				style: {
					height: `${treeHeight}px`,
					top: `${treeHeight * i}px`,
				},
			};
		})
	);
	const getBounds = () => {
		const { clientWidth: w, clientHeight: h, offsetTop: y, offsetLeft: x } = batikRef.current;
		const pad = 100;
		return { w: w - pad * 2, h: h - pad * 2, x: x + pad, y: y + pad };
	};
	const randomInt = (min, max) => {
		// min and max included
		return Math.floor(Math.random() * (max - min + 1) + min);
	};
	const dripIt = () => {
		window.scroll(0, 0);
		toMap();
	};
	const toMap = (page) => {
		const bounds = getBounds();
		const targets = document.querySelectorAll(`.${styles.tree}`);
		const totalTreeWidth = trees.reduce((acc, t) => t.ref.current.clientWidth + acc, 0);

		let pos = [];
		const rows = 3;
		const cols = trees.length / rows;
		const colWidth = bounds.w / cols;
		const colHeight = bounds.h / rows;

		targets.forEach((el, idx) => {
			const { clientHeight: h, clientWidth: w } = el;
			const row = Math.ceil(((idx + 1) / (rows * cols)) * rows);
			const col = idx + 1 - (row - 1) * cols;
			const left = bounds.x + randomInt((col - 1) * colWidth, (col - 1) * colWidth + colWidth - w);
			const top =
				bounds.y + randomInt((row - 1) * colHeight, (row - 1) * colHeight + colHeight - h); //((row-1)*colHeight)
			pos.push({ left, top });
		});

		pos = pos.sort((a, b) => Math.random() > 0.5);


		anime.set(targets, {
			translateY: () => "-100vh",
			left: (el, i) => pos[i].left,
			top: (el, i) => pos[i].top,
			height: treeHeight
		});

		anime
			.timeline({
				targets,
				delay: (el, i) => i * 20,
				easing: "spring(0.4, 100, 10, 0)",
				loop: false,
			})
			.add({ translateY: 0 });
		setShowMenu(false);
		setPositions(pos);
		setPage(page);
	};

	const toMenu = async () => {
		if (showMenu) return toMapFromMenu();
		const menuTreeHeight = treeHeight / 2;
		const maxTreeWidth = trees.sort(
			(a, b) => a.ref.current.clientWidth < b.ref.current.clientWidth
		)[0].ref.current.clientWidth;

		await anime({
			targets: `.${styles.tree}`,
			left: (el, i) => (maxTreeWidth - el.clientWidth) / 2 + padding,
			height: menuTreeHeight,
			top: anime.stagger([padding, trees.length * (menuTreeHeight + padding)]),
			delay: (el, i) => i * 20,
			duration: 200,
			easing: "linear",
			loop: false,
			scale: 1,
		}).finished;

		setShowMenu(true);
	};
	const toMapFromMenu = async () => {
		
		if(!positions) return

		const menuTreeHeight = treeHeight / 2;
		anime({
			targets: `.${styles.tree}`,
			left: (el, i) => positions[i].left,
			top: (el, i) => positions[i].top,
			height: treeHeight,
			delay: (el, i) => i * 20,
			duration: 500,
			easing: "easeOutExpo",
			loop: false,
			scale: 1,
		});
	};

	const toEvent = async () => {
		
		const menuTreeHeight = treeHeight / 2;
		const targets = document.querySelectorAll("[id^='gasymbol-']")
		const endTarget = document.querySelector(`[id^='evsymbol-${event.id}']`)
		const bounds = endTarget.getBoundingClientRect()
		console.log(bounds)
		anime({
			targets,
			left: (el, i) => el.getAttribute('eventId') === event.id ? bounds.left : undefined,
			top: (el, i) => el.getAttribute('eventId') === event.id ? bounds.top : undefined,
			height: (el, i) =>  el.getAttribute('eventId') === event.id ? bounds.height: undefined,
			width: (el, i) => el.getAttribute('eventId') === event.id ? bounds.width: undefined,
			scale: (el, i) => el.getAttribute('eventId') === event.id ? 1 : 0,
			delay: (el, i) => i * 20,
			duration: 500,
			easing: "easeOutExpo",
			loop: false,
			
		});
	};
	const toProgram = async () => {
		
		const menuTreeHeight = treeHeight / 2;
		const targets = document.querySelectorAll("[id^='gasymbol-']")
		const endTargets = document.querySelectorAll("[id^='prsymbol-']")
		console.log(endTargets[0])
		console.log(targets)
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
		
		const menuTreeHeight = treeHeight / 2;
		const targets = document.querySelectorAll("[id^='gasymbol-']")
		const endTargets = []

		targets.forEach((el) =>{
			const t = document.querySelector(`[id='pasymbol-${el.getAttribute('participant')}']`)
			const b = t.getBoundingClientRect()
			endTargets.push({
				left:b.left,
				top:b.top + menuTreeHeight,
			})			
		})
		
		anime({
			targets,
			left: (el, i) => endTargets[i].left,
			top: (el, i) => endTargets[i].top,
			height: (el, i) =>  treeHeight,
			//width: (el, i) => endTargets[i].clientWidth,
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
		const targets = document.querySelectorAll(`.${styles.tree}`);
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

	useEffect(() => {
	
		if(view === 'program')
			toProgram()
		if(view === 'participants')
			toParticipants()
		if(view === 'garden')
			toMapFromMenu()
		if(view === 'event')
			toEvent()
		
		
	}, [view]);
	
	return (
		<>
			<div className={styles.container} style={{ minHeight: totalPages * 100 + "vh" }}>
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
					<button onClick={toMenu}>menu</button>
					<button onClick={() => setShowBounds(!showBounds)}>bounds</button>
				</div>
			</div>
			{trees.map((t, index) => (
				<Tree
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