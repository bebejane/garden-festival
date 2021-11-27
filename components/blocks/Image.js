import styles from "./Image.module.scss"
import cn from "classnames";
import { Image as DatoImage} from 'react-datocms'

export default function Image({data, explicitWidth}) {
	return (
		<DatoImage data={data} explicitWidth={explicitWidth}/>
	);
}