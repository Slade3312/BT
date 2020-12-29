import { getAttrValueFromNodeTemplate } from 'utils/dom-helpers';
import { imgTagWithSpacesRegExp, messageUrlRegExp } from 'utils/regexps';
import { convertListToObjectBy } from 'utils/fn';

export const processSpacesAndLinebreaks = htmlTemplate =>
  htmlTemplate.replace(/<br\s*[/]?>/gi, '\n').replace(/&nbsp;/g, '\u00a0');

export const convertHtmlWithImgTagsToLinksString = (htmlTemplate) => {
  const nextHtml = processSpacesAndLinebreaks(htmlTemplate)
    .replace(imgTagWithSpacesRegExp, (imgNodeTemplate) => {
      const imgDataUrl = getAttrValueFromNodeTemplate(imgNodeTemplate, 'data-url');
      if (imgDataUrl) {
        // add spaced between links
        return ` ${imgDataUrl} `;
      }
      return '';
    })
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/^\s+/gm, '');

  return nextHtml.trim();
};

export const getMappedExistingLinks = (text, currentLinks, shortLink) => {
  const nextLinks = text.match(messageUrlRegExp) || [];
  const linksMap = convertListToObjectBy('link')(currentLinks);
  return nextLinks.map((linkName) => {
    if (linksMap[linkName]) {
      return { link: linkName, shortLink: linksMap[linkName].shortLink || shortLink, isShort: linksMap[linkName]?.isShort };
    }
    return { link: linkName, isShort: false };
  });
};
