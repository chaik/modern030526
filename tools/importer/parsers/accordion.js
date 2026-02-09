/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: accordion
 *
 * Block Structure (from markdown example):
 * Each row: [question label | answer content]
 *
 * Source HTML Pattern (Webflow dropdowns as accordion):
 * <div class="accordion transparent-accordion w-dropdown">
 *   <div class="w-dropdown-toggle">
 *     <div class="paragraph-lg">Question text</div>
 *   </div>
 *   <nav class="accordion-content w-dropdown-list">
 *     <div class="rich-text w-richtext">
 *       <p>Answer text</p>
 *     </div>
 *   </nav>
 * </div>
 *
 * Generated: 2026-02-08
 */
export default function parse(element, { document }) {
  const cells = [];

  // VALIDATED: Source uses .w-dropdown elements styled as accordion
  // Each .accordion.w-dropdown contains toggle (question) and list (answer)
  const toggle = element.querySelector('.w-dropdown-toggle, [role="button"]');
  const content = element.querySelector('.w-dropdown-list, .accordion-content');

  if (toggle && content) {
    // Extract question text - VALIDATED: source uses .paragraph-lg inside toggle
    const questionText = toggle.querySelector('.paragraph-lg')
      || toggle.querySelector('div:not(.dropdown-icon)');
    const question = questionText ? questionText.textContent.trim() : toggle.textContent.trim();

    // Extract answer text - VALIDATED: source uses .rich-text.w-richtext with <p> inside
    const answerEl = content.querySelector('.rich-text, .w-richtext');
    const answer = answerEl ? answerEl.cloneNode(true) : document.createTextNode(content.textContent.trim());

    cells.push([question, answer]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Accordion', cells });
  element.replaceWith(block);
}
