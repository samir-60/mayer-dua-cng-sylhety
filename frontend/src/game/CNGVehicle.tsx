import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../stores/useGameStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { soundService } from '../services/sound.service';
import { comedyEventBus } from '../comedy/ComedyEventBus';
import { vehicle3DState, vehicleInputState } from './sharedVehicleState';

interface CNGVehicleProps {
  initialPosition?: [number, number, number];
}

export const CNGVehicle: React.FC<CNGVehicleProps> = ({
  initialPosition = [0, 0.4, 15],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const frontWheelRef = useRef<THREE.Group>(null);
  const rearLeftWheelRef = useRef<THREE.Group>(null);
  const rearRightWheelRef = useRef<THREE.Group>(null);
  const bodyMeshRef = useRef<THREE.Group>(null);

  // Vehicle physics state
  const pos = useRef(new THREE.Vector3(...initialPosition));
  const rotationY = useRef(0);
  const speed = useRef(0);
  const steerAngle = useRef(0);
  const bounceY = useRef(0);
  const rollAngle = useRef(0);
  const pitchAngle = useRef(0);

  // Horn tracking & throttle timer
  const hornCount = useRef(0);
  const lastHornTime = useRef(0);
  const slowDrivingTimer = useRef(0);
  const lastTelemetryUpdate = useRef(0);
  const lastDriftSound = useRef(0);

  // Granular Store Selectors
  const gameMode = useGameStore((state) => state.gameMode);
  const isHeadlightsOn = useGameStore((state) => state.isHeadlightsOn);
  const activeMission = useGameStore((state) => state.activeMission);
  const hasPassenger = useGameStore((state) => state.hasPassenger);
  const equippedPaint = usePlayerStore((state) => state.profile?.equippedPaint || 'paint_classic_green');
  const equippedHorn = usePlayerStore((state) => state.profile?.equippedHorn || 'horn_sylheti_pee');

  // Control keys
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    drift: false,
    horn: false,
  });

  // Reset vehicle position and heading whenever starting a shift or free drive
  useEffect(() => {
    if (gameMode === 'PLAYING' || gameMode === 'FREE_ROAM') {
      pos.current.set(0, 0.4, 15);
      rotationY.current = 0;
      speed.current = 0;
      steerAngle.current = 0;
      keys.current.forward = false;
      keys.current.backward = false;
      keys.current.left = false;
      keys.current.right = false;
      keys.current.drift = false;
      vehicleInputState.forward = false;
      vehicleInputState.backward = false;
      vehicleInputState.left = false;
      vehicleInputState.right = false;
      vehicleInputState.boost = false;
      vehicle3DState.position.copy(pos.current);
      vehicle3DState.headingY = 0;
      vehicle3DState.speed = 0;
      vehicle3DState.speedKmh = 0;
    }
  }, [gameMode]);

  // Robust input listeners supporting code and key across all layouts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (['arrowup', 'w'].includes(k) || ['ArrowUp', 'KeyW'].includes(e.code)) {
        keys.current.forward = true;
      }
      if (['arrowdown', 's'].includes(k) || ['ArrowDown', 'KeyS'].includes(e.code)) {
        keys.current.backward = true;
      }
      if (['arrowleft', 'a'].includes(k) || ['ArrowLeft', 'KeyA'].includes(e.code)) {
        keys.current.left = true;
      }
      if (['arrowright', 'd'].includes(k) || ['ArrowRight', 'KeyD'].includes(e.code)) {
        keys.current.right = true;
      }
      if (['shift', ' '].includes(k) || ['ShiftLeft', 'ShiftRight', 'Space'].includes(e.code)) {
        keys.current.drift = true;
      }

      if (k === 'h' || e.code === 'KeyH') {
        triggerHorn();
      }
      if (k === 'l' || e.code === 'KeyL') {
        useGameStore.getState().toggleHeadlights();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (['arrowup', 'w'].includes(k) || ['ArrowUp', 'KeyW'].includes(e.code)) {
        keys.current.forward = false;
      }
      if (['arrowdown', 's'].includes(k) || ['ArrowDown', 'KeyS'].includes(e.code)) {
        keys.current.backward = false;
      }
      if (['arrowleft', 'a'].includes(k) || ['ArrowLeft', 'KeyA'].includes(e.code)) {
        keys.current.left = false;
      }
      if (['arrowright', 'd'].includes(k) || ['ArrowRight', 'KeyD'].includes(e.code)) {
        keys.current.right = false;
      }
      if (['shift', ' '].includes(k) || ['ShiftLeft', 'ShiftRight', 'Space'].includes(e.code)) {
        keys.current.drift = false;
      }
    };

    const handleBlur = () => {
      keys.current.forward = false;
      keys.current.backward = false;
      keys.current.left = false;
      keys.current.right = false;
      keys.current.drift = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const triggerHorn = () => {
    const now = Date.now();
    soundService.playHorn(equippedHorn === 'horn_hydraulic_blast');
    useGameStore.getState().incrementHorn();

    // Check rapid horn spamming
    if (now - lastHornTime.current < 800) {
      hornCount.current++;
      if (hornCount.current >= 3) {
        comedyEventBus.emit('HORN_SPAM');
        hornCount.current = 0;
      }
    } else {
      hornCount.current = 1;
    }
    lastHornTime.current = now;
  };

  const padStopTimer = useRef(0);

  // Paint color based on equipped paint and Master Build Prompt palette
  const getBodyPaintColor = () => {
    if (equippedPaint === 'paint_golden_vip' || equippedPaint === 'paint_festival') return '#047857';
    if (equippedPaint === 'paint_cyber_neon' || equippedPaint === 'paint_dusk') return '#0F3820';
    return '#1F6B3A'; // Classic CNG Green
  };

  // Vehicle Frame Loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Cap delta for physics stability
    const dt = Math.min(delta, 0.05);

    // If on Menu, rotate vehicle gently for interactive showroom showcase!
    if (gameMode === 'MENU') {
      rotationY.current += dt * 0.4;
      groupRef.current.position.set(0, 0.4, 0);
      groupRef.current.rotation.y = rotationY.current;
      vehicle3DState.position.copy(pos.current);
      return;
    }

    if (gameMode !== 'PLAYING' && gameMode !== 'FREE_ROAM') return;

    // Merge keyboard and virtual on-screen pedal controls
    const isForward = keys.current.forward || vehicleInputState.forward;
    const isBackward = keys.current.backward || vehicleInputState.backward;
    const isLeft = keys.current.left || vehicleInputState.left;
    const isRight = keys.current.right || vehicleInputState.right;
    const isBoost = keys.current.drift || vehicleInputState.boost;

    const maxForwardSpeed = isBoost ? 20.0 : 16.0; // units/s (~65-85 km/h)
    const maxReverseSpeed = -9.0; // units/s (~38 km/h)
    const accel = 18.0;
    const brakeDecel = 26.0;
    const coastDecel = 8.0;
    const turnSpeed = isBoost ? 3.0 : 2.4;

    // Responsive Accelerate / Brake / Reverse
    if (isForward) {
      if (speed.current < 0) {
        // Snappy braking while in reverse
        speed.current = Math.min(0, speed.current + brakeDecel * dt);
      } else {
        speed.current = Math.min(speed.current + accel * dt, maxForwardSpeed);
      }
    } else if (isBackward) {
      if (speed.current > 0) {
        // Snappy braking while moving forward
        speed.current = Math.max(0, speed.current - brakeDecel * dt);
      } else {
        // Accelerating in reverse
        speed.current = Math.max(speed.current - accel * 0.8 * dt, maxReverseSpeed);
      }
    } else {
      // Natural rolling friction
      if (speed.current > 0) {
        speed.current = Math.max(0, speed.current - coastDecel * dt);
      } else if (speed.current < 0) {
        speed.current = Math.min(0, speed.current + coastDecel * dt);
      }
    }

    // Steering
    const targetSteer = isLeft ? 0.45 : isRight ? -0.45 : 0;
    steerAngle.current += (targetSteer - steerAngle.current) * 14.0 * dt;

    // Turn vehicle if moving (corrected reverse steering factor)
    if (Math.abs(speed.current) > 0.1) {
      const directionFactor = speed.current >= 0 ? 1 : -1;
      const speedRatio = Math.min(1.0, Math.abs(speed.current) / 12.0);
      rotationY.current += steerAngle.current * turnSpeed * directionFactor * speedRatio * dt;
    }

    // Update position
    pos.current.x += Math.sin(rotationY.current) * speed.current * dt;
    pos.current.z += Math.cos(rotationY.current) * speed.current * dt;

    // Boundary constraints (stay within Sylhet city map radius ~170m)
    pos.current.x = Math.max(-170, Math.min(170, pos.current.x));
    pos.current.z = Math.max(-170, Math.min(170, pos.current.z));

    // Arcade Body Lean & Suspension Bounce
    const targetRoll = -steerAngle.current * (speed.current / maxForwardSpeed) * 0.35; // classic 3-wheeler body lean
    rollAngle.current += (targetRoll - rollAngle.current) * 8.0 * dt;

    const targetPitch = (isForward ? 0.05 : isBackward ? -0.06 : 0) * (Math.abs(speed.current) / maxForwardSpeed);
    pitchAngle.current += (targetPitch - pitchAngle.current) * 8.0 * dt;

    // Natural engine vibration bounce
    bounceY.current = Math.sin(state.clock.elapsedTime * 20) * 0.015 * (Math.abs(speed.current) > 0.5 ? 1.5 : 0.6);

    // Apply to group
    groupRef.current.position.set(pos.current.x, pos.current.y + bounceY.current, pos.current.z);
    groupRef.current.rotation.y = rotationY.current;

    if (bodyMeshRef.current) {
      bodyMeshRef.current.rotation.z = rollAngle.current;
      bodyMeshRef.current.rotation.x = pitchAngle.current;
    }

    // Animate wheels
    if (frontWheelRef.current) {
      frontWheelRef.current.rotation.y = steerAngle.current;
      frontWheelRef.current.rotation.x += speed.current * 3.0 * dt;
    }
    if (rearLeftWheelRef.current) {
      rearLeftWheelRef.current.rotation.x += speed.current * 3.0 * dt;
    }
    if (rearRightWheelRef.current) {
      rearRightWheelRef.current.rotation.x += speed.current * 3.0 * dt;
    }

    // Sound pitch modulation
    const speedRatio = Math.abs(speed.current) / maxForwardSpeed;
    soundService.updateEnginePitch(speedRatio, isForward);

    // Speed in km/h (~4.2 ratio for arcade feel: 18 units/s -> ~75 km/h)
    const kmh = Math.abs(speed.current) * 4.2;

    // Update shared 3D mutable state for camera, map & NPC (0 React re-renders)
    vehicle3DState.position.copy(pos.current);
    vehicle3DState.headingY = rotationY.current;
    vehicle3DState.speed = speed.current;
    vehicle3DState.speedKmh = kmh;

    // Throttle HUD store telemetry update to once every 150ms to keep React completely smooth
    if (state.clock.elapsedTime - lastTelemetryUpdate.current > 0.15) {
      useGameStore.getState().updateVehicleTelemetry(kmh, 0.15 * (Math.abs(speed.current) > 0.5 ? 0.08 : 0.02));
      lastTelemetryUpdate.current = state.clock.elapsedTime;
    }

    // Drift sound & event trigger
    if (keys.current.drift && Math.abs(speed.current) > 5.0) {
      if (state.clock.elapsedTime - lastDriftSound.current > 0.4) {
        soundService.playTyreDrift();
        comedyEventBus.emit('CNG_BOUNCE');
        lastDriftSound.current = state.clock.elapsedTime;
      }
    }

    // Event Triggers
    if (kmh > 72) {
      comedyEventBus.emit('SPEEDING');
    }

    if (kmh < 5 && Math.abs(speed.current) < 0.5) {
      slowDrivingTimer.current += dt;
      if (slowDrivingTimer.current > 7.0) {
        comedyEventBus.emit('SLOW_DRIVING');
        slowDrivingTimer.current = 0;
      }
    } else {
      slowDrivingTimer.current = 0;
    }

    // Check CNG Station Refuel Pads (Stop for 3 seconds to refill tank)
    const cngStationPads = [
      { x: -35, z: 20 },
      { x: 35, z: -60 },
      { x: 0, z: -150 },
    ];
    const nearStationPad = cngStationPads.some((pad) => Math.hypot(pos.current.x - pad.x, pos.current.z - pad.z) < 6.0);
    if (nearStationPad && Math.abs(speed.current) < 0.3) {
      padStopTimer.current += dt;
      if (padStopTimer.current >= 3.0) {
        useGameStore.getState().updateVehicleTelemetry(0, -100);
        soundService.playPaySound();
        padStopTimer.current = 0;
      }
    } else {
      padStopTimer.current = 0;
    }

    // Check Surma River Entry (Vehicle Flooding)
    const inRiverZone = pos.current.z > -138 && pos.current.z < -82;
    const onKeaneBridge = pos.current.x > -4 && pos.current.x < 14;
    const onWestBridge = pos.current.x > -98 && pos.current.x < -82;
    if (inRiverZone && !onKeaneBridge && !onWestBridge) {
      soundService.playCollision(true);
      useGameStore.getState().returnToMenu();
    }
  });

  const bodyColor = getBodyPaintColor();
  const roofColor = '#1A1C1E'; // Black rubber roof cover with slight sag
  const trimColor = '#F2C230'; // Signal yellow band along the lower edge

  return (
    <group ref={groupRef} position={initialPosition}>
      {/* VEHICLE BODY ASSEMBLY */}
      <group ref={bodyMeshRef}>
        {/* Lower Main Chassis (Green Metal) */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.5, 2.2]} />
          <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Signal Yellow Band along lower edge */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[1.32, 0.08, 2.22]} />
          <meshStandardMaterial color={trimColor} roughness={0.4} />
        </mesh>

        {/* CNG Cylinder under rear seat */}
        <mesh position={[0, 0.38, -0.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.95, 16]} />
          <meshStandardMaterial color="#1F6B3A" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Slanted Front Hood / Nose */}
        <mesh position={[0, 0.4, 1.15]} rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[1.0, 0.35, 0.6]} />
          <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Curved Yellow Canvas Roof */}
        <mesh position={[0, 1.35, -0.1]} castShadow>
          <cylinderGeometry args={[0.75, 0.8, 2.1, 16, 1, false, Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color={roofColor} roughness={0.7} />
        </mesh>

        {/* Roof Flat Filler Bottom */}
        <mesh position={[0, 1.35, -0.1]}>
          <boxGeometry args={[1.4, 0.06, 2.1]} />
          <meshStandardMaterial color={roofColor} roughness={0.7} />
        </mesh>

        {/* Front Windshield Frame and Glass */}
        <mesh position={[0, 1.0, 0.9]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[1.2, 0.65, 0.04]} />
          <meshPhysicalMaterial
            color="#bae6fd"
            transparent
            opacity={0.65}
            roughness={0.1}
            transmission={0.8}
            thickness={0.2}
          />
        </mesh>

        {/* Windshield Wiper */}
        <mesh position={[0.1, 1.0, 0.94]} rotation={[-0.2, 0, 0.25]}>
          <boxGeometry args={[0.03, 0.45, 0.02]} />
          <meshStandardMaterial color="#1c1917" />
        </mesh>

        {/* Metal Side Cage Grille Bars (Authentic Bangladeshi CNG) */}
        {[-0.65, 0.65].map((x, idx) => (
          <group key={idx} position={[x, 0.9, -0.2]}>
            {/* Top horizontal rail */}
            <mesh position={[0, 0.35, 0]}>
              <boxGeometry args={[0.04, 0.04, 1.8]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
            {/* Vertical protective cage bars */}
            {[-0.7, -0.35, 0, 0.35, 0.7].map((z, bIdx) => (
              <mesh key={bIdx} position={[0, 0, z]}>
                <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
                <meshStandardMaterial color="#475569" metalness={0.8} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Handlebars & Meter Dashboard */}
        <mesh position={[0, 0.8, 0.6]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.65, 0.05, 0.05]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.83, 0.58]}>
          <boxGeometry args={[0.2, 0.08, 0.08]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.4} />
        </mesh>

        {/* Passenger in Back Seat when onboard */}
        {hasPassenger && (
          <group position={[0, 0.72, -0.45]}>
            {/* Passenger Body in Panjabi */}
            <mesh position={[0, 0.25, 0]} castShadow>
              <boxGeometry args={[0.5, 0.5, 0.35]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
            {/* Head with beard */}
            <mesh position={[0, 0.65, 0]}>
              <sphereGeometry args={[0.14, 12, 12]} />
              <meshStandardMaterial color="#92400e" />
            </mesh>
            {/* White Prayer Cap */}
            <mesh position={[0, 0.8, 0]}>
              <cylinderGeometry args={[0.12, 0.13, 0.1, 12]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        )}

        {/* Rear License Plate ("সিলেট-থ ১১-১২৩৪") */}
        <mesh position={[0, 0.35, -1.12]} rotation={[0, Math.PI, 0]}>
          <boxGeometry args={[0.55, 0.2, 0.02]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>

        {/* Headlight (Center front single/dual beam) */}
        <mesh position={[0, 0.55, 1.45]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive={isHeadlightsOn ? '#fef08a' : '#000000'}
            emissiveIntensity={isHeadlightsOn ? 1.5 : 0}
          />
        </mesh>

        {/* Front Headlight Light */}
        {isHeadlightsOn && (
          <pointLight
            position={[0, 0.6, 1.8]}
            intensity={3.5}
            distance={25}
            color="#fef9c3"
          />
        )}

        {/* Passenger in Rear Seat (Abul Chacha or VIP Goat or Chicken crates!) */}
        {hasPassenger && (
          <group position={[0, 0.75, -0.4]}>
            {activeMission?.specialGimmick === 'VIP_GOAT' ? (
              // 3D VIP Eid Goat!
              <group position={[0, 0, 0]}>
                <mesh position={[0, 0.2, 0]} castShadow>
                  <boxGeometry args={[0.45, 0.35, 0.6]} />
                  <meshStandardMaterial color="#b45309" roughness={0.8} />
                </mesh>
                <mesh position={[0, 0.45, 0.3]}>
                  <boxGeometry args={[0.22, 0.25, 0.28]} />
                  <meshStandardMaterial color="#92400e" />
                </mesh>
                <mesh position={[-0.1, 0.6, 0.25]} rotation={[0.3, 0, -0.3]}>
                  <cylinderGeometry args={[0.02, 0.04, 0.18, 6]} />
                  <meshStandardMaterial color="#1c1917" />
                </mesh>
                <mesh position={[0.1, 0.6, 0.25]} rotation={[0.3, 0, 0.3]}>
                  <cylinderGeometry args={[0.02, 0.04, 0.18, 6]} />
                  <meshStandardMaterial color="#1c1917" />
                </mesh>
              </group>
            ) : activeMission?.specialGimmick === 'CHICKEN_DELIVERY' ? (
              // 3D Squawking Chicken Cages!
              <group position={[0, 0.1, 0]}>
                <mesh position={[0, 0.2, 0]}>
                  <boxGeometry args={[0.8, 0.5, 0.6]} />
                  <meshStandardMaterial color="#d97706" wireframe />
                </mesh>
                <mesh position={[-0.2, 0.2, 0]}>
                  <sphereGeometry args={[0.12, 8, 8]} />
                  <meshStandardMaterial color="#fef08a" />
                </mesh>
                <mesh position={[0.2, 0.2, 0]}>
                  <sphereGeometry args={[0.12, 8, 8]} />
                  <meshStandardMaterial color="#b91c1c" />
                </mesh>
              </group>
            ) : (
              // Human Passenger (Abul Chacha / Uncle)
              <group position={[0, 0, 0]}>
                <mesh position={[0, 0.2, 0]} castShadow>
                  <boxGeometry args={[0.45, 0.45, 0.35]} />
                  <meshStandardMaterial color="#f8fafc" />
                </mesh>
                <mesh position={[0, 0.55, 0]}>
                  <sphereGeometry args={[0.16, 16, 16]} />
                  <meshStandardMaterial color="#b45309" />
                </mesh>
                <mesh position={[0, 0.68, 0]}>
                  <cylinderGeometry args={[0.14, 0.15, 0.1, 16]} />
                  <meshStandardMaterial color="#ffffff" />
                </mesh>
              </group>
            )}
          </group>
        )}
      </group>

      {/* WHEELS (Classic 3-Wheeler Layout: 1 Front, 2 Rear) */}
      <group ref={frontWheelRef} position={[0, 0.25, 1.1]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.14, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.15, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      <group ref={rearLeftWheelRef} position={[-0.65, 0.25, -0.6]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.16, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.17, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
      </group>

      <group ref={rearRightWheelRef} position={[0.65, 0.25, -0.6]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.16, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.17, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
};
