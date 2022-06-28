//Annamaria Dal Bo

var objectsToDraw = [];
var mesh = new Array();

function setObjsToDraw() {
	objectsToDraw = [
		
		{
			name: "asteroid1",
			bufferInfo: bufferInfo_asteroid,
			uniforms: {
				u_colorMult: [0.5, 0.8, 1, 1],
				u_texture: textures[8],
				u_world: m4.scale(m4.translation(0, 0, -200), 3, 3, 3),
			},
		},
		{
			name: "asteroid2",
			bufferInfo: bufferInfo_asteroid,
			uniforms: {
				u_colorMult: [0.2, 0.5, 1, 1],
				u_texture: textures[0],
				u_world: m4.scale(m4.translation(-200, 0, -200), 2, 3, 2),
			},
		},
		{
			name: "asteroid3",
			bufferInfo: bufferInfo_asteroid2,
			uniforms: {
				u_colorMult: [0.5, 0.5, 0, 1],
				u_texture: textures[5],
				u_world: m4.scale(m4.translation(-200, 0, 0), 1, 1, 1),
			},
		},
		{
			name: "asteroid4",
			bufferInfo: bufferInfo_asteroid3,
			uniforms: {
				u_colorMult: [1, 0.5, 1, 1],
				u_texture: textures[3],
				u_world: m4.scale(m4.translation(0, 0, 300), 4, 4, 4),
			},
		},
		{
			name: "asteroid5",
			bufferInfo: bufferInfo_asteroid3,
			uniforms: {
				u_colorMult: [1, 1, 1, 1],
				u_texture: textures[8],
				u_world: m4.scale(m4.translation(300, 0, 0), 3, 3, 3),
			},
		},
		
		{
			name: "asteroid6",
			bufferInfo: bufferInfo_asteroid,
			uniforms: {
				u_colorMult: [0.5, 0.5, 0.5, 1],
				u_texture: textures[0],
				u_world: m4.scale(m4.translation(20, 20, 20), 2, 2, 2),
			},
		},

		{
			name: "boss",
			bufferInfo: bufferInfo_boss,
			uniforms: {
				u_colorMult: [0.5, 0.5, 0.5, 1],
				u_texture: textures[1],
				u_world: m4.scale(m4.translation(70, 20, 50), 5, 5, 5),
			},
		},
	
		{
			//not affected by the light
			name: "world",
			programInfo: programInfo_world,
			bufferInfo: bufferInfo_obj,
			uniforms: {
				u_texture: textures[6],
				u_world: m4.identity(),
			},
		},
		{
	
			name: "floor",
			bufferInfo: bufferInfo_floor,
			uniforms: {
				u_texture: textures[7],
				u_world: m4.identity(),
			},
		},
		{
			//not affected by the light
			name: "EndArea",
			programInfo: programInfo_platform,
			bufferInfo: bufferInfo_floor,
			uniforms: {
				u_color: [1,0,0,1], //red
				u_world: m4.identity(),
			},
		},
		
		{
			name: "mf",
			bufferInfo: bufferInfo_obj_mf,
			uniforms: {
				u_colorMult: [0.5, 0.5, 1, 1],
				u_texture: textures[4],
				u_world: m4.identity(),
			},
		},
		
	];
}


// ****************************************************************************************************************
// GEOMETRIES
// ****************************************************************************************************************

var bufferInfo_axis, bufferInfo_cubecoloured, bufferInfo_cubewire, bufferInfo_floor;
var bufferInfo_asteroid, bufferInfo_asteroid2, bufferInfo_asteroid3, bufferInfo_obj, 
	bufferInfo_obj_wheel, bufferInfo_obj_mf, cubeLinesBufferInfo, bufferInfo_boss;

