import { CacheTags, RedisCacheTagsRegistry } from 'next-cache-tags'

export const cacheTags = new CacheTags({
  registry: new RedisCacheTagsRegistry({
    url: process.env.CACHE_TAGS_REDIS_URL,
    socket: { connectTimeout: 50000 },
  })
})