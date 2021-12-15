import styles from "./ContentMain.module.scss";
import cn from "classnames";

export default function ContentHeader({ children, black }) {
	return (
		<div className={cn(styles.contentMain, black && styles.black)}>
			{children}
		</div>
	);
}