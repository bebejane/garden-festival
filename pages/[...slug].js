import { withGlobalProps } from "lib/utils";
import { GetParticipants, GetEvents, GetEventBySlug, GetParticipantBySlug } from "/graphql";
import { apiQuery } from "lib/api";

import Home from "./index"
export default Home;

export const getStaticProps = withGlobalProps(async (data) => {
  const {
    context : { params : { slug }},
    revalidate
  } = data;
  
  const participantSlug = slug[0]
  const eventSlug = slug.length > 1 ? slug[1] : false
  const { participant } = await apiQuery(GetParticipantBySlug, {slug:participantSlug});
  const { event } = eventSlug ? await apiQuery(GetEventBySlug, {slug:eventSlug}) : {};

  if(!event && !participant) return { notFound: true } 

  return {
    props :{
      ...data.props,
      participant,
      event : event || null,
      view : event ? 'event' : 'participant',
      defaultEvent : event || null
    },
    revalidate
  };
});

export async function getStaticPaths() {

  const { participants } = await apiQuery(GetParticipants);
  const { events } = await apiQuery(GetEvents);
  const paths = [];

  participants.forEach((participant) => {
    const participantEvents = events.filter((ev)=> ev.participant?.id === participant.id)
    paths.push({ params: { slug: [participant.slug] }})
    participantEvents.forEach((ev) => paths.push({ params: { slug: [`${participant.slug}`, `${ev.slug}`]}}))
  });  
  
	return {
		paths:paths,
		fallback: true,
	};
}