import { FESTIVAL_START_DATE, FESTIVAL_END_DATE } from "/lib/utils/constant";
import { withGlobalProps } from "lib/utils";
import { eachDayOfInterval, format, isBefore, isAfter } from "date-fns";

import Home from "./index";
export default Home;

const getDayEvents = (weekday) => {

	
}


export const getStaticProps = withGlobalProps(async ({ props, context, revalidate }) => {
	const { events } = props;
	const { params: { weekday }} = context;
	
	const dayEvents = events.filter((ev) => {
		const d = new Date(ev.startTime);
		return d.toLocaleDateString('en-EN', { weekday: 'long' }).toLowerCase() === weekday[0].toLowerCase() 
		&& isAfter(d, FESTIVAL_START_DATE) 
		&& isBefore(d, FESTIVAL_END_DATE)
	})

	return {
		props: {
			...props,
			weekday: weekday[0].toLowerCase(),
			dayEvents,
			view: "weekday",
		},
		revalidate,
	};
});

export async function getStaticPaths() {
	const paths = [];

	eachDayOfInterval({ start: FESTIVAL_START_DATE, end: FESTIVAL_END_DATE }).map((date, idx) => {
		paths.push({ params: { weekday: [format(date, "EEEE").toLocaleLowerCase()] } });
	});

	return {
		paths: paths,
		fallback: true,
	};
}
