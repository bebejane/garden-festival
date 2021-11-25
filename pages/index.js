import { useEffect, useState } from "react";
import { withGlobalProps } from "lib/utils";
import { GetEvents, GetEvent, GetParticipants, GetAbouts } from "/graphql";
import { apiQuery } from "/lib/api";

import Menu from "/components/Menu"
import Garden from "/components/Garden"
import Content from "/components/Content";
import Program from "/components/Program";
import Participants from "/components/Participants";
import Event from "/components/Event";

export default function Home({events, participants, abouts}) {
  
  const [event, setEvent] = useState()
  const [view, setView] = useState('garden')
  
  events = events.map((ev) => {
    return {
      ...ev,
      participant: participants.filter( p => ev.participant?.id === p.id)[0]
    }
  })
  useEffect(()=> setView(event ? 'event' : 'garden'), [event])
	return (
    <>
      <Menu view={view} setView={setView}/>      
      <Content show={view !== 'garden'} setView={setView}>
        <Program events={events} show={view === 'program'}/>
        <Participants participants={participants} show={view === 'participants'}/>
        <Event event={event} show={event !== undefined && view === 'event'}/>
      </Content>
      <Garden 
        setEvent={setEvent} 
        event={event} 
        events={events} 
        view={view}
      />
    </>
  )
}

export const getStaticProps = withGlobalProps({ query: GetEvents, model: "event" }, async (data) => {
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