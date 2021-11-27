import { withGlobalProps } from "lib/utils";
import { GetEvents, GetEvent, GetAbouts, GetEventBySlug, GetParticipants, GetParticipantBySlug } from "/graphql";
import { apiQuery } from "lib/api";

import Home from "./index"

export default Home;

export const getStaticProps = withGlobalProps({ queries: [GetParticipants, GetEvents, GetAbouts] }, async (data) => {
  
  const {
    props:{
      participants, 
      events,
      abouts
    },
    context : {
      params :{
        slug
      }
    },
    revalidate
  } = data;
  
  const participantSlug = slug[0]
  const eventSlug = slug.length > 1 ? slug[1] : false
  const { participant } = await apiQuery(GetParticipantBySlug, {slug:participantSlug});
  const { event } = eventSlug ? await apiQuery(GetEventBySlug, {slug:eventSlug}) : {};
  
  const props = {
    participant,
    events,
    participants,
    abouts,
    defaultView : event ? 'event' : 'participants'
  }
  if(event) 
    props.defaultEvent = {...event, participant};

  return {
    props,
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