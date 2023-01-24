import Link from 'next/link';

export default function Home() {
  return ( 
    <>
        <Link href="/">Home</Link>
        <h1>Test Links</h1>
       <ul>
            <li><Link href="/sillon-taboada-base-plata.html?color=381">Product w/o additional query params</Link></li>
            <li><Link href="/sillon-taboada-base-plata.html?color=381&marketing=stuff">Product w/ additional query params</Link></li>
            <li><Link href="/taza-petra.html?color=339">Product w/ no matching SKU Lookup</Link></li>
            <li><Link href="/marketplace-muebles/sala">Category w/ Marketplace Suffix</Link></li>
            <li><Link href="/muebles/recamara.html">Category w/o Marketplace Suffix</Link></li>

        </ul>
    </>
  );
}