import { axiosBaseRequest } from 'requests/helpers';

export const downloadTxtFile = (url) => {
  axiosBaseRequest({ url, responseType: 'text' }).then((response) => {
    const link = document.createElement('a');
    const blob = new Blob([response], { type: 'text/plain' });
    const fileName = url.slice(url.lastIndexOf('/') + 1);
    if (window.navigator.msSaveOrOpenBlob) {
      // for IE11
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      link.download = fileName;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    }
  });
};

export const normalizeEndOfUrl = url => (url[url.length - 1] === '/' ? url : `${url}/`);
