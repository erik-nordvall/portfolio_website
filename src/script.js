import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { randInt } from 'three/src/math/MathUtils'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() =>
    {
        material.color.set(parameters.materialColor)
    })
gui.hide()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const objectsDistance = 2

/**
 * Objects
 */
//Materials
const lettermaterial = new THREE.MeshNormalMaterial()

const glassmaterial  = new THREE.MeshPhysicalMaterial({
    //color:'#000000',
    //metalness: 0,  
    roughness: 0.1,
    transmission: 0.98,
    thickness: 0.5, // Add refraction!
  });
/**
 * 

const metalmaterial  = new THREE.MeshPhysicalMaterial({
   color: '#80dada',   metalness: 0,  
    roughness: 0.5,
    transmission: 0.5,
    dithering: false
    //thickness: 0.5, // Add refraction!
  });
 */


const material = new THREE.MeshStandardMaterial({color: parameters.materialColor})


//Meshes
const spheres = []
const sphere_geom = new THREE.SphereGeometry( 0.1, 32, 16 );
				

	for ( let i = 0; i < 300; i ++ ) {

        

		const mesh = new THREE.Mesh( sphere_geom, lettermaterial );
		mesh.position.x = Math.random() * 10 - 5;
		mesh.position.y = objectsDistance * 0.5 - (Math.random() * objectsDistance)
		mesh.position.z = Math.random() * 10 - 5;

		mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

		scene.add( mesh );

		spheres.push( mesh );

		}

const cylinders = []
const cylinder_geom = new THREE.CylinderGeometry(0.005,0.005, 0.3, 64);
const cylinder_colors =[
    '#8080ff',
    '#8025da',
    '#80dada',
    '#36c9c9',
    '#2580da',
    '#3636c9',
    '#da80da',
    '#c936c9',
    '#c9c9c9'
]
console.log(cylinder_colors)


const cylinder_material = new THREE.MeshStandardMaterial()
for ( let i = 0; i < 500; i ++ ) {


    
    

    const mesh = new THREE.Mesh( cylinder_geom, cylinder_material );
    mesh.position.x = Math.random() * 10 - 5;
    mesh.position.y = Math.random() * 10 - 5;
    mesh.position.z = Math.random() * 10 - 5;

    mesh.rotation.x = Math.random() * 10 - 5;
    mesh.rotation.z = Math.random() * 10 - 5;

    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

    scene.add( mesh );

    cylinders.push( mesh );

    }

    for ( let i = 0, il = cylinders.length; i < il; i ++ ) {
        const rndInt = randomIntFromInterval(0, 8)
        console.log(rndInt)
        const cylinder = cylinders[ i ];
        cylinder.material.color.set(cylinder_colors[rndInt])
        console.log(cylinder.material.color)

    }
    

const donuts = []
const donut_geom = new THREE.TorusGeometry(0.1,0.01, 64, 64);

for ( let i = 0; i < 100; i ++ ) {
    const mesh = new THREE.Mesh( donut_geom, glassmaterial );
    mesh.position.x = Math.random() * 10 - 5;
    mesh.position.y = Math.random() * 10 - 5;
    mesh.position.z = Math.random() * 10 - 5;

    mesh.rotation.x = Math.random() * 10 - 5;
    mesh.rotation.z = Math.random() * 10 - 5;

    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

    scene.add( mesh );

    donuts.push( mesh );

    }




//Mesh 1
const Mesh1 = new THREE.Group()

const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(2, 0.4, 16, 60),
    glassmaterial, 
)
mesh1.position.x = 0
mesh1.position.z = 1
mesh1.position.y = - objectsDistance * 0

//scene.add(mesh1)
//scene.add(mesh1)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 64),
    lettermaterial
)
mesh2.position.x = - 2
mesh2.position.y = - objectsDistance * 1
//scene.add(mesh2)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 32),
    lettermaterial
)
mesh3.position.x = 2
mesh3.position.y = - objectsDistance * 2
scene.add(mesh3)

//Mesh 1

const mesh4 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 16, 16),
    glassmaterial, 
)
mesh4.position.x = 0
mesh4.position.z = 1
mesh4.position.y = - objectsDistance * 1

//scene.add(mesh4)


/**
 * Models
 */

/** Kan detta vara något för att mappa animationer till vart i tiden man befinner sig?
 * let oldValue = 0;

window.addEventListener('scroll' , function(e){

var newValue = window.pageYOffset;

if(oldValue - newValue < 0){
    mixer.update( (newValue - oldValue) / 250 );
} 
else if(oldValue - newValue > 0){
   mixer.update(  (newValue - oldValue ) / 250 ) ;
}
oldValue = newValue;
});
 */





