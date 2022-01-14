import styles from "./ContentHeader.module.scss"
import cn from "classnames";
import { Image as DatoImage } from 'react-datocms'

export default function ContentHeader({ children, responsiveImage, black, color, type }) {
	return (
		<div className={cn(styles.contentHeader, !responsiveImage && styles.bgColor, black && styles.black, color && styles[color], type && styles[type])}>
			{responsiveImage && <DatoImage className={styles.bgImage} data={responsiveImage} />}
			{children}
		</div>
	);
}