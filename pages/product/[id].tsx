import Link from 'next/link';

interface PageProps {
  productID: any
}

export default function ProductDisplay<PageProps>({productID}:any) {
    console.log(productID)
  return ( 
    <>
        <Link href="/">Home</Link>
        <div>
            Product ID: {productID}
        </div>
    </>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: true }
}

export async function getStaticProps({ params }:any) {
  // Fetch necessary data for the product display page using params.id
  const productID = params.id;

  return {
    props: {
        productID
      },
    }
}