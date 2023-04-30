// Set up the scene

let targetRotationX = 0.05;
let targetRotationY = 0.02;
let mouseX = 0, mouseXOnMouseDown = 0, mouseY = 0, mouseYOnMouseDown = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
const slowingFactor = 0.98;
const dragFactor = 0.0002;

function onDocumentMouseDown( event ) {
    event.preventDefault();
    document.addEventListener('mousemove', onDocumentMouseMove, false );
    document.addEventListener('mouseup', onDocumentMouseUp, false );
    mouseXOnMouseDown = event.clientX - windowHalfX;
    mouseYOnMouseDown = event.clientY - windowHalfY;
}

function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    targetRotationX = ( mouseX - mouseXOnMouseDown ) * dragFactor;
    mouseY = event.clientY - windowHalfY;
    targetRotationY = ( mouseY - mouseYOnMouseDown ) * dragFactor;
}

function onDocumentMouseUp( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
}

function showCloud() {
    var loc = localStorage.getItem("cloudStatus")
    if(loc == "hide") {
        localStorage.setItem("cloudStatus", "show")
        document.getElementById("btnShowCloud").innerHTML = "Hide Cloud"
    } else {
        localStorage.setItem("cloudStatus", "hide")
        document.getElementById("btnShowCloud").innerHTML = "Show Cloud"
    }
    location.reload()
}

