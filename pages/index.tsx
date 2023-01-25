import Link from 'next/link';
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { Layout, Page, Text, Button } from '@vercel/examples-ui'
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter()
  const [currentABTest, setCurrentABTest] = useState(null)

  useEffect(() => {
    setCurrentABTest(Cookies.get('ab-test-platform'));
  }, []);

  const optOut = () => {
    Cookies.set('ab-test-platform', 'Magento')
    router.reload()
  }

  return ( 
    <>
        <Link href="/">Home</Link>
        <h1>Test Links</h1>
        <div>{currentABTest}</div>
        <div>      
           <Button variant="secondary" onClick={optOut}>
            Opt out
          </Button>
        </div>
       <ul>
            <li><Link href="/sillon-taboada-base-plata.html?color=381">Product w/o additional query params</Link></li>
            <li><Link href="/sillon-taboada-base-plata.html?color=381&marketing=stuff">Product w/ additional query params</Link></li>
            <li><Link href="/taza-petra.html?color=339">Product w/ no matching SKU Lookup</Link></li>
            <li><Link href="/marketplace-muebles/sala">Category w/ Marketplace Suffix</Link></li>
            <li><Link href="/muebles/recamara.html">Category w/o Marketplace Suffix</Link></li>
            <li><Link href="/search">Headless Search</Link></li>

        </ul>
    </>
  );
}