//Annamaria Dal Bo

var pxEND, pzEND;
var insideArea = false; //default = red, green when the pizza can be delivered
var endGame = false;
var gameOver = false;
var hit = 0;

function ENDGame() {
	if (key[4] && insideArea) { //BAR SPACE clicked
		key[4]=false;
		console.log("fine");
		endGame = true;
		let string; 
		string = "Obiettivo raggiunto!";
		document.getElementById('text').innerHTML = string;
		alert("Sei riuscito a salvarti. Complimenti! Ricarica il gioco se vuoi riprovare");
		}	
	}

	function GameOver() {
		/*
			if(Math.round(px) >= (objectsToDraw[6].uniforms.u_world[14]-100) && Math.round(px) <= (objectsToDraw[6].uniforms.u_world[14]+100)
			&& Math.round(pz) >= (objectsToDraw[6].uniforms.u_world[12]-100) && Math.round(pz) <= (objectsToDraw[6].uniforms.u_world[12]+100) && Math.round(py) >= (objectsToDraw[6].uniforms.u_world[13]-100) && Math.round(py) <= (objectsToDraw[6].uniforms.u_world[13]+100)){
			console.log(px,py,pz, objectsToDraw[6].uniforms.u_world[14], objectsToDraw[6].uniforms.u_world[13], objectsToDraw[6].uniforms.u_world[12]);
			gameOver = true;
			let string; 
			string = "Hai perso!";
			document.getElementById('text').innerHTML = string;
			alert("Hai perso! Ricarica il gioco se vuoi riprovare");
			}*/
			if(Math.round(px) >= (objectsToDraw[0].uniforms.u_world[12]-90) && Math.round(px) <= (objectsToDraw[0].uniforms.u_world[12]+90)
				&& Math.round(pz) >= (objectsToDraw[0].uniforms.u_world[14]-90) && Math.round(pz) <= (objectsToDraw[0].uniforms.u_world[14]+90) && Math.round(py) >= (objectsToDraw[0].uniforms.u_world[13]+90) && Math.round(py) <= (objectsToDraw[0].uniforms.u_world[13]+90)){
			hit++;
			test(hit);
			}
			console.log(px,py,pz, objectsToDraw[0].uniforms.u_world[12], objectsToDraw[0].uniforms.u_world[13], objectsToDraw[0].uniforms.u_world[14]);

				
		}

function test(hit){
	if(hit==1){
		let string; 
			string = "Hai ancora una vita!";
			document.getElementById('text').innerHTML = string;
	}
	else if(hit==2){
		let string; 
			string = "Hai perso!";
			document.getElementById('text').innerHTML = string;
			alert("Hai perso! Ricarica il gioco se vuoi riprovare");
	}
}


function areaInit(){
	pxEND = getRndInteger(-400, +400);
	pzEND = getRndInteger(-400, +400);
}