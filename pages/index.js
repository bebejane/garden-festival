import styles from '/styles/Home.module.scss'
import { useEffect, useState } from "react";
import { withGlobalProps } from "lib/utils";

import Menu from "/components/Menu"
import Garden from "/components/Garden"
import Background from "/components/Background"
import Content from "/components/Content";
import Program from "/components/Program";
import Participants from "/components/Participants";
import Participant from "/components/Participant";
import Event from "/components/Event";

export default function Home({events, participants, participant, abouts, event, defaultView = 'garden'}) {

  const [view, setView] = useState()
  const [selectedDate, setSelectedDate] = useState()
  const [selectedTimezone, setSelectedTimezone] = useState()
  
  useEffect(()=> setView(defaultView), [defaultView])
  
	return (
    <div className={styles.container}>
      <Menu view={view} setView={setView} showProgram={view === 'program'}/>      
      <Content show={view !== 'garden'} setView={setView} popup={['event', 'participant'].includes(view)} abouts={abouts}>
        <Program events={events} show={view === 'program'}/>
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