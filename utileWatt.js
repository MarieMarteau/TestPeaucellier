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


function createCurve(a,b,c){
	const tab = [];
	let theta = 0;
	for(let k=0;k<12;k++){
		theta = k*Math.PI/6;
		let rocarre1 = b*b- (a*Math.sin(theta) - Math.sqrt(c*c - a*a*Math.cos(theta)*Math.cos(theta)))*(a*Math.sin(theta) - Math.sqrt(c*c - a*a*Math.cos(theta)*Math.cos(theta)))
		let rocarre2 = b*b- (a*Math.sin(theta) + Math.sqrt(c*c - a*a*Math.cos(theta)*Math.cos(theta)))*(a*Math.sin(theta) + Math.sqrt(c*c - a*a*Math.cos(theta)*Math.cos(theta)))
	
		let rocarre = 0;
		if (rocarre1>=0){
			rocarre=rocarre1;
		}
		else if (rocarre2>=0){
			rocarre=rocarre2;
		}
		let ro = Math.sqrt(rocarre);
		tab.push(new THREE.Vector3(ro*Math.cos(theta)+a,ro*Math.sin(theta),0));
	}
	return tab;
}


function barBetween(p1,p2,barre){
	barre.position.set((p1[0]+p2[0])/2,(p1[1]+p2[1])/2,(p1[2]+p2[2])/2);
	const angle = Math.atan(-(p1[0]-p2[0])/(p1[1]-p2[1]));
	barre.rotation.z = angle;
}



function thetaMin(a,b,c){
	return - Math.acos((4*a*a+(2*c+b)*(2*c+b) - b*b)/(4*a*(2*c+b)))
}

function thetaMax(a,b,c){
	return Math.acos((b*b-(2*c+b)*(2*c+b) + 4*a*a)/(4*a*b))
}

function PB(theta,a,b,c){
	return Math.sqrt(b*b+4*a*a-4*a*b*Math.cos(theta))
}

function alpha1(theta,a,b,c){
	const p = PB(theta,a,b,c);
	return Math.acos((p*p+b*b-4*c*c)/(2*p*b));
}

function alpha2(theta,a,b,c){
	const p = PB(theta,a,b,c);
	return Math.acos((4*a*a+p*p-b*b)/(4*a*p));
}

function theta2(theta,a,b,c){
	const a1 = alpha1(theta,a,b,c);
	const a2 = alpha2(theta,a,b,c);
	
	if (theta < 0){
		return a1+a2;
	}
	else{
		return a1-a2;
	}
}


function coordP(theta,a,b,c){
	return [b*Math.cos(theta)-a,b*Math.sin(theta),0];
}

function coordQ(theta,a,b,c){
	const beta = theta2(theta,a,b,c);
	return [2*a-b*Math.cos(beta)-a,-b*Math.sin(beta),0];
}

function coordM(theta,a,b,c){
	const beta = theta2(theta,a,b,c);
	return [(2*a-b*Math.cos(beta)+b*Math.cos(theta))/2-a,(-b*Math.sin(beta)+b*Math.sin(theta))/2,0];
}