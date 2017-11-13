'use strict';

require('jquery');

var headerTemplate = require('../templates/header.handlebars');

$(document).ready(function(){
	$('header').html(headerTemplate({}));
});