function setGeometries(gl) {

	// ---------------------------------------------------------------------
	//Axis
	{
		const verticesAxis=[0,0,0, 10,0,0, 0,0,0, 0,10,0, 0,0,0, 0,0,10];
		const colorsAxis=[1,0,0, 1,0,0, 0,1,0, 0,1,0, 0,0,1, 0,0,1];

		const arrays_axis = {
		   position: 	{ numComponents: 3, data: verticesAxis, },
		   color: 		{ numComponents: 3, data: colorsAxis, },
		};

		bufferInfo_axis = webglUtils.createBufferInfoFromArrays(gl, arrays_axis);
	}

	// ---------------------------------------------------------------------
	// cube with coloured faces
	{
		const vertices_cubecoloured = [
			-1,-1,-1, 	1,-1,-1, 	1,1,-1, 	-1,1,-1, 
			-1,-1,1, 	1,-1,1, 	1,1,1, 		-1,1,1, 
			-1,-1,-1, 	-1,1,-1, 	-1,1,1, 	-1,-1,1,
			1,-1,-1, 	1,1,-1, 	1,1,1, 		1,-1,1, 
			-1,-1,-1, 	-1,-1,1, 	1,-1,1, 	1,-1,-1, 
			-1,1,-1, 	-1,1,1, 	1,1,1, 		1,1,-1,];

		const colors_cubecoloured =[
			0.9,0.9,0.9,  0.9,0.9,0.9,  0.9,0.9,0.9,  0.9,0.9,0.9,
			0.9,0.9,0.9,  0.9,0.9,0.9,  0.9,0.9,0.9,  0.9,0.9,0.9,
			0.9,0.9,0.9,  0.9,0.9,0.9,  0.9,0.9,0.9,  0.9,0.9,0.9,
			0.9,0.9,0.9,  0.9,0.9,0.9,  0.9,0.9,0.9,  0.9,0.9,0.9,
			0.9,0.9,0.9,  0.9,0.9,0.9,  0.9,0.9,0.9,  0.9,0.9,0.9,
			0.9,0.9,0.9,  0.9,0.9,0.9,  0.9,0.9,0.9,  0.9,0.9,0.9, 
			];
			
		const indices_cubecoloured = [
			0,1,2, 		0,2,3, 		4,5,6, 		4,6,7, 		8,9,10, 	8,10,11, 
			12,13,14, 	12,14,15, 	16,17,18, 	16,18,19, 	20,21,22, 	20,22,23 ];

		const arrays_cubecoloured = {
		   position: 	{ numComponents: 3, data: vertices_cubecoloured, },
		   color: 		{ numComponents: 3, data: colors_cubecoloured, },
		   indices: 	{ numComponents: 3, data: indices_cubecoloured, },
		};

		bufferInfo_cubecoloured = webglUtils.createBufferInfoFromArrays(gl, arrays_cubecoloured);
	}

	// ---------------------------------------------------------------------
	// cube for wireframe (contouring)
	{
		const arrays_cubewire = {
		   position: 	{ numComponents: 3, data: [	-1,-1,-1, 1,-1,-1, 1,1,-1, -1,1,-1, -1,-1,1, 1,-1,1, 1,1,1, -1,1,1,], },
		   color: 		{ numComponents: 3, data: [ 0,0,0,  0,0,0,  0,0,0,  0,0,0,	0,0,0,  0,0,0,  0,0,0,  0,0,0], },
		   indices: 	{ numComponents: 3, data: [ 0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 1,5, 2,6, 3,7, 0,4], },
		};

		bufferInfo_cubewire = webglUtils.createBufferInfoFromArrays(gl, arrays_cubewire);
	}
	// ---------------------------------------------------------------------
	//FRUSTUM
	cubeLinesBufferInfo = webglUtils.createBufferInfoFromArrays(gl, {
		position: [	-1, -1, -1,	1, -1, -1,	-1,  1, -1,	1,  1, -1,	-1, -1,  1,	 1, -1,  1,	-1,  1,  1,	 1,  1,  1,	],
		indices: [	0, 1,	1, 3,	3, 2,	2, 0,
					4, 5,	 5, 7,	 7, 6,	 6, 4,
					0, 4,	 1, 5,	  3, 7,	  2, 6,	], 
	});

	// ---------------------------------------------------------------------
	// plane
	{
		const S = 10; 		
		const H = -7; 

		const textureCoords = [ 0,0, 1,0, 0,1, 1,1,];

		const arrays_floor = {
		   position: 	{ numComponents: 3, data: [-S,H,-S, S,H,-S, -S,H,S,  S,H,S, ], },
		   texcoord: 	{ numComponents: 2, data: textureCoords, },
		   //color: 	{ numComponents: 3, data: [0.7,0.7,0.7,  0.7,0.7,0.7,  0.7,0.7,0.7,  0.7,0.7,0.7], },
		   indices: 	{ numComponents: 3, data: [0,2,1, 	2,3,1,], },
		   normal:		{numComponents: 3, data: [0,1,0,	0,1,0,	0,1,0,	0,1,0,], },
		};

		bufferInfo_floor = webglUtils.createBufferInfoFromArrays(gl, arrays_floor);
	}

	// ****************************************************************************************************************
	// LOAD FILE.OBJ 
	// ****************************************************************************************************************

	// ---------------------------------------------------------------------

	loadDoc('resources/data/asteroid.obj');

	const arrays_asteroid = {
	   position:	{ numComponents: 3, data:webglVertexData[0], },
	   texcoord:	{ numComponents: 2, data:webglVertexData[1], },
	   normal:		{ numComponents: 3, data:webglVertexData[2], },
	};

	bufferInfo_asteroid = webglUtils.createBufferInfoFromArrays(gl, arrays_asteroid);

	
	loadDoc('resources/data/asteroid.obj');

	const arrays_asteroid2 = {
	   position:	{ numComponents: 3, data:webglVertexData[0], },
	   texcoord:	{ numComponents: 2, data:webglVertexData[1], },
	   normal:		{ numComponents: 3, data:webglVertexData[2], },
	};

	bufferInfo_asteroid2 = webglUtils.createBufferInfoFromArrays(gl, arrays_asteroid2);

	

	loadDoc('resources/data/asteroid.obj');

	const arrays_asteroid3 = {
	   position:	{ numComponents: 3, data:webglVertexData[0], },
	   texcoord:	{ numComponents: 2, data:webglVertexData[1], },
	   normal:		{ numComponents: 3, data:webglVertexData[2], },
	};

	bufferInfo_asteroid3 = webglUtils.createBufferInfoFromArrays(gl, arrays_asteroid3);

	loadDoc('resources/data/boss.obj');

	const arrays_boss = {
	   position:	{ numComponents: 3, data:webglVertexData[0], },
	   texcoord:	{ numComponents: 2, data:webglVertexData[1], },
	   normal:		{ numComponents: 3, data:webglVertexData[2], },
	};

	bufferInfo_boss = webglUtils.createBufferInfoFromArrays(gl, arrays_boss);



	loadDoc('resources/data/cubeInternet.obj');

	const arrays_obj = {
	   position:	{ numComponents: 3, data:webglVertexData[0], },
	   texcoord:	{ numComponents: 2, data:webglVertexData[1], },
	   normal:		{ numComponents: 3, data:webglVertexData[2], },
	};

	bufferInfo_obj = webglUtils.createBufferInfoFromArrays(gl, arrays_obj);


	
	loadDoc('resources/data/nuovomodello.obj');

	const arrays_obj_mf = {
	   position:	{ numComponents: 3, data:webglVertexData[0], },
	   texcoord:	{ numComponents: 2, data:webglVertexData[1], },
	   normal:		{ numComponents: 3, data:webglVertexData[2], },
	};

	bufferInfo_obj_mf = webglUtils.createBufferInfoFromArrays(gl, arrays_obj_mf);
	
	
}
