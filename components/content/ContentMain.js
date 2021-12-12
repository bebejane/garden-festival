import styles from "./ContentMain.module.scss"

export default function ContentHeader({ children }) {
	return (
		<div className={styles.contentMain}>
			{children}
		</div>
	);
}