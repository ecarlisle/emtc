'use strict';

require('jquery');

var inventoryTemplate = require('../templates/inventory.handlebars');

function updateQuantity(e) {
	var $obj = $(e.currentTarget);
	var inventoryId = $obj.data('id');
	var quantity = $obj.siblings('input.quantity').val();

	// TODO : Client-side validation on entered quantity.

	$.ajax({
		url: '/api/v1/widgets/item',
		type: 'PUT',
		data: JSON.stringify({"quantity": parseInt(quantity), "id": inventoryId}),
		success: function(data) {

				// This console.log is just for debugging and would not be in
				// production code. On an application the user should be
				// provided some on-screen cue for waiting and result state.
				if (data.rowsAffected.length === 1) {
					console.log('Quantity update succeeded!');
				} else {
					console.log('Quantity update failed!');
				}
			}
	});
}

function setEventHanders() {
	$('.fa-save').on('click',function(e){
		updateQuantity(e);
	});
}

$(document).ready(function() {
	$.ajaxSetup({
		contentType : 'application/json',
		processData : false,
	});

	$.ajax({
		url: '/api/v1/widgets',
		type: 'GET',
		contentType: 'application/json',
		success: function(data) {
			$('#inventory').html(inventoryTemplate(data));
			setEventHanders();
		}
	});
});
