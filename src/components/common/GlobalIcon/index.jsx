import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FILE_FORMATS } from 'pages/constants';
import { isValidReactElement } from 'utils/dom-helpers';

import {
  PhoneIcon,
  PaperIcon,
  BasketIcon,
  WritedPaperIcon,
  ThumpUp,
  SmileFailure,
  CrossIcon,
  ArrowRightLongIcon,
  DocDocumentIcon,
  CsvDocumentIcon,
  FileAddIcon,
  EditIcon,
  arrowCircled,
  arrowLeft,
  arrowLeftBack,
  burger,
  checked,
  crossThin,
  documents,
  dropdownArrow,
  enter,
  exit,
  externalLink,
  home,
  mapMarker,
  ok,
  personal,
  phoneHandset,
  play,
  search,
  tariffCheck,
  placeMark,
  clip,
  editSquare,
  smallShevron,
  arrowRightBold,
  checkMark,
  stickerHeart,
  stickerCard,
  roundQuestion,
  message,
  monitor,
  strokeRightArrow,
  emojiSmile,
  ticket,
  reload,
  reloadWhite,
  updating,
  pdf,
  userYellow,
  uploadedDocument,
  showMore,
  iconLeftList,
  backSmallArrow,
  clock,
  iconLeftListBig,
  allItems,
  handshake,
  handshakeWhiteLarge,
  calendarIcon,
  deleteIcon,
  handshakeSmallGrey,
  speaker,
  chartPie,
  docList,
  equalizer,
  warningRed,
} from './assets';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const Icons = {
  phone: PhoneIcon,
  paper: PaperIcon,
  basket: BasketIcon,
  writedPaper: WritedPaperIcon,
  smileFailure: SmileFailure,
  thumpUp: ThumpUp,
  cross: CrossIcon,
  docDocumentIcon: DocDocumentIcon,
  csvDocumentIcon: CsvDocumentIcon,
  fileAdd: FileAddIcon,
  arrowCircled,
  arrowLeft,
  arrowLeftBack,
  burger,
  arrowRightLong: ArrowRightLongIcon,
  edit: EditIcon,
  editSquare,
  checked,
  crossThin,
  documents,
  dropdownArrow,
  enter,
  exit,
  externalLink,
  home,
  mapMarker,
  ok,
  personal,
  phoneHandset,
  play,
  search,
  tariffCheck,
  placeMark,
  clip,
  smallShevron,
  arrowRightBold,
  checkMark,
  stickerHeart,
  stickerCard,
  roundQuestion,
  message,
  monitor,
  strokeRightArrow,
  emojiSmile,
  ticket,
  reload,
  updating,
  reloadWhite,
  pdf,
  userYellow,
  uploadedDocument,
  showMore,
  iconLeftList,
  backSmallArrow,
  clock,
  iconLeftListBig,
  allItems,
  handshake,
  handshakeWhiteLarge,
  calendarIcon,
  deleteIcon,
  handshakeSmallGrey,
  speaker,
  chartPie,
  docList,
  equalizer,
  warningRed,
};

const SymbolicIcons = {
  arrowRightMinimal: true,
};

/*
  able to render icon in some cases:
  - render icon as slug if passed slug
  - render pure react nodes or node, if passed
  - else render icon as pure src image
 */
export default function GlobalIcon({ slug, icon, className }) {
  const SvgIcon = Icons[slug];
  const SymbolicIcon = SymbolicIcons[slug];

  if (SvgIcon) return <SvgIcon className={className} />;
  if (SymbolicIcon && slug === 'arrowRightMinimal') {
    return <div className={cx('arrowMinimal', className)} />;
  }
  if (isValidReactElement(icon)) {
    return <span className={cx('nodeContainer', className)}>{icon}</span>;
  }
  return icon ? <img className={cx(className)} src={icon} alt={slug || icon} /> : null;
}

GlobalIcon.getFileIconSlug = (fileFormat) => {
  switch (fileFormat) {
    case FILE_FORMATS.CSV: {
      return 'csvDocumentIcon';
    }
    case FILE_FORMATS.TXT: {
      return 'docDocumentIcon';
    }
    default: {
      return 'paper';
    }
  }
};

GlobalIcon.propTypes = {
  slug: PropTypes.string,
  className: PropTypes.any,
  icon: PropTypes.any,
};
