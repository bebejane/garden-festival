import styles from "./Image.module.scss"
import cn from "classnames";
import { Image as DatoImage } from 'react-datocms'

export default function Image({ data, explicitWidth }) {
	const { title, responsiveImage } = data;
	return (
		<figure className={styles.image}>
			<DatoImage data={responsiveImage} explicitWidth={explicitWidth} />
			<caption className={styles.caption}>{title}</caption>
		</figure>
	);
}
