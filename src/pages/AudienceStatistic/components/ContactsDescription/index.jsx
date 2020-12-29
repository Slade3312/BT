import React from 'react';
import classNames from 'classnames/bind';
import commonStyles from 'styles/common.pcss';
import { IconLink, IconPseudoLink } from 'components/buttons/IconLinks';
import { STATIC_LINKS } from 'pages/AudienceStatistic/constants';
import { downloadTxtFile } from 'utils/router';
import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

const handleTxtDownloadClick = () => {
  downloadTxtFile(STATIC_LINKS.EXAMPLE_TXT);
};

export const htmlOptions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.class === 'focusIconLink') {
      return (
        <IconLink
          isCompact
          target={domNode.attribs.target}
          href={domNode.attribs.href}
          className={cx('link')}
        >
          {domNode.children.map(item => item.data)}
        </IconLink>
      );
    }
    if (domNode.attribs && domNode.attribs.class === 'focusIconTxtLink') {
      return (
        <IconPseudoLink
          isCompact
          target={domNode.attribs.target}
          href={domNode.attribs.href}
          onClick={handleTxtDownloadClick}
          className={cx('link')}
        >
          {domNode.children.map(item => item.data)}
        </IconPseudoLink>
      );
    }
    return domNode;
  },
};
