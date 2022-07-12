//Annamaria Dal Bo

//*********************************************************************************************************************
//MATH functions
//*********************************************************************************************************************

//ritorna un numero random
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function degToRad(d) {
	return d * Math.PI / 180;
}

function radToDeg(r) {
	return r * 180 / Math.PI;
}

function isPowerOf2(value) {
		return (value & (value - 1)) === 0;
}


//*********************************************************************************************************************
// GESTIONE TEXTURE
//*********************************************************************************************************************

var textures = [];
function setTextures() {
	textures[0] = textureFromImage("resources/images/asteroid1.jpg");	
	textures[1] = textureFromImage("resources/images/IMG_ME.jpg");				
	textures[2] = textureFromImage("resources/images/texturecubo.jpg");		
	textures[3] = textureFromImage("resources/images/asteroid2.jpg");
	if(input==undefined)			
		textures[4] = textureFromImage("resources/images/noodles.jpg");
	else
		textures[4] = textureFromImage("resources/images/"+input.files[0].name);				
	textures[5] = textureFromImage("resources/images/asteroid3.jpg");
	textures[6] = textureFromImage("resources/images/box.jpg");	
	textures[7] = textureFromImage("resources/images/superficie.jpg");
	textures[8] = textureFromImage("resources/images/asteroid4.jpg");
	textures[9] = textureFromImage("resources/images/tie_sphere.jpeg");
}

var depthFramebuffer, depthTextureSize, depthTexture;

//using a URL, an image is loaded and associated to a texture
function textureFromImage(fileName){
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	// Fill the texture with a 1x1 blue pixel
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255])); // Fill the texture with a 1x1 blue pixel
	// Asynchronously load an image
	var image = new Image();
	//image.src = "resources/images/mappa.jpg";
	image.src = fileName;
	image.addEventListener('load', function() {
		// Now that the image has loaded, copy it to the texture
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		checkIfMipmap(image);
	});
	return texture;
}
function checkIfMipmap(image) {
	// Check if the image is a power of 2 in both dimensions
	if (isPowerOf2(image.width) && isPowerOf2(image.height)) { // Yes, it's a power of 2 --> Generate mips
		gl.generateMipmap(gl.TEXTURE_2D);
		//console.log("mipmap");
	} 
	else { // No, it's not a power of 2 --> Turn of mips and set wrapping to clamp to edge
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	}
}
// --------------------------------------------------
//DEPTH TEXTURE
function createTextureForLights(){
	depthTexture = gl.createTexture();
	depthTextureSize = 512;
	gl.bindTexture(gl.TEXTURE_2D, depthTexture);
	gl.texImage2D(
		gl.TEXTURE_2D,      // target
		0,                  // mip level
		gl.DEPTH_COMPONENT, // internal format
		depthTextureSize,   // width
		depthTextureSize,   // height
		0,                  // border
		gl.DEPTH_COMPONENT, // format
		gl.UNSIGNED_INT,    // type
	null);              // data
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	depthFramebuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
	gl.framebufferTexture2D(
		gl.FRAMEBUFFER,       // target
		gl.DEPTH_ATTACHMENT,  // attachment point
		gl.TEXTURE_2D,        // texture target
		depthTexture,         // texture
	0);                   // mip level
		
}
//*********************************************************************************************************************
// GESTIONE CARICAMENTO DEI FILE
//*********************************************************************************************************************
var input; //file per obj
var input2; // file per texture
function gc_openFile(event) {
	event.preventDefault();
    input = event.target;
	setGeometries(gl);
	setObjsToDraw();
}
function gc_openFile2(event) {
	event.preventDefault();
	input = event.target;
	setTextures();
	setObjsToDraw();
}


//*********************************************************************************************************************
// GESTIONE DELLE MESH
//*********************************************************************************************************************


function getObjToDraw(objsToDraw, name){

	return objsToDraw.find(x => x.name === name);
}
function loadDoc(url) {
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		
		if (xhttp.readyState == 4) {
			parseOBJ(xhttp.responseText);
	   }
	};
	xhttp.open("GET", url, false);
	xhttp.send(null);
}
function parseOBJ(text) {
	webglVertexData = [
	    [],   // positions
	    [],   // texcoords
	    [],   // normals
	];
	const objPositions = [[0, 0, 0]];
  	const objTexcoords = [[0, 0]];
  	const objNormals = [[0, 0, 0]];
	const objVertexData = [
	    objPositions,
	    objTexcoords,
	    objNormals,
    ];
	// same order as `f` indices
	//f 1/2/3 -> 1 2 3
	function addVertex(vert) {
		const ptn = vert.split('/');
		ptn.forEach((objIndexStr, i) => {
		  if (!objIndexStr) {
		    return;
		  }
		  const objIndex = parseInt(objIndexStr);
		  const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
		  //webglVertexData pubblica
		  //console.log(i);
		  webglVertexData[i].push(...objVertexData[i][index]);
		});
	}

	const keywords = {
	    v(parts) {
	      objPositions.push(parts.map(parseFloat));
	    },
	    vn(parts) {
	      objNormals.push(parts.map(parseFloat));
	    },
	    vt(parts) {
	      // should check for missing v and extra w?
	      objTexcoords.push(parts.map(parseFloat));
	    },
	    f(parts) {
	      const numTriangles = parts.length - 2;
	      for (let tri = 0; tri < numTriangles; ++tri) {
	        addVertex(parts[0]);
	        addVertex(parts[tri + 1]);
	        addVertex(parts[tri + 2]);
	      }
	    },
	};
	//	\w* = almeno una lettere o un numero
	// ?:x = meccia gli spazi singoli bianchi (anche più di uno)
	// . = classi di caratteri, meccia ogni singolo carattere tranne i terminatori di linea
	const keywordRE = /(\w*)(?: )*(.*)/;
	const lines = text.split('\n');
	//let identifica una variabile in un determinato blocco di codice
	for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
	const line = lines[lineNo].trim();
	if (line === '' || line.startsWith('#')) {
		//la riga è vuota o è un commento
	  continue;
	}
	//ritorna la stringa 
	const m = keywordRE.exec(line);
	//console.log(m);
	if (!m) {
	  continue;
	}
	const [, keyword, unparsedArgs] = m;
	const parts = line.split(/\s+/).slice(1);
	const handler = keywords[keyword];
	//console.log(parts);
	if (!handler) {
	  //console.warn('unhandled keyword:', keyword, 'at line', lineNo + 1);
	  continue;
	}
	handler(parts, unparsedArgs); //gestisce gli argomenti che non hai gestito
	}
}

