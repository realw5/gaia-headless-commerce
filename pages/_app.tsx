import type { AppProps } from 'next/app'

// use this global file to manage page template css initial, further evolve the CSS handling in future versions
import '../styles/global.css'

// use default Algolia styles using the default css styles provided by Algolia
import 'instantsearch.css/themes/satellite.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
