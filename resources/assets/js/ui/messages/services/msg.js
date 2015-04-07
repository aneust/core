/**
 * @namespace dias.ui.messages
 * @ngdoc service
 * @name msg
 * @memberOf dias.ui.messages
 * @description Enables arbitrary AngularJS modules to post user feedback messages using the DIAS UI messaging system.
 * @example
msg.post('danger', 'Do you really want to delete this?', 'Everything will be lost.');

msg.danger('Do you really want to delete this?', 'Everything will be lost.');
 */
angular.module('dias.ui.messages').service('msg', function () {
		"use strict";
		var _this = this;

		this.post = function (type, message) {
			message = message || type;
			window.$diasPostMessage(type, message);
		};

		this.danger = function (message) {
			_this.post('danger', message);
		};

		this.warning = function (message) {
			_this.post('warning', message);
		};

		this.success = function (message) {
			_this.post('success', message);
		};

		this.info = function (message) {
			_this.post('info', message);
		};

		this.responseError = function (response) {
			var message = response.data.message || "There was an error, sorry.";
			_this.danger(message);
		};
	}
);