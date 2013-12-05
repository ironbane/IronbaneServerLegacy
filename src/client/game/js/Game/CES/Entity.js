var Entity = Class.extend({
	Init: function(){
		this.components = {};
		
		this.id = Entity._id++;
	},
	addComponent: function(component){

	console.log(this.components);
		if(!_.isUndefined(this.components[component.name])){
			console.log("This entity already has component " + component.name);
			return;
		}
		this.components[component.name] = component;

	},
	getComponent: function(componentName){
		if(_.isUndefined(this.components[componentName])){
			console.log("This entity has no component " + componentName);
			return;
		}
		return this.components[componentName];
	}
});

Entity._id = 0;