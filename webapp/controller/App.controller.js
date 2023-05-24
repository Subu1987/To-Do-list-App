sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Input"

], function(Controller, JSONModel, Dialog, Button, Input) {
	"use strict";

	return Controller.extend("App_todolist.controller.App", {

		onInit: function() {

			// get the localStorage data 
			var oNewData = JSON.parse(localStorage.getItem("oDataLocal"));
			console.log(oNewData);

			if (oNewData === null) {
				var oData = {
					items: [{
						title: "Task no 1"
					}, {
						title: "Task no 2"

					}]
				};
			} else {
				// blank data 
				oData = {
					items: [

					]
				};

				// set the localStorage data in new variable
				oData.items = oNewData;
			}

			console.log(oData);

			// create a JSON Model for the to-do items
			var oModel = new JSONModel(oData);

			//set the JSON Model in the view
			this.getView().setModel(oModel);
			var sModel = this.getView().getModel();
			console.log(sModel);
			var count = 1;
			this.getView().getModel().setProperty("/count", count);

		},
		onLiveChange: function(oEvent) {

			// get the input value
			var sValue = oEvent.getParameter("value");

			// set the input value as a new property in model 
			this.getView().getModel().setProperty("/newItem", sValue);
		},
		onAddTask: function(oEvent) {

			// get the input value from model
			var sNewTask = this.getView().getModel().getProperty("/newItem");
			/*var sEventTime = this.getView().byId("datePickr").getValue();*/

			// chk value should not blank 
			if (sNewTask) {
				var aItems = this.getView().getModel().getProperty("/items");
				aItems.unshift({
					title: sNewTask
				});

				// now again set the properties model 
				this.getView().getModel().setProperty("/items", aItems);
				this.getView().getModel().setProperty("/newItem", "");
				/*this.getView().byId("datePickr").setValue("");*/

				// refresh the model 
				this.getView().getModel().refresh(true);

				// store into localStorage
				var sItemData = this.getView().getModel().getProperty("/items");
				var sItemDataStr = JSON.stringify(sItemData);

				localStorage.setItem("oDataLocal", sItemDataStr);

			}
		},
		/*onToggleTask: function(oEvent) {
			var oItem = oEvent.getSource();
			var oContext = oItem.getBindingContext();
			var bCompleted = oContext.getProperty("completed");

			oContext.getModel().setProperty(oContext.getPath() + "/completed", !bCompleted);
		},*/
		onDeleteTask: function(oEvent) {
			var oList = this.getView().byId("list");

			// calculate the index of the selected list item
			var sPath = oEvent.mParameters.listItem.oBindingContexts.undefined.sPath;
			var iLength = sPath.length;
			var iIndex = sPath.slice(iLength - 1);

			// remove the selected list item from the model based on the index
			var oDataList = this.getView().getModel().getData();

			oDataList.items.splice(iIndex, 1);

			// set the data to the model again 
			this.getView().getModel().setData(oDataList);

			// refresh the model 
			this.getView().getModel().refresh(true);

			// store into localStorage
			var sItemData = this.getView().getModel().getProperty("/items");
			var sItemDataStr = JSON.stringify(sItemData);
			localStorage.setItem("oDataLocal", sItemDataStr);

		},
		onEditTask: function(oEvent) {
			var that = this;
			var count = this.getView().getModel().getProperty("/count");

			var oId = oEvent.getParameters("id").id.split("--")[1];

			// function for generate a unique id
			function generateUniqueId() {
				var uniqueId = oId + count;
				console.log(oId);
				console.log(uniqueId);
				count++;
				that.getView().getModel().setProperty("/count", count);
				return uniqueId;

			}
			var newId = generateUniqueId();
			/*var sUniqueID = this.getView().createId("myPrefix");*/
			var oItem = oEvent.getSource();
			var oContext = oItem.getBindingContext();

			// get the index of item
			var sPath = oEvent.getSource().getBindingContext()['sPath'];
			var iLength = sPath.length;
			var iIndex = sPath.slice(iLength - 1);

			// get the title
			var sTitle = oContext.getModel().getProperty("/items")[iIndex].title;

			var oInputDialog = new Dialog({
				title: "Edit Task",
				content: [
					new Input({
						value: sTitle,
						width: "100%",
						id: newId
					})
				],
				beginButton: new Button({
					text: "Save",
					press: function() {

						var sNewTitle = sap.ui.getCore().byId(newId).getValue();

						oInputDialog.close();

						var aItems = oContext.getModel().getProperty("/items");
						aItems[iIndex].title = sNewTitle;
						oContext.getModel().setProperty("/items", aItems);

						// store into localStorage
						var sItemData = that.getView().getModel().getProperty("/items");
						var sItemDataStr = JSON.stringify(sItemData);
						localStorage.setItem("oDataLocal", sItemDataStr);
					}
				}),
				endButton: new Button({
					text: "Cancle",
					press: function() {
						oInputDialog.close();
					}
				})
			});

			oInputDialog.open();
		}
	});
});