import type { AppProps } from 'next/app'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useState, useCallback } from 'react'
import ThemeProvider from '@/components/ThemeProvider'
import PageTransition from '@/components/PageTransition'
import '@/styles/globals.css'

const Cursor = dynamic(() => import('@/components/ui/Cursor'), { ssr: false })
const Loader = dynamic(() => import('@/components/Loader'), { ssr: false })

export default function App({ Component, pageProps }: AppProps) {
  const [loaded, setLoaded] = useState(false)
  const onDone = useCallback(() => setLoaded(true), [])

  return (
    <ThemeProvider>
      <Head>
        <title>Moments by Gisore</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="A minimal, elegant home for your photography." />
      </Head>
      <Cursor />
      {!loaded && <Loader onDone={onDone} />}
      <PageTransition loaded={loaded}>
        <Component {...pageProps} loaded={loaded} />
      </PageTransition>
    </ThemeProvider>
  )
}
