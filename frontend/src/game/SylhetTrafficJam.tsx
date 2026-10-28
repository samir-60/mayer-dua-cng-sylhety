import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { vehicle3DState } from './sharedVehicleState';
import { soundService } from '../services/sound.service';
import { comedyEventBus } from '../comedy/ComedyEventBus';
import { useGameStore } from '../stores/useGameStore';

// -------------------------------------------------------------
// 1. CYCLE RICKSHAW (ঐতিহ্যবাহী সিলেট রিকশা)
// -------------------------------------------------------------
interface RickshawProps {
  position: [number, number, number];
  rotationY?: number;
  hoodColor?: string;
  plateColor?: string;
}

export const LowPolyRickshaw: React.FC<RickshawProps> = ({
  position,
  rotationY = 0,
  hoodColor = '#dc2626',
  plateColor = '#facc15',
}) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Chassis & Footrest Plate */}
      <mesh position={[0, 0.35, -0.3]} castShadow>
        <boxGeometry args={[1.1, 0.08, 1.4]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Passenger Seat (Vinyl Cushion) */}
      <mesh position={[0, 0.65, -0.6]} castShadow>
        <boxGeometry args={[1.0, 0.3, 0.5]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
      {/* Seat Backrest */}
      <mesh position={[0, 0.95, -0.8]}>
        <boxGeometry args={[1.0, 0.5, 0.1]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>

      {/* Traditional Curved Hood (হালকা ভাঁজ করা হুড) */}
      <mesh position={[0, 1.4, -0.65]} castShadow>
        <cylinderGeometry args={[0.6, 0.65, 1.1, 12, 1, false, Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color={hoodColor} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Hand-painted Tin Backplate (রিকশা আর্ট বোর্ড) */}
      <mesh position={[0, 0.5, -0.88]}>
        <boxGeometry args={[0.9, 0.45, 0.02]} />
        <meshStandardMaterial color={plateColor} metalness={0.2} roughness={0.4} />
      </mesh>

      {/* Rear 2 Spoke Bicycle Wheels */}
      {[-0.6, 0.6].map((x, idx) => (
        <group key={idx} position={[x, 0.4, -0.4]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.4, 0.4, 0.08, 16]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.34, 0.34, 0.09, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Bicycle Front Section (Frame & Handlebar) */}
      <mesh position={[0, 0.65, 0.6]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.9, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>
      {/* Handlebars */}
      <mesh position={[0, 1.05, 0.45]}>
        <boxGeometry args={[0.7, 0.04, 0.04]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} />
      </mesh>
      {/* Rickshaw Bell on Handlebar */}
      <mesh position={[0.2, 1.08, 0.46]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#eab308" metalness={0.9} />
      </mesh>
      {/* Front Wheel */}
      <mesh position={[0, 0.4, 0.9]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.06, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Rickshaw Puller (রিকশাওয়ালা মামা in Lungi & Gamchha) */}
      <group position={[0, 0.8, 0.2]}>
        {/* Torso in singlet / genji */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.35, 0.45, 0.25]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        {/* Red Gamchha around neck */}
        <mesh position={[0, 0.52, 0.05]}>
          <boxGeometry args={[0.38, 0.08, 0.28]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.72, 0]}>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshStandardMaterial color="#92400e" />
        </mesh>
        {/* Checkered Lungi (সবুজ চেক লুঙ্গি) */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.2, 0.24, 0.5, 12]} />
          <meshStandardMaterial color="#15803d" />
        </mesh>
      </group>
    </group>
  );
};

// -------------------------------------------------------------
// 2. BLUE SYLHETI LEGUNA (হিউম্যান হলার / লেগুনা)
// -------------------------------------------------------------
export const LowPolyLeguna: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({
  position,
  rotationY = 0,
}) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Front Cab (Blue metal) */}
      <mesh position={[0, 0.8, 1.0]} castShadow>
        <boxGeometry args={[1.5, 1.2, 1.4]} />
        <meshStandardMaterial color="#0284c7" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 1.0, 1.65]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[1.3, 0.6]} />
        <meshStandardMaterial color="#bae6fd" roughness={0.1} />
      </mesh>

      {/* Rear Passenger Passenger Bed with Overhead Cage Bars */}
      <mesh position={[0, 0.5, -0.8]} castShadow>
        <boxGeometry args={[1.6, 0.6, 2.2]} />
        <meshStandardMaterial color="#0369a1" />
      </mesh>
      {/* Yellow Trim Line */}
      <mesh position={[0, 0.75, -0.8]}>
        <boxGeometry args={[1.62, 0.08, 2.22]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>
      {/* Roof Canopy */}
      <mesh position={[0, 1.6, -0.8]} castShadow>
        <boxGeometry args={[1.65, 0.08, 2.3]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Metal Pillar Posts */}
      {[-0.75, 0.75].map((x, px) =>
        [-1.8, -0.8, 0.2].map((z, pz) => (
          <mesh key={`${px}_${pz}`} position={[x, 1.1, z]}>
            <cylinderGeometry args={[0.02, 0.02, 1.0, 6]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
        ))
      )}

      {/* 4 Wheels */}
      {[-0.8, 0.8].map((x, wx) =>
        [-1.2, 1.1].map((z, wz) => (
          <mesh key={`${wx}_${wz}`} position={[x, 0.35, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.35, 0.35, 0.2, 16]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        ))
      )}

      {/* Bangla Decal on Back: "সিলেট-কোম্পানীগঞ্জ" */}
      <mesh position={[0, 0.65, -1.92]}>
        <boxGeometry args={[1.4, 0.25, 0.02]} />
        <meshStandardMaterial color="#fef08a" />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// 3. OTHER SYLHETI GREEN CNG AUTO-RICKSHAW IN TRAFFIC
// -------------------------------------------------------------
export const TrafficCNG: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  signText?: string;
}> = ({ position, rotationY = 0, signText = 'বাপের দোয়া' }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Green Body */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.25, 0.5, 2.1]} />
        <meshStandardMaterial color="#1F6B3A" roughness={0.4} />
      </mesh>
      {/* Yellow Lower Skirt */}
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[1.27, 0.08, 2.12]} />
        <meshStandardMaterial color="#F2C230" />
      </mesh>
      {/* Slanted Nose */}
      <mesh position={[0, 0.4, 1.1]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.95, 0.35, 0.55]} />
        <meshStandardMaterial color="#1F6B3A" />
      </mesh>
      {/* Black Canvas Roof */}
      <mesh position={[0, 1.35, -0.1]} castShadow>
        <cylinderGeometry args={[0.72, 0.76, 2.0, 14, 1, false, Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color="#1A1C1E" roughness={0.7} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 1.0, 0.85]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[1.15, 0.6]} />
        <meshStandardMaterial color="#bae6fd" opacity={0.65} transparent />
      </mesh>
      {/* Rear Slogan Board */}
      <mesh position={[0, 0.5, -1.06]}>
        <boxGeometry args={[0.9, 0.25, 0.02]} />
        <meshStandardMaterial color="#F2C230" />
      </mesh>
      {/* 3 Wheels */}
      <mesh position={[0, 0.25, 1.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.12, 14]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {[-0.62, 0.62].map((x, idx) => (
        <mesh key={idx} position={[x, 0.25, -0.55]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.14, 14]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      ))}
    </group>
  );
};

