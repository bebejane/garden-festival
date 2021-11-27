import styles from "./Video.module.scss"
import cn from "classnames";
import { useEffect, useRef, useState } from "react";

export default function Video({provider, providerUid, title, url, thumbnailUrl}) {
	const ref = useRef()
	const [height, setHeight] = useState(360);
	useEffect(()=>setHeight((ref.current?.clientWidth/16)*9), [])
	
	return (
		<iframe 
			ref={ref}
			id="ytplayer" 
			type="text/html" 
			width="100%" 
			height={height}
			src={`https://www.youtube.com/embed/${providerUid}?autoplay=0&origin=http://example.com`}
			frameborder="0"
		/>
	);	
}