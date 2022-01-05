import { FESTIVAL_START_DATE, FESTIVAL_END_DATE } from "/lib/utils/constant";
import { withGlobalProps } from "lib/utils";
import { eachDayOfInterval, format } from "date-fns";

import Home from "./index";
export default Home;

export const getStaticProps = withGlobalProps(async ({ props, context, revalidate }) => {
	const { events } = props;
	const {
		params: { weekday },
	} = context;

	return {
		props: {
			...props,
			weekday: weekday[0].toLowerCase(),
			dayEvents: events.filter(
				(ev) => format(new Date(ev.startTime), "EEEE").toLowerCase() === weekday[0].toLowerCase()
			),
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
