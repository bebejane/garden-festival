import styles from "./Video.module.scss"
import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import {useWindowSize} from "rooks"

export default function Video({provider, providerUid, title, url, thumbnailUrl}) {
	const ref = useRef()
	const [height, setHeight] = useState(360);
	const {innerWidth} = useWindowSize()
	
	useEffect(()=>setHeight((ref.current?.clientWidth/16)*9), [innerWidth]) // Set to 16:9
	
	return (
		provider === 'youtube' ?
			<iframe 
				ref={ref}
				id="ytplayer" 
				type="text/html" 
				width="100%" 
				height={height}
				allow="autoplay; fullscreen; picture-in-picture" 
				src={`https://www.youtube.com/embed/${providerUid}?autoplay=0&origin=http://example.com`}
				frameborder="0"
			/>
		: provider === 'vimeo' ?  
			<iframe 
				ref={ref}
				type="text/html" 
				src={`https://player.vimeo.com/video/${providerUid}`} 
				width="100%" 
				height={height}
				frameborder="0" 
				allow="autoplay; fullscreen; picture-in-picture" 
				allowfullscreen 
			/>
		:
			<span>Video {provider} not supported!</span>
	);	
}