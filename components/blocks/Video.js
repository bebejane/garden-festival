import styles from "./Video.module.scss"
import cn from "classnames";

export default function Video({provider, providerUid, title, url, width, height, thumbnailUrl}) {
	
	return (
		<div className={styles.video}>
			<iframe 
				id="ytplayer" 
				type="text/html" 
				width="100%" 
				height="360"
  			src={`https://www.youtube.com/embed/${providerUid}?autoplay=0&origin=http://example.com`}
  			frameborder="0"></iframe>
 		</div>
	);	
}