"using strict"

let camera = null;
let scene = null;
let renderer = null;
let mesh = null;
let alpha = 0;
let spotLight = null;

let frameVisual = new createFrame();


const objective_frame_1 = { rotation:{axis:new THREE.Vector3(1,0,0).normalize(),angle:Math.PI/6.0},position:new THREE.Vector3(0,0,0)};
const objective_frame_2 = { rotation:{axis:new THREE.Vector3(1,0,1).normalize(),angle:5*Math.PI/6.0},position:new THREE.Vector3(0,6,0)};


let R1_euler = null;
let R1_matrix = null;
let R2_euler = null;
let R2_matrix = null;
let R_matrix_current = new THREE.Matrix4();
R_matrix_current.set(0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0);

let guiControls = new function() {
    this.value = 0.00;
}

function init(){

    // Init three.js
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 500 );

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor(new THREE.Color('rgb(255,255,255)') );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    var controls = new THREE.OrbitControls( camera, renderer.domElement );

    // position and point the camera to the center of the scene
    camera.position.x = -4;
    camera.position.y = 8;
    camera.position.z = 13;
    camera.lookAt(new THREE.Vector3(0,3,0));

    // Html element
    const WebGLElement = document.querySelector("#WebGLElement");
    WebGLElement.appendChild(renderer.domElement);



    let gui = new dat.GUI();
    gui.add(guiControls,'value',0,1);



    initScene();
    animate();
}

function initScene() {
    const planeGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = -2;
    plane.position.z = 0;
    scene.add(plane);

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshLambertMaterial({color: 0xff0000});
    mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;
    //scene.add( mesh );


    // add subtle ambient lighting
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // add spotlight for the shadows
    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-3, 6, -3);
    spotLight.castShadow = true;
    spotLight.shadowMapWidth = 2048; // default is 512
    spotLight.shadowMapHeight = 2048; // default is 512
    scene.add(spotLight);





    const frame_1 = createFrame();
    const frame_2 = createFrame();

    frame_1.position.copy(objective_frame_1.position);
    frame_2.position.copy(objective_frame_2.position);



    frame_1.setRotationFromAxisAngle(objective_frame_1.rotation.axis, objective_frame_1.rotation.angle);
    frame_2.setRotationFromAxisAngle(objective_frame_2.rotation.axis, objective_frame_2.rotation.angle);


    R1_euler = frame_1.getWorldRotation();
    R1_matrix = new THREE.Matrix4().makeRotationFromEuler(R1_euler);
    R2_euler = frame_2.getWorldRotation();
    R2_matrix = new THREE.Matrix4().makeRotationFromEuler(R2_euler);

    scene.add(frame_1);
    scene.add(frame_2);

    frameVisual = new createFrame();
    scene.add(frameVisual);

    const N = 0;
    for(let k=0; k<N; k++) {

        let alpha = 1/N + k/N;


        const px = (1-alpha)*objective_frame_1.position.x + alpha*objective_frame_2.position.x;
        const py = (1-alpha)*objective_frame_1.position.y + alpha*objective_frame_2.position.y;
        const pz = (1-alpha)*objective_frame_1.position.z + alpha*objective_frame_2.position.z;
        const q1 =  rotationAxisAngle2Quaternion(objective_frame_1.rotation.axis,objective_frame_1.rotation.angle);
        const q2 = rotationAxisAngle2Quaternion(objective_frame_2.rotation.axis,objective_frame_2.rotation.angle);
        const q = new slerp(q1,q2,alpha);
        //const q = new slerp(q1,q2,alpha);
        const angleAxis = new rotationQuaternion2AngleAxis(q);


        const dual1 = quaternionDualFromQuaternionTranslation(q1,objective_frame_1.position);
        const dual2 = quaternionDualFromQuaternionTranslation(q2,objective_frame_2.position);
        const dualCurrent = new slerp(dual1,dual2,alpha);
        //dualCurrent = new THREE.Vector4( (1-alpha)*dual1.x+alpha*dual2.x, (1-alpha)*dual1.y+alpha*dual2.y, (1-alpha)*dual1.z+alpha*dual2.z, (1-alpha)*dual1.w+alpha*dual2.w);
        const dualTranslation = quaternionDualToTranslation(q,dualCurrent);

        let temp_frame = new createFrame();
        //temp_frame.position.copy(new THREE.Vector3(px,py,pz));
        temp_frame.position.copy(dualTranslation);
        temp_frame.setRotationFromAxisAngle(angleAxis.axis,angleAxis.angle);

        scene.add(temp_frame);
    }


}

