import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Button } from '@gaia-design-system/Button';
import { useState, useEffect } from 'react';
import { request } from '@utils/datocms';
import { styled } from '../stitches.config';

const HOMEPAGE_QUERY = `query HomePage {
  allCategories {
    slug
    categoryName
    filters {
      algoliaFieldName
      displayName
    }
  }
}`;

const Text = styled('p', {
  fontFamily: '$system',
  color: '$naranjaGAIA',

  variants: {
    size: {
      1: {
        fontSize: '$1',
      },
      2: {
        fontSize: '$2',
      },
      3: {
        fontSize: '$3',
      },
    },
  },
});

export default function Home(categories) {
  const router = useRouter();
  const [currentABTest, setCurrentABTest] = useState(null);

  useEffect(() => {
    setCurrentABTest(Cookies.get('ab-test-platform'));
  }, []);

  const optOut = () => {
    Cookies.set('ab-test-platform', 'Magento');
    router.reload();
  };

  const optIn = () => {
    Cookies.set('ab-test-platform', 'CS-Cart');
    router.reload();
  };
  console.log(categories);

  return (
    <>
      <Link href="/">Home</Link>
      <h1>Headless POC</h1>
      <div><Text>Current Test:</Text> <Text size={1}>{currentABTest}</Text></div>
      <div>
        <Button variant="gray" onClick={optIn}>
          Opt In (CS-Cart)
        </Button>
        <Button variant="blue" onClick={optOut}>
          Opt Out (CS-Cart)
        </Button>
      </div>
      <h2>Category Page Headless</h2>
      <ul>
        <li>
          <Link href="/search">
            Headless Search (Incremental Adoption will load no matter the test)
          </Link>
          {categories &&
            categories.categories.map((category: any) => (
              <ul key={encodeURIComponent(category.slug)}>
                <Link href={`/search/${encodeURIComponent(category.slug)}`}>
                  {category.categoryName}
                </Link>
              </ul>
            ))}
        </li>
      </ul>
      <h2>Redirect Test Links</h2>
      <ul>
        <li>
          <Link href="/sillon-taboada-base-plata.html?color=381">
            Product w/o additional query params
          </Link>
        </li>
        <li>
          <Link href="/sillon-taboada-base-plata.html?color=381&marketing=stuff">
            Product w/ additional query params
          </Link>
        </li>
        <li>
          <Link href="/taza-petra.html?color=339">Product w/ no matching SKU Lookup</Link>
        </li>
        <li>
          <Link href="/marketplace-muebles/sala">Category w/ Marketplace Suffix</Link>
        </li>
        <li>
          <Link href="/muebles/recamara.html">Category w/o Marketplace Suffix</Link>
        </li>
      </ul>
    </>
  );
}

export async function getStaticProps() {
  const topLevelCategories = await request({
    query: HOMEPAGE_QUERY,
    variables: {},
    includeDrafts: true,
    excludeInvalid: true,
  });

  console.log(topLevelCategories);

  return {
    props: {
      categories: topLevelCategories.allCategories || [],
    },
    revalidate: 800, // In seconds
  };
}
