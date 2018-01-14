# invoice-bill [![NPM version](https://badge.fury.io/js/invoice-bill.svg)](https://npmjs.org/package/invoice-bill) [![Build Status](https://travis-ci.org/RaianRaika/invoice-bill.svg?branch=master)](https://travis-ci.org/RaianRaika/invoice-bill) [![Coverage Status](https://coveralls.io/repos/github/RaianRaika/invoice-bill/badge.svg?branch=master)](https://coveralls.io/github/RaianRaika/invoice-bill?branch=master)

> Invoice bill manager.<br>
>Create your checkout invoice-bill, add item(s) details,<br>
>and export them in HTML and/or PDF format(s).
>also the rendering is based a JADE template file so you can use/edit your template and make your bill with your template. 

## Installation

```sh
$ npm install --save invoice-bill
```
## Docs
 [Docs available here](https://raianraika.github.io/invoice-bill/)
## Usage

```js
const InvoiceBill = require('invoice-bill');
const sample = new InvoiceBill({
  billIDGenerator: {preFlightValue: 1, mode: 'padding'},
  currency: 'MYR',
  from: {issuer: 'Amin Aghabeiki'},
  to: 'Some body',
  logo: logo, // Any base64 encoded image.
});
sample.newRecords({itemName: 'test1', itemBasePrice: 10});
sample.newRecords({itemName: 'test2', itemBasePrice: 5, itemCount: 2, discount: 5});
const test = sample.renderToHTML();
require('fs').writeFileSync('test.html', test);
sample.renderPDF(__dirname, {format: 'Letter', orientation: 'landscape'})
  .then((filePath) => {
    console.log(`PDF file generated @ ${filePath}`);// eslint-disable-line no-console
  })
  .catch((err) => {
    console.log(err);
  });

```
And also working example is available [in](https://github.com/RaianRaika/invoice-bill/blob/master/example/app.js)
## options
## InvoiceBill constractor options: [docs](https://raianraika.github.io/invoice-bill/global.html#BillConfig)
* billIDGenerator       BillIDGeneratorConfig		
* from	                Company		
* to                    string		
* currency              string		
* templatePath          string      The JADE template path used for rendering the Bill ,
* logo	string          should      be in base64 image format
* title	title	        <optional>

## renderPDF options: [docs](https://raianraika.github.io/invoice-bill/Bill.html#renderPDF)
* outputPathDIR  string              Output path for storing PDF files. 
* options        object	<optional>  The Rendering options.
* fileName       string	<optional>  The filename, if not pass a name with title and a time stamp will be created.

### Note:
 For PDf rendering the module [`html-pdf `](https://www.npmjs.com/package/html-pdf) used,<br>
 and the rendering options is available [here](https://www.npmjs.com/package/html-pdf#options).

## Running the tests
    `npm test`
## Authors
* Amin Aghabeiki  - Initial work 

## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/RaianRaika/invoice-bill/blob/master/LICENSE) file for details

