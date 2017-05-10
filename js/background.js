// Setup a new scene
const scene = new THREE.Scene();

 // Setup the camera
 const kvikmynd = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
 kvikmynd.position.z = 5;
 kvikmynd.position.y = 10;
 kvikmynd.position.x = 50;
 kvikmynd.lookAt( scene.position )

 // Setup the renderer
 const renderer = new THREE.WebGLRenderer( {alpha: true} );
 renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

 // Add the lights
 const ambientLight = new THREE.AmbientLight( 0x404040 );
 scene.add(ambientLight);

 const light = new THREE.PointLight( 0xFFFFDD );
 light.position.set( 1, 10, 15 );
 scene.add( light );

 // Models
 let model;
 
 // Load the JSON files and provide callback functions (modelToScene
 const loader = new THREE.JSONLoader();
 loader.load( "assets/cube.json", addModelToScene );

 // After loading JSON from our file, we add it to the scene
 function addModelToScene( geometry, materials ) {
  const material = new THREE.MeshLambertMaterial();
   model = new THREE.Mesh( geometry, material );
   model2 = new THREE.Mesh( geometry, material );
   model.scale.set(0.5,0.5,0.5);
   model2.scale.set(1,1,1);
   model2.position.set( 1, -10, 15 );
   
   scene.add( model );
   scene.add( model2 );
 }

 const render = ()=> {
				requestAnimationFrame( render );

          kvikmynd.translateZ( - 0.005 );

				renderer.render( , kvikmynd);
			};

			render();
