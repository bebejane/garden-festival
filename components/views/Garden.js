import styles from "./Garden.module.scss"
import Symbol from "../Symbol";
import cn from "classnames";

export default function Garden({events, event, participant, view, symbolSize, bounds}) {

	return (
		<>
			<div className={styles.container}>
				<div className={cn(styles.header, view !== 'garden' && styles.hidden)}>
					<img src={'/images/The Community Garden Festival.png'}/>
				</div>
			</div>
			{view === 'garden' && <div className={styles.bounds} style={bounds}></div>}
			{events && events.map((event, index) => <Symbol event={event} symbolSize={symbolSize}/>)}
		</>
	);
}

