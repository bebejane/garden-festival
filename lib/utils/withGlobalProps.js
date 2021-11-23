import { apiQuery, SEOQuery } from "/lib/api";
//import { GetMenu, GetContact } from "/graphql";

export default function withGlobalProps(opt = {}, getStaticProps){
  
  return async (context) => {
    const queries = []// [GetMenu, GetContact];
  
    if(opt.query)
      queries.push(opt.query)
    if(opt.queries)
      queries.push.apply(queries, opt.queries)
    
    //if(opt.model) 
      //queries.push(SEOQuery(opt.model))
    
    const props = await apiQuery(queries, {}, context.preview);
    
    if(getStaticProps)
      return await getStaticProps({...context, props, revalidate:parseInt(process.env.REVALIDATE_TIME)});
    else
      return { props, revalidate: parseInt(process.env.REVALIDATE_TIME)};
  }
}
