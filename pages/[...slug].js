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
  
  const queries = [GetParticipantBySlug]
  const params = [{slug:participantSlug}]
  
  if(eventSlug){
    queries.push(GetEventBySlug)
    params.push({slug:eventSlug})
  }

  let { participant, event } = await apiQuery(queries, params);
  event = event ? transformEventWithTiming(event) : null
  
  if(!event && !participant) 
    return { notFound: true, revalidate:10} 
  // else if(event && event.inactive && !process.env.NEXT_PUBLIC_EDITOR_MODE) return { notFound: true, revalidate:10} 

  return {
    props :{
      ...data.props,
      participant,
      event,
      view : event ? 'event' : 'participant',
      defaultEvent : event || null
    },
    revalidate
  };
});

export async function _getStaticPaths() {
  const { participants, events } = await apiQuery([GetParticipants,GetEvents]);
  const paths = [];

  participants.forEach((participant) => {
    const participantEvents = events.filter((ev)=> ev.participant?.id === participant.id)
    paths.push({ params: { slug: [participant.slug] }})
    participantEvents.forEach((ev) => paths.push({ params: { slug: [`${participant.slug}`, `${ev.slug}`]}}))
  });  
  
	return {
		paths:paths,
		fallback: 'blocking',
	};
}