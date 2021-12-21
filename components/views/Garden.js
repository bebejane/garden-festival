import styles from "./Garden.module.scss"
import Symbol from "../Symbol";
import cn from "classnames";
const isDev = process.env.NODE_ENV === 'development'

export default function Garden({ events, participant, view, symbolSize, bounds }) {

	return (
		<>
			<div className={styles.container}>
				<div className={cn(styles.header, view !== 'garden' && styles.hidden)}>
					<h1>Community</h1>
					<h2>12 - 17 Feb 2020</h2>
					<h1>Garden</h1>
					<h2>By the SeedBox</h2>
					<h1>Festival</h1>
				</div>
			</div>
			{events && events.map((event, index) =>
				<Symbol
					key={index}
					index={index}
					event={event}
					symbolSize={symbolSize}
				/>
			)}
			{view === 'garden_' && isDev && <div className={styles.bounds} style={bounds}></div>}
		</>
	);
}


