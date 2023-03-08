import {
  RefinementList,
  SearchBox,
  Hits,
  Configure,
  Highlight,
  Pagination,
  InstantSearch,
  HierarchicalMenu,
  Panel,
} from 'react-instantsearch-dom';
import type { InstantSearchProps } from 'react-instantsearch-dom';
import { CustomRangeSlider } from '@components/search-filters/RangeSlider';
import Image from 'next/image';
import Link from 'next/link';
interface Facet {
  displayName: string;
  algoliaFieldName: string;
}

const HitComponent = ({ hit }: any) => {
  return (
    <div className="hit">
      <div>
        <div className="hit-picture">
          <img src={hit.image} alt={hit.name} />
        </div>
      </div>
      <div className="hit-content">
        <div>
          <Link href={`/product/${hit.product_id}`}>
            <Highlight attribute="name" hit={hit} />
          </Link>
          <span>
            <br /> ${hit.price}
          </span>
        </div>
        <div className="hit-type">
          <Highlight attribute="type" hit={hit} />
        </div>
        <div className="hit-description">
          <Highlight attribute="description" hit={hit} />
        </div>
      </div>
    </div>
  );
};

export function Search(props: any) {
  const categoryFilter = props.initialFilters || '';
  console.log(categoryFilter);

  return (
    <InstantSearch {...props}>
      <Configure filters={categoryFilter} hitsPerPage={12} />
      <header>
        <h1>Headless Commerce Example</h1>
        <SearchBox />
      </header>
      <main>
        <div className="menu">
          <Panel header="Category">
            <HierarchicalMenu attributes={['category.lvl1']} />
          </Panel>
          <Panel header="Price">
            <CustomRangeSlider attribute="price" />
          </Panel>

          {props.navigationFilters &&
            props.navigationFilters.map((facet: Facet) => (
              <Panel key={facet.displayName} header={facet.displayName} footer="&nbsp;">
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
  );
}
