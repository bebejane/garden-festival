import { withGlobalProps } from "lib/utils";
import { GetEvents, GetEvent, GetParticipants, GetAbouts } from "/graphql";
import Home from '../index';

export default Home;

export const getStaticProps = withGlobalProps({ queries: [GetEvents,  GetParticipants, GetAbouts] }, async (data) => {
  const {
    props :{
      events,
      participants,
      abouts
    },
    revalidate
  } = data;

  return {
    props:{
      abouts,
      participants,
      events,
      defaultView: 'program'
    },
    revalidate,
  };
});