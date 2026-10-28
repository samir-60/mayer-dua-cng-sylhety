import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { CNGVehicle } from './CNGVehicle';
import { SylhetMap } from './SylhetMap';
import { SylhetStreetLife } from './SylhetStreetLife';
import { SylhetTrafficJam } from './SylhetTrafficJam';
import { PassengerNPC } from './PassengerNPC';
import { useGameStore } from '../stores/useGameStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { apiService } from '../services/api.service';
import { soundService } from '../services/sound.service';
import { comedyEventBus } from '../comedy/ComedyEventBus';
import { vehicle3DState } from './sharedVehicleState';

// Rain Particles Effect
const RainParticles: React.FC = () => {
  const count = 1200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = Math.random() * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const array = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] -= delta * 45; // fall speed
      if (array[i * 3 + 1] < 0) {
        array[i * 3 + 1] = 40;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        color="#bae6fd"
        transparent
        opacity={0.65}
      />
    </points>
  );
};

// 3rd-Person Follow Camera & Dropoff Monitor
const CameraRig: React.FC = () => {
  const isCompleting = useRef(false);
  const slowDuringChaseTime = useRef(0);
  const [isTopAngle, setIsTopAngle] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyC') {
        setIsTopAngle((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useFrame((state, delta) => {
    const camera = state.camera;
    const pos = vehicle3DState.position;
    const headingY = vehicle3DState.headingY;
    const gameMode = useGameStore.getState().gameMode;
    const activeMission = useGameStore.getState().activeMission;
    const hasPassenger = useGameStore.getState().hasPassenger;

    if (gameMode === 'MENU') {
      // Showroom orbit camera on main menu
      camera.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 6.5;
      camera.position.y = 2.4;
      camera.position.z = Math.cos(state.clock.elapsedTime * 0.3) * 6.5;
      camera.lookAt(0, 0.9, 0);
      return;
    }

    // Dynamic 3rd-person chase camera rotating with the vehicle heading
    const camDist = isTopAngle ? 8.0 : 9.5;
    const camHeight = isTopAngle ? 22.0 : 4.8;
    const lookAhead = isTopAngle ? 1.0 : 4.0;

    const targetCamX = pos.x - Math.sin(headingY) * camDist;
    const targetCamY = pos.y + camHeight;
    const targetCamZ = pos.z - Math.cos(headingY) * camDist;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, delta * 6.0);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, delta * 6.0);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, delta * 6.0);

    const lookTargetX = pos.x + Math.sin(headingY) * lookAhead;
    const lookTargetY = pos.y + (isTopAngle ? 0.2 : 1.2);
    const lookTargetZ = pos.z + Math.cos(headingY) * lookAhead;
    camera.lookAt(lookTargetX, lookTargetY, lookTargetZ);

    // Reset completion flag if no passenger
    if (!hasPassenger) {
      isCompleting.current = false;
    }

    // Dropoff Check
    if (
      activeMission &&
      hasPassenger &&
      !isCompleting.current &&
      gameMode === 'PLAYING'
    ) {
      const drop = activeMission.dropoffLocation;
      const dist = Math.hypot(pos.x - drop.x, pos.z - drop.z);

      if (dist < 7.5) {
        isCompleting.current = true;
        handleMissionComplete();
      }
    }

    // Check if public is chasing and player slows down / stops -> Mob Catch!
    const isPublicChasing = useGameStore.getState().isPublicChasing;
    const speedKmh = useGameStore.getState().speedKmh;
    if (isPublicChasing && (gameMode === 'PLAYING' || gameMode === 'FREE_ROAM')) {
      if (speedKmh < 6) {
        if (!slowDuringChaseTime.current) {
          slowDuringChaseTime.current = state.clock.elapsedTime;
        } else if (state.clock.elapsedTime - slowDuringChaseTime.current > 1.8) {
          slowDuringChaseTime.current = 0;
          useGameStore.getState().triggerPublicCatch();
        }
      } else {
        slowDuringChaseTime.current = 0;
      }
    } else {
      slowDuringChaseTime.current = 0;
    }
  });

  const handleMissionComplete = async () => {
    const activeMission = useGameStore.getState().activeMission;
    if (!activeMission) return;

    soundService.playCashRegister();
    comedyEventBus.emit('MISSION_SUCCESS');

    // Celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#059669', '#facc15', '#dc2626', '#ffffff'],
    });

    const missionStartTime = useGameStore.getState().missionStartTime;
    const chaosScore = useGameStore.getState().chaosScore;
    const damagePercent = useGameStore.getState().damagePercent;
    const negotiatedFareTaka = useGameStore.getState().negotiatedFareTaka;
    const missionSessionToken = useGameStore.getState().missionSessionToken;

    const elapsed = Math.max(12, Math.round((Date.now() - missionStartTime) / 1000));

    try {
      const result = await apiService.completeMission({
        sessionToken: missionSessionToken || `session_${Date.now()}`,
        missionId: activeMission.id,
        timeElapsedSeconds: elapsed,
        chaosScore,
        damagePercent,
        fareNegotiatedTaka: negotiatedFareTaka,
        specialEventsTriggered: [],
        completedObjectives: ['PICKUP', 'DROPOFF'],
        clientNonce: 'client_done',
      });

      if (result.success) {
        usePlayerStore.getState().updateTaka(result.newBalance);
        if (result.unlockedNextMissionId) {
          usePlayerStore.getState().unlockMission(result.unlockedNextMissionId);
          useGameStore.getState().setUnlockedNextMissionId(result.unlockedNextMissionId);
        }
        useGameStore.getState().setActiveNewspaper(result.newspaper);
        useGameStore.getState().setGameMode('MISSION_COMPLETE');
      }
    } catch (e) {
      console.error('Mission completion error:', e);
    }
  };

  return null;
};

