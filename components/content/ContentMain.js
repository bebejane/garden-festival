import styles from "./ContentMain.module.scss";
import cn from "classnames";

export default function ContentHeader({ children, black, color }) {
	return (
		<div className={cn(styles.contentMain, black && styles.black, color && color)}>
			{children}
		</div>
	);
}