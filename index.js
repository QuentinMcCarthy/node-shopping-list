// Requires.
const http = require("http");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");
const listData = require("./data/list.json");

// Server variable.
var server = http.createServer(function(request, response){
    console.log(`${request.method} request for ${request.url}`);
    // var page;

	// Separate GET and POST requests.
	if(request.method === "GET"){
		// If the url is any of these, then the user is on the specified page.
	    if(request.url === "/" || request.url === "/home" || request.url === "/index"){
			// Read the html file for the page and display it if there is no errors.
	        fs.readFile("./public/index.html", "UTF-8", function(error, contents){
	            if(error){
					console.log(error);
	                console.log("Error, something went wrong");
	            } else {
	                response.writeHead(200, {"Content-Type": "text/html"});
	                response.end(contents);
	            }
	        });
	    } else if(request.url.match(/.js/)){
	        var jsPath = path.join(__dirname, "public", request.url);
	        var fileStream = fs.createReadStream(jsPath, "UTF-8");

	        response.writeHead(200, {"Content-Type": "text/javascript"});
	        fileStream.pipe(response);
	    } else if(request.url.match(/.css$/)){
	        var cssPath = path.join(__dirname, "public", request.url);
	        var fileStream = fs.createReadStream(cssPath, "UTF-8");

	        response.writeHead(200, {"Content-Type": "text/css"});
	        fileStream.pipe(response);
	    } else if(request.url === "/listData"){
			response.writeHead(200, {"Content-Type": "text/json"});
			response.end(JSON.stringify(listData));
		}
	}else if(request.method === "POST"){
		if(request.url === "/addItem"){
			var body = "";

			request.on("data", function(data){
				body += data;
			});

			request.on("end", function(){
				var formData = qs.parse(body);
				// console.log(body);

				fs.readFile("./data/list.json", "utf8", (err, data) => {
					if(err){
						console.log("Error");
						console.log(err);
					} else{
						var dataArray = JSON.parse(data);
						var content = body.split("=")[1]

						dataArray.push(content);

						JSON.stringify(dataArray);

						fs.writeFile("./data/list.json", dataArray, (err) => {
							if(err){
								console.log("Error");
								console.log(err);
							} else{
								console.log("List updated");
							}
						})

					}
				})

				response.writeHead(302, {"Location": "/"});
				response.end();
			});
		}
	}


});

// Server is on port 3000
server.listen(3000);

console.log("The server is running on port 3000");
