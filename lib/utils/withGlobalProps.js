import { apiQuery, SEOQuery } from "/lib/api";
import { GetEvents, GetParticipants, GetAbouts, GetGlobal } from "/graphql";
import { transformEventWithTiming } from '/lib/utils'

export default function withGlobalProps(opt = {}, callback){
  
  callback = typeof opt === 'function' ? opt : callback;

  return async (context) => {
    const queries = [GetGlobal]
    const revalidate = parseInt(process.env.REVALIDATE_TIME)
    
    if(opt.query)
      queries.push(opt.query)

    if(opt.queries)
      queries.push.apply(queries, opt.queries)
    
    if(opt.model) queries.push(SEOQuery(opt.model))

    const props = await apiQuery(queries, {}, context.preview);
    const  { participants } = props; 
    const events = props.events.map(transformEventWithTiming)
    console.log('#')
    if(callback)
      return await callback({context, props: {...props, events, participants}, revalidate});
    else
      return { props:{...props, events, participants}, context, revalidate};
  }
}