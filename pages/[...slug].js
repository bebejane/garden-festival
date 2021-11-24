import { withGlobalProps } from "lib/utils";
import { GetEvents, GetEvent, GetEventBySlug, GetParticipants, GetParticipantBySlug } from "/graphql";
import { apiQuery } from "lib/api";

import Menu from "/components/Menu"
import Garden from "/components/Garden"
import Content from "components/Content";

export default function Participant({participant, event}) {
  
	return (
    <>
      <Menu/>
      <Content show={true}>
        <div>
          <h3>{participant.title}</h3>
          {event && <p>{event.title}</p>}
        </div>
      </Content>
      <Garden/>
    </>
  )
}

export const getStaticProps = withGlobalProps({ query: GetParticipants, model: "participant" }, async (data) => {
  const {
    context,
    revalidate
  } = data;

  const { slug } = context.params
  const { participant } = await apiQuery(GetParticipantBySlug, {slug:slug[0]});
  const { event } = slug.length > 1 ? await apiQuery(GetEventBySlug, {slug:slug[1]}) : {};
  const props = {
    participant
  }
  if(event) props.event = event;
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
    paths.push({ params: { slug: [participant.slug]}})
    participantEvents.forEach((ev) => {
      paths.push({ params: { slug: [`${participant.slug}`, `${ev.slug}`]}})
    })
  });  
  
	return {
		paths:paths,
		fallback: false,
	};
}