import styles from "./Video.module.scss"
import cn from "classnames";

export default function Video({externalUrl}) {
	return (
		<div className={styles.video}>
			{externalUrl}
 		</div>
	);
}