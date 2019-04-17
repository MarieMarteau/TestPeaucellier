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
		const a = 4*2.1;
		const b = 4*2.2;
		const c = 4*0.6;
		
		const M = sceneGraph.getObjectByName("M");
		const Q = sceneGraph.getObjectByName("Q");
		const P = sceneGraph.getObjectByName("P");
		const A = sceneGraph.getObjectByName("A");
		const B = sceneGraph.getObjectByName("B");
		
		const AP = sceneGraph.getObjectByName("AP");
		const BQ = sceneGraph.getObjectByName("BQ");
		const PQ = sceneGraph.getObjectByName("PQ");
		
		if (pickingData.selectedObject==P){
			P.material.color.set(0xff0000);
			Q.material.color.set(0xffffff);
			pickingData.selectedObject.translateZ(-translation.y);
			pickingData.selectedObject.translateX(translation.x);
			const xP = pickingData.selectedObject.position.x;
			const yP = pickingData.selectedObject.position.y;
			const xA = A.position.x;
			const yA = A.position.y;
			
			let theta = Math.atan((yP-yA)/(xP-xA));
			
			
			if(theta>thetaMax(a,b,c)){
				theta=thetaMax(a,b,c);
			}
			if(theta<thetaMin(a,b,c)){
				theta=thetaMin(a,b,c);
			}
			
			P.position.set(coordP(theta,a,b,c)[0],coordP(theta,a,b,c)[1],coordP(theta,a,b,c)[2]);
			Q.position.set(coordQ(theta,a,b,c)[0],coordQ(theta,a,b,c)[1],coordQ(theta,a,b,c)[2]);
			M.position.set(coordM(theta,a,b,c)[0],coordM(theta,a,b,c)[1],coordM(theta,a,b,c)[2]);
			
			
			const coorda = [-a,0,0];
			const coordb =[a,0,0];
			const coordm = coordM(theta,a,b,c);
			const coordp = coordP(theta,a,b,c);
			const coordq = coordQ(theta,a,b,c);

			barBetween(coorda,coordp,AP);
			barBetween(coordb,coordq,BQ);
			barBetween(coordp,coordq,PQ);
			
			
		}
		
			pickingData.selectedPlane.p.add( translation );
	
	/*
	
	if(theta<thetaMax(a,b,c) && theta>thetaMin(a,b,c)){
	
		P.position.set(coordP(theta,a,b,c)[0],coordP(theta,a,b,c)[1],coordP(theta,a,b,c)[2]);
		Q.position.set(coordQ(theta,a,b,c)[0],coordQ(theta,a,b,c)[1],coordQ(theta,a,b,c)[2]);
		M.position.set(coordM(theta,a,b,c)[0],coordM(theta,a,b,c)[1],coordM(theta,a,b,c)[2]);
		
		
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
}