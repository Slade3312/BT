import React from 'react';
import PropTypes from 'prop-types';
import PngRoundIcon from './assets/png-icon.svg';
import JpgRoundIcon from './assets/jpg-icon.svg';
import XlsRoundIcon from './assets/xls-icon.svg';
import PdfRoundIcon from './assets/pdf-icon.svg';
import DocRoundIcon from './assets/doc-icon.svg';

import * as fileIcons from './assets/index.js';

const getCurrentIcon = (ext, props) => {
  switch (ext) {
    case 'doc': return fileIcons.doc;
    case 'docx': return fileIcons.doc;
    case '7zip': return fileIcons.sevenZip;
    case 'xls': return fileIcons.xls;
    case 'xlsx': return fileIcons.xls;
    case 'pdf': return fileIcons.pdf;
    case 'txt': return fileIcons.txt;
    case 'zip': return fileIcons.zip;

    case 'jpgRound': return <JpgRoundIcon {...props} />;
    case 'pngRound': return <PngRoundIcon {...props} />;
    case 'docRound': return <DocRoundIcon {...props} />;
    case 'pdfRound': return <PdfRoundIcon {...props} />;
    case 'xlsRound': return <XlsRoundIcon {...props} />;
    default: return fileIcons[ext] || fileIcons.txt;
  }
};

export default function FileIcon({ extension, alt, isSvgIcon, ...props }) {
  return isSvgIcon
    ? getCurrentIcon(extension, props)
    : <img src={getCurrentIcon(extension)} alt={alt} {...props} />;
}

FileIcon.propTypes = {
  extension: PropTypes.string,
  alt: PropTypes.string,
  isSvgIcon: PropTypes.bool,
};
