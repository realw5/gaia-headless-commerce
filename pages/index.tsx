import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import type { SearchState } from 'react-instantsearch-core'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import algoliasearch from 'algoliasearch/lite'
import { findResultsState } from 'react-instantsearch-dom/server'
import { Search } from '../components/Search'
import { createURL, searchStateToURL, pathToSearchState } from '../utils'
import { request } from "../utils/datocms";
import { Image } from "react-datocms";

// Demo key provided by https://github.com/algolia/react-instantsearch
const searchClient = algoliasearch(
  `${process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION}`,
  `${process.env.NEXT_PUBLIC_ALGOLIA_API_KEY}`
)

const defaultProps = {
  searchClient,
  indexName: 'merge_gaia',
}

const HOMEPAGE_QUERY = `query HomePage {
  allCategories {
    categoryName
    coverImage {
      responsiveImage(imgixParams: { fit: crop, w: 300, h: 300, auto: format }) {
        sizes
        src
        width
        height
        alt
        title
        base64
      }
    }
  }
  allFacets {
    displayName
    algoliaFieldName
    id
  }
}`;

export default function Page({
  resultsState,
  searchState: initialState,
  datoData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const debouncedSetState = useRef()
  const [searchState, setSearchState] = useState(initialState)

  const onSearchStateChange = (state: SearchState) => {
    clearTimeout(debouncedSetState.current)
    ;(debouncedSetState as any).current = setTimeout(() => {
      const href = searchStateToURL(state)

      router.push(href, href, { shallow: true })
    }, 700)

    setSearchState(state)
  }

  // console.log(datoData.allCategories[0].coverImage.responsiveImage);

  useEffect(() => {
    if (router) {
      router.beforePopState((state: SearchState) => {
        const { url } = state
        setSearchState(pathToSearchState(url))

        return true
      })
    }
  }, [router])

  return (
    <>
    <Search
      {...defaultProps}
      searchState={searchState}
      resultsState={resultsState}
      onSearchStateChange={onSearchStateChange}
      createURL={createURL}
      datoData={datoData}
    />
   {/*  <div>{JSON.stringify(datoData, null, 2)}</div> */}
    <div>
      { datoData.allCategories.length && (
      <Image data={datoData.allCategories[0].coverImage.responsiveImage} />
      ) }
    </div>
    </>
  )
}

interface PageProps {
  searchState: SearchState
  resultsState: unknown
  datoData: {
    [key: string]: any[];
  }
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({res, 
  resolvedUrl,
}) => {
  const searchState = pathToSearchState(resolvedUrl)
  const resultsState = await findResultsState(Search, {
    ...defaultProps,
    searchState,
  })

  const datoData = await request({
    query: HOMEPAGE_QUERY,
    variables: { limit: 10 },
    includeDrafts: true,
    excludeInvalid: true,
  });
  
  // This value is considered fresh for ten seconds (s-maxage=10).
  // If a request is repeated within the next 10 seconds, the previously
  // cached value will still be fresh. If the request is repeated before 59 seconds,
  // the cached value will be stale but still render (stale-while-revalidate=59).
  //
  // In the background, a revalidation request will be made to populate the cache
  // with a fresh value. If you refresh the page, you will see the new value.
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=1'
  )

  // Pre-serialize `findResultsState` object return so Next.js' serialization checks pass
  // https://github.com/vercel/next.js/issues/11993
  return {
    props: {
      resultsState: JSON.parse(JSON.stringify(resultsState)),
      searchState,
      datoData: datoData,
    },
  }
}
