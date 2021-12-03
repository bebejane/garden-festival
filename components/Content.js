import styles from "./Content.module.scss"
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import Footer from "./Footer";

export default function Content({show, children, setShow, setAbout, setView, popup = false, abouts}) {
	const router = useRouter()
	return (
		<main className={cn(styles.contentWrap, show && styles.show)}>
			<div className={cn(!popup ? styles.content : styles.contentPopup, show && styles.show)}>
				{children}
				{popup && <div className={styles.close} onClick={router.back}>×</div>}
			</div>
			<Footer abouts={abouts}/>
		</main>	
	);
}