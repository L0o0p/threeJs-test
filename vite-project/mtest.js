//CaseList:
// 1. 引入坐标轴
// 2. 视角控制器
// 3. 画布的响应式调整 
// 4. 贴图加载 -> 全景浏览实现 <<-|
// 5. 全景浏览的距离限制和其他调整
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';


// 初始化场景
const scene = new THREE.Scene();
// 初始化摄像机
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 12;// 相机的初识位置
// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);// 设置好渲染画布的大小
document.body.appendChild(renderer.domElement)

// 初始化环境贴图
const loader = new EXRLoader();
// 使用loader的时候，相关的模型必须在loader对象内部创建
loader.load('./asset/city.exr', function (texture) {
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.encoding = THREE.LinearEncoding;

  // 初始化模型
  let group = new THREE.Group();//初始化控制器
  const geometry = new THREE.SphereGeometry(50, 50, 50)
  geometry.scale(-1, 1, 1)// 这样调整后才会有期望的空间感
  // const material = new THREE.MeshBasicMaterial({ wireframe: true })//查看线框
  const material = new THREE.MeshBasicMaterial({ map: texture });// 使用导入的贴图
  const cube = new THREE.Mesh(geometry, material)

  group.add(cube)// 使用控制器，也可以不使用，就像blender的空对象，只是为了增加可编辑性
  // 调整初始角度
  group.rotateY(60 * Math.PI / 180)
  group.rotateX(0 * Math.PI / 180)
  group.rotateZ(0 * Math.PI / 180)
  scene.add(group)
})

// 初始化坐标系
const ax = new THREE.AxesHelper(50)
scene.add(ax)

// 初始化镜头控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.zoomSpeed = 3// 镜头滚动速度
controls.maxDistance = 85 //限制滚动距离
controls.minDistance = 20 //限制滚动距离
// 自动旋转
// controls.autoRotate = true // 开启自动旋转
controls.autoRotateSpeed = 0.5 // 自动旋转速度
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

animate();