/* eslint-disable */
// ============================================================
// Configuration file for DatoCMS CLI
// For build time caching of key assests 
// ------------------------------------------------------------
// https://www.datocms.com/
// See: https://www.datocms.com/docs/other-ssgs/fields
// ------------------------------------------------------------
/*

### Prerequistis for caching of key assests

    - Define data read-api key
    - Adapt data read and write logic for key assests where performance, cost and freshness of data fit a build-time caching strategy
    - DataCMS cli returns data using camelCase syntax I.E. category_name in DatoCMS UI equals categoryName via CLI interface. 

### Constants and Variables

  - Switch for file generation

### Data Models

  - Refinements
  - Categories
  - NavMenu

### Output Data

  - Global Site Variables
  - Dato in JSON format

### Functions

  - traverse
  - parentTraverse

*/
// ============================================================

// ------------------------------------------------------------
// Constants and Variables
// ------------------------------------------------------------

// Switches for file generation
// ------------------------------------------------------------
var generate_data_files = true;

// Settings
// sets path to write downlaoded json data files
// ------------------------------------------------------------
var CACHE_PATH = `_content_cache/datocms`;


// ------------------------------------------------------------
// Data Models
// ------------------------------------------------------------
module.exports = (dato, root) => {

    // Categories
    // ------------------------------------------------------------
    const categories = dato.categories.filter(category => !category.parent)
    var categoryData = {}
    var breadcrumbsData = {}
    traverse(categories,
        (category, depth) => {
            //    console.debug(`${'  '.repeat(depth)} * ${category.name}`);


            var breadcrumbs = []
            if (category) {
                parentTraverse(dato, category.id, (parent, depth) => {
                    var breadcrumb = {};
                    breadcrumb = {
                        id: parent.id,
                        name: parent.category_name,
                        link: parent.link,
                        depth
                    }
                    breadcrumbs.push(breadcrumb);
                });
            }

            // var algoliaFilters = [];
            // category.algoliaFilters.forEach(filter => {
            //     algoliaFilter = {};
            //     algoliaFilter['attribute'] = filter.attribute;
            //     algoliaFilter['value'] = filter.value;
            //     algoliaFilters.push(algoliaFilter)
            // })

            // var defaultRefinements = [];
            // category.defaultRefinements.forEach(refinement => {
            //     defaultRefinement = {};
            //     defaultRefinement['id'] = refinement.id;
            //     defaultRefinement['name'] = refinement.name;
            //     defaultRefinements.push(defaultRefinement)
            // })

            var childrenCategories = [];
            category.children.forEach(record => {
                childCategory = {};
                childCategory['id'] = record.id;
                childCategory['name'] = record.categoryName;
                childCategory['link'] = record.link;
                childrenCategories.push(childCategory)
            })

            var title = null;
            if (category.title) {
                title = category.title.toMap();
            }

            categoryData[category.slug] = {
                id: category.id,
                name: category.categoryName,
                link: category.slug,
                algoliaFilter: category.algoliaQuery,
               //  defaultRefinements: defaultRefinements,
                // title: title,
                children: childrenCategories
            }

            breadcrumbsData[category.slug] = breadcrumbs.reverse();

        }
    );

    // // Refinements
    // // ------------------------------------------------------------   
    // var refinementsData = [];
    // dato.refinements.forEach(refinement => {

    //     var helpGuide = null;
    //     if (refinement.helpGuide) {
    //         var helpGuideRecord = dato.find(refinement.helpGuide.id)
    //         helpGuide = {
    //             helpGuidanceText: helpGuideRecord.helpGuidanceText,
    //             helpIconAltText: helpGuideRecord.helpIconAltText
    //         }

    //     }
    //     var facet = null;
    //     if (refinement.facet) {
    //         var facetRecord = dato.find(refinement.facet.id)
    //         facet = {
    //             id: facetRecord.id,
    //             facetId: facetRecord.facetId,
    //             attribute: facetRecord.attribute
    //         }

    //     }
    //     var widget = null;
    //     if (refinement.widget) {
    //         var widgetRecord = dato.find(refinement.widget.id)
    //         widget = widgetRecord.toMap()
    //     }

    //     var refinementItem = {
    //         id: refinement.id,
    //         name: refinement.name,
    //         displayName: refinement.displayName,
    //         helpGuide: helpGuide,
    //         facet: facet,
    //         widget: widget,
    //     }
    //     refinementsData.push(refinementItem);

    // })

    // // NavMenu
    // // ------------------------------------------------------------   
    // var menuData = [];
    // dato.menus.forEach(menu => {
    //     var link = null
    //     var linkedPage = {}
    //     if (menu.link) {
    //         link = dato.find(menu.link.id)
    //         linkedPage = {
    //             id: link.id,
    //             name: link.name,
    //             link: link.link,
    //             _modelApiKey: link.itemType.apiKey
    //         }
    //     }
    //     var menuItem = {
    //         id: menu.id,
    //         linkName: menu.linkName,
    //         display: menu.display,
    //         link: linkedPage
    //     }

    //     menuData.push(menuItem)

    // })


    // ------------------------------------------------------------
    // Output Data
    // ------------------------------------------------------------

    // Save Data Files
    // ------------------------------------------------------------
    if (generate_data_files) {
        root.createDataFile(CACHE_PATH + '/categories.json', 'json', categoryData);
        // root.createDataFile(CACHE_PATH + '/refinements.json', 'json', refinementsData);
        // root.createDataFile(CACHE_PATH + '/menu.json', 'json', menuData);
        // root.createDataFile(CACHE_PATH + '/breadcrumbs.json', 'json', breadcrumbsData);
    }

    // Global Settings
    // ------------------------------------------------------------   
    // Create a YAML data file to store global data about the site
    // root.createDataFile(CACHE_PATH + '/settings.json', 'json', {
    //     siteName: dato.site.globalSeo.siteName,
    //     titleSuffix: dato.site.globalSeo.titleSuffix,
    //     seo: dato.site.globalSeo.toMap()
    // });

};

// ------------------------------------------------------------
// Functions
// ------------------------------------------------------------

// https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }
    return JSON.stringify(obj) === JSON.stringify({});
}

/**
 * Takes a collection records and returns callbacks
 * useful for category/tree-like strcutures from DatoCMS
 * // https://www.datocms.com/docs/other-ssgs/fields#tree-like-collections
 * @param {string} string
 * @return {string}
 */
function traverse(records, cb, depth = 0) {
    records.forEach((record) => {
        cb(record, depth);
        traverse(record.children, cb, depth + 1);
    });
}


function parentTraverse(dato, categoryId, cb, depth = 0) {
    const record = dato.find(categoryId);
    if (record) {
        cb(record, depth);
        if (record.parent) parentTraverse(dato, record.parent.id, cb, depth + 1);
    }
};