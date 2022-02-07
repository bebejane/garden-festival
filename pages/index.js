import styles from '/styles/Home.module.scss'

import Menu from "/components/Menu"
import Garden from "/components/views/Garden"
import Community from "/components/views/Community";
import Participant from "/components/views/Participant";
import Event from "/components/views/Event";
import Festival from "/components/views/Festival";
import About from "/components/views/About";
import Background from "/components/Background"
import Content from "/components/Content";
import Footer from "/components/Footer";

import { useEffect, useState, } from "react";
import { useWindowSize } from "rooks";
import { withGlobalProps } from "/lib/utils";
import { useIntervalWhen } from 'rooks';
import { transformEventWithTiming } from '/lib/utils'

const Home = (props) => {
	const {
		participants,
		participant,
		event,
		events,
		dayEvents,
		weekday,
		abouts,
		about,
		view = 'garden'	
	} = props;
	
	const [ evts, setEvents] = useState(events);
	const [ symbolSize, setSymbolSize] = useState(0);
	const { innerWidth, innerHeight } = useWindowSize();

	useEffect(() => {
		const size = innerWidth > 768 ? innerWidth/6 : innerWidth/4;
		const symbolSize = Math.floor(size/20)*20;
		setSymbolSize(symbolSize)
	}, [innerWidth])
	
	useIntervalWhen(() => setEvents(evts.map(transformEventWithTiming)),10*1000, true, false); // Update active state of events client side

	return (
		<div className={styles.container}>
			<Menu
				view={view}
				weekday={weekday}
			/>
			<Content
				show={view !== 'garden'}
				view={view}
				popup={['event', 'participant', 'about'].includes(view)}
			>
				<Festival
					show={view === 'festival' || view === 'weekday'}
					events={evts}
					dayEvents={dayEvents}
					weekday={weekday}
					symbolSize={symbolSize}
				/>
				<Community participants={participants} symbolSize={symbolSize} events={evts} show={view === 'community'} />
				<Participant participant={participant} symbolSize={symbolSize} events={evts} show={view === 'participant'} />
				<Event event={event} events={evts} symbolSize={symbolSize} show={view === 'event'} />
				<About about={about} abouts={abouts} show={view === 'about'}/>
			</Content>
			<Garden
				participant={participant}
				participants={participants}
				event={event}
				events={evts}
				view={view}
				symbolSize={symbolSize}
			/>
			<Background view={view} />
			<Footer event={event} view={view} />
		</div>
	)
}

export default Home;

export const getStaticProps = withGlobalProps(async ({ props, revalidate }) => {
	
	return {
		props,
		revalidate,
	};
});