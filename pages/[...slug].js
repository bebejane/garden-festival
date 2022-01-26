import { withGlobalProps } from "lib/utils";
import { GetParticipants, GetEvents, GetEventBySlug, GetParticipantBySlug } from "/graphql";
import { apiQuery } from "lib/api";
import { transformEventWithTiming } from '/lib/utils'

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
  let { event } = eventSlug ? await apiQuery(GetEventBySlug, {slug:eventSlug}) : {};
  event = transformEventWithTiming(event);
  
  if(!event && !participant) 
    return { notFound: true } 
  else if(event && event.inactive && !process.env.NEXT_PUBLIC_EDITOR_MODE) 
    return { notFound: true } 

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