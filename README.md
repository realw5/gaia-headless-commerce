# GAIA Headless Commerce demo

The goal of this example is to illustrate how you can use [Headless Commerce Concepts](https://docs.google.com/document/d/1EQMWpQiQlj6o5ihBY0w8GpxzrQmy5SKSnt7BAENIGKE/edit#) to create a high-performance, automatted, SEO friendly commerce application developed with Next.js. It also illustrates how you can keep in sync the Url with the search, Client-Side JavaScript instrumentation, handling cache at the edge using currogate keys, and engineering manamgement tools.

## How to use

Execute [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to boot strap the example. Then download and run the Vercel CLI tool to pull environment variables and run development:

```bash
yarn install
vc pull
vc dev
```
Understanding the middle:

The middle is intercepting the request, and applying logic using external services/data source to transform and rewrite the forwarding requet to
matching the CS-Cart expected requet to respond with the proper tempalte and category/product.

Setting the cookie `platform` to either 'CS-Cart' or 'Magento' will simulate traffic spliting to test. See console logs for debugging information.

To deploy the example:

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).
