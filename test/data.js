var Data = require('../lib/data');
var should = require('should');

describe('Data', function() {
  var data;
  var testData = [
    {
      id: 1,
      content: 'content1',
      achieve: false
    },
    {
      id: 2,
      content: 'content2',
      achieve: false
    },
    {
      id: 3,
      content: 'content3',
      achieve: true
    }
  ]

  beforeEach(function() {
    data = new Data;
    data.data = testData;
  });

  it('should be an object', function() {
    data.should.be.an.Object;
  });

  describe('#find', function() {
    it('should return all data', function() {
      data.find().should.eql(testData);
    });

    it('should return matched data', function() {
      data.find({id: 1}).should.eql([{id:1, content: 'content1', achieve: false}]);
    });
  });

  describe('#remove', function() {
    it('should remove the matched data and return the removed one', function() {
      data.remove({id: 1}).should.eql([{id:1, content: 'content1', achieve: false}]);
      data.find().should.not.containEql({id:1, content: 'content1', achieve: false});
    });
  });

  describe('#update', function() {
    it('should update the matched data and return the updated one', function() {
      data.update({id: 2}, {achieve: true}).should.eql([{id: 2, content: 'content2', achieve: true}]);
      data.find({id: 2}).pop().should.have.property('achieve', true);
    });
  });
});