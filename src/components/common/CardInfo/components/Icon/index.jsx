import React from 'react';
import PropTypes from 'prop-types';

import TagIcon from './assets/tag.svg';
import QuestionIcon from './assets/question.svg';
import PdfIcon from './assets/pdf.svg';
import ArrowIcon from './assets/arrow.svg';

const icons = {
  tag: TagIcon,
  question: QuestionIcon,
  pdf: PdfIcon,
  arrow: ArrowIcon,
};

export default function Icon({ slug, className }) {
  const SvgIcon = icons[slug];
  if (!SvgIcon) return null;

  return <SvgIcon className={className} />;
}

Icon.propTypes = {
  slug: PropTypes.string,
  className: PropTypes.any,
};