// -------------------------------------------------------------
// 4. MAIN DYNAMIC TRAFFIC JAM CONTROLLER (জ্যাম সিমুলেশন)
// -------------------------------------------------------------
interface MovingTrafficItem {
  id: string;
  type: 'RICKSHAW' | 'CNG' | 'LEGUNA';
  initialPos: [number, number, number];
  speed: number;
  dir: number;
  isEastWest?: boolean;
  lastHit?: number;
  lastNearMiss?: number;
}

export const SylhetTrafficJam: React.FC = () => {
  const lastHonkSound = useRef(0);
  const lastBellSound = useRef(0);

  // Moving traffic queue on Grand Avenue and Chowhatta intersection
  const trafficVehicles = useMemo<MovingTrafficItem[]>(() => {
    return [
      // 1. Chowhatta - Zindabazar Avenue Queue (Northbound Lane: X = 3.5)
      { id: 'rick_1', type: 'RICKSHAW', initialPos: [3.5, 0, 45], speed: 1.8, dir: 1 },
      { id: 'cng_1', type: 'CNG', initialPos: [3.2, 0, 25], speed: 3.2, dir: 1 },
      { id: 'leg_1', type: 'LEGUNA', initialPos: [3.6, 0, -5], speed: 2.6, dir: 1 },
      { id: 'rick_2', type: 'RICKSHAW', initialPos: [3.8, 0, -25], speed: 1.6, dir: 1 },
      { id: 'cng_2', type: 'CNG', initialPos: [3.3, 0, -60], speed: 3.0, dir: 1 },

      // 2. Keane Bridge to Ambarkhana (Southbound Lane: X = -3.5)
      { id: 'cng_3', type: 'CNG', initialPos: [-3.5, 0, 75], speed: 2.9, dir: -1 },
      { id: 'rick_3', type: 'RICKSHAW', initialPos: [-3.8, 0, 50], speed: 1.7, dir: -1 },
      { id: 'leg_2', type: 'LEGUNA', initialPos: [-3.4, 0, 15], speed: 2.4, dir: -1 },
      { id: 'rick_4', type: 'RICKSHAW', initialPos: [-3.6, 0, -15], speed: 1.9, dir: -1 },
      { id: 'cng_4', type: 'CNG', initialPos: [-3.2, 0, -45], speed: 3.1, dir: -1 },
      { id: 'rick_5', type: 'RICKSHAW', initialPos: [-3.7, 0, -85], speed: 1.5, dir: -1 },

      // 3. Commercial Highway Jam (East-West Lane: Z = 15)
      { id: 'rick_6', type: 'RICKSHAW', initialPos: [30, 0, 18.5], speed: 1.5, dir: 1, isEastWest: true },
      { id: 'leg_3', type: 'LEGUNA', initialPos: [65, 0, 18.2], speed: 2.5, dir: 1, isEastWest: true },
      { id: 'cng_5', type: 'CNG', initialPos: [-40, 0, 12.0], speed: 2.8, dir: -1, isEastWest: true },
      { id: 'rick_7', type: 'RICKSHAW', initialPos: [-75, 0, 12.5], speed: 1.6, dir: -1, isEastWest: true },
    ];
  }, []);

  const vehicleRefs = useRef<(THREE.Group | null)[]>([]);

  useFrame((state, delta) => {
    const playerPos = vehicle3DState.position;

    trafficVehicles.forEach((veh, idx) => {
      const grp = vehicleRefs.current[idx];
      if (!grp) return;

      // Animate movement along lanes
      if (veh.isEastWest) {
        grp.position.x += veh.dir * veh.speed * delta;
        // Loop around boundary
        if (veh.dir > 0 && grp.position.x > 120) grp.position.x = -120;
        if (veh.dir < 0 && grp.position.x < -120) grp.position.x = 120;
      } else {
        grp.position.z += veh.dir * veh.speed * delta;
        // Loop around boundary
        if (veh.dir > 0 && grp.position.z > 110) grp.position.z = -120;
        if (veh.dir < 0 && grp.position.z < -120) grp.position.z = 110;
      }

      // Proximity check to player CNG (Collision / Near Miss / Jam Atmosphere)
      const dist = Math.hypot(playerPos.x - grp.position.x, playerPos.z - grp.position.z);
      const now = state.clock.elapsedTime;

      if (dist < 2.3) {
        // Debounce collision per vehicle
        if (!veh.lastHit || now - veh.lastHit > 1.2) {
          veh.lastHit = now;
          soundService.playPublicCollisionHit();
          const lossTaka = veh.type === 'RICKSHAW' ? 800 : veh.type === 'LEGUNA' ? 1800 : 1200;
          const reasonBn = veh.type === 'RICKSHAW' ? 'রিকশায় ঘষা!' : veh.type === 'LEGUNA' ? 'লেগুনায় গুঁতো!' : 'সিএনজি ধাক্কা!';
          useGameStore.getState().addNationalLoss(lossTaka, reasonBn);
          comedyEventBus.emit('POTHOLE_HIT');
        }
      } else if (dist >= 2.3 && dist < 3.8) {
        // High-speed near miss bonus
        const speed = useGameStore.getState().speedKmh;
        if (speed > 25 && (!veh.lastNearMiss || now - veh.lastNearMiss > 3.0)) {
          veh.lastNearMiss = now;
          useGameStore.getState().addNationalLoss(350, 'ঝুঁকিপূর্ণ ওভারটেক!');
        }
      }

      // If player is close behind traffic, play rickshaw bell or polite jam horn
      if (dist < 8.0) {
        if (veh.type === 'RICKSHAW' && state.clock.elapsedTime - lastBellSound.current > 4.0) {
          soundService.playRickshawBell();
          lastBellSound.current = state.clock.elapsedTime;
        } else if (veh.type === 'LEGUNA' && state.clock.elapsedTime - lastHonkSound.current > 6.0) {
          soundService.playBusHorn();
          lastHonkSound.current = state.clock.elapsedTime;
        }
      }
    });
  });

  return (
    <group>
      {/* Moving Traffic Jam Queue */}
      {trafficVehicles.map((veh, idx) => {
        const rotY = veh.isEastWest
          ? veh.dir > 0
            ? Math.PI / 2
            : -Math.PI / 2
          : veh.dir > 0
          ? 0
          : Math.PI;

        return (
          <group
            key={veh.id}
            ref={(el) => (vehicleRefs.current[idx] = el)}
            position={veh.initialPos as [number, number, number]}
          >
            {veh.type === 'RICKSHAW' ? (
              <LowPolyRickshaw
                position={[0, 0, 0]}
                rotationY={rotY}
                hoodColor={idx % 2 === 0 ? '#dc2626' : '#16a34a'}
                plateColor={idx % 3 === 0 ? '#facc15' : '#38bdf8'}
              />
            ) : veh.type === 'LEGUNA' ? (
              <LowPolyLeguna position={[0, 0, 0]} rotationY={rotY} />
            ) : (
              <TrafficCNG
                position={[0, 0, 0]}
                rotationY={rotY}
                signText={idx % 2 === 0 ? 'সুরমা এক্সপ্রেস' : 'বাপের দোয়া'}
              />
            )}
          </group>
        );
      })}

      {/* ---------------- PARKED RICKSHAW STANDS ALONG ROADSIDE ---------------- */}
      <group position={[-9.5, 0, 10]}>
        <LowPolyRickshaw position={[0, 0, -4]} rotationY={0.3} hoodColor="#0284c7" />
        <LowPolyRickshaw position={[0, 0, 0]} rotationY={0.15} hoodColor="#16a34a" />
        <LowPolyRickshaw position={[0, 0, 4]} rotationY={-0.2} hoodColor="#dc2626" />
      </group>

      <group position={[9.5, 0, -40]}>
        <LowPolyRickshaw position={[0, 0, -3]} rotationY={-Math.PI + 0.2} hoodColor="#ea580c" />
        <LowPolyRickshaw position={[0, 0, 2]} rotationY={-Math.PI - 0.15} hoodColor="#facc15" />
      </group>
    </group>
  );
};
