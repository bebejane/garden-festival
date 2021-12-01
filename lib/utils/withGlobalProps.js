import { FESTIVAL_START_DATE, FESTIVAL_END_DATE } from "./constant";
import { apiQuery, SEOQuery } from "/lib/api";
import { GetEvents, GetEvent, GetParticipants, GetAbouts } from "/graphql";
import { randomInt } from "/lib/utils";

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
    let {events, participants} = props;
    
    //const {events, participants} = mockEvents([...props.events], props.participants);
    
    if(getStaticProps)
      return await getStaticProps({context, props: {...props, events, participants}, revalidate});
    else
      return { props:{...props, events, participants}, context, revalidate};
  }
}

const mockEvents = (events, participants) => {
  let maxId = parseInt(events.sort((a, b)=> parseInt(a.id) > parseInt(b.id))[0].id);
  let partMaxId = 100000;
  const evts = [...events]
  for (let index = 0; index < 3; index++) {
    const fakes = evts.map((ev)=>{
      const startTime = new Date(FESTIVAL_START_DATE)
      startTime.setDate(randomInt(FESTIVAL_START_DATE.getDate(),FESTIVAL_END_DATE.getDate()))
      startTime.setHours(randomInt(8, 20))
      startTime.setMinutes(randomInt(0, 59))
      ev.startTime = startTime.toISOString()
      startTime.setHours(randomInt(startTime.getHours()+1, 20))
      ev.endTime = startTime.toISOString()
      ev.id = ++maxId;
      ev.participant.id = ++partMaxId
      participants.push({...ev.participant})
      return {...ev}
    })
    events = events.concat(fakes)
  }
  return {events, participants}
}