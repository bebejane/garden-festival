import styles from "./Content.module.scss"
import Footer from "./Footer";
import cn from "classnames";
import { useRouter} from "next/router";
import { useState, useEffect, useLayoutEffect } from 'react'

const useIsomorphicLayoutEffect = process.browser ? useLayoutEffect : useEffect

export default function Content({show, children, setShow, setAbout, setView, popup = false, abouts}) {
	const router = useRouter()
	const [slideUp, setSlideUp] = useState()
	const [isDirectLink, setIsDirectLink] = useState(false)

	useIsomorphicLayoutEffect(() => {
		setTimeout(()=>setSlideUp(popup), 100)
		return () => {}
	}, [popup])
	
	return (
		<main className={cn(styles.contentWrap, show && styles.show)}>
			{!popup ?
				<div className={cn(styles.content, show && !popup && styles.show)}>
					{children}
				</div>
			:
				<div className={cn(styles.contentPopup, slideUp && styles.show)} style={isDirectLink ? {transitionDuration:'0s'} : {}}>
					{children}
					<div className={styles.close} onClick={router.back}>×</div>
				</div>
			}
			<Footer abouts={abouts}/>
		</main>	
	);
}