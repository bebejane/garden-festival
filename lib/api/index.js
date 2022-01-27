import { GraphQLClient, batchRequests } from "graphql-request"
import gql from 'graphql-tag';
import { GRAPHQL_API_ENDPOINT, GRAPHQL_PREVIEW_API_ENDPOINT, GRAPHQL_API_TOKEN } from "../utils/constant";

const headers = {headers: { authorization: 'Bearer ' + GRAPHQL_API_TOKEN}}
const client = new GraphQLClient(GRAPHQL_API_ENDPOINT, headers)
const previewClient = new GraphQLClient(GRAPHQL_PREVIEW_API_ENDPOINT, headers)

const apiQuery = async (query, params = {}, preview = false) => {
  if(!query) throw "Invalid Query!"
  
  /* Combine queries */
  const batch = (Array.isArray(query) ? query : [query]).map((document, idx) => {
    const variables = Array.isArray(params) && params.length > idx -1 ? params[idx] : {}
    return {document, variables}
  })
  
  const data = await (preview === true ? previewClient: client).batchRequests(batch)
  let result = {}
  data.forEach((res) => result = {...result, ...res?.data})
  //console.log('api query:', batch.length)
  return result  

  // Run multiple queries in parallel 
  /*
  if(Array.isArray(query)){
    const reqs = query.map((q,idx) => apiQuery(q, Array.isArray(params) ? params[idx] : params, preview))
    const res = await Promise.all(reqs)
    let data = {}; 
    res.forEach((r)=> data = {...data, ...r})
    return data
  }else
    return (preview === true ? previewClient: client).request(query, params)
  */
}

const SEOQuery = (schema) => {
  return gql`
    query GetSEO {
      seo: ${schema} {
        tags: _seoMetaTags {
          attributes
          content
          tag
        }
      }
    }
  `
}
export {
  client,
  apiQuery,
  SEOQuery
}
