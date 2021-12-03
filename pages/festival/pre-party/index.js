import { FESTIVAL_START_DATE, FESTIVAL_END_DATE } from "/lib/utils/constant";
import { withGlobalProps } from "lib/utils";

import Home from "../../index";
export default Home;

export const getStaticProps = withGlobalProps(async ({ props, context, revalidate }) => {
	const { events } = props;
	
	return {
		props: {
			...props,
			weekday: 'pre-party',
			dayEvents: events.filter((ev) => new Date(ev.startTime) < FESTIVAL_START_DATE),
			defaultView: "weekday",
		},
		revalidate,
	};
});