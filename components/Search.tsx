import {
  RefinementList,
  SearchBox,
  Hits,
  Configure,
  Highlight,
  Pagination,
  InstantSearch,
  HierarchicalMenu,
  Panel
} from 'react-instantsearch-dom'
import type { InstantSearchProps } from 'react-instantsearch-dom'
import Image from 'next/image'
import Link from 'next/link'
interface Facet {
  displayName: string;
  algoliaFieldName: string;
}

const HitComponent = ({hit}: any) => {

  return (
  <div className="hit">
    <div>
      <div className="hit-picture">
        {/* <Image src={`${hit.image}`} width="165" height="145" alt="" /> */}
      </div>
    </div>
    <div className="hit-content">
      <Link href={`/product/${hit.product_id}`}>
      <div>
        <Highlight attribute="name" hit={hit} />
         <span> - ${hit.sales}</span>
      </div>
      <div className="hit-type">
        <Highlight attribute="type" hit={hit} />
      </div>
      <div className="hit-description">
        <Highlight attribute="description" hit={hit} />
      </div>
      </Link>
    </div>
  </div>
)}

export function Search(props: any) {
  console.log(props)

  return (
    <InstantSearch {...props}>
      <Configure hitsPerPage={12} />
      <header>
        <h1>Headless Commerce Example</h1>
        <SearchBox />
      </header>
      <main>
        <div className="menu">
        <Panel header="Category">
            <HierarchicalMenu attributes={['category.lvl0', 'category.lvl1']} />
         </Panel>
          {props.datoData && props.datoData.allFacets.map((facet: Facet) => (
             <Panel key={facet.displayName} header={facet.displayName}>
                <RefinementList attribute={facet.algoliaFieldName} />
              </Panel>
          ))}
        </div>
        <div className="results">
          <Hits hitComponent={HitComponent} />
        </div>
      </main>
      <footer>
        <Pagination />
      </footer>
    </InstantSearch>
  )
}
