import styles from "./ImageGallery.module.scss"
import cn from "classnames";
import Image from "./Image";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export default function ImageGallery({images}) {
	
	return (
		<div className={styles.imageGallery}>
			<Carousel
				showThumbs={true}
				showStatus={false}
			>
				{images.map((image)=>
					<Image  data={image.responsiveImage}/>
				)}
			</Carousel>
 		</div>
	);
}