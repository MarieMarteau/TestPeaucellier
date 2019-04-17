"use strict";


main();

function main() {

    const sceneThreeJs = {
        sceneGraph: null,
        camera: null,
        renderer: null,
        controls: null
    };
	
	const pickingData = {
        descente:false,
		remontee:false,
		enabled: true,		// Mode picking en cours ou désactivé (CTRL enfoncé)
        enableDragAndDrop: false, // Drag and drop en cours ou désactivé
        selectableObjects: [],    // Les objets selectionnables par picking
        selectedObject: null,     // L'objet actuellement selectionné
        selectedPlane: {p:null,n:null}, // Le plan de la caméra au moment de la selection. Plan donné par une position p, et une normale n.
    };

    initEmptyScene(sceneThreeJs);
    init3DObjects(sceneThreeJs.sceneGraph,pickingData);
	
	// *************************** //
    // Creation d'un lanceur de rayon (ray caster) de Three.js pour le calcul de l'intersection entre un objet et un rayon
    // *************************** //
    const raycaster = new THREE.Raycaster();

    // *************************** //
    // Fonction de rappels
    // *************************** //

    // Récupération de la taille de la fenetre en tant que variable à part
    const screenSize = {
        w:sceneThreeJs.renderer.domElement.clientWidth,
        h:sceneThreeJs.renderer.domElement.clientHeight
    };

// Fonction à appeler lors du clic de la souris: selection d'un objet
    //  (Création d'un wrapper pour y passer les paramètres souhaités)
    const wrapperMouseDown = function(event) { onMouseDown(event,raycaster,pickingData,screenSize,sceneThreeJs.camera); };
    document.addEventListener( 'mousedown', wrapperMouseDown );

    const wrapperMouseUp = function(event) { onMouseUp(event,pickingData); };
    document.addEventListener( 'mouseup', wrapperMouseUp );

    // Fonction à appeler lors du déplacement de la souris: translation de l'objet selectionné
    const wrapperMouseMove = function(event) { onMouseMove(event, pickingData, screenSize, sceneThreeJs.camera,sceneThreeJs.sceneGraph) };
    document.addEventListener( 'mousemove', wrapperMouseMove );
	
    animationLoop(sceneThreeJs);

}

