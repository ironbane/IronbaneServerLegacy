IronbaneApp.service("ZoneConstants", function(){
	this.zone = null;
	
	this.getZoneConfig = function(string) {
            if ( angular.isUndefined(zoneTypeConfig[zones[this.zone]['type']][string]) ) {
              bm('Error: \''+string+'\' not defined for zone '+zones[this.zone].name+'!');
              return 0;
            }
            return zoneTypeConfig[zones[this.zone]['type']][string];
          };

});