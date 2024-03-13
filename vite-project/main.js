import * as THREE from 'three';
// 导入外部模型glt文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const loader = new GLTFLoader();// 使用外部模型加载器
let model; // 定义一个变量来持有您的模型
// 加载glTF模型
loader.load(
  './test.glb',
  (gltf) => {
    // 添加基础材质
    const material2 = new THREE.MeshBasicMaterial({ color: 0xff0ff });

    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = material2;
      }
    });

    // 加载完成后，将模型添加到场景中
    scene.add(gltf.scene);
    model = gltf.scene; // 将加载的模型赋值给之前定义的变量
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  (error) => {
    console.error('An error happened', error);
  }
);

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
  // model.rotation.x += 0.01;
  // model.rotation.y += 0.01;
//   cube.rotation.x += 0.01;
// cube.rotation.y += 0.01;
}
animate();