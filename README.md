# GAIA Headless Commerce demo

The goal of this example is to illustrate how you can use [Headless Commerce Concepts](https://docs.google.com/document/d/1EQMWpQiQlj6o5ihBY0w8GpxzrQmy5SKSnt7BAENIGKE/edit#) to create a high-performance, automatted, SEO friendly commerce application developed with Next.js. It also illustrates how you can keep in sync the Url with the search, Client-Side JavaScript instrumentation, handling cache at the edge using currogate keys, and engineering manamgement tools.

## How to use

Download and install [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) using NPM. 

```bash
npm install --global yarn
```

Then download and run the Vercel CLI tool to pull environment variables and run development server:

```bash
yarn global add vercel
```
Once both yarn and vercel are installed globally, you can run the following commands to setup and start locally:

```bash
yarn install
vc pull
vc dev
```
Understanding the Vercel Middleware:

The middleware is intercepting the request, and applying logic using external services/data source to transform and rewrite the forwarding requet to
matching the CS-Cart expected requet to respond with the proper tempalte and category/product.

Setting the cookie `ab-platform-test` to 'CS-Cart' should load CS-Cart while setting to 'Magento' should load a Magento codebase. See console logs for debugging information.

See [Vercel Middleware Docs](https://vercel.com/docs/concepts/functions/edge-middleware)

To deploy the example:

```bash
vc
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).
