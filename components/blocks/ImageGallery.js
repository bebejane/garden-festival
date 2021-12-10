import styles from "./ImageGallery.module.scss"
import cn from "classnames";
import Image from "./Image";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { useState } from "react";

export default function ImageGallery({ images }) {

	const [index, setIndex] = useState(0)

	return (
		<section className={styles.imageGallery}>
			<Carousel
				showThumbs={false}
				showStatus={false}
				dynamicHeight={false}
				onChange={(i) => setIndex(i)}
				renderThumbs={(children) => images.map((image, index) =>
					<div className={styles.thumbWrap} key={index}>
						<img src={`${image.url}?h=50`} />
					</div>
				)}
				renderIndicator={(onClick, selected, index) =>
					<span
						key={index}
						className={cn(styles.indicator, selected && styles.selected)}
						onClick={onClick}>
					</span>
				}
			>
				{images.map((image, i) =>
					<Image key={i} data={image} showCaption={false} />
				)}
			</Carousel>
			<div className={styles.captions}>
				{images.map((image, i) =>
					<caption className={i === index && styles.show}>{image.title}</caption>
				)}
			</div>
		</section>
	);
}