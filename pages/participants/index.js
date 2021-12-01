import { withGlobalProps } from "lib/utils";
import Home from '../index';

export default Home;

export const getStaticProps = withGlobalProps(async ({props, revalidate}) => {
  return {
    props:{
      ...props,
      defaultView: 'participants'
    },
    revalidate,
  };
});