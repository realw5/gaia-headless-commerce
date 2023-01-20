import Link from 'next/link';
import { useRouter } from 'next/router'

type Product = {
  id: string
  name: string
  relatedProducts: string[]
}
interface PageProps {
  productID: string;
}


export default function ProductDisplay<PageProps>({productID}: any) {
  const router = useRouter()

   console.log(router)
  return ( 
    <>
        <Link href="/">Home</Link>
        <h1>CS-Cart Product Page Handler Mock (will update to forward to cs-cart route)</h1>
        <div>
            GAIA SKU: {productID}
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