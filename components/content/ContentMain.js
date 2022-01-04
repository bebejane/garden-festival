import styles from "./ContentMain.module.scss";
import cn from "classnames";

export default function ContentMain({ children, black, color }) {
	return (
		<div className={cn(styles.contentMain, black && styles.black, color && styles[color])}>
			{children}
		</div>
	);
}