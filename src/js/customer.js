function initPage(){

	// Display categories.
	$.ajax({
		url: '/api/v1/categories',
		type: 'GET',
		contentType: 'application/json',
		success: function(data) {
			console.log(data);
		}
	});


}








$(document).ready(function() {

	// Place customer and order metadata into the session storage on first page load.
	if (sessionStorage.length === 0) {

		// Current customer is Han Solo who has OrderId of 1.
		sessionStorage.userId = 1;
		sessionStorage.orderId = 1;
	}
	initPage();
});
