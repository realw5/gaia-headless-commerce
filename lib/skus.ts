import mapping from './redirect-mappings.json'

/**
 * Returns the experiment to use, the overall flow is:
 * - You created an experiment in Google Optimize
 * - Then created the pages that will match that experiment, in this case pages/[variant]
 * - Start experimenting and then make decisions without having changed the original pages
 */
export function getGAIASKU(uri) {
  return mapping.find((exp) => exp.magento === uri)
}