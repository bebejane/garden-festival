import { FESTIVAL_START_DATE, FESTIVAL_END_DATE } from "/lib/utils/constant";
import { withGlobalProps } from "lib/utils";
import { eachDayOfInterval, format, isBefore, isAfter, isEqual } from "date-fns";
import { toDate, utcToZonedTime } from "date-fns-tz";
import { timeZones } from "/lib/utils/constant"

import Home from "./index";
export default Home;

const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export const getStaticProps = withGlobalProps(async ({ props, context, revalidate }) => {
	const { events } = props;
	const { params: { path }} = context;

	if(path?.length !== 2 ) return {notFound:true}

	const weekday = path[0].toLowerCase()
	const timeZoneCode = path[1]
	const tz = timeZones.filter( t => t.label.toLowerCase() === timeZoneCode.toLowerCase())[0]
	
	if(!tz) return {notFound:true}

	const dayEvents = events.filter((ev) => {	
		if(weekday === 'pre-party')
			return isBefore(utcToZonedTime(toDate(ev.startTime), 'Europe/Stockholm'), FESTIVAL_START_DATE)
		if(weekday === 'after-party')
			return isAfter(utcToZonedTime(toDate(ev.startTime), 'Europe/Stockholm'), FESTIVAL_END_DATE)

		const d = utcToZonedTime(toDate(ev.startTime), tz.timeZone)
		return d.toLocaleDateString('en-EN', { weekday: 'long' }).toLowerCase() === weekday 
		&& !isAfter(utcToZonedTime(toDate(ev.startTime), 'Europe/Stockholm'), FESTIVAL_END_DATE)
		&& !isBefore(utcToZonedTime(toDate(ev.startTime), 'Europe/Stockholm'), FESTIVAL_START_DATE)
	})
	
	return {
		props: {
			...props,
			weekday,
			dayEvents,
			view: "weekday",
		},
		revalidate,
	};
});

export async function getStaticPaths() {
	const paths = [];
	weekdays.concat(['pre-party', 'after-party']).map((weekday)=>{
		timeZones.forEach(({label})=>{
			paths.push({ params: { path: [weekday, label.toLowerCase()] } });
		})
	})
	return {
		paths: paths,
		fallback: 'blocking',
	};
}
