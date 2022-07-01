//Annamaria Dal Bo

// STATO DELLA NAVE SPAZIALE
// (DoStep fa evolvere queste variabili nel tempo)
var px,py,pz,facing = 0; 	// posizione e orientamento
var sterzo; // stato interno
var vx,vy,vz; 				// velocita' attuale

// costanti
var velSterzo, velRitornoSterzo, accMax, grip, 
attrito, attritoX, attritoY, attritoZ; // attriti
var key;


// DoStep: facciamo un passo di fisica (a delta-t costante)
// Indipendente dal rendering.
//
// Ricordiamoci che possiamo LEGGERE ma mai SCRIVERE la struttura controller da DoStep
function ShipDoStep(){
	// computiamo l'evolversi della macchina
	var vxm, vym, vzm; // velocita' in spazio macchina

	// da vel frame mondo a vel frame macchina
	var cosf = Math.cos(facing*Math.PI/180.0);
	var sinf = Math.sin(facing*Math.PI/180.0);
	vxm = +cosf*vx - sinf*vz;
	vym = vy;
	vzm = +sinf*vx + cosf*vz;

	// gestione dello sterzo
	if (key[1]) sterzo+=velSterzo;
	if (key[3]) sterzo-=velSterzo;
	sterzo*=velRitornoSterzo; // ritorno a volante fermo

	if (key[0])vzm-=accMax; // accelerazione in avanti
	if (key[5])	vym+=accMax+0.01; 
	if (key[2]) vzm+=accMax;	// accelerazione indietro
	if (key[6])	vym-=accMax+0.01; 
	

	// attriti (semplificando)
	vxm*=attritoX; 
	vym*=attritoY;
	vzm*=attritoZ;

	// l'orientamento della macchina segue quello dello sterzo
	// (a seconda della velocita' sulla z)
	facing = facing - (vzm*grip)*sterzo;

	// rotazione mozzo ruote (a seconda della velocita' sulla z) 
	/*
	var da ; //delta angolo
	da=(180.0*vzm)/(Math.PI*raggioRuotaA);
	mozzoA+=da;
	da=(180.0*vzm)/(Math.PI*(raggioRuotaP)); //gradi di rotazione, più alti sono, più le ruote sono lente
	mozzoP+=da;*/
	//console.log(degToRad(mozzoP));
	
	// ritorno a vel coord mondo
	vx = +cosf*vxm + sinf*vzm;
	vy = vym;
	vz = -sinf*vxm + cosf*vzm;

	//****************************************************************************************************
	//GESTIONE AREA DI SALVATAGGIO 

	
	
	if (Math.round(px) >= (pxEND-20) && Math.round(px) <= (pxEND+20)
		&& Math.round(pz) >= (pzEND-20) && Math.round(pz) <= (pzEND+20)) {
		//console.log("sono dentro");
		insideArea = true;
	}
	else insideArea = false;

	//****************************************************************************************************
	//GESTIONE OSTACOLI

	//suppongo che la macchina provi ad uscire dal mondo solo in avanti e non in retro
	const stepBack = 20;
	if (px >= 485)
		px-=stepBack;
	if (px <=-485)
		px+=stepBack;
	if (pz >= 485)
	 	pz-=stepBack;
	if (pz <= -485)
	 	pz+=stepBack; 
	if (py >= 400)
		py-= stepBack;
	if(py <= -300) 
		py+= stepBack;
	else {
		px+=vx;
		py+=vy;
		pz+=vz;
	}
}

function ShipInit(){
	// inizializzo lo stato della macchina
	// posizione e orientamento
	px = 0; py = 270; pz = 15;
	facing = 0; //per vedere la parte frontale o posteriore della macchina --> 0: posteriore, 180: anteriore
	
	sterzo = 0; 	// stato
	vx = vy = vz = 0;      			// velocita' attuale
	// inizializzo la struttura di controllo
	key=[false, false, false, false, false, false, false];

	velSterzo=0.8;
	//velSterzo=3.4;	// A
	//  velSterzo=2.26;    // A
	velRitornoSterzo=0.93; // B, sterzo massimo = A*B / (1-B)

	accMax = 0.01; //se aumenta, aumenta la velocità della car

	// attriti: percentuale di velocita' che viene mantenuta
	// 1 = no attrito
	// <<1 = attrito grande
	attritoZ = 0.991;  	// piccolo attrito sulla Z (nel senso di rotolamento delle ruote)
	attritoX = 0.4;  	// grande attrito sulla X (per non fare slittare la macchina)
	attritoY = 0.991;  

	
	
	grip = 0.8; // quanto il facing macchina si adegua velocemente allo sterzo
}

