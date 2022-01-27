import { apiQuery, SEOQuery } from "/lib/api";
import { GetEvents, GetParticipants, GetSiteSEO } from "/graphql";
import { transformEventWithTiming } from '/lib/utils'

export default function withGlobalProps(opt = {}, callback){
  
  callback = typeof opt === 'function' ? opt : callback;

  const revalidate = parseInt(process.env.REVALIDATE_TIME || 60)
  const queries = globalQueries(opt)
  
  return async (context) => {    
    const props = await apiQuery(queries, {}, context.preview);
    const  { participants } = props; 
    const events = props.events.map(transformEventWithTiming)
    
    if(callback)
      return await callback({context, props: {...props, events, participants}, revalidate});
    else
      return { props:{...props, events, participants}, context, revalidate};
  }
}

const globalQueries = (opt = {}) => {

  const queries = [GetEvents, GetParticipants, GetSiteSEO]
  
  if(opt.query) 
    queries.push(opt.query)
  if(opt.queries) 
    queries.push.apply(queries, opt.queries)
  if(opt.model) 
    queries.push(SEOQuery(opt.model))

  return queries;
}

export { globalQueries };