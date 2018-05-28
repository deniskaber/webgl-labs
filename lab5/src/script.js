var renderer, scene, camera, stats;
var pointsCloud, sphere, tracesCloud;
var noise = [];
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var amount = 1000;
var r = 200;
var rHalf = r / 2;
var particlesData = [];
var velocity = 2;
var maxSpeed = 10;
var direction = 1;
var sphereSpeed = 4;
var sphereRadius = 250;

init();
animate();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function init() {
  camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 1, 10000);
  camera.position.z = 1750;
  var controls = new THREE.OrbitControls(camera, container);
  scene = new THREE.Scene();
  group = new THREE.Group();
  scene.add(group);

  var ambient = new THREE.AmbientLight(0x101010);
  scene.add(ambient);

  // var helper = new THREE.BoxHelper( new THREE.Mesh( new THREE.BoxGeometry( r, r, r ) ) );
  // helper.material.color.setHex( 0x080808 );
  // helper.material.blending = THREE.AdditiveBlending;
  // helper.material.transparent = true;
  // group.add( helper );


  var positions = new Float32Array(amount * 3);
  var colors = new Float32Array(amount * 3);
  var sizes = new Float32Array(amount);
  var opacities = new Float32Array(amount);
  var vertex = new THREE.Vector3();
  var color = new THREE.Color(0xffffff);
  var frameDate = Date.now();

  for (var i = 0; i < amount; i++) {
    let data = getNewInitialParametersForParticle(frameDate);
    vertex.x = data.x;
    vertex.y = data.y;
    vertex.z = data.z;
    vertex.toArray(positions, i * 3);

    color.toArray(colors, i * 3);
    sizes[i] = 4;
    opacities[i] = 1.0;

    particlesData.push(data);
  }
  var geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
  geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.addAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
  //
  var material = new THREE.ShaderMaterial({
    uniforms: {
      amplitude: {value: 1.0},
      color: {value: new THREE.Color(0xffffff)},
      texture: {value: new THREE.TextureLoader().load("textures/particle2.png")}
    },
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true
  });
  //
  pointsCloud = new THREE.Points(geometry, material);
  group.add(pointsCloud);


  // var trPositions = new Float32Array(amount * 8 * 3);
  // var trColors = new Float32Array(amount * 8 * 3);
  // var trSizes = new Float32Array(amount * 8);
  // var trOpacities = new Float32Array(amount * 8);
  //
  // var traces = new THREE.BufferGeometry();
  // material = new THREE.LineBasicMaterial( { color: 0xccddff } )
  // tracesCloud = new THREE.Points(traces, material);
  //
  // for (var i = 0; i < amount; i++) {
  //   for (var j = 0; i < 8; j++) {
  //     trPositions[i*j + j] = positions[i];
  //   }
  // }
  //
  // traces.addAttribute('position', new THREE.BufferAttribute(trPositions, 3));
  // traces.addAttribute('color', new THREE.BufferAttribute(trColors, 3));
  // traces.addAttribute('size', new THREE.BufferAttribute(trSizes, 1));
  // traces.addAttribute('opacity', new THREE.BufferAttribute(trOpacities, 1));
  //
  // group.add(tracesCloud);


  var loader = new THREE.TGALoader();

  var sphereGeometry = new THREE.SphereBufferGeometry(sphereRadius, 6, 6);
  material = new THREE.MeshBasicMaterial({color: 0xccddff, map: loader.load('textures/metal.tga')});
  sphere = new THREE.Mesh(sphereGeometry, material);
  scene.add(sphere);

  // sphere.position.x = -300;
  sphere.position.y = -500;

  //
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  var container = document.getElementById('container');
  container.appendChild(renderer.domElement);
  // stats = new Stats();
  // container.appendChild( stats.dom );
  //
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  render();
  // stats.update();
}

function getNewInitialParametersForParticle(startLife) {
  let speed = getRandomInt(-1 * maxSpeed, maxSpeed);

  let obj = {
    x: Math.random() * r - r / 2,
    y: Math.random() * r - r / 2,
    z: Math.random() * r - r / 2,
    speed: speed,
    velocity: new THREE.Vector3(getRandomInt(-1 * maxSpeed, maxSpeed), getRandomInt(-1 * maxSpeed, maxSpeed), getRandomInt(-1 * maxSpeed, maxSpeed)),
    // lifetime: getRandomInt(3000, 8000),
    lifetime: 5000,
    startLife: startLife,
  };

  if (isInsideSphere(obj.x + obj.velocity.x, obj.y + obj.velocity.y, obj.z + obj.velocity.z)) {
    return getNewInitialParametersForParticle(startLife);
  }

  return obj;
}

