import PropTypes from 'prop-types';
import React from 'react';
import { FileExistingIcon, LoaderIcon } from './assets';

const Icons = {
  fileExisting: FileExistingIcon,
  loader: LoaderIcon,
};

export default function Icon({ slug, className }) {
  const SvgIcon = Icons[slug];
  if (!SvgIcon) return null;

  return <SvgIcon className={className} />;
}

Icon.propTypes = {
  slug: PropTypes.string,
  className: PropTypes.any,
};
