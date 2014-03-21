describe('TerrainHandler', function(){
    var scope;//we'll use this scope in our tests
 	var unitlistservice ;
    //mock Application to allow us to inject our own dependencies
    beforeEach(angular.module('IronbaneApp',['unitlist']));
    beforeEach(inject(function(_UnitList_){
    	_unitlist = unitlist;
    }));
    it("is a service", function(){

  });
});