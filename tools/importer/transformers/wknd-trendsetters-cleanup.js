/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for WKND Trendsetters website cleanup
 * Purpose: Remove non-content elements (nav, footer, Webflow artifacts)
 * Applies to: www.wknd-trendsetters.site (all templates)
 * Generated: 2026-02-08
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow
 * - Source HTML classes from Webflow-generated page
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove navigation - EXTRACTED: Found <div class="nav secondary-nav"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.nav.secondary-nav',
      '.w-nav-overlay',
    ]);

    // Remove footer - EXTRACTED: Found <footer class="footer inverse-footer"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'footer.footer',
    ]);

    // Remove Webflow badge and artifacts
    // EXTRACTED: Webflow-generated sites include these elements
    WebImporter.DOMUtils.remove(element, [
      '.w-webflow-badge',
      'noscript',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove leftover Webflow attributes from all elements
    // EXTRACTED: Captured DOM shows data-wf-* and data-w-* attributes on multiple elements
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      const attrs = Array.from(el.attributes || []);
      attrs.forEach((attr) => {
        if (attr.name.startsWith('data-wf-') || attr.name.startsWith('data-w-')
            || attr.name.startsWith('data-aisg-')) {
          el.removeAttribute(attr.name);
        }
      });
    });

    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
