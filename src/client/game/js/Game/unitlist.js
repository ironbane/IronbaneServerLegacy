var UnitList = Class.extend({
	Init: function(){
		var unitlist = [];
		this.addUnit = function(unit){
			unitlist.push(unit);
		};
        this.size = function() {
            return unitlist.length;
        };
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
        this.all = function(){
            return unitlist;
        };
        this.findUnits = function(searchFunction){
            return _.filter(unitlist, searchFunction)
        }
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
            _.each(unitlist, function(unit){
                unit.Destroy();
            });
        };
        this.tick = function(dTime){
            _.each(unitlist, function(unit) {
                console.log("tick");
                   unit.tick(dTime);
            });
        };

	}
});