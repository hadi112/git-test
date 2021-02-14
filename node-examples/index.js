var rect = require('./rectangle');

function solverect(l,b){
	console.log("Solving rectangle with length "+l+"and breadth "+b);

	rect(l,b,(err,rectangle) => {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else{
			console.log("area: " + rectangle.area());
			console.log("perimeter: " + rectangle.perimeter());
		}
	})
	console.log("this statement is after the call to rect()");
}

solverect(1,2);
solverect(3,4);
solverect(67,73);