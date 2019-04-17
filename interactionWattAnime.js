"use strict";

function interactionWatt(sceneThreeJs){ //ajoute les evenements à la scene

const onMouseUpFunction = function(event) { onMouseUp(sceneThreeJs); };
window.addEventListener('mouseup', onMouseUpFunction);

const onMouseDownFunction = function(event) { onMouseDown(sceneThreeJs); };
window.addEventListener('mousedown', onMouseDownFunction);

const onMouseMoveFunction = function(event) { onMouseMove(sceneThreeJs); };
window.addEventListener('mousemove', onMouseMoveFunction);

}

function onMouseDown(sceneThreeJs) {
    console.log('Mouse down');  

}

// Fonction appelée lors du relachement de la souris
function onMouseUp(sceneThreeJs) {
    console.log('Mouse up');
}

// Fonction appelée lors du déplacement de la souris
function onMouseMove(sceneThreeJs) {

    const xPixel = event.clientX;
    const yPixel = event.clientY;
	
	const x = xPixel - window.innerWidth/2;
	const y = -yPixel + window.innerHeight/2;
	
	/*const a = 4*2.1;
	const b = 4*2.2;
	const c = 4*0.6;
	
	const theta = Math.atan(y/100);
	
	const M = sceneThreeJs.sceneGraph.getObjectByName("M");
	const Q = sceneThreeJs.sceneGraph.getObjectByName("Q");
	const P = sceneThreeJs.sceneGraph.getObjectByName("P");
	
	const AP = sceneThreeJs.sceneGraph.getObjectByName("AP");
	const BQ = sceneThreeJs.sceneGraph.getObjectByName("BQ");
	const PQ = sceneThreeJs.sceneGraph.getObjectByName("PQ");
		
	
	if(x<0){
		P.material.color.set(0xff0000);
		Q.material.color.set(0xffffff);
	}
	if(x>0){
		Q.material.color.set(0xff0000);
		P.material.color.set(0xffffff);
	}
	
	if(theta<thetaMax(a,b,c) && theta>thetaMin(a,b,c)){
	
		P.position.set(coordP(theta,a,b,c)[0],coordP(theta,a,b,c)[1],coordP(theta,a,b,c)[2]);
		Q.position.set(coordQ(theta,a,b,c)[0],coordQ(theta,a,b,c)[1],coordQ(theta,a,b,c)[2]);
		M.position.set(coordM(theta,a,b,c)[0],coordM(theta,a,b,c)[1],coordM(theta,a,b,c)[2]);
		
		leaveDot(sceneThreeJs.sceneGraph,coordM(theta,a,b,c)[0],coordM(theta,a,b,c)[1],coordM(theta,a,b,c)[2]);
		
		const coorda = [-a,0,0];
		const coordb =[a,0,0];
		const coordm = coordM(theta,a,b,c);
		const coordp = coordP(theta,a,b,c);
		const coordq = coordQ(theta,a,b,c);

		barBetween(coorda,coordp,AP);
		barBetween(coordb,coordq,BQ);
		barBetween(coordp,coordq,PQ);
	}
		*/
	}
