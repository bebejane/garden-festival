import { withGlobalProps } from "lib/utils";
import { GetEvents, GetEvent, GetParticipants, GetAbouts } from "/graphql";
import { apiQuery } from "/lib/api";

import Menu from "/components/Menu"
import Garden from "/components/Garden"
import Content from "/components/Content";
import Program from "/components/Program";

export default function ProgramPage({events, participants}) {
  events = events.map((ev) => {
    return {
      ...ev,
      participant: participants.filter( p => ev.participant?.id === p.id)[0]
    }
  })
	return (
    <>
      <Menu/>
      <Content show={true}>
        <Program events={events} participants={participants}/>
      </Content>
      <Garden events={events}/>
    </>
  )
}

export const getStaticProps = withGlobalProps({ query: GetParticipants, model: "participants" }, async (data) => {
  const {
    props,
    revalidate
  } = data;

  const { abouts } = await apiQuery(GetAbouts);
  const { participants } = await apiQuery(GetParticipants);
  const { events } = await apiQuery(GetEvents);
  
  return {
    props:{
      abouts,
      participants,
      events
    },
    revalidate,
  };
});