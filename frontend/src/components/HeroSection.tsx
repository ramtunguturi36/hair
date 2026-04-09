import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import girl from '../models/source/girl.glb';
import textureImage from '../models/textures/textureImage.png'
import styles from '../styles/HeroSectionStyles';

const BlowDryer: React.FC = () => {
    const { scene } = useGLTF(girl);
    const texture = useTexture(textureImage);
    
    const modelRef = useRef<THREE.Object3D>();
    scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({ map: texture });
      }
    });
    useFrame((state) => {
      if (modelRef.current) {
        modelRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      }
    });
  
    return <primitive ref={modelRef} object={scene} scale={1.5} />;
  };

const HeroSection: React.FC = () => {
    const navigate = useNavigate();
    const { isSignedIn } = useAuth();

    const handleGetStarted = () => {
        if (isSignedIn) {
            navigate('/dashboard/analysis');
        } else {
            navigate('/signup');
        }
    };

    return (
        <section className={styles.section}>
            <div className={styles.textContainer}>
                <h2 className={styles.title}>
                    Healthy Hair, <span className="text-cyan-600">Mapped</span> by AI <br /> and Built for You
                </h2>
                <p className={styles.description}>
                Scan your hair, get expert-grade analysis, and follow a routine that adapts to your goals, concerns, and budget.
                </p>
                <button className={styles.getStartedButton} onClick={handleGetStarted}>
                    Start Your Analysis
                </button>
            </div>
            <div className = {styles.canvasContainer}>
                <div className={styles.gradientCircle}>
                </div>
                <Canvas>
                    <ambientLight intensity={0.95} />
                    <directionalLight position={[10, 10, 5]} intensity={0.6} />
                    <BlowDryer />
                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} enablePan={false} maxPolarAngle={1.8} minPolarAngle={1.2} />
                </Canvas>
            </div>

        </section>
    )
}

export default HeroSection;