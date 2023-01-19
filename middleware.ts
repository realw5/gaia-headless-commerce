import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAME } from '@lib/constants'
import { getCurrentExperiment } from '@lib/optimize'
import { getGAIASKU } from '@lib/skus'

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|product|favicon.ico).*)',
    ],
  }

export function middleware(req: NextRequest) {
  let cookie = req.cookies.get(COOKIE_NAME)?.value
  let cookie_for_cloudflare = 'N';

  if (!cookie) {
    let n = Math.random() * 100
    const experiment = getCurrentExperiment()
    const variant = experiment.variants.find((v, i) => {
      if (v.weight >= n) return true
      n -= v.weight
    })

    cookie = `${experiment.id}.${variant.id}`
  }

  const [, variantId] = cookie.split('.')
  const url = req.nextUrl
  const sku = getGAIASKU(url.pathname)?.sku

  console.log('SKU: ', sku)
  console.log('URL: ', url)
  console.log('variantId: ', variantId)
  console.log('Starting Path',url.pathname)

  if (url.pathname.match('/(.*).html')) {
    console.log('Product SLUG Match')
   //return NextResponse.rewrite(new URL('/about-2', req.url));
  

  // `0` is the original version (Magento)
  // Ideally we can set a head value here, that we can then read in Cloudflare under a new endpoint, with zero config
  if (variantId !== '0' && sku) {
    url.pathname = url.pathname.replace(url.pathname, `/product/${sku}`)
    cookie_for_cloudflare = 'Y';
  } 

  // TODO: create logic that handles the URI rewrites
  // We can do this by a key/value store using redis
  // or, ideally we could write a pattern matcher that covers majority of the cases
  console.log('url rewrite: ', url)
  }
  const res = NextResponse.rewrite(url)
  res.headers.set('x-edge-platform-test', `${cookie}`)

  // Add the cookie if it's not there
  // We can use VWO cookie format, which would allow us to utilize the existing tracking implmentation which is in Magento/CS-Cart tempaltes

  if (!req.cookies.has(COOKIE_NAME)) {
    res.cookies.set(COOKIE_NAME, cookie)
    res.cookies.set('gredir', cookie_for_cloudflare)
  }

  return res
}