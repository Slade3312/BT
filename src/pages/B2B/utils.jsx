import React from 'react';

export const messageUrlRegExp = /(?:http(s)?:\/\/)?[а-я\w.-]+(?:\.[а-я\w.-]+)+[а-я\w\-._~:/?#[\]@!$&'()*+,;=.]+/gi;

const imageFormatsArray = ['png', 'jpg', 'gif', 'svg', 'jpeg'];

export const getLinksFromText = (text) => {
  const matchedLinks = text.match(messageUrlRegExp) || [];

  if (matchedLinks.length > 0) {
    return text.split(' ').map((item) => {
      if (item.match(messageUrlRegExp)) {
        return (<React.Fragment><a href={item} target="blank">{item}</a>{' '}</React.Fragment>);
      }
      return `${item} `;
    });
  }

  return text;
};

export const getFormattedDate = (dateString) => new Date(dateString).toLocaleDateString();
export const getTodayDate = new Date().toLocaleDateString();

export const getFormattedTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const getArrayWithDateElements = (inputArray) => {
  const arrayWithDates = [];

  inputArray.forEach((element, index, mappedArray) => {
    if (index === 0) {
      arrayWithDates.push({
        id: '0-date',
        message: element.date_time_message,
        isDateMessage: true,
      });
    }
    if (
      index >= 1 && !mappedArray[index - 1].isDateMessage &&
      getFormattedDate(element.date_time_message) !== getFormattedDate(mappedArray[index - 1].date_time_message)
    ) {
      arrayWithDates.push({
        id: `${element.id}-date`,
        message: element.date_time_message,
        isDateMessage: true,
      });
    }
    if (element.files && element.files.length !== 0) {
      element.files.forEach(item => {
        if (imageFormatsArray.includes(item.file.split('.').pop())) {
          arrayWithDates.push({
            ...element,
            id: `${element.id}-file-${item.id}`,
            imageUrl: item.file,
            files: null,
          });
        } else {
          arrayWithDates.push({
            ...element,
            id: `${element.id}-file-${item.id}`,
            fileUrl: item.file,
            fileExtension: item.file.split('.').pop(),
            files: null,
          });
        }
      });
    }
    if (element.message) arrayWithDates.push(element);
  });

  return arrayWithDates;
};

export const convertActionByType = type => {
  switch (type) {
    case 0:
      return '₽';
    default:
      return '%';
  }
};