let mixer = null
 const gltfLoader = new GLTFLoader()
 gltfLoader.load(
    '/models/wall_ref.glb',
    (gltf) =>
    {
        /**
         * 
        
        mixer = new THREE.AnimationMixer(gltf.scene)

        for(let i = 0; i<gltf.animations.length; i++){
            const animation = mixer.clipAction(gltf.animations[i])
            animation.setLoop(THREE.LoopOnce);
            animation.clampWhenFinished = true;
            animation.enable = true;
            animation.play()
        }
         
        console.log(gltf.scene.children.length)
        //while(gltf.scene.children.length)
        for(let i = 0; i<gltf.scene.children.length; i++)
        {
            console.log(gltf.scene.children[i])
            //gltf.scene.children[0].children[0].material = lettermaterial
            gltf.scene.children[1].material = lettermaterial
            const letters = new THREE.Group()
            letters.add(gltf.scene.children[1])
            //letters.scale.set(0.8, 0.8, 0.8)
            gltf.scene.position.set(-0.1, -6, -2)
            scene.add(gltf.scene)
            //scene.add(gltf.scene.children[0])
            
        }
        */
        //console.log(scene)
    }
)


/**
 * Lights
 */
 const directionalLight1 = new THREE.DirectionalLight('#ffffff', 2)
 directionalLight1.position.set(1, 1, 0)

const directionalLight2 = new THREE.DirectionalLight('#ffffff', 2)
directionalLight2.position.set(-2, -1, 0)

const directionalLight3 = new THREE.DirectionalLight('#ffffff', 5)
directionalLight3.position.set(0, -1, -3)



scene.add(directionalLight1, directionalLight2, directionalLight3)




/**
 * Particles
 */

//parallax particles
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')
//Geometry
const particlesCount = 1500
const positions = new Float32Array(particlesCount*3)
for(let i = 0; i<particlesCount; i++){
    positions[i*3 + 0] = (Math.random()-0.5) * 10
    positions[i*3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * 3
    positions[i*3 + 2] = (Math.random()-0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

//Material
const particlesMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    sizeAttenuation: true,
    size: 0.1,
    transparent: true,
    blending: THREE.AdditiveBlending,
    map: particleTexture,
    alphaMap: particleTexture,
    //depthWrite: false // instead of sortParticles

})

//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


//Donut particles



  //const donutgeom = new THREE.TorusGeometry(3, 0.4, 16, 60)
  const donutgeom = new THREE.SphereGeometry(1.2, 32, 32)
  const donut = createPoints(donutgeom)
  
  Mesh1.add(donut)
  //scene.add(Mesh1)

  const sectionMeshes = [mesh1, mesh2, mesh3, mesh4]


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
//Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0
window.addEventListener('scroll',()=>
{
    scrollY = window.scrollY

    const newSection = Math.round(scrollY / sizes.height)

    if(newSection != currentSection)
    {
        currentSection = newSection

        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 6,
                ease: 'power2.inOut',
                x:'+=3',
                y:'+=3',
                //z: '+=1.5'
            }
        )
    }
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event)=>
{
    cursor.x = event.clientX / sizes.width -0.5
    cursor.y = event.clientY / sizes.height -0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //Update Mixer
    if(mixer !== null)
    {
        mixer.update(deltaTime)

    }


    for ( let i = 0, il = spheres.length; i < il; i ++ ) {

        const sphere = spheres[ i ];
        const timer = 0.000005 * Date.now()
        sphere.position.x = 5 * Math.cos( timer + i );
        sphere.position.y = 5 * Math.sin( timer + i * 0.9 );

    }

    for ( let i = 0, il = cylinders.length; i < il; i ++ ) {

        const cylinder = cylinders[ i ];
        const timer = 0.000005 * Date.now()
        cylinder.position.x = 5 * Math.cos( timer + i *0.8);
        cylinder.position.y = 5 * Math.sin( timer + i * 1.1 );
        cylinder.rotation.x = 5 * (timer + i );
        cylinder.rotation.z = 6* (timer + i )

    }
    for ( let i = 0, il = donuts.length; i < il; i ++ ) {

        const donut = donuts[ i ];
        const timer = 0.000005 * Date.now()
        donut.position.x = 5 * Math.cos( timer + i *1.1);
        donut.position.y = 5 * Math.sin( timer + i * 1.6 );
        donut.rotation.x = 5 * (timer + i );
        donut.rotation.z = 3* (timer + i )

    }
    //Animate Camera
    camera.position.y =  - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * deltaTime * 5
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * deltaTime * 5

    //Animate Meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.05

    }

    Mesh1.rotation.x += deltaTime *0.1
    Mesh1.rotation.y += deltaTime *0.15

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

function createPoints(geom) {
    var material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      blending: THREE.AdditiveBlending,
      map: particleTexture,
      alphaMap: particleTexture,
      depthWrite: false // instead of sortParticles
    });
  
    let cloud = new THREE.Points(geom, material);
    cloud.position.z = 1
    return cloud;
  }

  function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  