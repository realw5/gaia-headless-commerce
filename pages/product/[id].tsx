import Link from 'next/link';
import { cacheTags } from '../../lib/cache-tags'

type Product = {
  id: string
  name: string
  relatedProducts: string[]
}
interface PageProps {
  productID: string;
}


export default function ProductDisplay<PageProps>({productID}: any) {
    console.log(productID)
  return ( 
    <>
        <Link href="/">Home</Link>
        <div>
            Product ID - Test: {productID}
        </div>
    </>
  );
}

// Build time caching, we can use analytics to preload highest traffic pages and even make this dy
export async function getStaticPaths() {
  return { 
    paths: [
    {
      params: { id: '22817' },
    },
  ], 
  fallback: 'blocking' }
}

export async function getStaticProps(ctx: any) {
  // Fetch necessary data for the product display page using params.id
  const productID = ctx.params.id;

  // Here we woukld call the product lib to fetch data either via Algolia or directly from a PIM
  // const product: Product = await loadProduct(productID)
  //  const relatedProducts: Product[] = await loadProducts(product.relatedProducts)

  // Here we can set the surrogate keys, we can set any number of them. 
  // Imagine a page with multiple related products, we can set all them here.
/*   const ids = [{id: productID, name: "test"}]
  const tags = ids.map(id => `product:${productID}`)
  
  cacheTags.register(ctx, tags) */

  return {
    props: {
      productID
      },
      revalidate: 800, // In seconds
    }
}