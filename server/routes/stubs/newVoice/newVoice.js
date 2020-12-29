const connectionTypes = [
  { id: 1, label: 'Самостоятельный обзвон' },
  { id: 2, label: 'Соединение с заинтересованными абонентами' },
  { id: 3, label: 'Индивидуальные условия' },
];

const callMethods = [
  { id: 1, label: 'Со своего мобильного номера' },
  { id: 2, label: 'C корпоративного номера Билайн' },
];

const activityFields = [
  { group_name: 'Авто', id: 1, children: [{ id: 2, name: 'Audi', cost: 1500 }, { id: 3, name: 'BMW', cost: 2000 }] },
  { group_name: 'Квартиры', id: 4, children: [{ id: 5, name: '3-комн', cost: 4500 }, { id: 6, name: '2-комн', cost: 3200 }] },
];


module.exports = {
  connectionTypes,
  callMethods,
  activityFields,
};
