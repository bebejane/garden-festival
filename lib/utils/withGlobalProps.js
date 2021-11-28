import { FESTIVAL_START_DATE, FESTIVAL_END_DATE } from "./constant";
import { apiQuery, SEOQuery } from "/lib/api";
import { GetEvents, GetEvent, GetParticipants, GetAbouts } from "/graphql";
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);



export default function withGlobalProps(opt = {}, getStaticProps){
  
  getStaticProps = typeof opt === 'function' ? opt : getStaticProps;

  return async (context) => {
    const queries = [GetEvents, GetParticipants, GetAbouts]
    const revalidate = parseInt(process.env.REVALIDATE_TIME)
    
    if(opt.query)
      queries.push(opt.query)
    if(opt.queries)
      queries.push.apply(queries, opt.queries)
    
    //if(opt.model) queries.push(SEOQuery(opt.model))

    const props = await apiQuery(queries, {}, context.preview);
    const events = props.events;
    //const events = mockEvents([...props.events]);
    
    
    
    
    if(getStaticProps)
      return await getStaticProps({context, props: {...props, events}, revalidate});
    else
      return { props:{...props, events}, context, revalidate};
  }
}

const mockEvents = (events) => {
  let maxId = parseInt(events.sort((a, b)=> parseInt(a.id) > parseInt(b.id))[0].id);
  const evts = [...events]
  for (let index = 0; index < 30; index++) {
    const fakes = evts.map((ev)=>{
      const startTime = new Date(FESTIVAL_START_DATE)
      startTime.setDate(randomInt(FESTIVAL_START_DATE.getDate(),FESTIVAL_END_DATE.getDate()))
      startTime.setHours(randomInt(8, 20))
      startTime.setMinutes(randomInt(0, 59))
      ev.startTime = startTime.toISOString()
      startTime.setHours(randomInt(startTime.getHours()+1, 20))
      ev.endTime = startTime.toISOString()
      ev.id = ++maxId;
      return ev
    })
    events.push.apply(events, fakes)
  }
  return events
}