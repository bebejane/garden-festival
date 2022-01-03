import '/styles/index.scss'

import { AppStateProvider } from "/lib/context/appstate";
import DatoSEO from 'lib/dato/seo';
import {useRouter} from 'next/router';

function MyApp({ Component, pageProps }) {
  
  const router = useRouter()
  const { seo, site } = pageProps;
	const { pathname, route } = router
	//console.log(seo)
	//const pageMenu = menu.filter(m => pathname.includes(m.slug))[0]

	const pageTitle = `Community Garden Festival · February 07th - 12th · 2022`
	

  return (
    <>
      <DatoSEO seo={seo} site={site} pathname={pathname} title={pageTitle} key={pathname}/>
      <AppStateProvider>
        <Component {...pageProps} />
      </AppStateProvider>
    </>
  )
}

export default MyApp
