/**
* @class UnitList
* @constructor
*/
var UnitList = Class.extend({
    
	Init: function(){
		var unitlist = [];

        /**
        * @method addUnit
        * @param {Unit} unit
        * Adds a unit to the unitlist
        **/
		this.addUnit = function(unit){
			unitlist.push(unit);
		};

        /**
        * @method size
        * @return {Number} length
        * Returns the number of units in the unitlist
        **/
        this.size = function() {
            return unitlist.length;
        };

        /**
        * @method findUnit
        * @param {Number} unitID
        * @param {Function} searchFunction
        * @return {Unit}
        * finds a unit based on unitID or searchFunction
        **/
		this.findUnit = function(searchOption){
            if(_.isNumber(searchOption)){
                var id = searchOption;
                if ( ironbane.player && ironbane.player.id == id ){
                    return ironbane.player;    
                } 

                var unit =_.find(unitlist, function(unit){
                  return unit.id === id; 
                });
                return unit;
            }
            if(_.isFunction(searchOption)){
                var searchFunction = searchOption;
                return _.find(unitlist, function(unit){
                    return searchFunction(unit);
                });
            }
          
        };
        /**
        * @method all
        * @return {Number} 
        * Returns the unitlist, will be removed in production
        **/
        this.all = function(){
            return unitlist;
        };

        /**
        * @method findUnits
        * @param {Function} searchFunction
        * @return {Array}
        * finds units based on searchFunction
        **/
        this.findUnits = function(searchFunction){
            return _.filter(unitlist, searchFunction)
        };

         /**
        * @method removeUnit
        * @param {Unit} unit
        * Removes a unit from the unitlist
        **/
        this.removeUnit = function(unit){
            unitlist = _.without(unitlist, unit);
        };
        /**
        * @method clear
        * Clears the unitlist
        **/
        this.clear = function(){
        	unitlist = [];
        };
        /**
        * @method removeUnits
        * @param {Array} units
        * Removes the units from the unitlist
        **/
        this.removeUnits = function(units){
        	unitlist = _.difference(unitlist, units);
        };
        /**
        * @method iterate
        * @param {Function} func
        * Iterate over the unitlist and apply the function to each unit
        **/
        this.iterate = function(func){
            _.each(unitlist, function(unit){
                func(unit);
            });
        };
        /**
        * @method destroy
        * Calls unit.destroy() for each Unit in the unitlist
        **/
        this.destroy = function(){
            _.each(unitlist, function(unit){
                unit.Destroy();
            });
        };
         /**
        * @method tick
        * @param {Number} dTime
        * Calls unit.tick(dTime) for each Unit in the unitlist
        **/
        this.tick = function(dTime){
            _.each(unitlist, function(unit) {
                   unit.tick(dTime);
            });
        };

	}
});