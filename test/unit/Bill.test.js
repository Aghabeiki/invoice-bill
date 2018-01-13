'use strict';

const should = require('should');
const Bill = require('../../lib/Bill');
const mockery = require('mockery');
const isHtml = require('is-html');
const fs = require('fs');
describe('# Bill Class unit test', () => {
  it('- Should generate bill in HTML and PDF form', (done) => {
    const bill = new Bill({billIDGenerator: {preFlightValue: 1, mode: 'padding'}, from: {issuer: 'Amin'}});
    bill.should.be.instanceof(Bill);
    should(bill.to).be.eql('Dear value customer.');
    should(bill.currency).be.eql('IRR');
    should(bill.from).have.properties({issuer: 'Amin'});
    bill.billID.should.be.eql('xxxxxxx1');
    bill.from = {issuer: 'Amin', companyName: 'RaianRaika'};
    bill.to = 'Amin';
    bill.currency = 'MYR';
    bill.from.should.have.properties({issuer: 'Amin', companyName: 'RaianRaika'});
    bill.currency.should.be.eql('MYR');
    bill.newRecords({discount: 0, itemName: 'test', itemBasePrice: 1, itemCount: 1});
    const test = bill.renderToHTML();
    test.should.be.ok();
    isHtml(test).should.be.ok();
    bill.renderPDF(__dirname, 'test.pdf', {
      'format': 'Letter',
      'orientation': 'portrait',
    }).then((filePath) => {
      fs.existsSync(filePath).should.be.ok();
      fs.unlinkSync(filePath);
      done();
    })
      .catch(done);
  });
  it('- Should throw an error in newRecords method\t invalid record pass to method.', (done) => {
    const bill = new Bill({billIDGenerator: {preFlightValue: 1, mode: 'padding'}, from: {issuer: 'Amin'}});
    try {
      bill.newRecords();
      done(new Error('This test required to throw an error.'));
    } catch (err) {
      err.message.should.be.eql('Item name or Item Price is required for generate bill.');
      done();
    }
  });
  it('- Should throw an error in payment method\t this method not implemented yet.!', (done) => {
    const bill = new Bill({billIDGenerator: {preFlightValue: 1, mode: 'padding'}, from: {issuer: 'Amin'}});
    try {
      bill.payment();
      done(new Error('This test required to throw an error.'));
    } catch (err) {
      err.message.should.be.eql('Not implemented.');
      done();
    }
  });
  it('- Should throw an error in renderToHTML method\t because of invalid template', (done) => {
    const bill = new Bill({
      billIDGenerator: {preFlightValue: 1, mode: 'padding'},
      from: {issuer: 'Amin'},
      templatePath: require('path').resolve(__dirname, '../resource/invalidJadeFile.jade'),
    });
    try {
      bill.renderToHTML();
      done(new Error('This test required to throw an error.'));
    } catch (err) {
      err.message.should.be.containEql('something wrong');
      done();
    }
  });
  it('- Should throw an error in renderPDF method\t because of invalid output path', (done) => {
    const bill = new Bill({
      billIDGenerator: {preFlightValue: 1, mode: 'padding'},
      from: {issuer: 'Amin'},
    });
    bill.renderPDF().then(() => {
      done(new Error('This test required to throw an error.'));
    })
      .catch((err) => {
        err.message.should.be.eql('Output path is required');
        done();
      });
  });
  it('- Should throw an error in  method\t an error happen in HTML rendering part', (done)=>{
    const bill = new Bill({
      billIDGenerator: {preFlightValue: 1, mode: 'padding'},
      from: {issuer: 'Amin'},
      templatePath: require('path').resolve(__dirname, '../resource/invalidJadeFile.jade'),
    });
    bill.renderPDF()
      .then(()=>{
        done(new Error('This test required to throw an error.'));
      })
      .catch((err)=>{
        err.message.should.be.containEql('something wrong');
        done();
      });
  });

  it('- Should throw an error in  method \t an error will be happen in `html-pdf` module.', (done)=>{
    const mockedModule='html-pdf';
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true,
    });
    const htmlPDF = {
      create: function() {
        return {
          toFile(...args) {
            args.reverse()[0](new Error('A test error.'));
          },
        };
      },
    };
    mockery.resetCache();
    mockery.registerMock(mockedModule, htmlPDF);
    const Bill=require('../../lib/Bill');
    const bill = new Bill({billIDGenerator: {preFlightValue: 1, mode: 'padding'}, from: {issuer: 'Amin'}});
    bill.renderPDF(__dirname)
      .then(()=>{
        mockery.deregisterMock(mockedModule);
        mockery.disable();
        done(new Error('This test required to throw an error.'));
      })
      .catch((err)=>{
        mockery.deregisterMock(mockedModule);
        mockery.disable();
        err.message.should.be.eql('A test error.');
        done();
      });
  });
});
