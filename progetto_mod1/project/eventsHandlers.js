//Annamaria Dal Bo

//*****************************************************************************************************************
// EVENTI MOUSE
//*****************************************************************************************************************

var mouseDown=function(e) {
	drag=true;
	cameraLibera = true;
	old_x=e.pageX, old_y=e.pageY;
	e.preventDefault();
	return false;
};

var mouseUp=function(e){
	drag=false;
	cameraLibera = false;
};

var mouseMove=function(e) {
	if (!drag) return false; 
	dX=-(e.pageX-old_x)*2*Math.PI/canvas.width; 
	dY=-(e.pageY-old_y)*2*Math.PI/canvas.height; 
	settings.THETA+=dX;
	settings.PHI+=dY;
	old_x=e.pageX, old_y=e.pageY; 
	e.preventDefault();
	render();
};

//*****************************************************************************************************************
// EVENTI TASTIERA
//*****************************************************************************************************************
var WJ=0; //serve per ruotare avanti e indietro
var WJ2=0; // serve per ruotare a destra e sinistra
function doKeyDown(e){
	if (e.keyCode == 87){ // THE W KEY
		key[0]=true; 	
	} 
	if (e.keyCode == 83){ // THE S KEY
		key[2]=true; 	
	} 
	if (e.keyCode == 65){ // THE A KEY
		key[1]=true; 		
		WJ2=2;
	} 
	if (e.keyCode == 68){ // THE D KEY
		key[3]=true; 	
		WJ2=-2;
	} 
	if (e.keyCode == 32){ // THE BAR SPACE
		key[4]=true; 		
	} 
	if (e.keyCode == 74){ // THE J KEY
		key[5]=true; 		
	} 
	if (e.keyCode == 75){ // THE K KEY
		key[6]=true; 
	}		
	if(key[0]==true && key[5]==true){
		WJ=1;
	}
	if(key[0]==true && key[6]==true){
		WJ=-1;
	}
}

function doKeyUp(e){
	if (e.keyCode == 87){  // THE W KEY
		key[0]=false; 
		if(WJ==1 || WJ==-1){
			WJ=0;
		}
	} 
	if (e.keyCode == 83){ // THE S KEY
		key[2]=false; 		
	} 
	if (e.keyCode == 65){ // THE A KEY
		key[1]=false; 	
		if(WJ2==2){
			WJ2=0;
		}
	} 
	if (e.keyCode == 68){ // THE D KEY
		key[3]=false; 	
		if(WJ2==-2){
			WJ2=0;
		}
	} 
	if (e.keyCode == 32){ // THE BAR SPACE
		key[4]=false; 		
	}
	if (e.keyCode == 74){	// THE J KEY
		key[5]=false; 
		if(WJ==1){
			WJ=-0;
		}	
	} 
	if (e.keyCode == 75){ // THE K KEY	
		key[6]=false;
		if(WJ==-1){
			WJ=0;
		}	 	
	} 
}


//*****************************************************************************************************************
// EVENTI MOBILE
//*****************************************************************************************************************


function doTouchstart(e){
    if (pressed === "ButtonW"){
        key[0]=true;    // THE W KEY
    } 
    if (pressed === "ButtonS"){
        key[2]=true;    // THE S KEY  
    } 
    if (pressed === "ButtonA"){
        key[1]=true;    // THE A KEY   
    } 
    if (pressed === "ButtonD"){
        key[3]=true;    // THE D KEY 
    } 
	if (pressed === "ButtonEND"){
		pressedOnMobile = true;
        key[4]=true;    // THE END BUTTON	
    }
	if (pressed === "ButtonUP"){
        key[5]=true;    // THE J KEY  
    }  
	if (pressed === "ButtonDOWN"){
        key[6]=true;    // THE K KEY  
    }  
}
function doTouchend(e){
	console.log(e);
    if (pressed === "ButtonW"){
		pressed = "";
        key[0]=false;   // THE W KEY
    } 
    if (pressed === "ButtonS"){
		pressed = "";
        key[2]=false;   // THE S KEY    
    } 
    if (pressed === "ButtonA"){
		pressed = "";
        key[1]=false;   // THE A KEY
		if(WJ2==2){
			WJ2=0;
		}
    } 
    if (pressed === "ButtonD"){
		pressed = "";
        key[3]=false;   // THE D KEY  
		if(WJ2==-2){
			WJ2=0;
		}  
    } 
	if (pressed === "ButtonEND"){
		pressed = "";
        key[4]=false;    // THE END BUTTON	
		
    }
	if (pressed === "ButtonUP"){
		pressed = "";
        key[5]=false;    // THE J KEY 
		if(WJ==1){
			WJ=-0;
		}	 
    }  
	if (pressed === "ButtonDOWN"){
		pressed = "";
        key[6]=false;    // THE K KEY  
		if(WJ==-1){
			WJ=0;
		}	 	
    }  	
}


