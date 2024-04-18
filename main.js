import * as THREE from 'three';

var camera, scene, renderer;

var texture_placeholder,
    isUserInteracting = false,
    onPointerDownMouseX = 0, onPointerDownMouseY = 0,
    lon = 0, onPointerDownLon = 0,
    lat = 0, onPointerDownLat = 0,
    phi = 0, theta = 0;

init();
animate();

function init() {
    var container, mesh;

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);

    scene = new THREE.Scene();

    var geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));

    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('Corona_Panorama_CanhoSunny.jpg');
    var material = new THREE.MeshBasicMaterial({ map: texture });

    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mousewheel', onDocumentMouseWheel, false);
    document.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    isUserInteracting = true;
    onPointerDownMouseX = event.clientX;
    onPointerDownMouseY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
}

function onDocumentMouseMove(event) {
    if (isUserInteracting === true) {
        lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
        lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
    }
}

function onDocumentMouseUp(event) {
    isUserInteracting = false;
}

function onDocumentMouseWheel(event) {
    if (event.wheelDeltaY) {
        camera.fov = Math.min(Math.max(15.0, (camera.fov - event.wheelDeltaY * 0.05)), 130.0);
    } else if (event.wheelDelta) {
        camera.fov = Math.min(Math.max(15.0, (camera.fov - event.wheelDelta * 0.05)), 130.0);
    } else if (event.detail) {
        camera.fov = Math.min(Math.max(15.0, (camera.fov + event.detail * 1.0)), 130.0);
    }
    camera.updateProjectionMatrix();
}

function animate() {
    requestAnimationFrame(animate);
    update();
}

function update() {
    if (isUserInteracting === false) {
        lon += 0;
    }
    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon + 180);
    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 500 * Math.cos(phi);
    camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(camera.target);
    renderer.render(scene, camera);
}
