import styles from "./Content.module.scss"
import cn from "classnames";
import Link from "next/link";
import { useRouter} from "next/router";
import {useState, useEffect, useLayoutEffect } from 'react'

import Footer from "./Footer";

export default function Content({show, children, setShow, setAbout, setView, popup = false, abouts}) {
	const router = useRouter()
	const [slideUp, setSlideUp] = useState(false)

	useLayoutEffect(() => {
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
				<div className={cn(styles.contentPopup, slideUp && styles.show)}>
					{children}
					<div className={styles.close} onClick={router.back}>×</div>
				</div>
			}
			<Footer abouts={abouts}/>
		</main>	
	);
}