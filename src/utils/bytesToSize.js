export default function bytesToSize(bytes) {
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`; // eslint-disable-line
}
