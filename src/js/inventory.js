'use strict';

require('jquery');

var inventoryTemplate = require('../templates/inventory.handlebars');

function updateQuantity(e) {
	var $obj = $(e.currentTarget);
	var inventoryId = $obj.data('id');
	var quantity = $obj.siblings('input.quantity').val();

	$.ajax({
		url: '/api/v1/widgets/item',
		type: 'PUT',
		data: {"quantity": quantity, "id": inventoryId},
		success: function(data) {
			console.log(data);
		}
	});
}


function setEventHanders() {
	$('.fa-save').on('click',function(e){
		updateQuantity(e);
	});
}

$(document).ready(function() {
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
