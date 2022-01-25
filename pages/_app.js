import '/styles/index.scss'

import { AppStateProvider } from "/lib/context/appstate";
import { useRouter } from 'next/router';
import DatoSEO from 'lib/dato/seo';

function MyApp({ Component, pageProps }) {

  const router = useRouter()
  const { seo, site } = pageProps;
  const { pathname, route } = router
  const pageTitle = `The Community Garden Festival · February 7–11 · 2022`

  return (
    <>
      <DatoSEO seo={seo} site={site} pathname={pathname} title={pageTitle} key={pathname} />
      <AppStateProvider>
        <Component {...pageProps} />
      </AppStateProvider>
    </>
  )
}

export default MyApp
