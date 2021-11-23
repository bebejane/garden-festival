import { GraphQLClient } from "graphql-request"
import gql from 'graphql-tag';
import combineQuery from 'graphql-combine-query'
import * as AllQueries from "/graphql";
import { 
  GRAPHQL_API_ENDPOINT, 
  GRAPHQL_PREVIEW_API_ENDPOINT, 
  GRAPHQL_API_TOKEN 
} from "../utils/constant";

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
  
  /* Run multiple queries in parallel
  if(Array.isArray(query)){
    const reqs = query.map((q,idx) => apiQuery(q, Array.isArray(params) ? params[idx] : params, preview))
    const res = await Promise.all(reqs)
    let data = {}; 
    res.forEach((r)=> data = {...data, ...r})
    return data
    return preview === true ? previewClient.request(query, params) : client.request(query, params)
  }
  */
}

const getQueryByType = (type) => {
  switch (type) {
    case 'home':
      return AllQueries.GetHome;
    case 'menu':
      return AllQueries.GetMenu;
    case 'contact':
      return AllQueries.GetContact;
    case 'ourOffer':
      return AllQueries.GetOurOffer;
    case 'invest':
      return AllQueries.GetInvest;
    case 'about':
      return AllQueries.GetAbout;
    case 'partner':
        return AllQueries.GetPartner;
  }
  throw `Query type ${type} doesn't exist!`
};

const getObjectBySlug = async (type, slug, preview) => {
	const query = getQueryByType(type);
	const data = await apiQuery(query, {}, preview)
  return {...data,  _type:type, _slug:slug};
};

const getPathBySlug = (type, slug) => {
  switch (type) {
		case "home":
			return `/`
		case "ourOffer":
			return `/${slug}`
		case "about":
      return `/${slug}`
    case "invest":
      return `/${slug}`
    case "partner":
      return `/${slug}`
    case "contact":
      return `/`
    case "menu":
      return `/`
		default:
			throw `Path ${type} not found!`;
	}
};

const SEOQuery = (schema) => {
  return gql`
    query GetSEO {
      site: _site {
        favicon: faviconMetaTags {
          attributes
          content
          tag
        }
        globalSeo {
          facebookPageUrl
          siteName
          titleSuffix
          twitterAccount
          fallbackSeo {
            description
            title
            twitterCard
          }
        }
      }
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
  getObjectBySlug,
  getPathBySlug,
  SEOQuery
}
