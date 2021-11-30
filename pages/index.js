import styles from '/styles/Home.module.scss'
import { useEffect, useState } from "react";
import { withGlobalProps } from "/lib/utils";

import Menu from "/components/Menu"
import Garden from "/components/views/Garden"
import Participants from "/components/views/Participants";
import Participant from "/components/views/Participant";
import Event from "/components/views/Event";
import Program from "/components/views/Program";

import Background from "/components/Background"
import Content from "/components/Content";

export default function Home({events, participants, participant, abouts, event, dayEvents, weekday, defaultView = 'garden'}) {
  
  const [view, setView] = useState()
  
  useEffect(()=> setView(defaultView), [defaultView])
  
	return (
    <div className={styles.container}>
      <Menu view={view} setView={setView} weekday={weekday}/>      
      <Content show={view !== 'garden'} setView={setView} popup={['event', 'participant'].includes(view)} abouts={abouts}>
        <Program events={events} dayEvents={dayEvents} weekday={weekday} show={view === 'program' || view === 'weekday'}/>
        <Participants participants={participants} show={view === 'participants'}/>
        <Participant participant={participant} events={events} show={view === 'participant'}/>
        <Event event={event} show={view === 'event'}/>
      </Content>
      <Garden 
        event={event} 
        participant={participant} 
        participants={participants} 
        events={events} 
        view={view}
        defaultView={defaultView}
      />
      <Background view={view} />
    </div>
  )
}

export const getStaticProps = withGlobalProps(async ({props, revalidate}) => {
  return {
    props,
    revalidate,
  };
});