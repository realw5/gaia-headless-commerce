
import { cacheTags } from '../../lib/cache-tags'

export default cacheTags.invalidator({
    wait: true,
    resolver: (req) => [req.query.tag as string],
  })