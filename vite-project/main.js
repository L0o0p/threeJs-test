import * as THREE from 'three';
// 导入外部模型glt文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// 添加一个环境光
// const light = new THREE.AmbientLight(0xffffff); // 柔和的白光
// scene.add(light);
// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
// scene.add(hemiLight);
// 创建一个EXR加载器
const exRloader = new EXRLoader();
exRloader.load(
  '../asset/city.exr', // 替换为你的EXR文件路径
  function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture; // 将加载的EXR纹理设置为场景的环境贴图

    // 你也可以在这里创建物体，应用材质等
    // ...

    // 然后渲染场景
    renderer.render(scene, camera);
  },
  undefined,
  function (error) {
    console.error('An error happened during loading the EXR file.', error);
  }
);

// 尝试绑定空对象
// const helperObject = new THREE.AxesHelper();
// scene.add(helperObject);
let outer = new THREE.Group()


// 交替开关
let doorStatus = true;
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
    // intersects[0].object.material.color.set(0xff0000);
    // model.rotateY(Math.PI / 2)
    // 更新目标旋转值
    if (doorStatus) {
      targetRotationY -= rotationSpeed; // 逆时针旋转
    } else {
      targetRotationY += rotationSpeed; // 顺时针旋转
    }
    doorStatus = !doorStatus;
    modelX.rotateY(Math.PI / 1)

    console.log(doorStatus)
  }
}

let group = new THREE.Group();// const 关键字用于声明一个常量，这意味着一旦常量被赋值后，就不能再被重新赋值。
let model, modelX,
  modelY = null; // 定义一个变量来持有您的模型
const loader = new GLTFLoader();// 使用外部模型加载器
// 加载glTF模型

loader.load('../asset/door_handler.glb', function (gltf) {
  modelX = gltf.scene
  // modelX.rotateY(Math.PI / 1)
  modelX.position.set(0 + 0.42, 0, 0)
  group.add(modelX)
  scene.add(group)


}, undefined, function (error) {
  console.error(error);
});

loader.load('../asset/door_body.glb', function (gltf) {
  model = gltf.scene
  model.position.set(0 + 0.42, 0, 0)
  group.add(model)
  scene.add(group)
  // // 假设你想将原点移动到模型的底部
  // model.geometry.computeBoundingBox();
  // let boundingBox = model.geometry.boundingBox;

  // 移动模型，使得底部对齐到原点
  // model.position.y = -boundingBox.min.y;
}, undefined, function (error) {
  console.error(error);
});
group.position.set(0 - 0.44, 0, 0)
// group.rotateY(0.25 * Math.PI)

// 优化动画效果：
const clock = new THREE.Clock();
let targetRotationY = group.rotation.y;
let rotationSpeed = Math.PI / 3; // 每次点击旋转的角度

loader.load('../asset/door_frame.glb', function (gltf) {
  scene.add(gltf.scene);
  modelY = gltf.scene

}, undefined, function (error) {

  console.error(error);

});

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  let delta = clock.getDelta(); // 获取时间差
  let rotateAmount = (targetRotationY - group.rotation.y) * delta * 5; // 计算应该旋转的量，这里的5是一个可以调整的因子，用于控制旋转的速度
  group.rotation.y += rotateAmount; // 插值旋转

  // model.rotation.x += 0.01;
  // model.rotation.y += 0.01;
  //   cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
}
animate();