function isInsideSphere(x, y, z) {
  var sphereX = sphere ? sphere.position.x : 0;
  var sphereY = sphere ? sphere.position.y : -500;
  var sphereZ = sphere ? sphere.position.z : 0;

  return Math.pow(x - sphereX, 2) + Math.pow(y - sphereY, 2) + Math.pow(z - sphereZ, 2) <= Math.pow(sphereRadius, 2);
}

function render() {
  var frameDate = Date.now();
  var geometry = pointsCloud.geometry;
  var attributes = geometry.attributes;

  for (var i = 0; i < attributes.opacity.array.length; i++) {
    let particleData = particlesData[i];
    let isInside = false;
    var newParams;
    var isDead = ((frameDate - particleData.startLife) > particleData.lifetime);

    if (!isDead) {

      // if (attributes.position.array[i * 3] + particleData.velocity.x < -rHalf || attributes.position.array[i * 3] + particleData.velocity.x > rHalf)
      //   particleData.velocity.x = -particleData.velocity.x;
      // if (attributes.position.array[i * 3 + 1] + particleData.velocity.y < -rHalf || attributes.position.array[i * 3 + 1] + particleData.velocity.y > rHalf)
      //   particleData.velocity.y = -particleData.velocity.y;
      // if (attributes.position.array[i * 3 + 2] + particleData.velocity.z < -rHalf || attributes.position.array[i * 3 + 2] + particleData.velocity.z > rHalf)
      //   particleData.velocity.z = -particleData.velocity.z;

      if (isInsideSphere(
          attributes.position.array[i * 3] + particleData.velocity.x,
          attributes.position.array[i * 3 + 1],
          attributes.position.array[i * 3 + 2]
        )) {
        isInside = true;

        particleData.velocity.x = -particleData.velocity.x;
      }

      if (isInsideSphere(
          attributes.position.array[i * 3],
          attributes.position.array[i * 3 + 1] + particleData.velocity.y,
          attributes.position.array[i * 3 + 2]
        )) {
        isInside = true;

        particleData.velocity.y = -particleData.velocity.y;
      }

      if (isInsideSphere(
          attributes.position.array[i * 3],
          attributes.position.array[i * 3 + 1],
          attributes.position.array[i * 3 + 2] + particleData.velocity.z
        )) {
        isInside = true;

        particleData.velocity.z = -particleData.velocity.z;
      }

      if (isInside) {
        attributes.customColor.array[i * 3] = 255;
        attributes.customColor.array[i * 3 + 1] = 0;
        attributes.customColor.array[i * 3 + 2] = 0;
      }


      attributes.position.array[i * 3] += particleData.velocity.x;
      attributes.position.array[i * 3 + 1] += particleData.velocity.y;
      attributes.position.array[i * 3 + 2] += particleData.velocity.z;

      attributes.opacity.array[i] = (particleData.lifetime - (frameDate - particleData.startLife)) / particleData.lifetime * 10;

    } else {

      newParams = getNewInitialParametersForParticle(frameDate);

      attributes.position.array[i * 3] = newParams.x;
      attributes.position.array[i * 3 + 1] = newParams.y;
      attributes.position.array[i * 3 + 2] = newParams.z;

      particlesData[i].velocity = newParams.velocity;
      particlesData[i].lifetime = newParams.lifetime;
      particlesData[i].startLife = newParams.startLife;

      attributes.customColor.array[i * 3] = 255;
      attributes.customColor.array[i * 3 + 1] = 255;
      attributes.customColor.array[i * 3 + 2] = 255;

      attributes.opacity.array[i] = (particleData.lifetime - (frameDate - particleData.startLife)) / particleData.lifetime * 10;
    }

    // for (let j = 0; j < 8; j++) {
    //   trAttributes.position.array[i*j + j] = attributes.position.array[i * 3];
    //   trAttributes.position.array[i*j + j + 1] = attributes.position.array[i * 3 + 1];
    //   trAttributes.position.array[i*j + j + 2] = attributes.position.array[i * 3 + 2];
    // }

  }
  attributes.position.needsUpdate = true;
  attributes.customColor.needsUpdate = true;
  attributes.opacity.needsUpdate = true;

  // trAttributes.position.needsUpdate = true;

  // if (sphere.position.x > 800 || sphere.position.x < -800) {
  //   direction = -1 * direction;
  // }

  // sphere.position.x += sphereSpeed * direction;

  renderer.render(scene, camera);
}