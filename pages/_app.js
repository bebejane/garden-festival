import '../styles/globals.css'
import { UIProvider } from "/lib/context/ui";

function MyApp({ Component, pageProps }) {
  return (
    <UIProvider>
      <Component {...pageProps} />
    </UIProvider>
  )
}

export default MyApp
