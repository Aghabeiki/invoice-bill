'use strict';
/**
 *
 * @typedef BillIDGeneratorConfig BillIDGeneratorConfig
 * @property {*} preFlightValue The value  that bill id should generate based on.
 * @property {BillIDGeneratorMode} mode Bill ID generator mode.
 *
 */
/**
 * @desc Generate Bill ID based passed options.
 * @param {BillIDGeneratorConfig} options
 * @private
 * @return {String}
 */
const BillIDGeneratorMode=module.exports = {
  padding: 'padding',
};

module.exports.billGenerator= (options = {}) => {
  const formatter = billIDGenerationImplementation[BillIDGeneratorMode[options.mode]] ||
      billIDGenerationImplementation.padding;
  return formatter(options.preFlightValue);
};

const billIDGenerationImplementation = {
  padding: (value) => {
    if (value) {
      return value.toString().padStart(8, 'x');
    } else throw new Error('Invalid value passed.');
  },
};

