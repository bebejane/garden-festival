import '/styles/index.scss'

import { AppStateProvider } from "/lib/context/appstate";

function MyApp({ Component, pageProps }) {
  return (
    <AppStateProvider>
      <Component {...pageProps} />
    </AppStateProvider>
  )
}

export default MyApp
