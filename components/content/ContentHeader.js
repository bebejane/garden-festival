import styles from "./ContentHeader.module.scss"
import cn from "classnames";
import { Image as DatoImage } from 'react-datocms'

export default function ContentHeader({ children, responsiveImage, black }) {
	return (
		<div className={cn(styles.contentHeader, !responsiveImage && styles.bgColor, black && styles.black)}>
			{responsiveImage && <DatoImage className={styles.bgImage} data={responsiveImage} />}
			{children}
		</div>
	);
}