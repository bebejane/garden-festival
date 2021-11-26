import styles from "./Content.module.scss"
import cn from "classnames";
import Link from "next/link";
import Footer from "./Footer";

export default function Content({show, children, setShow, setView, popup = false}) {

	return (
		<>
			<div className={cn(styles.contentWrap, show && styles.show)}>
				<div className={cn(styles.content, popup && styles.popup)}>
					{children}
					<Link href={'/'}><div className={styles.close}>×</div></Link>
				</div>
				<Footer/>	
			</div>
			
		</>
	);
}