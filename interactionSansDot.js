"use strict";

function onMouseDown(event,raycaster,pickingData,screenSize,camera) {
	
	// Gestion du picking
    if( pickingData.enabled===true ) { // activation si la touche CTRL est enfoncée

        // Coordonnées du clic de souris
        const xPixel = event.clientX;
        const yPixel = event.clientY;

        const x =  2*xPixel/screenSize.w-1;
        const y = -2*yPixel/screenSize.h+1;

        // Calcul d'un rayon passant par le point (x,y)
        //  c.a.d la direction formé par les points p de l'espace tels que leurs projections sur l'écran par la caméra courante soit (x,y).
        raycaster.setFromCamera(new THREE.Vector2(x,y),camera);

        // Calcul des interections entre le rayon et les objets passés en paramètres
        const intersects = raycaster.intersectObjects( pickingData.selectableObjects );

        const nbrIntersection = intersects.length;
        if( nbrIntersection>0 ) {

            // Les intersections sont classés par distance le long du rayon. On ne considère que la première.
            const intersection = intersects[0];

            // Sauvegarde des données du picking
            pickingData.selectedObject = intersection.object; // objet selectionné
            pickingData.selectedPlane.p = intersection.point.clone(); // coordonnées du point d'intersection 3D
            pickingData.selectedPlane.n = camera.getWorldDirection().clone(); // normale du plan de la caméra

            pickingData.enableDragAndDrop = true;

        }
    }
}


function onMouseUp(event,pickingData) {
    pickingData.enableDragAndDrop = false;
}

