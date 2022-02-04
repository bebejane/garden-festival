import styles from "./Image.module.scss"
import cn from "classnames";
import { Image as DatoImage } from 'react-datocms'
import { useEffect, useState } from "react";

export default function Image({ data, explicitWidth, lazyLoad, showCaption = true}) {
	if(!data) return null
	
	const { title, responsiveImage } = data;

	return (
		<figure className={styles.image}>
			<DatoImage 
				data={responsiveImage} 
				explicitWidth={explicitWidth} 
				lazyLoad={lazyLoad} 
				usePlaceholder={true} 
				blurupClassName={undefined}
			/>
			{showCaption && <caption className={styles.caption}>{title}</caption>}
		</figure>
	);
}
