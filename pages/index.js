import styles from '/styles/Home.module.scss'
import { useEffect, useState } from "react";
import { withGlobalProps } from "lib/utils";

import Menu from "/components/Menu"
import Garden from "/components/Garden"
import Content from "/components/Content";
import Program from "/components/Program";
import Participants from "/components/Participants";
import Event from "/components/Event";

export default function Home({events, participants, abouts, event, defaultView = 'garden'}) {
  const [view, setView] = useState()
  
  useEffect(()=> setView(defaultView), [defaultView])
  
	return (
    <div className={styles.container}>
      <Menu view={view} setView={setView}/>      
      <Content show={view !== 'garden'} setView={setView} popup={view === 'event'} abouts={abouts}>
        <Program events={events} show={view === 'program'}/>
        <Participants participants={participants} show={view === 'participants'}/>
        <Event event={event} show={view === 'event'}/>
      </Content>
      <Garden 
        event={event} 
        events={events} 
        view={view}
        defaultView={defaultView}
      />
      
    </div>
  )
}

export const getStaticProps = withGlobalProps(async ({props, revalidate}) => {
  return {
    props,
    revalidate,
  };
});