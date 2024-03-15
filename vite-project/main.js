import * as THREE from 'three';
// 导入外部模型glt文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// 初始化场景
const scene = new THREE.Scene();
// 初始化摄像机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);// 设置好渲染画布的大小
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


// 交替物体运动的开合
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
  // 只计算interactiveObjects中物体和射线的交点
  let intersects = raycaster.intersectObjects(interactiveObjects, true);

  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(mouse, camera);

  // // 计算物体和射线的交点
  // let intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    // // 如果存在交点，intersects[0]是最接近摄像机的交点
    // console.log(intersects[0]);

    // 这里确保被点击的是门体
    let selectedObject = intersects[0].object;
    while (selectedObject && !selectedObject.userData.isDoorBody) {
      selectedObject = selectedObject.parent;
    }
    // 例如，你可以选择高亮被点击的物体
    // intersects[0].object.material.color.set(0xff0000);
    // doorBody.rotateY(Math.PI / 2)
    // 更新目标旋转值
    if (doorStatus) {
      targetRotationY -= rotationSpeed; // 逆时针旋转
    } else {
      targetRotationY += rotationSpeed; // 顺时针旋转$
    }
    doorStatus = !doorStatus;

    console.log(doorStatus)
  }
}

// 初始化模型
let group = new THREE.Group();// const 关键字用于声明一个常量，这意味着一旦常量被赋值后，就不能再被重新赋值。
let doorBody, room,
  doorFrame = null; // 定义一个变量来持有您的模型
const loader = new GLTFLoader();// 使用外部模型加载器
// 加载glTF模型
// 加载房间模型
loader.load('../asset/door_room.glb', function (gltf) {
  room = gltf.scene
  room.rotateY(Math.PI)
  scene.add(room)
}, undefined, function (error) {
  console.error(error);
});

// 存储所有可交互的物体
let interactiveObjects = [];
// 加载门板模型
loader.load('../asset/door_body_full.glb', function (gltf) {
  doorBody = gltf.scene
  doorBody.position.set(0 + 0.42, 0, 0)
  group.add(doorBody)
  scene.add(group)

  // 模型加载完成后，将门体添加到可交互物体数组中
  interactiveObjects.push(doorBody);

}, undefined, function (error) {
  console.error(error);
});
group.position.set(0 - 0.44, 0, 0)
// group.rotateY(0.25 * Math.PI)

// 优化动画效果：
// 初始化动画参数（运动的主体 & 运动的内容和幅度）
const clock = new THREE.Clock();
let targetRotationY = group.rotation.y;// 旋转事件：物体+行为
let rotationSpeed = Math.PI / 3; // 旋转参数：每次点击旋转的角度
// 加载门框模型
loader.load('../asset/door_frame.glb', function (gltf) {
  doorFrame = gltf.scene
  scene.add(doorFrame);

}, undefined, function (error) {

  console.error(error);

});

// 渲染循环
// let angle = 0; //用于圆周运动计算的角度值
// const R = 10; //相机圆周运动的半径
camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  let delta = clock.getDelta(); // 获取时间差
  let rotateAmount = (targetRotationY - group.rotation.y) * delta * 5; // 计算应该旋转的量，这里的5是一个可以调整的因子，用于控制旋转的速度
  group.rotation.y += rotateAmount; // 插值旋转


  // angle += 0.01;
  // // 相机y坐标不变，在XOZ平面上做圆周运动
  // camera.position.x = R * Math.cos(angle);
  // camera.position.z = R * Math.sin(angle);

  // // 相机圆周运动过程，如果希望视线始终指向圆心，位置改变后必须重新执行lookAt指向圆心
  // camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);



  // doorBody.rotation.x += 0.01;
  // doorBody.rotation.y += 0.01;
  //   cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
}
animate();