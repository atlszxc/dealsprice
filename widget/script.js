/*global define*/
/*eslint no-undef: "error"*/

define([], function () {
	let CustomWidget = function () {
		let self = this;
		this.callbacks = {		
			render: function () {
				console.log("render");
				return true;
			},
			init: function () {
				const settings = self.get_settings();
				console.log(settings);
				console.log("init");
				return true;
			},
			bind_actions: function () {
				console.log("bind_actions");
				return true;
			},
			settings: function () {
				console.log("settings");
				return true;
			},
			onSave: function () {
				alert("click");
				return true;
			},
			destroy: function () {

			},
			contacts: {
				//select contacts in list and clicked on widget name
				selected: function () {
					console.log("contacts");
				}
			},
			leads: {
				//select leads in list and clicked on widget name
				selected: function () {
					console.log("leads");
				}
			},
			tasks: {
				//select taks in list and clicked on widget name
				selected: function () {
					console.log("tasks");
				}
			},
			dpSettings: function () { },
			advancedSettings: function () { },
			onSalesbotDesignerSave: function (handler_code, params) {
				console.log(handler_code, params); 
			},
			todo: {
				selected: function () { }
			},
			onAddAsSource: function (pipeline_id) {
				console.log(pipeline_id); 
			}
		};
		return this;
	};
	return CustomWidget;
});