import '/styles/index.scss'

import { AppStateProvider } from "/lib/context/appstate";
import { useRouter } from 'next/router';
import { GoogleAnalytics, usePagesViews } from "nextjs-google-analytics";
import DatoSEO from 'lib/dato/seo';

function MyApp({ Component, pageProps }) {

  const router = useRouter()
<<<<<<< HEAD
  const { site, event, participant, about } = pageProps;
  const seo = event?.seo || participant?.seo || about?.seo || pageProps.seo
=======
  const { seo, site } = pageProps;
  const { pathname, route } = router
  const pageTitle = `The Community Garden Festival · February 7–11 · 2022`
>>>>>>> 793fc5ddd293a11b5738cc3f363061436fe3f205

	const { asPath : pathname, route } = router
	const pageTitle = `Community Garden Festival – February 07th - 12th · 2022`
  
	usePagesViews() // Google Analytics page view tracker
  return (
    <>
<<<<<<< HEAD
      <GoogleAnalytics />
      <DatoSEO seo={seo} site={site} pathname={pathname} title={pageTitle} key={pathname}/>
=======
      <DatoSEO seo={seo} site={site} pathname={pathname} title={pageTitle} key={pathname} />
>>>>>>> 793fc5ddd293a11b5738cc3f363061436fe3f205
      <AppStateProvider>
        <Component {...pageProps} />
      </AppStateProvider>
    </>
  )
}

export default MyApp
