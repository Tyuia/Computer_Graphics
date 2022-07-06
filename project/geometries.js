//Annamaria Dal Bo

var objectsToDraw = [];
var mesh = new Array();
var positions=[]; //per salvare i dati sul buffer
var normals=[];
var texcoords=[];
var ambient; //default
var diffuse; // default
var emissive; //default
var opacity; //default
var positions2 = []; //per calcolare centro oggetto

// ****************************************************************************************************************
// OGGETTI DA DISEGNARE
// ****************************************************************************************************************
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
				u_world: m4.zRotate(m4.scale(m4.translation(100, -300, 20), 10, 16, 5),degToRad(90)),
			},
		},
		{
			name: "boss2",
			bufferInfo: bufferInfo_boss,
			uniforms: {
				u_colorMult: [0.5, 0.5, 0.5, 1],
				u_texture: textures[1],
				u_world: m4.zRotate(m4.scale(m4.translation(0, -100, 20), 5, 14, 8),degToRad(90)),
			},
		},
		{
			name: "boss3",
			bufferInfo: bufferInfo_boss,
			uniforms: {
				u_colorMult: [0.5, 0.5, 0.5, 1],
				u_texture: textures[1],
				u_world: m4.zRotate(m4.scale(m4.translation(-250, -250, 300), 6, 11, 6), degToRad(90)),
			},
		},
		{
			name: "boss4",
			bufferInfo: bufferInfo_boss,
			uniforms: {
				u_colorMult: [0.5, 0.5, 0.5, 1],
				u_texture: textures[1],
				u_world: m4.zRotate(m4.scale(m4.translation(100, -200, 200), 15, 15, 15),degToRad(90)),
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
		{
			name: "ship1",
			bufferInfo: bufferInfo_fighters,
			uniforms: {
				u_colorMult: [0.5, 0.5, 1, 1],
				u_texture: textures[9],
				u_world: m4.scale(m4.translation(200, 200, 200), 5, 5, 5),
			},
		},
		{
			name: "ship2",
			bufferInfo: bufferInfo_fighters,
			uniforms: {
				u_colorMult: [0.5, 0.5, 1, 1],
				u_texture: textures[9],
				u_world: m4.scale(m4.translation(-200, -100, -20), 5, 5, 5),
			},
		},
		{
			name: "ship3",
			bufferInfo: bufferInfo_fighters,
			uniforms: {
				u_colorMult: [0.5, 0.5, 1, 1],
				u_texture: textures[9],
				u_world: m4.scale(m4.translation(250, 300, -20), 5, 5, 5),
			},
		},
		{
			name: "ship4",
			bufferInfo: bufferInfo_fighters,
			uniforms: {
				u_colorMult: [0.5, 0.5, 1, 1],
				u_texture: textures[9],
				u_world: m4.scale(m4.translation(-250, 300, 20), 5, 5, 5),
			},
		},
		
	];
}


// ****************************************************************************************************************
// GEOMETRIE
// ****************************************************************************************************************
var bufferInfo_axis, bufferInfo_cubecoloured, bufferInfo_cubewire, bufferInfo_floor;
var bufferInfo_asteroid, bufferInfo_obj, bufferInfo_fighters, 
bufferInfo_boss, bufferInfo_obj_mf, cubeLinesBufferInfo, bufferInfo_boss;

function setGeometries(gl) {
	// ---------------------------------------------------------------------
	//Assi
	{
		const verticesAxis=[0,0,0, 100,0,0, 0,0,0, 0,100,0, 0,0,0, 0,0,100];
		const arrays_axis = {
		   position: 	{ numComponents: 3, data: verticesAxis, },
		};

		bufferInfo_axis = webglUtils.createBufferInfoFromArrays(gl, arrays_axis);
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
	// piano
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
	// CARICARE FILE.OBJ 
	// ****************************************************************************************************************

	// ---------------------------------------------------------------------
	//Asteroide
	loadDoc('resources/data/asteroid.obj');
	const arrays_asteroid = {
	   position:	{ numComponents: 3, data:webglVertexData[0], },
	   texcoord:	{ numComponents: 2, data:webglVertexData[1], },
	   normal:		{ numComponents: 3, data:webglVertexData[2], },
	};
	var o1=centercalculation(webglVertexData[0]);
	bufferInfo_asteroid = webglUtils.createBufferInfoFromArrays(gl, arrays_asteroid);
	// ---------------------------------------------------------------------
	//Boss
	loadDoc('resources/data/boss.obj')
	const arrays_boss= {
	   position:	{ numComponents: 3, data:webglVertexData[0], },
	   texcoord:	{ numComponents: 2, data:webglVertexData[1], },
	   normal:		{ numComponents: 3, data:webglVertexData[2], },
	};
	var o3=centercalculation(webglVertexData[0]);
	bufferInfo_boss = webglUtils.createBufferInfoFromArrays(gl, arrays_boss);
	// ---------------------------------------------------------------------
	//Mondo
	mesh.sourceMesh="resources/data/cubeInternet.obj";
	LoadMesh(gl, mesh);
	const arrays_obj = {
		position:	{ numComponents: 3, data:positions, },
		texcoord:	{ numComponents: 2, data:texcoords, },
		normal:		{ numComponents: 3, data:normals, },
	};
	bufferInfo_obj = webglUtils.createBufferInfoFromArrays(gl, arrays_obj);
	// ---------------------------------------------------------------------
	//Millennium Falcon
	if(input==undefined){
		loadDoc('resources/data/nuovomodello.obj')
		const arrays_obj_mf = {
			position:	{ numComponents: 3, data:webglVertexData[0], },
			texcoord:	{ numComponents: 2, data:webglVertexData[1], },
			normal:		{ numComponents: 3, data:webglVertexData[2], },
		};
		var o2=centercalculation(webglVertexData[0]);
		bufferInfo_obj_mf = webglUtils.createBufferInfoFromArrays(gl, arrays_obj_mf);
	}
	else{
		loadDoc('resources/data/'+input.files[0].name);
		const arrays_obj_mf2 = {
			position:	{ numComponents: 3, data:webglVertexData[0], },
			texcoord:	{ numComponents: 2, data:webglVertexData[1], },
			normal:		{ numComponents: 3, data:webglVertexData[2], },
		};
		var o2=centercalculation(webglVertexData[0]);
		bufferInfo_obj_mf = webglUtils.createBufferInfoFromArrays(gl, arrays_obj_mf2);
    }
	// ---------------------------------------------------------------------
	//Nave imperiale
	loadDoc('resources/data/imperial_fighters2.obj')
	const arrays_fighters= {
	   	position:	{ numComponents: 3, data:webglVertexData[0], },
	   	texcoord:	{ numComponents: 2, data:webglVertexData[1], },
	   	normal:		{ numComponents: 3, data:webglVertexData[2], },
	};
	var o4=centercalculation(webglVertexData[0]);
	bufferInfo_fighters = webglUtils.createBufferInfoFromArrays(gl, arrays_fighters);
	return{o1,o2,o3,o4};	
}

// ****************************************************************************************************************
// CALCOLARE CENTRO DEGLI OGGETTI
// ****************************************************************************************************************

function centercalculation(positions){
	var positions2=Array.from(positions);
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
	var xc=(p1[0]+p2[0]+p3[0]+p4[0]+p5[0]+p6[0])/6;
	var yc=(p1[1]+p2[1]+p3[1]+p4[1]+p5[1]+p6[1])/6;
	var zc=(p1[2]+p2[2]+p3[2]+p4[2]+p5[2]+p6[2])/6;
	var o=[xc,yc,zc];
	return o;
}





