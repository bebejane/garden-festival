import styles from "./ImageGallery.module.scss"
import cn from "classnames";
import Image from "./Image";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export default function ImageGallery({images}) {
	
	return (
		<div className={styles.imageGallery}>
			<Carousel
				showThumbs={true}
				showStatus={false}
				dynamicHeight={false}
				renderThumbs={(children) => images.map((image, index)=>
					<div className={styles.thumbWrap} key={index}>
						<img src={`${image.url}?h=50`} />
					</div>
				)}
				renderIndicator={(onClick, selected, index)=>{
					console.log(index)
					return (
						<span 
							key={index}
							className={cn(styles.indicator, selected && styles.selected)} 
							onClick={onClick}>
						</span>
					)
				}}
			>
				{images.map((image, i)=>
					<Image key={i} data={image.responsiveImage}/>
				)}
			</Carousel>
 		</div>
	);
}