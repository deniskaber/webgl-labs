var camera, scene, renderer, lightSource;
var cone, cylinder, sphere, ground, dir = 1;
var clock = new THREE.Clock();
init();
animate();
function init() {
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 20;
  scene = new THREE.Scene();

  var controls = new THREE.OrbitControls( camera );
  controls.minPolarAngle = Math.PI / 4;
  controls.maxPolarAngle = Math.PI / 1.5;

  lightSource = new THREE.PointLight(0xffffff, 2, 100);
  lightSource.position.set (5, 5, 5);
  lightSource.castShadow = true;

  scene.add(lightSource);
  scene.add(new THREE.AmbientLight(0x505050));

  var tgaLoader = new THREE.TGALoader();

  cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 2, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: tgaLoader.load('textures/metal.tga'),
      transparent: true,
      opacity: 0.5,
    })
  );
  cylinder.position.set(-5, 0, 0);
  cylinder.receiveShadow = true;
  cylinder.castShadow = true;
  scene.add(cylinder);

  sphere = new THREE.Mesh(
    new THREE.SphereGeometry(10, 16, 16),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: tgaLoader.load('textures/metal.tga')
    })
  );
  sphere.position.set(5, 0, 0);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  sphere.scale.set(0.10, 0.10, 0.10);
  scene.add(sphere);

  cone = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    new THREE.MeshPhongMaterial({
      color: 0xffffff,
      map: tgaLoader.load('textures/metal.tga')
    })
  );
  cone.position.set(-5, 0, 0);
  cone.castShadow = true;
  cone.receiveShadow = true;
  scene.add(cone);

  ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({color: 0xffffff})
  );
  ground.rotation.x = - Math.PI / 2;
  ground.position.y = -1;
  ground.receiveShadow = true;
  scene.add( ground );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.shadowMap.enabled = true;
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

  if (lightSource.position.y < 0) {
    dir = 1;
  }

  if (lightSource.position.y > 20) {
    dir = -1;
  }

  lightSource.position.y += dir * 0.5;
  lightSource.position.x += dir * 0.2;
  lightSource.power += dir * 0.05;
  lightSource.color = new THREE.Color(lightSource.position.y * 1000);

  renderer.render( scene, camera );
}