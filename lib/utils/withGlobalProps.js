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
    const {events, participants} = props;

    if(getStaticProps)
      return await getStaticProps({context, props: {...props, events, participants}, revalidate});
    else
      return { props:{...props, events, participants}, context, revalidate};
  }
}