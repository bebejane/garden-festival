import { apiQuery, SEOQuery } from "/lib/api";
//import { GetMenu, GetContact } from "/graphql";

export default function withGlobalProps(opt = {}, getStaticProps){
  
  return async (context) => {
    const queries = []// [GetMenu, GetContact];
    const revalidate = parseInt(process.env.REVALIDATE_TIME)
    
    if(opt.query)
      queries.push(opt.query)
    if(opt.queries)
      queries.push.apply(queries, opt.queries)
    
    if(opt.model) 
      queries.push(SEOQuery(opt.model))
      
    const props = await apiQuery(queries, opt.params, context.preview);

    if(getStaticProps)
      return await getStaticProps({context, props, revalidate});
    else
      return { props, context, revalidate};
  }
}
