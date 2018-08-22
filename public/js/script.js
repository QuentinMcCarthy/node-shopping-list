$(document).ready(function(){
	$.ajax({
		type: "GET",
		url: "http://192.168.33.10:3000/",
		dataType: "json",
		success: function(data){
			console.log(data);
		},
		error: function(err){
			console.log("Error "+err.status);
			console.log(err);
		}
	});
});
