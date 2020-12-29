import PropTypes from 'prop-types';
import React from 'react';
import { IconTypes } from '../helpers/constants';
import { MessageIcon, MonitorIcon, PhoneIcon } from './assets';

const Icons = {
  [IconTypes.MESSAGE]: MessageIcon,
  [IconTypes.MONITOR]: MonitorIcon,
  [IconTypes.PHONE]: PhoneIcon,
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