function animate() {
    requestAnimationFrame( animate );

    alpha += 0.003;
    if(alpha>1)
        alpha=0;

    alpha = guiControls.value;

    spotLight.position.x = camera.position.x-3;
    spotLight.position.y = camera.position.y+5;
    spotLight.position.z = camera.position.z+5;

    const current_frame = {};


    const px = (1-alpha)*objective_frame_1.position.x + alpha*objective_frame_2.position.x;
    const py = (1-alpha)*objective_frame_1.position.y + alpha*objective_frame_2.position.y;
    const pz = (1-alpha)*objective_frame_1.position.z + alpha*objective_frame_2.position.z;

    const q1 = rotationAxisAngle2Quaternion(objective_frame_1.rotation.axis,objective_frame_1.rotation.angle);
    const q2 = rotationAxisAngle2Quaternion(objective_frame_2.rotation.axis,objective_frame_2.rotation.angle);


    const q = new slerp(q1,q2,alpha);
    //const q = new slerp(q1,q2,alpha);
    const angleAxis = new rotationQuaternion2AngleAxis(q);


    current_frame.position = new THREE.Vector3(px,py,pz);


    // const R1_element = R1_matrix.elements;
    // const R2_element = R2_matrix.elements;
    // let R_element = R_matrix_current.elements;
    // for( k=0; k<16; k++) {
    //     R_element[k] = (1-alpha)*R1_element[k] + alpha*R2_element[k];
    // }
    // const sx = Math.sqrt(R_element[0]*R_element[0]+R_element[3]*R_element[3]+R_element[6]*R_element[6]);
    // const sy = Math.sqrt(R_element[1]*R_element[1]+R_element[4]*R_element[4]+R_element[7]*R_element[7]);
    // const sz = Math.sqrt(R_element[2]*R_element[2]+R_element[5]*R_element[5]+R_element[8]*R_element[8]);

    dual1 = quaternionDualFromQuaternionTranslation(q1,objective_frame_1.position);
    dual2 = quaternionDualFromQuaternionTranslation(q2,objective_frame_2.position);
    dualCurrent = new slerp(dual1,dual2,alpha);
    //dualCurrent = new THREE.Vector4( (1-alpha)*dual1.x+alpha*dual2.x, (1-alpha)*dual1.y+alpha*dual2.y, (1-alpha)*dual1.z+alpha*dual2.z, (1-alpha)*dual1.w+alpha*dual2.w);
    dualTranslation = quaternionDualToTranslation(q,dualCurrent);

    //frameVisual.setRotationFromMatrix(R_matrix_current);
    // frameVisual.matrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1) ;
    // frameVisual.applyMatrix(R_matrix_current);
    // console.log(R_matrix_current.elements[1]);


    frameVisual.position.copy(current_frame.position);
    //frameVisual.position.copy(dualTranslation);
    frameVisual.setRotationFromAxisAngle(angleAxis.axis,angleAxis.angle);

    const primal = rotationQuaternion2AngleAxis(q);
    const dual = rotationQuaternion2AngleAxis(dualCurrent);
    //console.log(primal.axis);

    renderer.render(scene, camera);
}

function quaternionDualFromQuaternionTranslation(q,t) {
    const w = 0.5*( t.x*q.x + t.y*q.y + t.z*q.z );
    const x = 0.5*( t.x*q.w + t.y*q.z - t.z*q.y );
    const y = 0.5*(-t.x*q.z + t.y*q.w + t.z*q.x );
    const z = 0.5*( t.x*q.y - t.y*q.x + t.z*q.w );

    return new THREE.Vector4(x,y,z,w);
}
function quaternionDualToTranslation(q,d) {
    const x = 2*( -d.w*q.x + d.x*q.w - d.y*q.z + d.z*q.y );
    const y = 2*( -d.w*q.y + d.x*q.z + d.y*q.w - d.z*q.x );
    const z = 2*( -d.w*q.z - d.x*q.y + d.y*q.x + d.z*q.w );

    return new THREE.Vector3(x,y,z);
}

