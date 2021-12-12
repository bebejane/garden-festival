import styles from "./ContentHeader.module.scss"
import cn from "classnames";
import { Image as DatoImage } from 'react-datocms'

export default function ContentHeader({ children, responsiveImage }) {
	return (
		<header className={cn(styles.contentHeader, !responsiveImage && styles.bgColor)}>
			{responsiveImage && <DatoImage className={styles.bgImage} data={responsiveImage} />}
			{children}
		</header>
	);
}