import { withGlobalProps } from "lib/utils";
import { GetEvents, GetEvent, GetEventBySlug, GetParticipants, GetParticipantBySlug } from "/graphql";
import { apiQuery } from "lib/api";

import Home from "./index"
import Menu from "/components/Menu"
import Garden from "/components/Garden"
import Content from "components/Content";
import Event from "components/Event";

/*
export default function Participant({participant, event, show}) {
  
	return (
    <>
      <Menu/>
      <Content show={true}>
        <Event show={true} event={event}/>
      </Content>
      <Garden/>
    </>
  )
}
*/
export default Home;

export const getStaticProps = withGlobalProps({ queries: [GetParticipants, GetEvents] }, async (data) => {
  
  const {
    props:{
      participants, 
      events
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