function slerp(q1,q2,alpha) {
    const cosOmega = q1.dot(q2);
    const sinOmega = Math.sqrt(1-cosOmega*cosOmega);
    const Omega = Math.atan2(sinOmega,cosOmega);

    w1 = Math.sin((1-alpha)*Omega)/sinOmega;
    w2 = Math.sin(alpha*Omega)/sinOmega;

    x = w1*q1.x + w2*q2.x;
    y = w1*q1.y + w2*q2.y;
    z = w1*q1.z + w2*q2.z;
    w = w1*q1.w + w2*q2.w;

    return new THREE.Vector4(x,y,z,w);
}

function rotationAxisAngle2Quaternion(axis,angle) {

    sinAngle = Math.sin(angle/2);
    cosAngle = Math.cos(angle/2);
    const q = new THREE.Vector4(axis.x*sinAngle, axis.y*sinAngle, axis.z*sinAngle, cosAngle);
    return q;
}

function rotationQuaternion2AngleAxis(q) {

    const x = q.x;
    const y = q.y;
    const z = q.z;
    const w = q.w;

    const L = Math.sqrt(x*x+y*y+z*z);
    const axis = new THREE.Vector3(x/L,y/L,z/L);
    const theta = 2*Math.atan2(L,w);

    return {"axis":axis, "angle":theta};
}

function createFrame() {

    const frame = new THREE.Object3D();

    const LCone = 0.2;
    const sphereGeometry = new THREE.SphereGeometry( 0.1,32,32 );
    const cylinderGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.0, 24,24);
    const coneGeometry = new THREE.ConeGeometry(0.1, LCone, 24);

    const white = new THREE.MeshLambertMaterial({color: 0xffffff});
    const red = new THREE.MeshLambertMaterial({color: 0xff0000});
    const green = new THREE.MeshLambertMaterial({color: 0x00ff00});
    const blue = new THREE.MeshLambertMaterial({color: 0x0000ff});


    const sphere = new THREE.Mesh(sphereGeometry,white);
    sphere.castShadow = true;

    const cylinderX = new THREE.Mesh(cylinderGeometry,red);
    cylinderX.rotation.set(0,0,Math.PI/2);
    cylinderX.position.set(0.5,0,0);
    cylinderX.castShadow = true;

    const cylinderY = new THREE.Mesh(cylinderGeometry,green);
    cylinderY.rotation.set(0,0,0);
    cylinderY.position.set(0,0.5,0);
    cylinderY.castShadow = true;

    const cylinderZ = new THREE.Mesh(cylinderGeometry,blue);
    cylinderZ.rotation.set(Math.PI/2,0,0);
    cylinderZ.position.set(0,0,0.5);
    cylinderZ.castShadow = true;


    const coneX = new THREE.Mesh(coneGeometry,red);
    coneX.rotation.set(0,0,-Math.PI/2);
    coneX.position.set(1.0,0,0);
    coneX.castShadow = true;

    const coneY = new THREE.Mesh(coneGeometry,green);
    coneY.rotation.set(0,0,0);
    coneY.position.set(0,1.0,0);
    coneY.castShadow = true;

    const coneZ = new THREE.Mesh(coneGeometry,blue);
    coneZ.rotation.set(Math.PI/2,0,0);
    coneZ.position.set(0,0,1.0);
    coneZ.castShadow = true;



    frame.add(sphere);

    frame.add(cylinderX);
    frame.add(cylinderY);
    frame.add(cylinderZ);

    frame.add(coneX);
    frame.add(coneY);
    frame.add(coneZ);






    return frame;
}



function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init;
window.addEventListener('resize', onResize, false);
