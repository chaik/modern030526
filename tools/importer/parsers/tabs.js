/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: tabs
 *
 * Block Structure (from markdown example):
 * Each row: [tab label | tab content]
 *
 * Source HTML Pattern:
 * <div class="w-tabs">
 *   <div class="w-tab-menu" role="tablist">
 *     <a data-w-tab="Tab 1" class="w-tab-link">Trends</a>
 *     <a data-w-tab="Tab 2" class="w-tab-link">Sporty</a>
 *     <a data-w-tab="Tab 3" class="w-tab-link">Nightlife</a>
 *   </div>
 *   <div class="w-tab-content">
 *     <div data-w-tab="Tab 1" class="w-tab-pane">
 *       <h3>Fresh fits, bold moves</h3>
 *       <img alt="..." src="...">
 *     </div>
 *     ...
 *   </div>
 * </div>
 *
 * Generated: 2026-02-08
 */
export default function parse(element, { document }) {
  const cells = [];

  // VALIDATED: Webflow tabs use .w-tab-link for tab labels and .w-tab-pane for content
  const tabLinks = Array.from(element.querySelectorAll('.w-tab-link, [role="tab"]'));
  const tabPanes = Array.from(element.querySelectorAll('.w-tab-pane, [role="tabpanel"]'));

  tabLinks.forEach((tabLink, index) => {
    const label = tabLink.textContent.trim();
    const pane = tabPanes[index];

    if (pane) {
      // Extract tab content (heading + image)
      const contentCell = document.createElement('div');
      const heading = pane.querySelector('h2, h3, [class*="h2-heading"]');
      const image = pane.querySelector('img');

      if (heading) contentCell.appendChild(heading.cloneNode(true));
      if (image) contentCell.appendChild(image.cloneNode(true));

      cells.push([label, contentCell]);
    } else {
      cells.push([label, '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Tabs', cells });
  element.replaceWith(block);
}
