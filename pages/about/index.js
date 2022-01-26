import { withGlobalProps } from "lib/utils";
import { GetAbouts } from "/graphql";
import { apiQuery } from "lib/api";

import Home from "../index"
export default Home;

export const getStaticProps = withGlobalProps({queries:[GetAbouts]}, async ({props, context, revalidate}) => {
  return {
    props:{
      ...props,
      view : 'about'
    },
    revalidate
  };
});