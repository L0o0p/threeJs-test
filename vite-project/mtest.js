//CaseList:
// 1. 引入坐标轴
// 2. 视角控制器
// 3. 画布的响应式调整 
// 4. 贴图加载 -> 全景浏览实现 
// 5. 全景浏览的距离限制和其他调整 
// 6. 场景切换：切换到另一个场景 
// 通过两个按钮标签->控制材质切换实现切换
// AlphaMap第二个材质消除切换卡顿
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';


// 初始化场景
const scene = new THREE.Scene();
// 初始化摄像机
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 12;// 相机的初识位置
// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);// 设置好渲染画布的大小
document.body.appendChild(renderer.domElement)

// 初始化材质
let material;
// 初始化环境贴图加载器
const loader = new EXRLoader();
let texture1, texture2;

// 加载环境贴图
loader.load('./asset/hospital_room_2_4k.exr', function (texture) {
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.encoding = THREE.LinearEncoding;
  texture1 = texture;

  hideLoadingIndicator(); // 贴图加载完成，隐藏加载指示器
  // 初始化模型和材质
  initScene();
})
// 显示“加载中”提示
showLoadingIndicator()

loader.load('./asset/forest.exr', function (texture) {
  texture2 = texture;
});

// 确保在外部引入的环境贴图加载好了->再初始化、渲染模型，否则网页中内容会偏离预期（出现没有贴图的模型）
function initScene() {
  // 确保texture1已经加载
  if (texture1) {
    material = new THREE.MeshBasicMaterial({ map: texture1 });
    // 初始化模型
    let group = new THREE.Group();//初始化控制器
    const geometry = new THREE.SphereGeometry(50, 50, 50)
    geometry.scale(-1, 1, 1)// 这样调整后才会有期望的空间感
    // const material = new THREE.MeshBasicMaterial({ wireframe: true })//查看线框
    // let material = new THREE.MeshBasicMaterial({ map: texture1 });// 使用导入的贴图->放到前面比较符合逻辑
    const cube = new THREE.Mesh(geometry, material)

    // 将网格添加到场景/容器中
    group.add(cube)// 使用控制器，也可以不使用，就像blender的空对象，只是为了增加可编辑性
    // 调整初始角度
    group.rotateY(21 * Math.PI / 180)
    group.rotateX(0 * Math.PI / 180)
    group.rotateZ(0 * Math.PI / 180)
    scene.add(group)

    // 开始动画循环
    animate();
  } else {
    // 在页面中渲染<div>loading...</div>
  }
}


// 初始化坐标系
const ax = new THREE.AxesHelper(50)
scene.add(ax)

// 初始化镜头控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.zoomSpeed = 3// 镜头滚动速度
controls.maxDistance = 70 //限制滚动距离
controls.minDistance = 20 //限制滚动距离
// 自动旋转
controls.autoRotate = true // 开启自动旋转
controls.autoRotateSpeed = -0.5 // 自动旋转速度（正负可控制方向）
// 运动阻尼感
controls.enableDamping = true

// 渲染和动画
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update()
}

// 缩放
// 监听窗口size的变化，然后执行函数
window.addEventListener('resize', () => { // 当浏览器窗口尺寸发生变化时触发的事件
  camera.aspect = window.innerWidth / window.innerHeight; // 更新摄像机的宽高比为新的窗口宽高比
  camera.updateProjectionMatrix(); // 更新摄像机的投影矩阵，以确保场景以正确的透视角度渲染

  // 注意：这里 renderer.setSize() 需要两个参数：新的宽度和高度
  renderer.setSize(window.innerWidth, window.innerHeight); // 重新设置渲染器的大小以匹配新的窗口尺寸

  // 设置渲染器的像素比率，通常设置为 window.devicePixelRatio 以支持高分辨率显示
  renderer.setPixelRatio(window.devicePixelRatio); // 重新设置渲染器的像素比例以保持场景的清晰度
});

// // 确保在纹理完全加载并准备好之后再开始渲染循环。你可以通过添加一个检查来保证所有纹理已加载：
// function checkTexturesLoaded() {
//   if (texture1 && texture2) {
//     animate();
//   } else {
//     // 可选：在这里处理加载失败或者显示加载进度
//     console.log('Waiting for textures to load...');
//     requestAnimationFrame(checkTexturesLoaded);
//   }
// }

// checkTexturesLoaded();

// 这个函数可以在贴图加载开始时调用
// 显示加载指示器

function showLoadingIndicator() {
  const loadingDiv = document.getElementById('loading-indicator');
  loadingDiv.style.display = 'block'; // 显示div
}

// 隐藏加载指示器
function hideLoadingIndicator() {
  const loadingDiv = document.getElementById('loading-indicator');
  loadingDiv.style.display = 'none'; // 隐藏div
}


// 点击事件：切换场景的按钮
document.getElementById('app2').onclick = () => {
  // 「if」的条件限制：确保对应的模型已经加载
  if (texture2) {
    material.map = texture2;
    material.needsUpdate = true; // 告诉Three.js需要更新材质
  }
}

document.getElementById('app').onclick = () => {
  // 「if」的条件限制：确保对应的模型已经加载
  if (texture1) {
    material.map = texture1;
    material.needsUpdate = true; // 告诉Three.js需要更新材质
  }
}

