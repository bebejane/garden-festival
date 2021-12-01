import styles from "./Garden.module.scss"
import Symbol from "../Symbol";
import cn from "classnames";
const isDev = process.env.NODE_ENV === 'development'

export default function Garden({events, participant, view, symbolSize, bounds}) {
	
	return (
		<>
			<div className={styles.container}>
				<div className={cn(styles.header, view !== 'garden' && styles.hidden)}>
					<img src={'/images/The Community Garden Festival.png'}/>
				</div>
			</div>
			{events && events.map((event, index) => 
				<Symbol 
					index={index} 
					event={event} 
					symbolSize={symbolSize}
				/>
			)}
			{view === 'garden' && isDev  && <div className={styles.bounds} style={bounds}></div>}
		</>
	);
}


