/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: columns
 *
 * Block Structure (from markdown example):
 * Single row with multiple columns: [col1 content | col2 content]
 *
 * Source HTML Pattern:
 * <div class="w-layout-grid grid-layout desktop-4-column">
 *   <div>
 *     <h2>Join the style revolution</h2>
 *     <p class="subheading">...</p>
 *   </div>
 *   <div class="button-group">
 *     <a class="button w-button">Sign up</a>
 *     <a class="button secondary-button w-button">Connect</a>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-08
 */
export default function parse(element, { document }) {
  const cells = [];

  // VALIDATED: Source uses direct child divs as columns within grid layout
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  if (columns.length >= 2) {
    // Build row with one cell per column
    const row = columns.map((col) => {
      const cell = document.createElement('div');

      // Clone heading if present
      const heading = col.querySelector('h1, h2, h3');
      if (heading) cell.appendChild(heading.cloneNode(true));

      // Clone description if present
      const desc = col.querySelector('p.subheading, p');
      if (desc) cell.appendChild(desc.cloneNode(true));

      // Clone CTAs if present - VALIDATED: source uses a.button inside .button-group
      const ctas = col.querySelectorAll('a.button, a.w-button');
      ctas.forEach((cta) => {
        const p = document.createElement('p');
        p.appendChild(cta.cloneNode(true));
        cell.appendChild(p);
      });

      // If cell is still empty, clone all content
      if (!cell.hasChildNodes()) {
        cell.append(...Array.from(col.childNodes).map((n) => n.cloneNode(true)));
      }

      return cell;
    });

    cells.push(row);
  } else {
    // Fallback: single column
    cells.push([element.cloneNode(true)]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
  element.replaceWith(block);
}
