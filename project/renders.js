//Annamaria Dal Bo



var matrix_ship //matrice di trasformazione Millennium Falcon
var angle=0; //angolo per andare avanti e indietro
var angle2=0; // angolo per andare a destra e sinistra
// variabili globali per scelta camera
var cambiaCamera = false; // per passare tra la camera posteriore e anteriore
var cameraLibera = false; // drag del mouse

var flags = [false, false, false, false, false, false, false, false,false,false]; //flag per il movimento degli oggetti
//matrici globali. 
var lightWorldMatrix, lightProjectionMatrix, projectionMatrix, cameraMatrix;
const gamepadDisplay = document.getElementById("gamepad-display"); //permette di vedere in tempo reale gli effetti sul gamepad

// ****************************************************************************************************************
// ANIMAZIONE ED EVENTI GAMEPAD
// ****************************************************************************************************************
function update(time){
	const gamepads = navigator.getGamepads();
	if (gamepads[0]){
		const gamepadState = {
			id: gamepads[0].id,
			axes: [
				gamepads[0].axes[0].toFixed(2),
				gamepads[0].axes[1].toFixed(2),
				gamepads[0].axes[2].toFixed(2),
				gamepads[0].axes[3].toFixed(2),
			],
			buttons: [
				{button_0: gamepads[0].buttons[0].pressed},
				{button_1: gamepads[0].buttons[1].pressed},
				{button_2: gamepads[0].buttons[2].pressed},
				{button_3: gamepads[0].buttons[3].pressed},
				{button_4: gamepads[0].buttons[4].pressed},
				{button_5: gamepads[0].buttons[5].pressed},
				{button_6: gamepads[0].buttons[6].pressed},
				{button_7: gamepads[0].buttons[7].pressed},
				{button_8: gamepads[0].buttons[8].pressed},
				{button_9: gamepads[0].buttons[9].pressed},
				{button_10: gamepads[0].buttons[10].pressed},
				{button_11: gamepads[0].buttons[11].pressed},
				{button_12: gamepads[0].buttons[12].pressed},
				{button_13: gamepads[0].buttons[13].pressed},
				{button_14: gamepads[0].buttons[14].pressed},
				{button_15: gamepads[0].buttons[15].pressed},
			],
		}
		//gamepadDisplay.textContent = JSON.stringify(gamepadState,null,2); //stampa i valori in tempo reale del pad
		if(gamepads[0].axes[0] >=0.98){
			key[3]=true; 	// THE D KEY
		}
		if(gamepads[0].axes[0] < 0.98){
			key[3]=false; 	// THE D KEY
		}
		if(gamepads[0].axes[0] <=-0.98){
			key[1]=true; 	// THE A KEY
		}
		if(gamepads[0].axes[0] >-0.98){
			key[1]=false;	// THE A KEY
		}
		if(gamepads[0].axes[1] >=0.98){
			key[2]=true; 	// THE S KEY
		}
		if(gamepads[0].axes[1] <=-0.98){
			key[0]=true;	// THE W KEY
		}
		if(gamepads[0].axes[1] >-0.98){
			key[0]=false;	// THE W KEY
		}
		if(gamepads[0].axes[1] <0.98){
			key[2]=false; 	// THE S KEY
		}
		if(gamepads[0].axes[3] <=-0.98){
			key[5]=true;	// THE J KEY
		}
		if(gamepads[0].axes[3] >=0.98){
			key[6]=true;	// THE K KEY
		}
		if(gamepads[0].axes[3] >-0.98){
			key[5]=false;	// THE J KEY
		}
		if(gamepads[0].axes[3] <0.98){
			key[6]=false;	// THE K KEY
		}
		if(gamepads[0].buttons[2].pressed == true){
			key[4]=true;	//THE LEFT BUTTON
		}
		if(gamepads[0].buttons[2].pressed == false){
			key[4]=false;	//THE LEFT BUTTON
		}
	}
	if(nstep*PHYS_SAMPLING_STEP <= timeNow){ //skippa il frame se passa troppo poco tempo
		GameOver();
		ENDGame();
		ShipDoStep(); 
		nstep++; 
		doneSomething=true;
		window.requestAnimationFrame(update);
	}
	timeNow=time;
	if (doneSomething) {
		render();
		doneSomething=false;
	}
	window.requestAnimationFrame(update); // vai al prossimo frame
}
// ****************************************************************************************************************
// RENDERING
// ****************************************************************************************************************
function render(){
	//gl.enable(gl.CULL_FACE); 	//se è disabilitato, riesco a vedere dentro al cubo, se no no
    gl.enable(gl.DEPTH_TEST);
    // matriece di vista della luce
    lightWorldMatrix = m4.lookAt(
        [settings.x_light, settings.y_light, settings.z_light],          			// position
        [settings.x_targetlight, settings.y_targetlight, settings.z_targetlight], 	// target
        settings.up,                                              					// up
    );
		//matrice di proiezione della luce
    lightProjectionMatrix = m4.perspective(
    	degToRad(settings.fovLight),
    	settings.width_projLight / settings.height_projLight,
    	1,  	// near: top of the frustum
    700);   // far: bottom of the frustum

	// -----------------------------------------------------------
    // draw to the depth texture
	
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
    gl.viewport(0, 0, depthTextureSize, depthTextureSize);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    drawScene( lightProjectionMatrix, lightWorldMatrix, m4.identity(), lightWorldMatrix, programInfo_platform);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1); //setta tutto a nero se 0,0,0,1
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let textureMatrix = m4.identity();
    textureMatrix = m4.translate(textureMatrix, 0.5, 0.5, 0.5);
    textureMatrix = m4.scale(textureMatrix, 0.5, 0.5, 0.5);
    textureMatrix = m4.multiply(textureMatrix, lightProjectionMatrix);
    textureMatrix = m4.multiply(textureMatrix, m4.inverse(lightWorldMatrix));
	// -------------------------------------------------------------------
	//matrici di vista
	projectionMatrix = m4.perspective(settings.fov, settings.aspect, 1, 2000);
	var targetShip = [px, py, pz];
	camera = [px + (settings.D*Math.sin(degToRad(facing))), py+20, pz+(settings.D*Math.cos(degToRad(facing)))]; //posteriore
	//cambiaCamera = true --> camera posteriore
	if(cambiaCamera){
		var targetShip = [px, py, pz];
		camera = [px+(-settings.D*Math.sin(degToRad(facing))), py+20, pz+(-settings.D*Math.cos(degToRad(facing)))];		
	}
	//permette di muoversi nella scena (esempio con la drag del mouse)
	if(cameraLibera){
		camera = [settings.D*7*Math.sin(settings.PHI)*Math.cos(settings.THETA),
					settings.D*7*Math.sin(settings.PHI)*Math.sin(settings.THETA),
					settings.D*7*Math.cos(settings.PHI)];
	}
    cameraMatrix = m4.lookAt(camera, targetShip, settings.up);
    drawScene( projectionMatrix, cameraMatrix, textureMatrix, lightWorldMatrix, programInfo_spot);
	//drawFrustum();
	drawWorld();
	drawENDArea();
}

