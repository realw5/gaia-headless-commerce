import Link from 'next/link';
import { cacheTags } from '../../lib/cache-tags'

type Product = {
  id: string
  name: string
  relatedProducts: string[]
}
interface PageProps {
  tags: any
}

export default function ProductDisplay<PageProps>({tags}:any) {
    console.log(tags)
  return ( 
    <>
        <Link href="/">Home</Link>
        <div>
            Product ID: {JSON.stringify(tags, null, 2 )}
        </div>
    </>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: true }
}

export async function getStaticProps(ctx: any) {
  // Fetch necessary data for the product display page using params.id
  const productID = ctx.params.id;
  // const product: Product = await loadProduct(productID)
 //  const relatedProducts: Product[] = await loadProducts(product.relatedProducts)

  const ids = [{id: productID, name: "test"}]
  const tags = ids.map(id => `product:${productID}`)
  
  cacheTags.register(ctx, tags)

  return {
    props: {
        tags
      },
    }
}