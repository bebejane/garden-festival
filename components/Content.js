import styles from "./Content.module.scss"
import cn from "classnames";
import Link from "next/link";


export default function Content({show, children, setShow, setView, popup = false}) {

	return (
		<>
			<div className={cn(styles.contentWrap, popup && styles.popup, show && styles.show)}>
				<div className={styles.content}>
					{children}
					<Link href={'/'}><div className={styles.close}>×</div></Link>
				</div>
				<div className={styles.footer}>
					Footer
				</div>
			</div>
		</>
	);
}