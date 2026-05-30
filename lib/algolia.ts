import { algoliasearch } from 'algoliasearch';

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || 'dummy',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || 'dummy'
);

export interface SearchResult {
  objectID: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

export async function instantSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  try {
    // This assumes you have an index named 'menu_items'
    const { results } = await client.search({
      requests: [
        {
          indexName: 'menu_items',
          query: query,
          hitsPerPage: 10,
        },
      ],
    });

    const hits = (results[0] as any).hits || [];

    return hits.map((hit: any) => ({
      objectID: hit.objectID,
      name: hit.name,
      category: hit.category,
      price: hit.price,
      image: hit.image,
    }));
  } catch (error) {
    console.error('Algolia search error:', error);
    return [];
  }
}
