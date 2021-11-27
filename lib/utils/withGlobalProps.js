import { apiQuery, SEOQuery } from "/lib/api";
import { GetEvents, GetEvent, GetParticipants, GetAbouts } from "/graphql";

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
    
    if(getStaticProps)
      return await getStaticProps({context, props, revalidate});
    else
      return { props, context, revalidate};
  }
}
