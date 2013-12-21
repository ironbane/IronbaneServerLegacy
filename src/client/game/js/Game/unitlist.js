var UnitList = Class.extend({
	Init: function(){
		var unitlist = [];
		this.addUnit = function(unit){
			unitlist.push(unit);
		};
		this.findUnit = function(searchOption){
            if(_.isNumber(searchOption)){
                var id = searchOption;
                if ( !id ) return null;

                if ( ironbane.player && ironbane.player.id == id ) return ironbane.player;

                return _.find(unitlist, function(unit){
                  return unit.id === id; 
                });
            }
            if(_.isFunction(searchOption)){
                return _.find(unitlist, function(unit){
                    return searchOption(unit);
                });
            }
          
        };
        this.removeUnit = function(unit){
            unitlist = _.without(unitlist, unit);
        };
        this.clear = function(){
        	unitlist = [];
        };
        this.removeUnits = function(units){
        	unitlist = _.difference(unitlist, units);
        };
        this.iterate = function(func){
            _.each(unitlist, function(unit){
                func(unit);
            });
        };
        this.destroy = function(){
            _.each(unitist, function(unit){
                unit.Destroy();
            });
        };

	}
});