import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import type { SearchState } from 'react-instantsearch-core'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import algoliasearch from 'algoliasearch/lite'
import { findResultsState } from 'react-instantsearch-dom/server'
import { Search } from '../components/Search'
import { createURL, searchStateToURL, pathToSearchState } from '../utils'
import { request } from "../utils/datocms";
import { NoResultsHandler } from '../components/NoResultsHandler';
import { Image } from "react-datocms";

// Demo key provided by https://github.com/algolia/react-instantsearch
const searchClient = algoliasearch(
  'FC2QYJU83S',
  '5c1d09d4af4c086f53eb28a62cf2171f'
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
    />


    <div>{JSON.stringify(datoData, null, 2)}</div>
{/*     <div>
      <Image data={datoData.allCategories[0].coverImage.responsiveImage} />
    </div> */}


    </>
  )
}

interface PageProps {
  searchState: SearchState
  resultsState: unknown
  datoData: null
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
