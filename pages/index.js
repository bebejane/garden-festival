import styles from '/styles/Home.module.scss'
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

export default function Home({events, participants, abouts, defaultEvent, defaultView = 'garden'}) {
  
  const [event, setEvent] = useState()
  const [view, setView] = useState()
  
  useEffect(()=> setEvent(defaultEvent), [defaultEvent])
  useEffect(()=> setView(defaultView), [defaultView])
  
	return (
    <div className={styles.container}>
      <Menu view={view} setView={setView}/>      
      <Content show={view !== 'garden'} setView={setView} popup={view === 'event'} abouts={abouts}>
        <Program events={events} show={view === 'program'}/>
        <Participants participants={participants} show={view === 'participants'}/>
        <Event event={event} show={view === 'event'} placeholder={defaultEvent && false}/>
      </Content>
      <Garden 
        setEvent={setEvent} 
        event={event} 
        events={events} 
        view={view}
      />
    </div>
  )
}

export const getStaticProps = withGlobalProps({ queries: [GetEvents, GetAbouts, GetParticipants] }, async (data) => {
  const {
    props :{
      events,
      participants,
      abouts
    },
    revalidate
  } = data;

  return {
    props:{
      abouts,
      participants,
      events
    },
    revalidate,
  };
});