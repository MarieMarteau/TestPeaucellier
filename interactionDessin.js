"use strict";

function interaction(sceneThreeJs){ //ajoute les evenements à la scene

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
	
	const angle = 2*Math.atan(-y/x);
	const a = 7;
	const d = 12;
	const c = 3;
	const L = Math.sqrt((2*a+d)/2*(2*a+d)/2+c*c);
	
	const A = sceneThreeJs.sceneGraph.getObjectByName("A");
	const C = sceneThreeJs.sceneGraph.getObjectByName("C");
	const B = sceneThreeJs.sceneGraph.getObjectByName("B");
	const D = sceneThreeJs.sceneGraph.getObjectByName("D");
	const AI = sceneThreeJs.sceneGraph.getObjectByName("AI");
	const DA = sceneThreeJs.sceneGraph.getObjectByName("DA");
	const AB = sceneThreeJs.sceneGraph.getObjectByName("AB");
	const BC = sceneThreeJs.sceneGraph.getObjectByName("BC");
	const CD = sceneThreeJs.sceneGraph.getObjectByName("CD");
	const OB = sceneThreeJs.sceneGraph.getObjectByName("OB");
	const OD = sceneThreeJs.sceneGraph.getObjectByName("OD");
	const arrow = sceneThreeJs.sceneGraph.getObjectByName("arrow");
	const arrow2 = sceneThreeJs.sceneGraph.getObjectByName("arrow2");
	
	
	if ((x>window.innerWidth/8 || x<-window.innerWidth/8) && Math.abs(angle)<Math.PI/3){
		
		/*if (x>0){
			arrow.visible=false;
			arrow2.visible=true;
		}
		else{
			arrow.visible=true;
			arrow2.visible=false;
		}*/
		
		const coorda = coordA(a,angle);
		A.position.set(coorda[0],coorda[1],coorda[2]);

		const coordc = coordC(d,angle);
		C.position.set(coordc[0],coordc[1],coordc[2]);

		const coordb = coordB(a,d,L,angle);
		B.position.set(coordb[0],coordb[1],coordb[2]);

		const coordd = coordD(a,d,L,angle);
		D.position.set(coordd[0],coordd[1],coordd[2]);

		const coordi=[-7,0,0];
		const coordo=[0,0,0];

		barBetween(coordi,coorda,AI);
		barBetween(coorda,coordd,DA);
		barBetween(coorda,coordb,AB);
		barBetween(coordb,coordc,BC);
		barBetween(coordc,coordd,CD);
		barBetween(coordo,coordb,OB);
		barBetween(coordo,coordd,OD);
		
	}
	
}