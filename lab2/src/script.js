var container, stats;

var camera, scene, renderer;

var geometry, objects;

var mesh;

var morphDirection = 1;

init();
animate();

function init() {

  container = document.getElementById( 'container' );

  camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
  // camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 400;
  scene = new THREE.Scene();

  var geometry = new THREE.BoxGeometry( 100, 100, 100 );
  var material = new THREE.MeshBasicMaterial( { wireframe: true, morphTargets: true } );

  // construct 8 blend shapes

  for ( var i = 0; i < 8; i ++ ) {

    var vertices = [];

    for ( var v = 0; v < geometry.vertices.length; v ++ ) {

      vertices.push( geometry.vertices[ v ].clone() );

      if ( v === i ) {

        vertices[ vertices.length - 1 ].x *= 2;
        vertices[ vertices.length - 1 ].y *= 2;
        vertices[ vertices.length - 1 ].z *= 2;

      }

    }

    geometry.morphTargets.push( { name: "target" + i, vertices: vertices } );

  }

  mesh = new THREE.Mesh( geometry, material );

  scene.add( mesh );

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  //


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
  render();

}

function render() {

  mesh.rotation.y += 0.005;

  if (mesh.morphTargetInfluences[ 2 ] > 1) {
    morphDirection = 0;
  } else if (mesh.morphTargetInfluences[ 2 ] < -1) {
    morphDirection = 1;
  }

  mesh.morphTargetInfluences[ 0 ] += 0.005 * -1 * morphDirection;
  mesh.morphTargetInfluences[ 1 ] += 0.005 * -1 * morphDirection;
  mesh.morphTargetInfluences[ 2 ] += 0.005 * morphDirection;
  mesh.morphTargetInfluences[ 3 ] += 0.005 * morphDirection;
  mesh.morphTargetInfluences[ 4 ] += 0.005 * -1 * morphDirection;
  mesh.morphTargetInfluences[ 5 ] += 0.005 * -1 * morphDirection;
  mesh.morphTargetInfluences[ 6 ] += 0.005 * morphDirection;
  mesh.morphTargetInfluences[ 7 ] += 0.005 * morphDirection;

  renderer.render( scene, camera );

}