//Annamaria Dal Bo

var pxEND, pzEND;
var insideArea = false; //default = red, green when the pizza can be delivered
var endGame = false;
var gameOver = false;
var hit = 0;
var r=-1;
var l=6


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
		var c_m_t=[c_m[0]+objectsToDraw[l+7].uniforms.u_world[12], c_m[1]+objectsToDraw[l+7].uniforms.u_world[13],c_m[2]+objectsToDraw[l+7].uniforms.u_world[14]];
		for(i=l;i<l+4;i++){
		var c_b_t=[c_b[0]+objectsToDraw[i].uniforms.u_world[12], c_m[1]+objectsToDraw[i].uniforms.u_world[13],c_m[2]+objectsToDraw[i].uniforms.u_world[14]];
		if(Math.sqrt(Math.pow((c_m_t[0]-c_b_t[0]),2)+Math.pow((c_m_t[1]-c_b_t[1]),2)+Math.pow((c_m_t[2]-c_b_t[2]),2)) < 40){
			let string; 
			string = "Hai perso!";
			document.getElementById('text').innerHTML = string;
			alert("GAME OVER!");
		}
		}
		for(i=0;i<l;i++){
		var c_a_t=[c_a[0]+objectsToDraw[i].uniforms.u_world[12], c_a[1]+objectsToDraw[i].uniforms.u_world[13],c_a[2]+objectsToDraw[i].uniforms.u_world[14]];
		if(Math.sqrt(Math.pow((c_m_t[0]-c_a_t[0]),2)+Math.pow((c_m_t[1]-c_a_t[1]),2)+Math.pow((c_m_t[2]-c_a_t[2]),2)) < 25){
			hit++;
			if(hit<=1){
				let string; 
				string = "Hai ancora una vita";
				document.getElementById('text').innerHTML = string;
				objectsToDraw.splice(i,1);
				l--;
				console.log(objectsToDraw);
				r=i;
				return;
			}
			else {
				let string; 
				string = "Hai perso!";
				document.getElementById('text').innerHTML = string;
				alert("GAME OVER!");
				}
			}
		}
		}
		
		


function areaInit(){
	pxEND = getRndInteger(-400, +400);
	pzEND = getRndInteger(-400, +400);
}