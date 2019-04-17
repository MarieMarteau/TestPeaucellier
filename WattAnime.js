"use strict";


main();

function main() {

    const sceneThreeJs = {
        sceneGraph: null,
        camera: null,
        renderer: null,
        controls: null
    };

    initEmptyScene(sceneThreeJs);
    init3DObjects(sceneThreeJs.sceneGraph);


    animationLoop(sceneThreeJs);
	interactionWatt(sceneThreeJs);

}

// Initialise les objets composant la scène 3D
function init3DObjects(sceneGraph) {
	
	const a = 4*2.1;
	const b = 4*2.2;
	const c = 4*0.6;
	
	
	
	/*
	const curve = new THREE.CatmullRomCurve3(
		createCurve(a,b,c)
	);

	const points = curve.getPoints( 100 );
	const geometry = new THREE.BufferGeometry().setFromPoints( points );

	const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

	
	const curveObject = new THREE.Line( geometry, material );
	sceneGraph.add(curveObject);
	*/
	
	/*
	
	//Create circle
    const materialCircle1 = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const geometryCircle1 = new THREE.CircleGeometry( b, 64 );
	geometryCircle1.vertices.shift();
	const circle1 = new THREE.LineLoop( geometryCircle1, materialCircle1 ) ;
	circle1.position.set(a,0,0);
	sceneGraph.add( circle1);
	
	const materialCircle2 = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const geometryCircle2 = new THREE.CircleGeometry( b, 64 );
	geometryCircle2.vertices.shift();
	const circle2 = new THREE.LineLoop( geometryCircle2, materialCircle2 ) ;
	circle2.position.set(-a,0,0);
	sceneGraph.add( circle2);*/

	const A = createCylinder("A",Vector3(-a,0,0));
	const M = createCylinder("M",Vector3(0,0,0));
	const P = createCylinder("P",Vector3(3,0,0));
	const Q = createCylinder("Q",Vector3(-3,0,0));
	const B = createCylinder("B",Vector3(a,0,0));

	
	sceneGraph.add(A);
	sceneGraph.add(M);
	sceneGraph.add(P);
	sceneGraph.add(Q);
	sceneGraph.add(B);
	
	
	const theta = 0.1;
	
	P.position.set(coordP(theta,a,b,c)[0],coordP(theta,a,b,c)[1],coordP(theta,a,b,c)[2]);
	Q.position.set(coordQ(theta,a,b,c)[0],coordQ(theta,a,b,c)[1],coordQ(theta,a,b,c)[2]);
	M.position.set(coordM(theta,a,b,c)[0],coordM(theta,a,b,c)[1],coordM(theta,a,b,c)[2]);
	
	
	const AP = createBar(b, "AP");
	const BQ = createBar(b, "BQ");
	const PQ = createBar(2*c, "PQ");
	
	sceneGraph.add(AP);
	sceneGraph.add(BQ);
	sceneGraph.add(PQ);
	
	
	const coorda = [-a,0,0];
	const coordb=[a,0,0];
	const coordm = coordM(theta,a,b,c);
	const coordp = coordP(theta,a,b,c);
	const coordq = coordQ(theta,a,b,c);

	barBetween(coorda,coordp,AP);
	barBetween(coordb,coordq,BQ);
	barBetween(coordp,coordq,PQ);

}

// Demande le rendu de la scène 3D
function render( sceneThreeJs ) {
    sceneThreeJs.renderer.render(sceneThreeJs.sceneGraph, sceneThreeJs.camera);
}

function animate(sceneThreeJs, time) {

    const t = time/1000;//time in second
	const a = 4*2.1;
	const b = 4*2.2;
	const c = 4*0.6;
	
	const theta = (thetaMin(a,b,c)+thetaMax(a,b,c))/2 + Math.cos(t)*(thetaMax(a,b,c)-thetaMin(a,b,c))/2;
	
	const M = sceneThreeJs.sceneGraph.getObjectByName("M");
	const Q = sceneThreeJs.sceneGraph.getObjectByName("Q");
	const P = sceneThreeJs.sceneGraph.getObjectByName("P");
	
	const AP = sceneThreeJs.sceneGraph.getObjectByName("AP");
	const BQ = sceneThreeJs.sceneGraph.getObjectByName("BQ");
	const PQ = sceneThreeJs.sceneGraph.getObjectByName("PQ");
	
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
	
	leaveDot(sceneThreeJs.sceneGraph,coordM(theta,a,b,c)[0],coordM(theta,a,b,c)[1],coordM(theta,a,b,c)[2]);
	
    render(sceneThreeJs);
}






// Fonction d'initialisation d'une scène 3D sans objets 3D
//  Création d'un graphe de scène et ajout d'une caméra et d'une lumière.
//  Création d'un moteur de rendu et ajout dans le document HTML
function initEmptyScene(sceneThreeJs) {

    sceneThreeJs.sceneGraph = new THREE.Scene( );

    sceneThreeJs.camera = sceneInit.createCamera(0,0,26);
	sceneThreeJs.camera.lookAt(0,0,0);
    sceneInit.insertAmbientLight(sceneThreeJs.sceneGraph);
    sceneInit.insertLight(sceneThreeJs.sceneGraph,Vector3(0,5,20));
	sceneInit.insertLight(sceneThreeJs.sceneGraph,Vector3(0,-5,20));

    sceneThreeJs.renderer = sceneInit.createRenderer();
    sceneInit.insertRenderInHtml(sceneThreeJs.renderer.domElement);


    const onResizeFunction = function(event) { onResize(sceneThreeJs); };
    window.addEventListener('resize', onResizeFunction );
}

// Fonction de gestion d'animation
function animationLoop(sceneThreeJs) {

    // Fonction JavaScript de demande d'image courante à afficher
    requestAnimationFrame(

        // La fonction (dite de callback) recoit en paramètre le temps courant
        function(timeStamp){
            animate(sceneThreeJs,timeStamp); // appel de notre fonction d'animation
            animationLoop(sceneThreeJs); // relance une nouvelle demande de mise à jour
        }

     );

}

// Fonction appelée lors du redimensionnement de la fenetre
function onResize(sceneThreeJs) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneThreeJs.camera.aspect = width / height;
    sceneThreeJs.camera.updateProjectionMatrix();

    sceneThreeJs.renderer.setSize(width, height);
}

function Vector3(x,y,z) {
    return new THREE.Vector3(x,y,z);
}

function MaterialRGB(r,g,b) {
    const c = new THREE.Color(r,g,b);
    return new THREE.MeshLambertMaterial( {color:c} );
}


