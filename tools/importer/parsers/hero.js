/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: hero
 *
 * Block Structure (from markdown example):
 * - Row 1: Background images
 * - Row 2: Content (heading, subheading, CTAs)
 *
 * Source HTML Pattern:
 * <header class="section secondary-section">
 *   <div class="container small-container">
 *     <h1 class="h1-heading">...</h1>
 *     <p class="subheading">...</p>
 *     <div class="button-group">
 *       <a class="button w-button">...</a>
 *       <a class="button secondary-button w-button">...</a>
 *     </div>
 *   </div>
 *   <div class="w-layout-grid">
 *     <div class="utility-aspect-1x1"><img .../></div>
 *     <div class="utility-aspect-1x1"><img .../></div>
 *   </div>
 * </header>
 *
 * Generated: 2026-02-08
 */
export default function parse(element, { document }) {
  // Extract heading - VALIDATED: source uses h1.h1-heading
  const heading = element.querySelector('h1, h2, [class*="h1-heading"]');

  // Extract subheading - VALIDATED: source uses p.subheading
  const description = element.querySelector('p.subheading')
    || element.querySelector('.container p');

  // Extract CTA buttons - VALIDATED: source uses a.button.w-button
  const ctas = Array.from(
    element.querySelectorAll('.button-group a.button, .button-group a.w-button'),
  );

  // Extract images - VALIDATED: source has img inside .utility-aspect-1x1
  const images = Array.from(
    element.querySelectorAll('.w-layout-grid img, .utility-aspect-1x1 img'),
  );

  // Build cells array matching hero block structure
  const cells = [];

  // Row 1: Images (background row)
  if (images.length > 0) {
    const imageContainer = document.createElement('div');
    images.forEach((img) => imageContainer.appendChild(img.cloneNode(true)));
    cells.push([imageContainer]);
  }

  // Row 2: Content (heading, description, CTAs)
  const contentCell = [];
  if (heading) contentCell.push(heading.cloneNode(true));
  if (description) contentCell.push(description.cloneNode(true));
  ctas.forEach((cta) => contentCell.push(cta.cloneNode(true)));

  cells.push(contentCell);

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
