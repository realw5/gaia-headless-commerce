import algoliasearch from 'algoliasearch/lite';

export default async function handler(req, res) {

    const searchClient = algoliasearch(
        `${process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION}`,
        `${process.env.NEXT_PUBLIC_ALGOLIA_API_KEY}`
      );
    const index = searchClient.initIndex('merge_gaia_test');
    const { sku } = req.query
    console.log(sku);

    try {
        // Search for "query string" in the index "contacts"
        index.search('', { 
                filters: "product_code:"+ sku,
           //     attributesToRetrieve: ['product_code', 'color.name'],
            }).then(({ hits }) => {
            return res.status(200).json(hits);
        });


      } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send('Error finding product');
      }
}