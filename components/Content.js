import styles from "./Content.module.scss"
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import Footer from "./Footer";

export default function Content({show, children, setShow, setView, popup = false, abouts}) {
	const router = useRouter()
	return (
		<>
			<div className={cn(styles.contentWrap, show && styles.show)}>
				<div className={cn(styles.content, popup && styles.popup)}>
					{children}
					{popup && <div className={styles.close} onClick={router.back}>×</div>}
				</div>
				<Footer abouts={abouts}/>	
			</div>	
		</>
	);
}