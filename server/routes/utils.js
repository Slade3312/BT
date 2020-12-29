// round float part of value to count digits
module.exports.floatRoundOff = (value, count) => value.toFixed(count);

const getRndFloat = (min, max) => Math.random() * (max - min) + min;

// get random value from interval
module.exports.getRndFloat = getRndFloat;
module.exports.getRnd = (min, max) => Math.round(getRndFloat(min, max));
