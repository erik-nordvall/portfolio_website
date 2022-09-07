import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Cards
 */
const card = document.querySelector('.card__inner');
card.addEventListener('click', ()=>{
    card.classList.toggle('is-flipped');
})

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

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Objects
 */
//Materials
const lettermaterial = new THREE.MeshNormalMaterial()

const glassmaterial  = new THREE.MeshPhysicalMaterial({
    //metalness: 0,  
    roughness: 0.2,
    transmission: 1,
    thickness: 0.5, // Add refraction!
  });

const material = new THREE.MeshStandardMaterial({color: parameters.materialColor})


//Meshes

//Mesh 1
const Mesh1 = new THREE.Group()
const objectsDistance = 4
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(3, 0.4, 16, 60),
    glassmaterial, 
)
mesh1.position.x = 0
mesh1.position.z = 1
mesh1.position.y = - objectsDistance * 0

Mesh1.add(mesh1)

//const mesh2 = new THREE.Mesh(
//    new THREE.ConeGeometry(1, 2, 64),
//    material
//)
//mesh2.position.x = - 2
//mesh2.position.y = - objectsDistance * 1

//const mesh3 = new THREE.Mesh(
//    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 32),
//    material
//)
//mesh3.position.x = 2
//mesh3.position.y = - objectsDistance * 2

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
    '/models/name_reveal.glb',
    (gltf) =>
    {
        
        mixer = new THREE.AnimationMixer(gltf.scene)

        for(let i = 0; i<gltf.animations.length; i++){
            const animation = mixer.clipAction(gltf.animations[i])
            animation.setLoop(THREE.LoopOnce);
            animation.clampWhenFinished = true;
            animation.enable = true;
            animation.play()
        }
        
        while(gltf.scene.children.length)
        {
            console.log(gltf.scene.children[0].children[0].material.color.r)
            gltf.scene.children[0].children[0].material = lettermaterial
            const letters = new THREE.Group()
            letters.add(gltf.scene.children[0])
            letters.scale.set(0.8, 0.8, 0.8)
            letters.position.set(-2, -0.5, 2)
            scene.add(letters)
            //scene.add(gltf.scene.children[0])
        }
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



scene.add(directionalLight1, directionalLight2)

const sectionMeshes = [Mesh1] //mesh2, mesh3]

/**
 * Particles
 */

//parallax particles
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')
//Geometry
const particlesCount = 500
const positions = new Float32Array(particlesCount*3)
for(let i = 0; i<particlesCount; i++){
    positions[i*3 + 0] = (Math.random()-0.5) * 10
    positions[i*3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
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
    depthWrite: false // instead of sortParticles

})

//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


//Donut particles

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

  //const donutgeom = new THREE.TorusGeometry(3, 0.4, 16, 60)
  const donutgeom = new THREE.SphereGeometry(4, 8, 8)
  const donut = createPoints(donutgeom)
  
  Mesh1.add(donut)
  scene.add(Mesh1)


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

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()