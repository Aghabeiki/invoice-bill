'use strict';

const billIDGenerator = require('./helper/billIDGenerator').billGenerator;
const path = require('path');
const fs = require('fs');
const pdf = require('html-pdf');
const jade = require('jade');
const getSymbolFromCurrency = require('currency-symbol-map');

const defaultTemplateRenderingPath = path.resolve(__dirname, './templates/default.jade');
const formatDate = (date) => {
  const monthNames = [
    'January', 'February', 'March',
    'April', 'May', 'June', 'July',
    'August', 'September', 'October',
    'November', 'December',
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
};

/**
 * A Bill object that hold your billing information.
 */
class Bill {
  /**
     * @typedef {object}                  Company         Company(bill issuer) options.
     * @property {string}                 [address]       Company address.
     * @property {string}                 [companyName]   Company name.
     * @property {string}                 issuer          Issuer of Invoice bill
     * @property {string}                 [email]         Company E-mail.
     * @property {string}                 phoneNumber     Company phone number.
     */

  /**
     * @typedef {object}                  BillConfig      Bill constractor options.
     * @property {BillIDGeneratorConfig}  billIDGenerator Configuration required to generate bill.
     * @property {Company}                from            Bill issuer person/company.
     * @property {string}                 to              Invoiced to person/company.
     * @property {string}                 currency        Bill currency(used for mapping to currency Symbol in bill).
     * @property {string}                 templatePath    The JADE template path used for rendering the Bill.
     * @property {string}                 logo            Should be in base64 image format.
     * @property {title}                  [title]         HTML title and/or PDF file prefix name.
     */
  /**
     *
     * @param {BillConfig} config
     */
  constructor(config = {}) {
    /**
         * @desc Bill ID.
         * @type {String}
         * @private
         */
    this._billID = billIDGenerator(config.billIDGenerator);
    /**
         * @desc This bill invoiced from.
         * @type {Company}
         * @private
         */
    this._from = config.from || null;
    /**
         * @desc This bill invoiced to. Default to is 'Dear value customer.'
         * @type {string}
         * @private
         */
    this._to = config.to || 'Dear value customer.';
    /**
         * @desc The bill currency. default currency is IRR
         * @type {string}
         * @private
         */
    this._currency = config.currency || 'IRR';
    /**
         * @desc Bill records.
         * @type {Array}
         * @private
         */
    this._records = [];
    /**
         * @desc JADE template path.
         * @type {string}
         * @private
         */
    this._templatePath = config.templatePath || defaultTemplateRenderingPath;
    /**
         *
         * @type {Array}
         * @private
         */
    this._payment = [];
    /**
         * @desc Logo Image encoded in base64.
         * @type {string}
         * @private
         */
    this._logo = config.logo || '';
    /**
         * @desc Bill title that showed in HTML mode.
         * @type {string}
         * @private
         */
    this._title = config.title || '';
  }

  /**
     *
     * @return {String}
     */
  get billID() {
    return this._billID;
  }

  /**
     *
     * @return {Company}
     */
  get from() {
    return this._from;
  }

  /**
     *
     * @param {Company} value
     */
  set from(value) {
    this._from = value;
  }

  /**
     *
     * @return {string}
     */
  get to() {
    return this._to;
  }

  /**
     *
     * @param {string}value
     */
  set to(value) {
    this._to = value;
  }

  /**
     *
     * @return {string}
     */
  get currency() {
    return this._currency;
  }

  /**
     *
     * @param {string}value
     */
  set currency(value) {
    this._currency = value;
  }

  /**
     *
     * @desc Add new records to bill.
     * @param {object}  record
     * @param {string}  record.itemName             - Item name that should show in bill.
     * @param {string}  [record.itemDescription=''] - Item description that should show in bill.
     * @param {number}  [record.itemCount=1]        - Item count.
     * @param {float}   record.itemBasePrice        - Item base price.
     * @param {float}   [record.discount=0]         - Any discounts
     * @throws Error                                if Item price or Item name missed.
     */
  newRecords(record={}) {
    const {itemName, itemDescription = '', itemCount = 1, itemBasePrice, discount = 0} = record;
    if (!itemName || !itemBasePrice) {
      throw new Error('Item name or Item Price is required for generate bill.');
    } else {
      this._records.push({
        itemName: itemName,
        itemDescription: itemDescription,
        itemCount: itemCount,
        itemBasePrice: itemBasePrice,
        discount: discount,
        total: (itemCount * itemBasePrice) - discount,
      });
    }
  }

  /**
     * @abstract
     * @param {string} paymentType
     * @param {float} value
     */
  payment(paymentType, value) {
    // todo implement this part
    throw new Error('Not implemented.');
  }

  /**
     * @desc Return Rendered bill in HTML form
     * @throws Error
     * @return {string}
     */
  renderToHTML() {
    let defaultPath = defaultTemplateRenderingPath;
    if (fs.existsSync(this._templatePath)) {
      defaultPath = this._templatePath;
    }
    let renderedHTML = null;
    const options = {
      billID: this._billID,
      title: this._title,
      logo: this._logo,
      createDate: formatDate(new Date()),
      from: this._from,
      to: this._to,
      currency: getSymbolFromCurrency(this.currency) || this.currency,
      payment: this._payment,
      recode: this._records,
      total: this._records.reduce((p, v) => {
        p += v.total;
        return p;
      }, 0),
    };
    try {
      renderedHTML = jade.renderFile(defaultPath, options);
    } catch (err) {
      // todo update this part to handel messages.
      throw err;
    }

    return renderedHTML;
  }

  /**
     * @desc Generate bill in PDF format.
     * @param {...*} args
     * @param {string} args.outputPathDIR
     * @param {object} [args.options] rendering options.
     * @param {string} [args.fileName] filename, if not pass a name with title and a time stamp will be created.
     * @return {Promise}
     */
  renderPDF(...args) {
    const outputPathDIR = args[0];
    const fileName = typeof args[1] === 'string' ? args[1] : typeof args[2] === 'string' ? args[2] : undefined;
    const options = typeof args[2] === 'object' ? args[2] : typeof args[1] === 'object' ? args[1] : {};
    return new Promise((resolve, reject) => {
      let html=null;
      try {
        html = this.renderToHTML();
      } catch (err) {
        reject(err);
      }

      if (html && outputPathDIR && fs.existsSync(outputPathDIR)) {
        pdf.create(html, options).toFile(path
          .resolve(outputPathDIR, `${fileName || this._title + new Date().toISOString()}.pdf`), (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res.filename);
          }
        });
      } else if (html) {
        reject(new Error('Output path is required'));
      }
    });
  }
}

module.exports = Bill;
