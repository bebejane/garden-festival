import '/styles/index.scss'

import { AppStateProvider } from "/lib/context/appstate";
import { useRouter } from 'next/router';
import { GoogleAnalytics, usePagesViews } from "nextjs-google-analytics";
import DatoSEO from 'lib/dato/seo';

function MyApp({ Component, pageProps }) {
  
  const router = useRouter()
  const { site, event, participant, about } = pageProps;
  const seo = event?.seo || participant?.seo || about?.seo || pageProps.seo

	const { asPath : pathname, route } = router
	const pageTitle = `Community Garden Festival – February 07th - 12th · 2022`
  
	usePagesViews() // Google Analytics page view tracker
  return (
    <>
      <GoogleAnalytics />
      <DatoSEO seo={seo} site={site} pathname={pathname} title={pageTitle} key={pathname}/>
      <AppStateProvider>
        <Component {...pageProps} />
      </AppStateProvider>
    </>
  )
}

export default MyApp