function onMouseMove( event, pickingData, screenSize, camera, sceneGraph ) {
	
	const A = sceneGraph.getObjectByName("A");
	const C = sceneGraph.getObjectByName("C");
	const B = sceneGraph.getObjectByName("B");
	const D = sceneGraph.getObjectByName("D");
	const I = sceneGraph.getObjectByName("I");
	const AI = sceneGraph.getObjectByName("AI");
	const DA = sceneGraph.getObjectByName("DA");
	const AB = sceneGraph.getObjectByName("AB");
	const BC = sceneGraph.getObjectByName("BC");
	const CD = sceneGraph.getObjectByName("CD");
	const OB = sceneGraph.getObjectByName("OB");
	const OD = sceneGraph.getObjectByName("OD");

	// Gestion du drag & drop
    if( pickingData.enableDragAndDrop===true) {

		// Coordonnées de la position de la souris
        const xPixel = event.clientX;
        const yPixel = event.clientY;

        const x =  2*xPixel/screenSize.w-1;
        const y = -2*yPixel/screenSize.h+1;

        // Projection inverse passant du point 2D sur l'écran à un point 3D
        const selectedPoint = Vector3(x, y, 0.5 /*valeur de z après projection*/ ); 
       selectedPoint.unproject( camera );

        // Direction du rayon passant par le point selectionné
        const p0 = camera.position;
        const d = selectedPoint.clone().sub( p0 );

        // Intersection entre le rayon 3D et le plan de la camera
        const p = pickingData.selectedPlane.p;
        const n = pickingData.selectedPlane.n;
        // tI = <p-p0,n> / <d,n>
        const tI = ( (p.clone().sub(p0)).dot(n) ) / ( d.dot(n) );
        // pI = p0 + tI d
        const pI = (d.clone().multiplyScalar(tI)).add(p0); // le point d'intersection

        // Translation à appliquer
        const translation = pI.clone().sub( p );

        // Translation de l'objet et de la représentation visuelle
		
		if (pickingData.selectedObject==C){
			C.material.color.set(0xff0000);
			A.material.color.set(0xffffff);
			pickingData.selectedObject.translateZ(-translation.y);
			
			const a = 7;
			const d0 = 12;
			const c = 3;
			const L = Math.sqrt((2*a+d0)/2*(2*a+d0)/2+c*c);
			
			const xC = pickingData.selectedObject.position.x;
			const yC = pickingData.selectedObject.position.y;
			//pickingData.selectedObject.position.set(xI+(xA-xI)/norme*a,yI+(yA-yI)/norme*a,0);
			let angle = -2*Math.atan(yC/d0);
			if (angle>Math.PI/2.8){
				angle=Math.PI/2.8;
			}
			if (angle<-Math.PI/2.8){
				angle=-Math.PI/2.8;
			}
			
			//const coorda = [pickingData.selectedObject.position.x,pickingData.selectedObject.position.y,pickingData.selectedObject.position.z]
			const coorda = coordA(a,angle);
			A.position.set(coorda[0],coorda[1],coorda[2]);

			const coordc = coordC(d0,angle);
			C.position.set(coordc[0],coordc[1],coordc[2]);

			const coordb = coordB(a,d0,L,angle);
			B.position.set(coordb[0],coordb[1],coordb[2]);

			const coordd = coordD(a,d0,L,angle);
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
			AI.position.z=-1;
			
			
		}
		
		if (pickingData.selectedObject==A){
			A.material.color.set(0xff0000);
			C.material.color.set(0xffffff);
			pickingData.selectedObject.translateZ(-translation.y);
			pickingData.selectedObject.translateX(translation.x);
			
			const a = 7;
			const d0 = 12;
			const c = 3;
			const L = Math.sqrt((2*a+d0)/2*(2*a+d0)/2+c*c);
			
			const xA = pickingData.selectedObject.position.x;
			const yA = pickingData.selectedObject.position.y;
			const xI = I.position.x;
			const yI = I.position.y;
			const norme = Math.sqrt((xA-xI)*(xA-xI) + (yA-yI)*(yA-yI));
			//pickingData.selectedObject.position.set(xI+(xA-xI)/norme*a,yI+(yA-yI)/norme*a,0);
			let angle = -Math.atan((yA-yI)/(xA-xI));
			if (angle>Math.PI/2.8){
				angle=Math.PI/2.8;
			}
			if (angle<-Math.PI/2.8){
				angle=-Math.PI/2.8;
			}
			
			//const coorda = [pickingData.selectedObject.position.x,pickingData.selectedObject.position.y,pickingData.selectedObject.position.z]
			const coorda = coordA(a,angle);
			pickingData.selectedObject.position.set(coorda[0],coorda[1],coorda[2]);

			const coordc = coordC(d0,angle);
			C.position.set(coordc[0],coordc[1],coordc[2]);

			const coordb = coordB(a,d0,L,angle);
			B.position.set(coordb[0],coordb[1],coordb[2]);

			const coordd = coordD(a,d0,L,angle);
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
			AI.position.z=-1;
			
			
		}
		
		/*const xSphere = pickingData.selectedObject.position.x;
		const ySphere = pickingData.selectedObject.position.y;
		const cylindre = sceneGraph.getObjectByName("cylindre");
		const xC = cylindre.position.x;
		const yC = cylindre.position.y;
		const norme = Math.sqrt((xSphere-xC)*(xSphere-xC) + (ySphere-yC)*(ySphere-yC));
		pickingData.selectedObject.position.set(xC+(xSphere-xC)/norme*1.5,yC+(ySphere-yC)/norme*1.5,0);
		if(ySphere<yC){
			if (xSphere<xC){
				pickingData.selectedObject.position.set(xC-1.5,yC,0);
			}
			else{
				pickingData.selectedObject.position.set(xC+1.5,yC,0);
			}
		}
		
		const levier = sceneGraph.getObjectByName("levier");
		const p1 = [xC,yC,0];
		const p2 = [pickingData.selectedObject.position.x,pickingData.selectedObject.position.y,0];
		barBetween(p2,p1,levier);
*/
        pickingData.selectedPlane.p.add( translation );

    }
}

/*

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
		
		if(x<0){
			A.material.color.set(0xff0000);
			C.material.color.set(0xffffff);
		}
		if(x>0){
			C.material.color.set(0xff0000);
			A.material.color.set(0xffffff);
		}
		
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
		AI.position.z=-1;
		
		leaveDot(sceneThreeJs.sceneGraph,coorda[0],coorda[1],coorda[2]);
		leaveDot(sceneThreeJs.sceneGraph,coordc[0],coordc[1],coordc[2]);
		
	}
	
}
*/