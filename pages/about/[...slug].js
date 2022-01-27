import { withGlobalProps } from "lib/utils";
import { GetAbouts } from "/graphql";
import { apiQuery } from "lib/api";

import Home from "../index"
export default Home;

export const getStaticProps = withGlobalProps({queries:[GetAbouts]}, async ({props, context, revalidate}) => {
  const { params : { slug }} = context
  
  return {
    props:{
      ...props,
      about: props.abouts.filter(a => a.slug === slug[0])[0],
      view : 'about'
    },
    revalidate
  };
});

export async function getStaticPaths() {
  const { abouts } = await apiQuery(GetAbouts, {}, false);
  const paths = [];
  
  abouts.forEach(a => paths.push({ params: { slug: [a.slug] }}))

  return {
		paths:paths,
		fallback: 'blocking',
	};
}