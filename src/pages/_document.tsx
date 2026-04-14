import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" data-scroll-behavior="smooth">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;1,400&family=Dancing+Script:wght@400;700&family=Space+Grotesk:wght@300;400&family=Cormorant+Garamond:ital,wght@0,300;1,300&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('theme');
            if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.setAttribute('data-theme', 'dark');
            }
          } catch(e) {}
        `}} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
