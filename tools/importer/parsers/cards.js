/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: cards
 *
 * Handles two card patterns found on the source page:
 * 1. Feature cards (no images) - icon+text items in grid
 * 2. Article cards (with images) - image + title + tag + description + link
 *
 * Block Structure (from markdown example):
 * With images: Row per card with [image | text content]
 * Without images: Row per card with [text content]
 *
 * Generated: 2026-02-08
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect card type: check if this is an article card (with image) or feature card
  // VALIDATED: Article cards use .utility-link-content-block with img elements
  const isArticleCard = !!element.querySelector('img');

  if (isArticleCard) {
    // Article card pattern - VALIDATED: source has .w-layout-grid with img + text
    const image = element.querySelector('img');
    const title = element.querySelector('h3, h4, [class*="h4-heading"], strong');
    const tag = element.querySelector('.tag div, .tag');
    const readTime = element.querySelector('.paragraph-sm');
    const desc = element.querySelector('h3 ~ p, h4 ~ p, .h4-heading ~ p');
    const link = element.querySelector('a:last-of-type');

    // Build text content cell
    const textCell = document.createElement('div');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent;
      textCell.appendChild(strong);
      textCell.appendChild(document.createElement('br'));
    }
    if (tag) {
      const tagText = document.createTextNode(
        `${tag.textContent.trim()}${readTime ? ` · ${readTime.textContent.trim()}` : ''}`,
      );
      textCell.appendChild(tagText);
      textCell.appendChild(document.createElement('br'));
    }
    if (desc) {
      textCell.appendChild(desc.cloneNode(true));
    }
    if (link) {
      const a = link.cloneNode(true);
      textCell.appendChild(a);
    }

    // Image in col 1, text in col 2
    if (image) {
      cells.push([image.cloneNode(true), textCell]);
    } else {
      cells.push([textCell]);
    }
  } else {
    // Feature card (no images) - VALIDATED: source has .flex-horizontal.flex-gap-xxs with icon SVG + p
    const text = element.querySelector('p');
    if (text) {
      cells.push([text.cloneNode(true)]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });
  element.replaceWith(block);
}
