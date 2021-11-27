import { withGlobalProps } from "lib/utils";
import { GetEvents, GetEvent, GetParticipants, GetAbouts } from "/graphql";
import Home from '../index';

export default Home;

export const getStaticProps = withGlobalProps(async ({props, revalidate}) => {
  return {
    props:{
      ...props,
      defaultView: 'program'
    },
    revalidate,
  };
});