// ****************************************************************************************************************
// DISEGNA SCENA
// ****************************************************************************************************************
function drawScene(	projectionMatrix, cameraMatrix, textureMatrix, lightWorldMatrix, programInfo) {
    const viewMatrix = m4.inverse(cameraMatrix);
	gl.useProgram(programInfo.program);
	webglUtils.setUniforms(programInfo, {
		u_view: viewMatrix,
		u_projection: projectionMatrix,
		u_bias: bias,
		u_textureMatrix: textureMatrix,
		u_projectedTexture: depthTexture,
		u_shininess: settings.shininess,
		u_innerLimit: Math.cos(degToRad(settings.fov/2-10)),
		u_outerLimit: Math.cos(degToRad(settings.fov / 2)),
		u_reverseLightDirection: lightWorldMatrix.slice(8, 11),
		u_lightWorldPosition: [settings.x_light, settings.y_light, settings.z_light],
		u_viewWorldPosition: cameraMatrix.slice(12, 15),
		u_lightIntensity: settings.lightIntensity,
		u_shadowIntensity: settings.shadowIntensity,
	});
	drawAsteroids(programInfo);
	drawShips(programInfo);
	drawShip(programInfo);
	drawFloor(programInfo); 
}
// ****************************************************************************************************************
// DISEGNA AREA DI SALVATAGGIO
// ****************************************************************************************************************
function drawENDArea() {
	if (!endGame) {
		const viewMatrix = m4.inverse(cameraMatrix);
		let objToDraw = getObjToDraw(objectsToDraw, "EndArea");
		const programInfo = objToDraw.programInfo;
		gl.useProgram(programInfo.program);
		let matrix = m4.identity();
		matrix = m4.translate(matrix, pxEND, -320, pzEND); 
		matrix = m4.scale(matrix, 2, 2, 2);
		objToDraw.uniforms.u_world = matrix;
		webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw.bufferInfo);
		webglUtils.setUniforms(programInfo, objToDraw.uniforms);
		webglUtils.setUniforms(programInfo, {
			u_view: viewMatrix,
			u_projection: projectionMatrix,
			u_world: matrix,
		});
		if (insideArea) //cambia colore in blu
			webglUtils.setUniforms(programInfo, {
				u_color: [0,0,1,1],
			});
		webglUtils.drawBufferInfo(gl, objToDraw.bufferInfo);		
	}
}
// ****************************************************************************************************************
// DISEGNA ASTEROIDI
// ****************************************************************************************************************
function drawAsteroids(programInfo) {
	if(r!=0){ //se r==0 non lo disegna ecc per gli altri r
	var objToDraw1 = getObjToDraw(objectsToDraw, "asteroid1");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw1.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw1.uniforms);
	if (flags[0] == false ){
		objToDraw1.uniforms.u_world[14] += 0.5;
	}
	if(objToDraw1.uniforms.u_world[14]>300)
		flags[0] = true;
	if(flags[0] == true){
		objToDraw1.uniforms.u_world[14] -= 0.5;
	}
	if(objToDraw1.uniforms.u_world[14]<-300)
		flags[0] = false;
	webglUtils.drawBufferInfo(gl, objToDraw1.bufferInfo);
	}
	if(r!=1){
	var objToDraw2 = getObjToDraw(objectsToDraw, "asteroid2");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw2.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw2.uniforms);
	if ( flags[1] == false){
		objToDraw2.uniforms.u_world[13] += 0.5;
	}
	if(objToDraw2.uniforms.u_world[13]>400)
		flags[1] = true;
	if(flags[1] == true){
		objToDraw2.uniforms.u_world[13] -= 0.3;
	}
	if(objToDraw2.uniforms.u_world[13]<-300)
		flags[1] = false;
	webglUtils.drawBufferInfo(gl, objToDraw2.bufferInfo);
	}
	if(r!=2){
	var objToDraw3 = getObjToDraw(objectsToDraw, "asteroid3");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw3.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw3.uniforms);
	if (flags[2] == false){
		objToDraw3.uniforms.u_world[12] += 0.3;
	}
	if(objToDraw3.uniforms.u_world[12]>300)
		flags[2] = true;
	if(flags[2] == true){
		objToDraw3.uniforms.u_world[12] -= 0.8
	}
	if(objToDraw3.uniforms.u_world[12]<-300)
		flags[2] = false;
	webglUtils.drawBufferInfo(gl, objToDraw3.bufferInfo);
	}
	if(r!=3){
	var objToDraw4 = getObjToDraw(objectsToDraw, "asteroid4");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw4.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw4.uniforms);
	if (flags[3] == false ){
		objToDraw4.uniforms.u_world[14] += 0.5;
	}
	if(objToDraw4.uniforms.u_world[14]>300)
		flags[3] = true;
	if(flags[3] == true){
		objToDraw4.uniforms.u_world[14] -= 0.5;
	}
	if(objToDraw4.uniforms.u_world[14]<-300)
		flags[3] = false;
	webglUtils.drawBufferInfo(gl, objToDraw4.bufferInfo);
	}
	if(r!=4){
	var objToDraw5 = getObjToDraw(objectsToDraw, "asteroid5");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw5.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw5.uniforms);
	if ( flags[4] == false){
		objToDraw5.uniforms.u_world[13] += 0.5;
	}
	if(objToDraw5.uniforms.u_world[13]>400)
		flags[4] = true;
	if(flags[4] == true){
		objToDraw5.uniforms.u_world[13] -= 0.3;
	}
	if(objToDraw5.uniforms.u_world[13]<-300)
		flags[4] = false;
	webglUtils.drawBufferInfo(gl, objToDraw5.bufferInfo);
	}
	if(r!=5){
	var objToDraw6 = getObjToDraw(objectsToDraw, "asteroid6");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw6.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw6.uniforms);
	if (flags[5] == false){
		objToDraw6.uniforms.u_world[12] += 0.3;
	}
	if(objToDraw6.uniforms.u_world[12]>300)
		flags[5] = true;
	if(flags[5] == true){
		objToDraw6.uniforms.u_world[12] -= 0.8
	}
	if(objToDraw6.uniforms.u_world[12]<-300)
		flags[5] = false;
	webglUtils.drawBufferInfo(gl, objToDraw6.bufferInfo);
	}

	var objToDraw7 = getObjToDraw(objectsToDraw, "boss1");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw7.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw7.uniforms);
	if (flags[6] == false){
		objToDraw7.uniforms.u_world[13] += 0.8;
	}
	if(objToDraw7.uniforms.u_world[13]>400)
		flags[6] = true;
	if(flags[6] == true){
		objToDraw7.uniforms.u_world[13] -= 0.8
	}
	if(objToDraw7.uniforms.u_world[13]<-300)
		flags[6] = false;
	webglUtils.drawBufferInfo(gl, objToDraw7.bufferInfo);

	var objToDraw8 = getObjToDraw(objectsToDraw, "boss2");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw8.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw8.uniforms);
	if (flags[7] == false){
		objToDraw8.uniforms.u_world[12] += 0.8;
	}
	if(objToDraw8.uniforms.u_world[12]>300)
		flags[7] = true;
	if(flags[7] == true){
		objToDraw8.uniforms.u_world[12] -= 0.8
	}
	if(objToDraw8.uniforms.u_world[12]<-300)
		flags[7] = false;
	webglUtils.drawBufferInfo(gl, objToDraw8.bufferInfo);

	var objToDraw9 = getObjToDraw(objectsToDraw, "boss3");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw9.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw9.uniforms);
	if (flags[8] == false ){
		objToDraw9.uniforms.u_world[14] += 1;
	}
	if(objToDraw9.uniforms.u_world[14]>300)
		flags[8] = true;
	if(flags[8] == true){
		objToDraw9.uniforms.u_world[14] -= 0.9;
	}
	if(objToDraw9.uniforms.u_world[14]<-300)
		flags[8] = false;
	webglUtils.drawBufferInfo(gl, objToDraw9.bufferInfo);

	var objToDraw10 = getObjToDraw(objectsToDraw, "boss4");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw10.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw10.uniforms);
	if (flags[9] == false ){
		objToDraw10.uniforms.u_world[14] += 1;
	}
	if(objToDraw10.uniforms.u_world[14]>300)
		flags[9] = true;
	if(flags[9] == true){
		objToDraw10.uniforms.u_world[14] -= 0.9;
	}
	if(objToDraw9.uniforms.u_world[14]<-300)
		flags[9] = false;
	webglUtils.drawBufferInfo(gl, objToDraw10.bufferInfo);
}
// ****************************************************************************************************************
// DISEGNA NAVI IMPERIALI
// ****************************************************************************************************************
function drawShips(programInfo) {
	if(f!=14){ //se f==14 non disegno la nave imperiale ecc per gli altri f
	var objToDraw1 = getObjToDraw(objectsToDraw, "ship1");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw1.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw1.uniforms);
	if (flags[0] == false ){
		objToDraw1.uniforms.u_world[14] += 0.5;
	}
	if(objToDraw1.uniforms.u_world[14]>400){
		flags[0] = true;
	}
	if(flags[0] == true)
		objToDraw1.uniforms.u_world[14] -= 0.5;
	if(objToDraw1.uniforms.u_world[14]<-400){
		flags[0] = false;
	}
	webglUtils.drawBufferInfo(gl, objToDraw1.bufferInfo);
	}
	if(f!=15){
	var objToDraw2 = getObjToDraw(objectsToDraw, "ship2");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw2.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw2.uniforms);
	if ( flags[1] == false){
		objToDraw2.uniforms.u_world[13] += 0.5;
	}
	if(objToDraw2.uniforms.u_world[13]>400){
		flags[1] = true;
		objToDraw2.uniforms.u_world= m4.yRotate(objToDraw1.uniforms.u_world, degToRad(180));
	}
	if(flags[1] == true){
		objToDraw2.uniforms.u_world[13] -= 0.3;
	}
	if(objToDraw2.uniforms.u_world[13]<-300){
		flags[1] = false;
		objToDraw2.uniforms.u_world= m4.yRotate(objToDraw1.uniforms.u_world, degToRad(180));
	}
	webglUtils.drawBufferInfo(gl, objToDraw2.bufferInfo);
	}
	if(f!=16){
	var objToDraw3 = getObjToDraw(objectsToDraw, "ship3");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw3.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw3.uniforms);
	if (flags[2] == false){
		objToDraw3.uniforms.u_world[12] += 0.3;
	}
	if(objToDraw3.uniforms.u_world[12]>400)
		flags[2] = true;
	if(flags[2] == true){
		objToDraw3.uniforms.u_world[12] -= 0.8
	}
	if(objToDraw3.uniforms.u_world[12]<-400)
		flags[2] = false;
	webglUtils.drawBufferInfo(gl, objToDraw3.bufferInfo);
	}
	if(f!=17){
	var objToDraw4 = getObjToDraw(objectsToDraw, "ship4");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw4.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw4.uniforms);
	if (flags[3] == false ){
		objToDraw4.uniforms.u_world[14] += 0.5;
	}
	if(objToDraw4.uniforms.u_world[14]>400)
		flags[3] = true;
	if(flags[3] == true){
		objToDraw4.uniforms.u_world[14] -= 0.5;
	}
	if(objToDraw4.uniforms.u_world[14]<-400)
		flags[3] = false;
	webglUtils.drawBufferInfo(gl, objToDraw4.bufferInfo);	
	}
}
// ****************************************************************************************************************
// DISEGNA IL MONDO
// ****************************************************************************************************************
function drawWorld() {
	const viewMatrix = m4.inverse(cameraMatrix);
	let objToDraw = getObjToDraw(objectsToDraw, "world");
	const programInfo = objToDraw.programInfo;
	gl.useProgram(programInfo.program);
	let matrix_world = m4.identity();
	matrix_world = m4.translate(matrix_world,0,50,0);
	matrix_world = m4.scale(matrix_world,500,400,500);
	matrix_world = m4.yRotate(matrix_world,degToRad(270));
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw.uniforms);
	webglUtils.setUniforms(programInfo, {
		u_view: viewMatrix,
		u_projection: projectionMatrix,
		u_world: matrix_world,
	});
	webglUtils.drawBufferInfo(gl, objToDraw.bufferInfo);	
	
}
// ****************************************************************************************************************
// DISEGNA IL PIANO
// ****************************************************************************************************************
function drawFloor(programInfo) {
	var objToDraw = getObjToDraw(objectsToDraw, "floor");
	let matrix = m4.identity();
	matrix = m4.translate(matrix,0,5,0);
	matrix = m4.scale(matrix,50,50,50);
	objToDraw.uniforms.u_world = matrix;
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw.uniforms);
	webglUtils.drawBufferInfo(gl, objToDraw.bufferInfo);
}
// ****************************************************************************************************************
// DISEGNA MILLENNIUM FALCON
// ****************************************************************************************************************
function drawShip (programInfo) {
	var max=15;
	var max2=35;
	var objToDraw = getObjToDraw(objectsToDraw, "mf");
	matrix_ship = m4.identity(); 
	matrix_ship = m4.translate(matrix_ship,px,py,pz);
	matrix_ship = m4.yRotate(matrix_ship, degToRad(180));
	matrix_ship = m4.yRotate(matrix_ship, degToRad(facing));
	if(WJ==0 && angle > 0){		
		angle=angle-0.1;
		matrix_ship = m4.xRotate(matrix_ship, degToRad(angle));
		//console.log(angle);

	}
	if(WJ==0 && angle < 0){		
		angle=angle+0.1;
		matrix_ship = m4.xRotate(matrix_ship, degToRad(angle));

	}
	if(WJ2==0 && angle2 > 0){		
		angle2=angle2-0.5;
		matrix_ship = m4.zRotate(matrix_ship, degToRad(angle2));
		//console.log(angle);

	}
	if(WJ2==0 && angle2 < 0){		
		angle2=angle2+0.5;
		matrix_ship = m4.zRotate(matrix_ship, degToRad(angle2));

	}
	if(WJ==1){
		if(angle >=-max)
			angle=angle-0.1;
		matrix_ship = m4.xRotate(matrix_ship, degToRad(angle));

	}
	if(WJ==-1){
		if(angle <=max)
			angle=angle+0.1;
		matrix_ship = m4.xRotate(matrix_ship, degToRad(angle));
	}
	if(WJ2==2){
		if(angle2 >=-max2)
			angle2=angle2-0.5;
		matrix_ship = m4.zRotate(matrix_ship, degToRad(angle2));
	}
	if(WJ2==-2){
		if(angle2 <=max2)
			angle2=angle2+0.5;
		matrix_ship = m4.zRotate(matrix_ship, degToRad(angle2));
	}
	objToDraw.uniforms.u_world = matrix_ship;
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw.uniforms);
	webglUtils.drawBufferInfo(gl, objToDraw.bufferInfo);
}
// ****************************************************************************************************************
// DISEGNA FRUSTUM
// ****************************************************************************************************************
function drawFrustum() {
	const viewMatrix = m4.inverse(cameraMatrix);
	gl.useProgram(programInfo_platform.program);
	webglUtils.setBuffersAndAttributes(gl, programInfo_platform, cubeLinesBufferInfo);
	const mat = m4.multiply(lightWorldMatrix, m4.inverse(lightProjectionMatrix));
	webglUtils.setUniforms(programInfo_color, {
		u_color: [1, 1, 1, 1], //frustum color = white
		u_view: viewMatrix,
		u_projection: projectionMatrix,
		u_world: mat,
	});
	webglUtils.drawBufferInfo(gl, cubeLinesBufferInfo, gl.LINES);
}









