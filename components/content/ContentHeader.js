import styles from "./ContentHeader.module.scss"
import cn from "classnames";


export default function ContentHeader({ children }) {
	return (
		<header className={styles.contentHeader}>
			{children}
		</header>
	);
}