// Initialise les objets composant la scène 3D
function init3DObjects(sceneGraph,pickingData) {

	const a = 7;
	const d = 12;
	const c = 3;
	const L = Math.sqrt((2*a+d)/2*(2*a+d)/2+c*c);
	const l = Math.sqrt(((-2*a+d)/2*(-2*a+d)/2+c*c));
	
	
	const A = createCylinder("A",Vector3(-2*a,0,0));
	
	const textureLoader = new THREE.TextureLoader();
	const textureC= textureLoader.load( 'bronze2.jpg' );
    const materialC = new THREE.MeshLambertMaterial({ map: textureC });
	const I = new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.6,0.2,32),materialC)
	I.rotateX(Math.PI/2);
	I.position.set(-a, 0,0);
	I.castShadow = true;
	I.name = "I";
	pickingData.selectableObjects.push(A);
	
	
	const O = createCylinder("O",Vector3(0,0,0));
	const C = createCylinder("C",Vector3(d,0,0));
	const B = createCylinder("B",Vector3((-2*a+d)/2,c,0));
	const D = createCylinder("D",Vector3((-2*a+d)/2,-c,0));
	sceneGraph.add(A);
	sceneGraph.add(O);
	sceneGraph.add(I);
	sceneGraph.add(C);
	sceneGraph.add(B);
	sceneGraph.add(D);
	pickingData.selectableObjects.push(C);
	
	const DA = createBar(L, "DA");
	const AB = createBar(L, "AB");
	const BC = createBar(L, "BC");
	const CD = createBar(L, "CD");
	const OB = createBar(l, "OB");
	const OD = createBar(l, "OD");
	const AI = createBar(a, "AI");
	sceneGraph.add(AI);
	sceneGraph.add(DA);
	sceneGraph.add(AB);
	sceneGraph.add(BC);
	sceneGraph.add(CD);
	sceneGraph.add(OB);
	sceneGraph.add(OD);
	
	/*const PGeometry = new THREE.CubeGeometry(26,20,1);
	
	const textureLoader = new THREE.TextureLoader();
	const textureP= textureLoader.load( 'wood.jpg' );
    const materialP = new THREE.MeshLambertMaterial({ map: textureP });
	const planche = new THREE.Mesh(PGeometry,materialP);
	planche.position.set(1, 0,-0.8);
	sceneGraph.add(planche);*/
	
	
	//Initialisation du parallélogramme
	const coorda = coordA(a,0);
	A.position.set(coorda[0],coorda[1],coorda[2]);

	const coordc = coordC(d,0);
	C.position.set(coordc[0],coordc[1],coordc[2]);

	const coordb = coordB(a,d,L,0);
	B.position.set(coordb[0],coordb[1],coordb[2]);

	const coordd = coordD(a,d,L,0);
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
	
	let pts1=[];
	const l1 = 0.15*2;
	const l2 = 0.3*2;
	const l3 = 0.1*2;
	const l4 = 0.3*2;
    pts1.push(new THREE.Vector2(0,l1));
	pts1.push(new THREE.Vector2(l2,l1));
	pts1.push(new THREE.Vector2(l2,l1+l3));
	pts1.push(new THREE.Vector2(l2+l4,0));
	pts1.push(new THREE.Vector2(l2,-l1-l3));
	pts1.push(new THREE.Vector2(l2,-l1));
	pts1.push(new THREE.Vector2(0,-l1));
	pts1.push(new THREE.Vector2(0,l1));
    const shape1 = new THREE.Shape( pts1 );
	
    let Points1 = [];
	Points1.push( new THREE.Vector3(0,0,-0.15));
	Points1.push( new THREE.Vector3(0,0,0.15));
    const Spline1 =  new THREE.CatmullRomCurve3( Points1 );

    const extrudeSettings1 = {
	steps: 150,
	bevelEnabled: false,
	extrudePath: Spline1
};

    const extrudeGeometry1 = new THREE.ExtrudeBufferGeometry( shape1, extrudeSettings1 );
    const flecheG = new THREE.Mesh( extrudeGeometry1,new THREE.MeshLambertMaterial({color:0xc40712})) ;
    flecheG.material.side = THREE.DoubleSide; 
	flecheG.name = "flecheG";
	flecheG.position.set(0,0.4,3.0);
	flecheG.rotateZ(Math.PI/2);
	flecheG.rotateX(Math.PI/2);
	flecheG.rotateY(Math.PI/2);
	A.add(flecheG);
	
	const extrudeGeometry2 = new THREE.ExtrudeBufferGeometry( shape1, extrudeSettings1 );
    const flecheD = new THREE.Mesh( extrudeGeometry2,new THREE.MeshLambertMaterial({color:0xc40712})) ;
    flecheD.material.side = THREE.DoubleSide; 
	flecheD.name = "flecheD";
	flecheD.position.set(0,0.4,3.0);
	flecheD.rotateZ(Math.PI/2);
	flecheD.rotateX(Math.PI/2);
	flecheD.rotateY(Math.PI/2);
	C.add(flecheD);
	

}

// Demande le rendu de la scène 3D
function render( sceneThreeJs ) {
    sceneThreeJs.renderer.render(sceneThreeJs.sceneGraph, sceneThreeJs.camera);
}

function animate(sceneThreeJs, time) {

    const t = time/1000;//time in second
	
    render(sceneThreeJs);
}






// Fonction d'initialisation d'une scène 3D sans objets 3D
//  Création d'un graphe de scène et ajout d'une caméra et d'une lumière.
//  Création d'un moteur de rendu et ajout dans le document HTML
function initEmptyScene(sceneThreeJs) {

    sceneThreeJs.sceneGraph = new THREE.Scene( );

    sceneThreeJs.camera = sceneInit.createCamera(0,0,30);
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


