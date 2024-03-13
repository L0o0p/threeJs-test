import * as THREE from 'three';
// 导入外部模型glt文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// 添加鼠标事件监听器
renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
renderer.domElement.addEventListener('click', onDocumentMouseClick, false);

// 根据鼠标在屏幕上的位置来计算一个标准化的二维向量。这个向量将用于Raycaster。
let mouse = new THREE.Vector2();
function onDocumentMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

// 使用Raycaster来检测鼠标射线与场景中对象的相交。(二维到三维)
let raycaster = new THREE.Raycaster();

function onDocumentMouseClick(event) {
    // 更新鼠标位置
    onDocumentMouseMove(event);

    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(mouse, camera);

    // 计算物体和射线的交点
    let intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        // 如果存在交点，intersects[0]是最接近摄像机的交点
        console.log(intersects[0]);
        // 例如，你可以选择高亮被点击的物体
        intersects[0].object.material.color.set(0xff0000);
        model = model.rotateY(Math.PI / 2)
    }
}

const loader = new GLTFLoader();// 使用外部模型加载器
let model; // 定义一个变量来持有您的模型
// 加载glTF模型
loader.load(
  './test.glb',
  (gltf) => {
    // 添加基础材质
    const material2 = new THREE.MeshBasicMaterial({ color: 0xff0ff });

    // gltf.scene.traverse((child) => {
    //   if (child.isMesh) {
    //     child.material = material2;
    //   }
    // });

    // 加载完成后，将模型添加到场景中
    scene.add(gltf.scene);
    model = gltf.scene; // 将加载的模型赋值给之前定义的变量
    // model = model.rotateY(Math.PI / 2)
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