'use strict';

const should = require('should');
const billIdGenerator = require('../../lib/helper/billIDGenerator');

describe('# Test Bill ID generator', () => {
  it('- Should generate a valid id.', () => {
    const res=billIdGenerator.billGenerator({preFlightValue: 1, mode: 'padding'});
    should(res).be.eql('xxxxxxx1');
  });
  it('- Should use defaults options to generate Bill ID', ()=>{
    const res=billIdGenerator.billGenerator({preFlightValue: 1});
    res.should.be.eql('xxxxxxx1');
  });
  it('- Should throw an error\t missed value', (done)=>{
    try {
      billIdGenerator.billGenerator();
      done(new Error('This test required to throw an error.'));
    } catch (err) {
      err.message.should.be.eql('Invalid value passed.');
      done();
    }
  });
});
