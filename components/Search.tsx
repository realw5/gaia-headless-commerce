import {
  RefinementList,
  SearchBox,
  Hits,
  Configure,
  Highlight,
  Pagination,
  InstantSearch,
  HierarchicalMenu
} from 'react-instantsearch-dom'
import type { InstantSearchProps } from 'react-instantsearch-dom'
import Image from 'next/image'
import Link from 'next/link'

const HitComponent = ({ hit }: any) => (
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
        <span> - ${hit.price}</span>
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
)

export function Search(props: InstantSearchProps) {
  return (
    <InstantSearch {...props}>
      <Configure hitsPerPage={12} />
      <header>
        <h1>Headless Architecture</h1>
        <SearchBox />
      </header>
      <main>
        <div className="menu">
         <HierarchicalMenu attributes={['category.lvl0', 'category.lvl1']} />
          <RefinementList attribute="color.name" />
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