function main()
{
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer(
    {
      antialias: true
    }
  );
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild( VRButton.createButton( renderer ) );
  renderer.xr.enabled = true;

  //manage blurring on texture
  renderer.setPixelRatio(
    window.devicePixelRatio
  )
  document.body.appendChild(renderer.domElement);


  // set ambientlight
  const ambientlight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientlight);
  // set point light
  const pointerlight = new THREE.PointLight(0xffffff, 0.9);
  pointerlight.position.set(5, 3, 5);
  scene.add(pointerlight);

  let cloudMesh = null

  var loc = localStorage.getItem("cloudStatus")
  if(loc == "show") {
    // create cloudGeometry
    const cloudGeometry = new THREE.SphereGeometry(5.2, 32, 32);
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('texture/earthCloud.png'),
        transparent: true
    });
    cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(cloudMesh);
    document.getElementById("btnShowCloud").innerHTML = "Hide Cloud"
  } else {
    document.getElementById("btnShowCloud").innerHTML = "Show Cloud"
  }

  // create starGeometry
  const starGeometry =  new THREE.SphereGeometry(10,64,64);
  const starMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('texture/galaxy.png'),
      side: THREE.BackSide
  });

  const starMesh = new THREE.Mesh(starGeometry,starMaterial);
  scene.add(starMesh);

  //create atmosphere
  const AtmosphereVertex = document.getElementById("atmosphereVertex").textContent
  const AtmosphereFragment = document.getElementById("atmosphereFragment").textContent
  const atmosphere = new THREE.Mesh(new 
    THREE.SphereGeometry(5,50,50),
      new THREE.ShaderMaterial(
      {
        vertexShader: AtmosphereVertex,
        fragmentShader: AtmosphereFragment,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      }
    ))

    atmosphere.scale.set(1.1,1.1,1.1)

  scene.add(atmosphere)



  //create sphere
  const VertexShader = document.getElementById("vertexShader").textContent
  const FragmentShader = document.getElementById("fragmentShader").textContent
  const sphere = new THREE.Mesh(new 
    THREE.SphereGeometry(5,50,50),
    //new THREE.MeshBasicMaterial(
      new THREE.ShaderMaterial(
      {
        //color: 0xff0000 //red
        //map: new THREE.TextureLoader().load('texture/earth_3.jpg')

        vertexShader: VertexShader,
        fragmentShader: FragmentShader,
        uniforms: {
          globeTexture: {
            value: new THREE.TextureLoader().load('texture/earth_3.jpg')
          }
        }
      }
    ))


    const group = new THREE.Group()
    group.add(sphere)

    sphere.callback = function() { console.log("llllll" ); }



  function createPoint(place) {

    //add lat lng
    const point  = new THREE.Mesh(
        new THREE.SphereGeometry(0.1,50,50),
        new THREE.MeshBasicMaterial({
            color: "#ff0000" //+Math.floor(Math.random()*16777215).toString(16)
        })
    )

    point.name = place.status
    
      const lat = (place.lat /180) * Math.PI
      const lng = (place.lng/180) * Math.PI

      const radius = 5

      console.log({lat, lng})

      const x = radius * Math.cos(lat) * Math.sin(lng);
      const y = radius * Math.sin(lat);
      const z = radius * Math.cos(lat) * Math.cos(lng);
      
      console.log(x,y,z)
      point.position.x = x;
      point.position.y = y;
      point.position.z = z;

    group.add(point)

    point.callback = function() { 
      //alert(place.city)
      const URL = place.url 
      window.open(URL, '_blank');
    }


    point.hovercallback = function() { 
      showToast(place.movie, place.status, 'info', "5000")
    }

    
  }


  //you can show this data from api
  const places = [
    {
      "lat": 22.572645,
      "lng": 88.363892,
      "city": "Kolkata",
      "status": "<u>20/04/2023</u><br/><i>PVR, Kolkata</i>",
      "movie": "Bahubali",
      "url": "https://in.bookmyshow.com/cinemas/kolkata/pvr-uniworld-downtown-mall-new-town-kolkata/PVUK"
    },
    {
      "lat": 13.0827,
      "lng": 80.2707,
      "city": "Chennai",
      "status": "<u>20/04/2023</u><br/><i>PVR, Chennai</i>",
      "movie": "Bahubali",
      "url": "https://in.bookmyshow.com/cinemas/chennai/pvr-uniworld-downtown-mall-new-town-chennai/PVUK"
    },
    {
      "lat": 25.2048,
      "lng": 55.2708,
      "city": "Dubai",
      "status": "<u>20/04/2023</u><br/><i>PVR, Dubai</i>",
      "movie": "Bahubali",
      "url": "https://in.bookmyshow.com/cinemas/dubai/pvr-uniworld-downtown-mall-new-town-dubai/PVUK"
    },
    {
      "lat": 23.3441,
      "lng": 85.3096,
      "city": "Ranchi",
      "status": "<u>20/04/2023</u><br/><i>PVR, Ranchi</i>",
      "movie": "Bahubali",
      "url": "https://in.bookmyshow.com/cinemas/ranchi/pvr-uniworld-downtown-mall-new-town-ranchi/PVUK"
    },
    {
      "lat": 36.2048,
      "lng": 138.2529,
      "city": "Japan",
      "status": "<u>20/04/2023</u><br/><i>PVR, Japan</i>",
      "movie": "Bahubali",
      "url": "https://in.bookmyshow.com/cinemas/japan/pvr-uniworld-downtown-mall-new-town-japan/PVUK"
    }
  ]

  /* 
  // example to read data from api 
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("here-api-url", requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result)
      result = JSON.parse(result)['results']
      result.forEach(element => {
        createPoint({
          "lat": parseFloat(element.latitude),
          "lng": parseFloat(element.longitude),
          "status": "<u>"+element.event_start_date+"</u><br/><i>"+element.venue+"</i>",
          "event": element.title,
          "event_id": element._id
        })
      });
    })
    .catch(error => console.log('error', error));
  */

  places.forEach(place => {
    createPoint(place) 
  });

  scene.add(group)

  sphere.rotation.y = -Math.PI / 2
  //sphere.rotation.x = -Math.PI / 40

  

      // show in screen
      camera.position.z = 9;
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  
  window.addEventListener('mousemove', onDocumentMouseHover2, false);
  window.addEventListener('click', onDocumentMouseDown2, false);
  function onDocumentMouseDown2( event ) {
  
    event.preventDefault();
    
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
    //console.log(mouse.x, mouse.y)
    raycaster.setFromCamera( mouse, camera );
  
    var intersects = raycaster.intersectObjects( group.children  ); 
  //console.log(intersects)
    if ( intersects.length > 0 ) {

        intersects[0].object.callback();
  
    }
  
  }

  function onDocumentMouseHover2( event ) {
  
    event.preventDefault();
    
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
    console.log(mouse.x, mouse.y)
    raycaster.setFromCamera( mouse, camera );
  
    var intersects = raycaster.intersectObjects( group.children  ); 
  console.log(intersects)
    if ( intersects.length > 0 ) {
      if(intersects[0].object.name != ""){
        const myDivElem = document.querySelector("body");
        myDivElem.style.cursor = "pointer"; 
        intersects[0].object.hovercallback();


      } else {
        console.log("here")
        const myDivElem = document.querySelector("body");
        myDivElem.style.cursor = "default"; 
      }
  
    }
  
  }
  


  const render = () => {
    var loc = localStorage.getItem("cloudStatus")
    if(loc == "show") {
        cloudMesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), targetRotationX);
        cloudMesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), targetRotationY);
        document.getElementById("btnShowCloud").innerHTML = "Hide Cloud"
    } else {
        document.getElementById("btnShowCloud").innerHTML = "Show Cloud"
    }
    group.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), targetRotationX);
    group.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), targetRotationY);
    targetRotationY = targetRotationY * slowingFactor;
    targetRotationX = targetRotationX * slowingFactor;
    renderer.render(scene,camera);
}

  // Animate the scene
  function animate() {
    requestAnimationFrame(animate);
    render();
  }
  animate();

  document.addEventListener('mousedown', onDocumentMouseDown, false );


window.addEventListener('resize', onWindowResize);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

/*
// add event listener for the mouse wheel
window.addEventListener('wheel', onWheel);

function onWheel(event) {
  // get the amount the mouse wheel has moved
  const delta = event.wheelDeltaY || -event.deltaY;

  // zoom the camera based on the mouse wheel movement
  const zoomSpeed = 0.0001;
  camera.position.z += delta * zoomSpeed;

  // clamp the camera position to a minimum and maximum distance from the globe
  const minDistance = 10;
  const maxDistance = 50;
  const distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
  if (distance < minDistance) {
    camera.position.setLength(minDistance);
  } else if (distance > maxDistance) {
    camera.position.setLength(maxDistance);
  }
}

*/
}
window.onload = main;