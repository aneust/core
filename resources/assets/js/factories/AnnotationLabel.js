/**
 * @ngdoc factory
 * @name AnnotationLabel
 * @memberOf dias.core
 * @description Provides the resource for annotation labels.
 * @requires $resource
 * @returns {Object} A new [ngResource](https://docs.angularjs.org/api/ngResource/service/$resource) object
 * @example
// get all labels of an annotation and update one of them
var labels = AnnotationLabel.query({annotation_id: 1}, function () {
   var label = labels[0];
   label.confidence = 0.9;
   label.$save();
});

// directly update a label
AnnotationLabel.save({confidence: 0.1, annotation_id: 1, id: 1});

// attach a new label to an annotation
var label = AnnotationLabel.attach({label_id: 1, confidence: 0.5, annotation_id: 1}, function () {
   console.log(label); // {id: 1, name: 'my label', user_id: 1, ...}
});


// detach a label
var labels = AnnotationLabel.query({annotation_id: 1}, function () {
   var label = labels[0];
   label.$detach();
});
// or directly
AnnotationLabel.detach({id: 1, annotation_id: 1});
 * 
 */
angular.module('dias.core').factory('AnnotationLabel', function ($resource) {
	"use strict";

	return $resource('/api/v1/annotations/:annotation_id/labels/:id', {
			id: '@id',
			annotation_id: '@annotation_id'
		}, {
			attach: {method: 'POST'},
			save: {method: 'PUT'},
			detach: {method: 'DELETE'}
	});
});