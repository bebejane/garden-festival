import styles from "./ContentHeader.module.scss"
import cn from "classnames";
import { Image as DatoImage } from 'react-datocms'

export default function ContentHeader({ children, responsiveImage, black, color }) {
	return (
		<div className={cn(styles.contentHeader, !responsiveImage && styles.bgColor, black && styles.black, color && color)}>
			{responsiveImage && <DatoImage className={styles.bgImage} data={responsiveImage} />}
			{children}
		</div>
	);
}