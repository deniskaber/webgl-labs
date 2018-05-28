var camera, scene, renderer, light1, light2, spotLight, lightHelper;
var cone, cylinder, sphere;
var clock = new THREE.Clock();
init();
animate();
function init() {
  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 800;
  scene = new THREE.Scene();

  var controls = new THREE.OrbitControls( camera );
  controls.minPolarAngle = Math.PI / 4;
  controls.maxPolarAngle = Math.PI / 1.5;

  sphere = new THREE.SphereBufferGeometry( 0.5, 16, 8 );

  var ambient = new THREE.AmbientLight( 0x101010 );
  scene.add( ambient );

  //lights
  light1 = new THREE.PointLight( 0xff0040, 5, 1000 );
  light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
  scene.add( light1 );

  light2 = new THREE.PointLight( 0x0040ff, 5, 1000 );
  light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
  scene.add( light2 );


  spotLight = new THREE.SpotLight( 0xffffff, 5, 1000 );
  light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
  spotLight.position.set( 400, 400, 200 );
  spotLight.angle = 0.3;
  spotLight.penumbra = 0.05;
  spotLight.decay = 2;
  spotLight.distance = 800;
  scene.add( spotLight );

  lightHelper = new THREE.SpotLightHelper( spotLight );
  scene.add( lightHelper );


  var cubeMap = new THREE.CubeTextureLoader()
    .setPath( 'textures/' )
    .load( [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ] );

  var loader = new THREE.TGALoader();

  // https://threejs.org/docs/index.html#api/geometries/CylinderBufferGeometry
  var cylinderGeometry = new THREE.CylinderBufferGeometry( 50, 50, 150, 32 );
  var material = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: cubeMap, map: loader.load('textures/metal.tga') } );

  cylinder = new THREE.Mesh( cylinderGeometry, material );
  scene.add( cylinder );

  cylinder.position.x = -200;

  // https://threejs.org/docs/index.html#api/geometries/SphereBufferGeometry
  var sphereGeometry = new THREE.SphereBufferGeometry( 115, 6, 6 );
  material = new THREE.MeshLambertMaterial( { color: 0xccddff, map: loader.load('textures/metal.tga') } );
  sphere = new THREE.Mesh( sphereGeometry, material );
  scene.add( sphere );

  sphere.position.x = 0;

  // https://threejs.org/docs/index.html#api/geometries/ConeBufferGeometry
  var coneGeometry = new THREE.ConeBufferGeometry( 50, 150, 32 );
  material = new THREE.MeshLambertMaterial( { color: 0xccddff, opacity: 0.7, transparent: true, map: loader.load('textures/metal.tga') } );
  cone = new THREE.Mesh( coneGeometry, material );
  scene.add( cone );

  cone.position.x = 200;

  renderer = new THREE.WebGLRenderer( { antialias: true } );
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
  var time = Date.now() * 0.0005;
  var delta = clock.getDelta();
  // if( object ) object.rotation.y -= 0.5 * delta;

  light1.position.x = Math.sin( time * 0.7 ) * 150 * 1.5;
  light1.position.y = Math.cos( time * 0.5 ) * 200 * 1.5;
  light1.position.z = Math.cos( time * 0.3 ) * 150 * 1.5;

  light2.position.x = Math.cos( time * 0.3 ) * 150 * 1.5;
  light2.position.y = Math.sin( time * 0.5 ) * 200 * 1.5;
  light2.position.z = Math.sin( time * 0.7 ) * 150 * 1.5;

  spotLight.position.x = light1.position.x;
  lightHelper.update();

  renderer.render( scene, camera );
}