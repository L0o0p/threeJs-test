import { Canvas } from "@react-three/fiber"
import { Scene } from "./Scene"
import { OrbitControls, Sky,Image } from "@react-three/drei"


export const ThreeD=()=>{
    return(
        <Canvas 
        flat
         dpr={[1, 1.5]} 
         gl={{ antialias: false }} 
         camera={{ 
            position: [0, 1.5, 15],
            // fov: 25,
            // near: 1,
            // far: 20 
        }}
        >
            <OrbitControls/>
            <ambientLight intensity={1.5 * Math.PI} />
            <Sky />
            <Scene/>
      <Image url='/image/20240503-025135.jpg' />

        </Canvas>
    )
  }