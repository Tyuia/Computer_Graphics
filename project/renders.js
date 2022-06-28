//Annamaria Dal Bo

/*
drawBufferInfo does automatically the distintion between drawElements and drawArrays
Moreover, if anything is specified about the type, it automatically draws with gl.TRIANGLES
Otherwise, it is necessary to specify the type, as we did for example in drawCubeWire (car.js) where it uses gl.LINES

The code for the drawElements that was used previously, was the following:
	if (objToDraw.type === "triangles")
		gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
	if (objToDraw.type === "lines")
		gl.drawElements(gl.LINES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
	
The code for the drawArrays was similar...
	gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);

Now they're no longer necessary 
*/

//ORDINE CORRETTO DI APPLICAZIONE DELLE TRASFORMAZIONI DELLE MATRICI: traslate, rotate, scale
const gamepadDisplay = document.getElementById("gamepad-display");
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
		//gamepadDisplay.textContent = JSON.stringify(gamepadState,null,2);
		if(gamepads[0].axes[0] >=0.98)
			key[3]=true; 
		if(gamepads[0].axes[0] < 0.98)
			key[3]=false; 
		if(gamepads[0].axes[0] <=-0.98)
			key[1]=true; 
		if(gamepads[0].axes[0] >-0.98)
			key[1]=false;
		if(gamepads[0].axes[1] >=0.98)
			key[2]=true; 
		if(gamepads[0].axes[1] <=-0.98)
			key[0]=true;
		if(gamepads[0].axes[1] >-0.98)
			key[0]=false;
		if(gamepads[0].axes[1] <0.98)
			key[2]=false; 
		if(gamepads[0].axes[3] <=-0.98)
			key[5]=true;
		if(gamepads[0].axes[3] >=0.98)
			key[6]=true;
		if(gamepads[0].axes[3] >-0.98)
			key[5]=false;
		if(gamepads[0].axes[3] <0.98)
			key[6]=false;
		if(gamepads[0].buttons[2].pressed == true)
			key[4]=true;
		if(gamepads[0].buttons[2].pressed == false)
			key[4]=false;
	}
	if(nstep*PHYS_SAMPLING_STEP <= timeNow){ //skip the frame if the call is too early
		GameOver();
		ENDGame();
		ShipDoStep(); 
		nstep++; 
		doneSomething=true;
		window.requestAnimationFrame(update);
		return; // return as there is nothing to do
	}
	timeNow=time;
	if (doneSomething) {
		render();
		doneSomething=false;
	}
	window.requestAnimationFrame(update); // get next frame
}

// variabili globali per scelta camera
var cambiaCamera = false; // per passare tra la camera posteriore e anteriore
var cameraLibera = false; // drag del mouse
var flag1 = false;
var flag2 = false;
var flag3 = false;
var flag4 = false;
var flag5 = false;
var flag6 = false;
var flag7 = false;



//matrici globali. Alternativa --> passarle come argomento
var lightWorldMatrix, lightProjectionMatrix, projectionMatrix, cameraMatrix;

function render(){

	//gl.enable(gl.CULL_FACE); 	//se è disabilitato, riesco a vedere dentro al cubo, se no no
    gl.enable(gl.DEPTH_TEST);

    // first draw from the POV of the light
    lightWorldMatrix = m4.lookAt(
        [settings.x_light, settings.y_light, settings.z_light],          			// position
        [settings.x_targetlight, settings.y_targetlight, settings.z_targetlight], 	// target
        settings.up,                                              					// up
    );

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

    drawScene( projectionMatrix, cameraMatrix, textureMatrix, lightWorldMatrix, programInfo_sun);
    
	
	//drawFrustum();
	drawWorld();
	drawENDArea();
}

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
	drawShip(programInfo);
	drawFloor(programInfo); 
}



function drawENDArea() {
	
	if (!endGame) {
		const viewMatrix = m4.inverse(cameraMatrix);
		
		let objToDraw = getObjToDraw(objectsToDraw, "EndArea");
		const programInfo = objToDraw.programInfo;
		gl.useProgram(programInfo.program);
		
		let matrix = m4.identity();
		
		matrix = m4.translate(matrix, pxEND, -320, pzEND); //QUI
		matrix = m4.scale(matrix, 2, 2, 2);
		objToDraw.uniforms.u_world = matrix;
		
		webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw.bufferInfo);
		
		webglUtils.setUniforms(programInfo, objToDraw.uniforms);
		
		webglUtils.setUniforms(programInfo, {
			u_view: viewMatrix,
			u_projection: projectionMatrix,
			u_world: matrix,
		});
		
		if (insideArea) //cambia colore in verde
			webglUtils.setUniforms(programInfo, {
				u_color: [0,1,0,1],
			});
		
		webglUtils.drawBufferInfo(gl, objToDraw.bufferInfo);	
		
	}
}



