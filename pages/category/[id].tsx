import Link from 'next/link';
import { useRouter } from 'next/router'

interface PageProps {
  categorySlug: string;
}


export default function CategoryDisplay<PageProps>({categorySlug}: any) {
  const router = useRouter()

   console.log(router)
  return ( 
    <>
        <Link href="/">Home</Link>
        <h1>CS-Cart Category Page Handler Mock (will update to proxy to special cs-cart route)</h1>
        <div>
            GAIA Category Slug: TBD
        </div>
    </>
  );
}

// Build time caching, we can use analytics to preload highest traffic pages and even make this dy
export async function getStaticPaths() {
  return { 
    paths: [
    {
      params: { id: '/test/test' },
    },
  ], 
  fallback: 'blocking' }
}

export async function getStaticProps(ctx: any) {
  // Fetch necessary data for the product display page using params.id
  const categorySlug = ctx.params.id;

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
      categorySlug
      },
      revalidate: 800, // In seconds
    }
}