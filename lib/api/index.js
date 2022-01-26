import { GraphQLClient } from "graphql-request"
import gql from 'graphql-tag';
import combineQuery from 'graphql-combine-query'
import { GRAPHQL_API_ENDPOINT, GRAPHQL_PREVIEW_API_ENDPOINT, GRAPHQL_API_TOKEN } from "../utils/constant";

const headers = {headers: { authorization: 'Bearer ' + GRAPHQL_API_TOKEN}}
const client = new GraphQLClient(GRAPHQL_API_ENDPOINT, headers)
const previewClient = new GraphQLClient(GRAPHQL_PREVIEW_API_ENDPOINT, headers)

const apiQuery = async (query, params = {}, preview = false) => {
  if(!query) throw "Invalid Query!"
  
  /* Combine queries  */
  
  if(Array.isArray(query)){
    let multiQuery = combineQuery('combined')
    query.forEach((q, idx)=> {
      const param = Array.isArray(params) && params.length > idx -1 ? params[idx] : undefined
      multiQuery = multiQuery.add(q, param)
    })
    return preview === true ? previewClient.request(multiQuery.document, multiQuery.variables) : client.request(multiQuery.document, multiQuery.variables)
  }
  else{
    return preview === true ? previewClient.request(query, params) : client.request(query, params)
  }
  
  

  // Run multiple queries in parallel
  /*
  if(Array.isArray(query)){
    const reqs = query.map((q,idx) => apiQuery(q, Array.isArray(params) ? params[idx] : params, preview))
    const res = await Promise.all(reqs)
    let data = {}; 
    res.forEach((r)=> data = {...data, ...r})
    return data
    
  }
  return preview === true ? previewClient.request(query, params) : client.request(query, params)
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
