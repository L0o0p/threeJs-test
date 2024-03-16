//CaseList:
// 1. 引入坐标轴
// 2. 视角控制器
// 3. 画布的响应式调整 <-|
// 4. 题图加载
// 5. 全景浏览实现
// 6. 全景浏览的距离限制
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// 初始化场景
const scene = new THREE.Scene();
// 初始化摄像机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;
// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);// 设置好渲染画布的大小
document.body.appendChild(renderer.domElement)

// 初始化坐标系
const ax = new THREE.AxesHelper(50)
scene.add(ax)

// 初始化镜头控制器
const controls = new OrbitControls(camera, renderer.domElement);

// 初始化模型
const geometry = new THREE.SphereGeometry(5, 50, 50)
const material = new THREE.MeshBasicMaterial({ wireframe: true })
const cube = new THREE.Mesh(geometry, material)

scene.add(cube)

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