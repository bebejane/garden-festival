import '/styles/index.scss'

import { AppStateProvider } from "/lib/context/appstate";
import { useRouter } from 'next/router';
import { GoogleAnalytics, usePagesViews } from "nextjs-google-analytics";
import DatoSEO from 'lib/dato/seo';

function MyApp({ Component, pageProps }) {
  //console.log(pageProps)
  const router = useRouter()
  const { asPath : pathname, route } = router
  const pageTitle = `Community Garden Festival – February 07th - 12th · 2022`
  const { site, event, participant, about } = pageProps;
  const seo = event?.seo || participant?.seo || about?.seo || pageProps.seo
	
  // Google Analytics page view tracker
  usePagesViews();

  return (
    <>
      <GoogleAnalytics />
      <DatoSEO seo={seo} site={site} pathname={pathname} key={pathname}/>
      <AppStateProvider>
        <Component {...pageProps} />
      </AppStateProvider>
    </>
  )
}

export default MyApp
