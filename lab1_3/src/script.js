var camera, scene, renderer;
var cone, cylinder;
init();
animate();
function init() {
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 400;
  scene = new THREE.Scene();

  // https://threejs.org/docs/index.html#api/geometries/ConeBufferGeometry
  var coneGeometry = new THREE.ConeBufferGeometry( 50, 150, 32 );
  var material = new THREE.MeshBasicMaterial( {wireframe: true} );
  cone = new THREE.Mesh( coneGeometry, material );
  scene.add( cone );

  cone.position.y = -100;

  // https://threejs.org/docs/index.html#api/geometries/CylinderBufferGeometry
  var cylinderGeometry = new THREE.CylinderBufferGeometry( 50, 50, 150, 32 );
  cylinder = new THREE.Mesh( cylinderGeometry, material );
  scene.add( cylinder );

  cylinder.position.y = 50;

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  //
  window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}