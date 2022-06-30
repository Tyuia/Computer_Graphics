//Annamaria Dal Bo

var objectsToDraw = [];
var positions = [];
var positions2=[];
var positions3=[];


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
			bufferInfo: bufferInfo_asteroid,
			uniforms: {
				u_colorMult: [0.5, 0.5, 0, 1],
				u_texture: textures[5],
				u_world: m4.scale(m4.translation(-200, 0, 0), 3, 2, 3),
			},
		},
		{
			name: "asteroid4",
			bufferInfo: bufferInfo_asteroid,
			uniforms: {
				u_colorMult: [1, 0.5, 1, 1],
				u_texture: textures[3],
				u_world: m4.scale(m4.translation(0, 0, 300), 4, 4, 4),
			},
		},
		{
			name: "asteroid5",
			bufferInfo: bufferInfo_asteroid,
			uniforms: {
				u_colorMult: [1, 1, 1, 1],
				u_texture: textures[8],
				u_world: m4.scale(m4.translation(300, 0, 0), 3, 6, 3),
			},
		},
		
		{
			name: "asteroid6",
			bufferInfo: bufferInfo_asteroid,
			uniforms: {
				u_colorMult: [0.5, 0.5, 0.5, 1],
				u_texture: textures[0],
				u_world: m4.scale(m4.translation(20, 20, 20), 2, 2, 5),
			},
		},

		{
			name: "boss1",
			bufferInfo: bufferInfo_boss,
			uniforms: {
				u_colorMult: [0.5, 0.5, 0.5, 1],
				u_texture: textures[1],
				u_world: m4.scale(m4.translation(20, -100, 20), 5, 7, 5),
			},
		},

		{
			name: "boss2",
			bufferInfo: bufferInfo_boss,
			uniforms: {
				u_colorMult: [0.5, 0.5, 0.5, 1],
				u_texture: textures[1],
				u_world: m4.scale(m4.translation(0, -100, 20), 5, 2, 5),
			},
		},

		{
			name: "boss3",
			bufferInfo: bufferInfo_boss,
			uniforms: {
				u_colorMult: [0.5, 0.5, 0.5, 1],
				u_texture: textures[1],
				u_world: m4.scale(m4.translation(250, -250, 300), 8, 8, 8),
			},
		},

		{
			name: "boss4",
			bufferInfo: bufferInfo_boss,
			uniforms: {
				u_colorMult: [0.5, 0.5, 0.5, 1],
				u_texture: textures[1],
				u_world: m4.scale(m4.translation(250, 200, 20), 5, 5, 5),
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
var bufferInfo_asteroid, bufferInfo_obj, 
	bufferInfo_boss, bufferInfo_obj_mf, cubeLinesBufferInfo, bufferInfo_boss;

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
	positions = Array.from(webglVertexData[0]);
	var xmax=0;
	var xmin=0;
	for(i=0;i<positions.length;i=i+3){
		if(xmax<positions[i]){
			xmax=positions[i];
			var j=i;
		}
		if(xmin>positions[i]){
			xmin=positions[i];
			var k=i;
		}
	}
	var p1=[xmin,positions[k+1], positions[k+2]];
	var p2=[xmax,positions[j+1],positions[j+2]];
	var ymax=0;
	var ymin=0;
	for(i=1;i<positions.length;i=i+3){
		if(ymax<positions[i]){
			ymax=positions[i];
			var j=i;
		}
		if(ymin>positions[i]){
			ymin=positions[i];
			var k=i;
		}
	}
	var p3=[positions[j-1],ymax,positions[j+1]];
	var p4=[positions[k-1],ymin,positions[k+1]];
	
	var zmax=0;
	var zmin=0;
	for(i=2;i<positions.length;i=i+3){
		if(zmax<positions[i]){
			zmax=positions[i];
			var j=i;
		}
		if(zmin>positions[i]){
			zmin=positions[i];
			var k=i;
		}
	}
	var p5=[positions[j-2],positions[j-1],zmax];
	var p6=[positions[k-2],positions[k-1],zmin];
	var xc=(p1[0]+p2[0]+p3[0]+p4[0]+p5[0]+p6[0])/6;
	var yc=(p1[1]+p2[1]+p3[1]+p4[1]+p5[1]+p6[1])/6;
	var zc=(p1[2]+p2[2]+p3[2]+p4[2]+p5[2]+p6[2])/6;

	bufferInfo_asteroid = webglUtils.createBufferInfoFromArrays(gl, arrays_asteroid);

	loadDoc('resources/data/boss.obj')

	const arrays_boss= {
	   position:	{ numComponents: 3, data:webglVertexData[0], },
	   texcoord:	{ numComponents: 2, data:webglVertexData[1], },
	   normal:		{ numComponents: 3, data:webglVertexData[2], },
	};
	positions3 = Array.from(webglVertexData[0]);
	var xmax=0;
	var xmin=0;
	for(i=0;i<positions3.length;i=i+3){
		if(xmax<positions3[i]){
			xmax=positions3[i];
			var j=i;
		}
		if(xmin>positions3[i]){
			xmin=positions3[i];
			var k=i;
		}
	}
	var p1=[xmin,positions3[k+1], positions3[k+2]];
	var p2=[xmax,positions3[j+1],positions3[j+2]];
	var ymax=0;
	var ymin=0;
	for(i=1;i<positions3.length;i=i+3){
		if(ymax<positions3[i]){
			ymax=positions3[i];
			var j=i;
		}
		if(ymin>positions3[i]){
			ymin=positions3[i];
			var k=i;
		}
	}
	var p3=[positions3[j-1],ymax,positions3[j+1]];
	var p4=[positions3[k-1],ymin,positions3[k+1]];
	
	var zmax=0;
	var zmin=0;
	for(i=2;i<positions3.length;i=i+3){
		if(zmax<positions3[i]){
			zmax=positions3[i];
			var j=i;
		}
		if(zmin>positions3[i]){
			zmin=positions3[i];
			var k=i;
		}
	}
	var p5=[positions[j-2],positions[j-1],zmax];
	var p6=[positions[k-2],positions[k-1],zmin];
	var xc3=(p1[0]+p2[0]+p3[0]+p4[0]+p5[0]+p6[0])/6;
	var yc3=(p1[1]+p2[1]+p3[1]+p4[1]+p5[1]+p6[1])/6;
	var zc3=(p1[2]+p2[2]+p3[2]+p4[2]+p5[2]+p6[2])/6;

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
	positions2 = Array.from(webglVertexData[0]);
	var xmax=0;
	var xmin=0;
	for(i=0;i<positions2.length;i=i+3){
		if(xmax<positions2[i]){
			xmax=positions2[i];
			var j=i;
		}
		if(xmin>positions2[i]){
			xmin=positions2[i];
			var k=i;
		}
	}
	var p1=[xmin,positions2[k+1], positions2[k+2]];
	var p2=[xmax,positions2[j+1],positions2[j+2]];
	var ymax=0;
	var ymin=0;
	for(i=1;i<positions2.length;i=i+3){
		if(ymax<positions2[i]){
			ymax=positions2[i];
			var j=i;
		}
		if(ymin>positions2[i]){
			ymin=positions2[i];
			var k=i;
		}
	}
	var p3=[positions2[j-1],ymax,positions2[j+1]];
	var p4=[positions2[k-1],ymin,positions2[k+1]];
	
	var zmax=0;
	var zmin=0;
	for(i=2;i<positions2.length;i=i+3){
		if(zmax<positions2[i]){
			zmax=positions2[i];
			var j=i;
		}
		if(zmin>positions2[i]){
			zmin=positions2[i];
			var k=i;
		}
	}
	var p5=[positions2[j-2],positions2[j-1],zmax];
	var p6=[positions2[k-2],positions2[k-1],zmin];
	var xc2=(p1[0]+p2[0]+p3[0]+p4[0]+p5[0]+p6[0])/6;
	var yc2=(p1[1]+p2[1]+p3[1]+p4[1]+p5[1]+p6[1])/6;
	var zc2=(p1[2]+p2[2]+p3[2]+p4[2]+p5[2]+p6[2])/6;


	bufferInfo_obj_mf = webglUtils.createBufferInfoFromArrays(gl, arrays_obj_mf);
	return{xc,yc,zc,xc2,yc2,zc2,xc3,yc3,zc3};
	
	
}