function drawAsteroids(programInfo) {
	
	var objToDraw1 = getObjToDraw(objectsToDraw, "asteroid1");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw1.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw1.uniforms);
	if (flag1 == false ){
		objToDraw1.uniforms.u_world[14] += 0.5;
	}
	if(objToDraw1.uniforms.u_world[14]>300)
		flag1 = true;
	if(flag1 == true){
		objToDraw1.uniforms.u_world[14] -= 0.5;
	}
	if(objToDraw1.uniforms.u_world[14]<-300)
		flag1 = false;
	webglUtils.drawBufferInfo(gl, objToDraw1.bufferInfo);
	/*
	var objToDraw2 = getObjToDraw(objectsToDraw, "asteroid2");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw2.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw2.uniforms);
	if ( flag2 == false){
		objToDraw2.uniforms.u_world[13] += 0.5;
	}
	if(objToDraw2.uniforms.u_world[13]>400)
		flag2 = true;
	if(flag2 == true){
		objToDraw2.uniforms.u_world[13] -= 0.3;
	}
	if(objToDraw2.uniforms.u_world[13]<-300)
		flag2 = false;
	webglUtils.drawBufferInfo(gl, objToDraw2.bufferInfo);
	
	var objToDraw3 = getObjToDraw(objectsToDraw, "asteroid3");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw3.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw3.uniforms);
	if (flag3 == false){
		objToDraw3.uniforms.u_world[12] += 0.3;
	}
	if(objToDraw3.uniforms.u_world[12]>300)
		flag3 = true;
	if(flag3 == true){
		objToDraw3.uniforms.u_world[12] -= 0.8
	}
	if(objToDraw3.uniforms.u_world[12]<-300)
		flag3 = false;
	webglUtils.drawBufferInfo(gl, objToDraw3.bufferInfo);
	
	var objToDraw4 = getObjToDraw(objectsToDraw, "asteroid4");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw4.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw4.uniforms);
	if (flag4 == false ){
		objToDraw4.uniforms.u_world[14] += 0.5;
	}
	if(objToDraw4.uniforms.u_world[14]>300)
		flag4 = true;
	if(flag4 == true){
		objToDraw4.uniforms.u_world[14] -= 0.5;
	}
	if(objToDraw4.uniforms.u_world[14]<-300)
		flag4 = false;
	webglUtils.drawBufferInfo(gl, objToDraw4.bufferInfo);

	var objToDraw5 = getObjToDraw(objectsToDraw, "asteroid5");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw5.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw5.uniforms);
	if ( flag5 == false){
		objToDraw5.uniforms.u_world[13] += 0.5;
	}
	if(objToDraw5.uniforms.u_world[13]>400)
		flag5 = true;
	if(flag5 == true){
		objToDraw5.uniforms.u_world[13] -= 0.3;
	}
	if(objToDraw5.uniforms.u_world[13]<-300)
		flag5 = false;
	webglUtils.drawBufferInfo(gl, objToDraw5.bufferInfo);
	
	var objToDraw6 = getObjToDraw(objectsToDraw, "asteroid6");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw6.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw6.uniforms);
	if (flag6 == false){
		objToDraw6.uniforms.u_world[12] += 0.3;
	}
	if(objToDraw6.uniforms.u_world[12]>300)
		flag6 = true;
	if(flag6 == true){
		objToDraw6.uniforms.u_world[12] -= 0.8
	}
	if(objToDraw6.uniforms.u_world[12]<-300)
		flag6 = false;
	webglUtils.drawBufferInfo(gl, objToDraw6.bufferInfo);*/

	var objToDraw7 = getObjToDraw(objectsToDraw, "boss");
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw7.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw7.uniforms);
	if (flag7 == false)
		objToDraw7.uniforms.u_world[12] += 0.8;
	if(objToDraw7.uniforms.u_world[12]>300)
		flag7 = true;
	if(flag7 == true)
		objToDraw7.uniforms.u_world[12] -= 0.8
	if(objToDraw7.uniforms.u_world[12]<-300)
		flag7 = false;
	webglUtils.drawBufferInfo(gl, objToDraw7.bufferInfo);
	
}

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

// -------------------------------------------------------------------------




function drawShip (programInfo) {
	
	var objToDraw = getObjToDraw(objectsToDraw, "mf");
	
	matrix_ship = m4.identity(); 
	
	matrix_ship = m4.translate(matrix_ship,px,py+4,pz);
	matrix_ship = m4.yRotate(matrix_ship, degToRad(180));
	matrix_ship = m4.yRotate(matrix_ship, degToRad(facing));
	matrix_ship = m4.scale(matrix_ship, 1, 1, 1);
	objToDraw.uniforms.u_world = matrix_ship;
	
	matrix_ship = m4.yRotate(matrix_ship, degToRad(-180));
	matrix_ship = m4.scale(matrix_ship, 1/5, 1/5, 1/5);
	
	webglUtils.setBuffersAndAttributes(gl, programInfo, objToDraw.bufferInfo);
	webglUtils.setUniforms(programInfo, objToDraw.uniforms);
	webglUtils.drawBufferInfo(gl, objToDraw.bufferInfo);
}



function drawFrustum() {
	
	const viewMatrix = m4.inverse(cameraMatrix);

	gl.useProgram(programInfo_color.program);

	webglUtils.setBuffersAndAttributes(gl, programInfo_color, cubeLinesBufferInfo);
	const mat = m4.multiply(lightWorldMatrix, m4.inverse(lightProjectionMatrix));

	webglUtils.setUniforms(programInfo_color, {
		u_color: [1, 1, 1, 1], //frustum color = white
		u_view: viewMatrix,
		u_projection: projectionMatrix,
		u_world: mat,
	});

	webglUtils.drawBufferInfo(gl, cubeLinesBufferInfo, gl.LINES);
}









