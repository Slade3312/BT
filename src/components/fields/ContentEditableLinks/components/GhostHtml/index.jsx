import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { imgTagRegExp } from 'utils/regexps';
import { escapeStringRegexp, explodeStringByRegExp } from 'utils/fn';
import { getAttrValueFromNodeTemplate } from 'utils/dom-helpers';
import TagNode from '../TagNode';

// this component receive html content from editable div
// the content consist of: textNodes, textNodes with new urls, <img> tags (existed visual tags and confirmed urls)
// our goal to show visual tags only for <img> (convert it to visual tags) and don't touch existing url in our content
function GhostHtml({
  template = '',
  links,
  onSwitchToShortLink,
  onResetShortLink,
  onRemoveLink,
}) {
  let lastPostFix = template;

  const matchedTags = template.match(imgTagRegExp) || [];
  const result = matchedTags.reduce((acc, curImgTag, index) => {
    const [prefix, curMatched, postfix] = explodeStringByRegExp(lastPostFix, escapeStringRegexp(curImgTag));

    const nodes = [prefix];

    if (curMatched) {
      const curUrl = getAttrValueFromNodeTemplate(curImgTag, 'data-url');

      const key = `${curUrl}-${index}`;

      const isShort = !!links.find(data => data.link === curUrl && data.isShort);

      nodes.push(<TagNode
        key={key}
        url={curUrl}
        index={index}
        isShortLink={isShort}
        onShort={() => (isShort ? onResetShortLink(curUrl) : onSwitchToShortLink(curUrl))}
        onRemove={() => onRemoveLink(index)}
      />);
    }

    lastPostFix = postfix;

    return [...acc, ...nodes];
  }, []);

  return <Fragment>{result}</Fragment>;
}

GhostHtml.propTypes = {
  links: PropTypes.array,
  onSwitchToShortLink: PropTypes.func,
  onResetShortLink: PropTypes.func,
  onRemoveLink: PropTypes.func,
  template: PropTypes.string,
};

export default GhostHtml;
