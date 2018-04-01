var camera, scene, renderer;
var mesh, sphere;
init();
animate();
function init() {
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 400;
  scene = new THREE.Scene();

  // https://threejs.org/docs/index.html#api/geometries/BoxBufferGeometry
  var boxGeometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
  var material = new THREE.MeshBasicMaterial( {wireframe: true} );
  mesh = new THREE.Mesh( boxGeometry, material );

  scene.add( mesh );

  // https://threejs.org/docs/index.html#api/geometries/SphereBufferGeometry
  var sphereGeometry = new THREE.SphereBufferGeometry( 141.422, 6, 6 );
  sphere = new THREE.Mesh( sphereGeometry, material );

  scene.add( sphere );

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

function changePositions() {
  mesh.position.y -= 50;
  sphere.scale.x = sphere.scale.x * 0.75;
  sphere.scale.y = sphere.scale.y * 0.75;
  sphere.scale.z = sphere.scale.z * 0.75;
}