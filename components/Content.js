import styles from "./Content.module.scss"
import cn from "classnames";
import { useRouter } from "next/router";
import { useState, useEffect, useLayoutEffect } from 'react'
import { useRouterHistory } from 'lib/hooks';

const useIsomorphicLayoutEffect = process.browser ? useLayoutEffect : useEffect

export default function Content({ view, show, children, popup = false, abouts }) {

	const router = useRouter()
	const history = useRouterHistory()
	const [slideUp, setSlideUp] = useState()
	const isDirectLink = process.browser && window.history.state.idx === 0;

	const handleKeyDown = (e) => e.key === 'Escape' && !isDirectLink && router.back()
	const handleClose = () => {
		if (view !== 'about') return router.back()

		let count = 0;
		for (let i = history.length - 1; i >= 0; i--, count++) {
			if (!history[i].startsWith('/about'))
				break
		}

		global.history.go(-count)
	}

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	})

	useIsomorphicLayoutEffect(() => {
		setTimeout(() => setSlideUp(popup), 50)
		return () => { }
	}, [popup])

	return (
		<main className={cn(styles.contentWrap, show && styles.show)}>
			{!popup ?
				<div className={cn(styles.content, show && !popup && styles.show)}>
					{children}
				</div>
			:
				<div className={cn(styles.contentPopup, slideUp && styles.slideUp, isDirectLink && styles.direct)}>
					{children}
					{!isDirectLink && <div className={cn(styles.close, view === 'about' && styles.invert)} onClick={handleClose}>×</div>}
				</div>
			}
		</main>
	);
}