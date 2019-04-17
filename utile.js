"use strict";

function createCylinder(n,position){ // creer une sphere rouge dont les coordonnées seront position
	const CGeometry = new THREE.CylinderGeometry(0.6,0.6,0.8,32);
	
	const textureLoader = new THREE.TextureLoader();
	const textureC= textureLoader.load( 'bronze2.jpg' );
    const materialC = new THREE.MeshLambertMaterial({ map: textureC });
	const cylinder = new THREE.Mesh(CGeometry,materialC)
	cylinder.rotateX(Math.PI/2);
	cylinder.position.set(position.x, position.y,position.z);
	cylinder.castShadow = true;
	cylinder.name = n;
	return cylinder;
}

function createBar(l, n){
	const BGeometry = new THREE.BoxGeometry(1,l,0.2);
	const textureLoader = new THREE.TextureLoader();
	const textureBar= textureLoader.load( 'bronze.jpg' );
    const materialBar = new THREE.MeshLambertMaterial({ map: textureBar });
	const barre = new THREE.Mesh(BGeometry,materialBar);
	barre.castShadow = true;
	barre.name = n;
	return barre;
}

function leaveDot(scene,x,y,z){ // creer une sphere rouge dont les coordonnées seront position
	const Geometry = new THREE.SphereGeometry(0.1,10,10);
	
	const material = new THREE.MeshLambertMaterial({ color:0xffffff });
	const sphere = new THREE.Mesh(Geometry,material)
	sphere.position.set(x,y,z);
	scene.add(sphere);
}

function leaveDotBleu(scene,x,y,z){ // creer une sphere rouge dont les coordonnées seront position
	const Geometry = new THREE.SphereGeometry(0.1,10,10);
	
	const material = new THREE.MeshLambertMaterial({ color:0xf5ff00 });
	const sphere = new THREE.Mesh(Geometry,material)
	sphere.position.set(x,y,z);
	scene.add(sphere);
}

function createArrow2(){
	const arrow2G = new THREE.Geometry();
	
	const curveArrow1 = new THREE.EllipseCurve(-9,0,5,5,5*Math.PI/6,7*Math.PI/6);
	const pointsArrow1 = curveArrow1.getPoints(40);

	for (let i = 0;i<40;i++){
		console.log(pointsArrow1[i].x);
		arrow2G.vertices.push(new THREE.Vector3(pointsArrow1[i].x,pointsArrow1[i].y,0));
	}
	arrow2G.vertices.push(new THREE.Vector3(pointsArrow1[39].x+0.3,pointsArrow1[39].y,0));
	arrow2G.vertices.push(new THREE.Vector3(pointsArrow1[39].x-0.2,pointsArrow1[39].y-0.5,0));
	arrow2G.vertices.push(new THREE.Vector3(pointsArrow1[39].x-0.8,pointsArrow1[39].y,0));
	
	const curveArrow2 = new THREE.EllipseCurve(-9.5,0,5,5,5*Math.PI/6,7*Math.PI/6);
	const pointsArrow2 = curveArrow2.getPoints(40);
	
	for (let i = 39;i>=0;i--){
		console.log(pointsArrow2[i].x);
		arrow2G.vertices.push(new THREE.Vector3(pointsArrow2[i].x,pointsArrow2[i].y,0));
	}
	arrow2G.vertices.push(new THREE.Vector3(pointsArrow2[0].x-0.3,pointsArrow2[0].y,0));
	arrow2G.vertices.push(new THREE.Vector3(pointsArrow2[0].x+0.2,pointsArrow2[0].y+0.5,0));
	arrow2G.vertices.push(new THREE.Vector3(pointsArrow2[0].x+0.8,pointsArrow2[0].y,0));
	arrow2G.vertices.push(new THREE.Vector3(pointsArrow1[0].x,pointsArrow1[0].y,0));
	
	const arrow2M = new THREE.LineBasicMaterial( { color: 0xc51515, linewidth: 1 } );
	const arrow2 = new THREE.Line( arrow2G, arrow2M );
	return arrow2;
}

function trinome(a,b,c){// a,b,c sont les coefficients du trinome a resoudre, renvoie les 2 racines réelles si elles existent 
  	const delta = b*b-4*a*c;
  	var x1 = (-b+Math.sqrt(delta))/(2*a);
	var x2 = (-b-Math.sqrt(delta))/(2*a);
	return [x2,x1];
}


function yDroiteBD(x, angle, a, d ) { // renvoie l'ordonnée de la droite BD quand on lui donne l abscisse
  	//angle a d parametres du parallelogramme etudie
	
	const A = -Math.sin(angle)/(1+Math.cos(angle));
	const B = (a+a*Math.cos(angle)-d)/2 - A/2*(a*Math.sin(angle)- d*Math.sin(angle)/(1+Math.cos(angle)));
	
  	return A*x + B;
}
                                                    
function getCoord(angle, a, d, L) { // dans le cas du point d'intersection du cercle avec la droite QB du parallelogramme de peaucelier
  	// x, angle a et d sont les parametres du parallelogramme
    // definition des cstes
    const A = -Math.sin(angle)/(1+Math.cos(angle));
    const B = (a+a*Math.cos(angle)-d)/2 - A/2*(a*Math.sin(angle)- d*Math.sin(angle)/(1+Math.cos(angle)));
    const C = a*Math.sin(angle);
	const D = a+a*Math.cos(angle) - B;
    var x1x2 = trinome(1+A*A,
    -2*C-2*A*D,
    C*C+D*D-L*L
    );
  	return x1x2;
}


function coordA(a,angle){
	return [-(a+a*Math.cos(angle)),a*Math.sin(angle),0]
}

function coordC(d,angle){
	return [d,-d*Math.sin(angle)/(1+Math.cos(angle)),0]
}

function coordB(a,d,L,angle){
	const x = getCoord(angle, a, d, L)[1];
	const y = yDroiteBD(x, angle, a, d);
	return [-y,x,0]
}

function coordD(a,d,L,angle){
	const x = getCoord(angle, a, d, L)[0];
	const y = yDroiteBD(x, angle, a, d);
	return [-y,x,0]
}

function barBetween(p1,p2,barre){
	barre.position.set((p1[0]+p2[0])/2,(p1[1]+p2[1])/2,(p1[2]+p2[2])/2);
	const angle = Math.atan(-(p1[0]-p2[0])/(p1[1]-p2[1]));
	barre.rotation.z = angle;
}