export const GameScene: React.FC = () => {
  const isRain = useGameStore((state) => state.isRain);

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        shadows
        camera={{ position: [0, 6, -12], fov: 60 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        {/* SKY BACKGROUND (Monsoon sky grey #B9C2C6 / hill haze blue #9DB4C0) */}
        <color attach="background" args={[isRain ? '#9DB4C0' : '#B9C2C6']} />

        {/* FOG (Exponential fog fading into hill haze blue #9DB4C0 or monsoon grey #B9C2C6) */}
        <fogExp2 attach="fog" args={[isRain ? '#9DB4C0' : '#B9C2C6', isRain ? 0.007 : 0.0035]} />

        {/* LIGHTING & AMBIANCE */}
        <ambientLight intensity={isRain ? 0.35 : 0.65} color={isRain ? '#94a3b8' : '#fef08a'} />
        <hemisphereLight intensity={0.4} groundColor="#1c1917" color="#bae6fd" />
        <directionalLight
          position={[40, 60, 30]}
          intensity={isRain ? 0.8 : 1.6}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={200}
          shadow-camera-left={-60}
          shadow-camera-right={60}
          shadow-camera-top={60}
          shadow-camera-bottom={-60}
          color={isRain ? '#cbd5e1' : '#fffbeb'}
        />

        {/* Rain particles */}
        {isRain && <RainParticles />}

        {/* 3D MAP & LANDMARKS */}
        <SylhetMap />

        {/* AUTHENTIC SYLHET STREET SCENERY, ELEVATED ROADS & TEA STALLS */}
        <SylhetStreetLife />

        {/* DYNAMIC SYLHET TRAFFIC JAM (Rickshaws, Legunas & CNGs) */}
        <SylhetTrafficJam />

        {/* 3D PICKUP PASSENGER NPC */}
        <PassengerNPC />

        {/* PLAYABLE CNG AUTO-RICKSHAW */}
        <CNGVehicle initialPosition={[0, 0.4, 15]} />

        {/* CAMERA RIG & CONTROLLER */}
        <CameraRig />
      </Canvas>
    </div>
  );
};
