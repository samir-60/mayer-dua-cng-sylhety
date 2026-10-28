import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../stores/useGameStore';
import { soundService } from '../services/sound.service';
import { comedyEventBus } from '../comedy/ComedyEventBus';
import { vehicle3DState } from './sharedVehicleState';

// -------------------------------------------------------------
// 1. HISTORIC ALI AMJAD'S CLOCK TOWER (আলী আমজদের ঘড়ি - ১৮৭৪)
// Located on the north bank of Surma River right next to Keane Bridge
// -------------------------------------------------------------
const AliAmjadClockTower: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Stone Foundation Plinth */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.8, 4.2]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>

      {/* Tier 1: Red Brick Base with Arched Portal Details */}
      <mesh position={[0, 2.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 4.0, 3.2]} />
        <meshStandardMaterial color="#991b1b" roughness={0.7} />
      </mesh>
      {/* Arched entrance doorway */}
      <mesh position={[0, 1.8, 1.62]}>
        <boxGeometry args={[1.2, 2.2, 0.1]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Mid Stone Cornice Balustrade */}
      <mesh position={[0, 5.0, 0]} castShadow>
        <boxGeometry args={[3.6, 0.4, 3.6]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>

      {/* Tier 2: Red Brick Clock Tower Shaft */}
      <mesh position={[0, 8.2, 0]} castShadow>
        <boxGeometry args={[2.8, 6.0, 2.8]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.7} />
      </mesh>

      {/* Tier 3: Clock Face Chamber with 4 Round Clock Faces */}
      <mesh position={[0, 12.2, 0]} castShadow>
        <boxGeometry args={[3.0, 2.2, 3.0]} />
        <meshStandardMaterial color="#991b1b" roughness={0.7} />
      </mesh>

      {/* 4 Clock Dials (North, South, East, West) */}
      {[
        [0, 12.2, 1.52, 0],
        [0, 12.2, -1.52, Math.PI],
        [1.52, 12.2, 0, Math.PI / 2],
        [-1.52, 12.2, 0, -Math.PI / 2],
      ].map(([x, y, z, rotY], idx) => (
        <group key={idx} position={[x, y, z]} rotation={[0, rotY, 0]}>
          {/* White Dial Face */}
          <mesh>
            <circleGeometry args={[0.85, 24]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Gold Outer Rim */}
          <mesh position={[0, 0, 0.01]}>
            <ringGeometry args={[0.82, 0.94, 24]} />
            <meshStandardMaterial color="#eab308" metalness={0.8} />
          </mesh>
          {/* Clock Hands */}
          <mesh position={[0, 0.25, 0.02]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.06, 0.5, 0.02]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.2, 0, 0.02]} rotation={[0, 0, -1.2]}>
            <boxGeometry args={[0.06, 0.4, 0.02]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
        </group>
      ))}

      {/* Tier 4: Peaked Copper Roof Spire (Iconic Victorian Dome) */}
      <mesh position={[0, 14.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.9, 2.4, 4]} />
        <meshStandardMaterial color="#047857" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Top Spire Finial */}
      <mesh position={[0, 15.8, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 1.0, 8]} />
        <meshStandardMaterial color="#eab308" metalness={0.9} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// 2. CHOWHATTA SHAHEED MINAR MONUMENT (সিলেট কেন্দ্রীয় শহীদ মিনার)
// -------------------------------------------------------------
const ChowhattaShaheedMinar: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Circular Stepped Stone Podium */}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <cylinderGeometry args={[14, 15, 0.5, 32]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0, 0.65, 0]} receiveShadow>
        <cylinderGeometry args={[11, 12, 0.4, 32]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0, 0.95, 0]} receiveShadow>
        <cylinderGeometry args={[8, 9, 0.3, 32]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      {/* Glowing Crimson Red Sun Behind Minar */}
      <mesh position={[0, 6.2, -1.2]}>
        <circleGeometry args={[2.8, 32]} />
        <meshBasicMaterial color="#dc2626" />
      </mesh>

      {/* Central Tallest White Pillar (Tilted slightly forward) */}
      <mesh position={[0, 5.5, 0]} rotation={[-0.08, 0, 0]} castShadow>
        <boxGeometry args={[1.2, 9.5, 0.4]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>

      {/* Flanking Stepped White Pillars */}
      {[-1.8, 1.8].map((x, idx) => (
        <mesh key={`mid_${idx}`} position={[x, 4.2, 0]} rotation={[-0.08, 0, 0]} castShadow>
          <boxGeometry args={[1.0, 7.2, 0.35]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
      ))}
      {[-3.4, 3.4].map((x, idx) => (
        <mesh key={`outer_${idx}`} position={[x, 3.2, 0]} rotation={[-0.08, 0, 0]} castShadow>
          <boxGeometry args={[0.9, 5.0, 0.3]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
      ))}

      {/* Decorative Red & Green Flowerbeds */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const rad = 12.5;
        return (
          <mesh
            key={`flower_${i}`}
            position={[Math.cos(angle) * rad, 0.5, Math.sin(angle) * rad]}
          >
            <sphereGeometry args={[0.55, 8, 8]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#16a34a' : '#ef4444'} />
          </mesh>
        );
      })}
    </group>
  );
};

// -------------------------------------------------------------
// 3. ROADSIDE TEA STALL (চায়ের টং - গরম লাল চা ও কেতলি)
// -------------------------------------------------------------
const RoadsideTongStall: React.FC<{ position: [number, number, number]; rotation?: number }> = ({
  position,
  rotation = 0,
}) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Wooden Shed */}
      <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 2.6, 3.2]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Corrugated Tin Roof */}
      <mesh position={[0, 2.7, 0]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[4.8, 0.1, 3.8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.4} />
      </mesh>
      {/* Front Service Counter */}
      <mesh position={[0, 1.0, 1.6]} castShadow>
        <boxGeometry args={[3.8, 0.15, 0.8]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>
      {/* Aluminum Tea Kettle (কেতলি) */}
      <mesh position={[-0.8, 1.25, 1.6]} castShadow>
        <cylinderGeometry args={[0.22, 0.28, 0.4, 12]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Hanging Yellow Banana Bunch */}
      <mesh position={[1.0, 2.2, 1.6]}>
        <cylinderGeometry args={[0.15, 0.2, 0.5, 8]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>
      {/* Wooden Customer Bench */}
      <mesh position={[0, 0.35, 2.7]} castShadow>
        <boxGeometry args={[3.6, 0.3, 0.6]} />
        <meshStandardMaterial color="#573010" />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// 4. TRADITIONAL SYLHETI CYCLE RICKSHAW (পার্ক করা রিকশা)
// -------------------------------------------------------------
const ParkedRickshaw: React.FC<{ position: [number, number, number]; rotation?: number }> = ({
  position,
  rotation = 0,
}) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Rickshaw Passenger Seat Frame */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[1.1, 0.45, 0.8]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      {/* Decorative Hand-Painted Rickshaw Hood (Hood Canvas) */}
      <mesh position={[0, 1.25, -0.2]} rotation={[-0.2, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.65, 0.65, 1.15, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#facc15" side={THREE.DoubleSide} />
      </mesh>
      {/* Cycle Front Frame & Handlebar */}
      <mesh position={[0, 0.6, 1.0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>
      {/* Handlebar */}
      <mesh position={[0, 1.0, 0.95]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
      </mesh>
      {/* Rear Wheels */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0.4, -0.1]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.38, 0.04, 8, 24]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}
      {/* Front Wheel */}
      <mesh position={[0, 0.4, 1.4]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.38, 0.04, 8, 24]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// 5. OVERHEAD HIGHWAY DIRECTIONAL SIGN (সিলেটি দিকনির্দেশক গ্যান্ট্রি)
// -------------------------------------------------------------
const OverheadSignGantry: React.FC<{
  position: [number, number, number];
  titleBn: string;
  subEn: string;
}> = ({ position, titleBn, subEn }) => {
  return (
    <group position={position}>
      {/* Steel Pillars */}
      {[-9, 9].map((x, idx) => (
        <mesh key={idx} position={[x, 3.2, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 6.4, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} />
        </mesh>
      ))}
      {/* Cross Overhead Beam */}
      <mesh position={[0, 6.2, 0]}>
        <boxGeometry args={[18.4, 0.25, 0.25]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} />
      </mesh>
      {/* Green Direction Board */}
      <mesh position={[0, 5.0, 0]} castShadow>
        <boxGeometry args={[12.0, 2.0, 0.15]} />
        <meshStandardMaterial color="#047857" roughness={0.4} />
      </mesh>
      {/* White Border Frame */}
      <mesh position={[0, 5.0, 0.09]}>
        <boxGeometry args={[11.8, 1.8, 0.02]} />
        <meshStandardMaterial color="#ffffff" wireframe />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// 6. SYLHET TEA GARDEN HILLOCKS (চা বাগান ও টিলা)
// -------------------------------------------------------------
const TeaGardenHills: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Rolling Green Hill */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <sphereGeometry args={[28, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#15803d" roughness={0.9} />
      </mesh>
      {/* Tea Bushes on Hills (Clusters of tea plants) */}
      {Array.from({ length: 30 }).map((_, idx) => {
        const u = Math.random();
        const v = Math.random() * Math.PI * 2;
        const r = Math.sqrt(u) * 22;
        const x = Math.cos(v) * r;
        const z = Math.sin(v) * r;
        const y = Math.max(0.5, 4.5 - (r / 22) * 3.5);
        return (
          <mesh key={idx} position={[x, y + 0.4, z]}>
            <sphereGeometry args={[0.85, 8, 8]} />
            <meshStandardMaterial color={idx % 3 === 0 ? '#16a34a' : '#14532d'} />
          </mesh>
        );
      })}
      {/* Tall Shade Tree (সিরিষ গাছ) */}
      <group position={[5, 4.5, -4]}>
        <mesh position={[0, 4, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.55, 8, 8]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[0, 8.5, 0]}>
          <sphereGeometry args={[3.8, 12, 12]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
      </group>
    </group>
  );
};

// -------------------------------------------------------------
// MAIN SYLHET MAP COMPONENT
// -------------------------------------------------------------
export const SylhetMap: React.FC = () => {
  const activeMission = useGameStore((state) => state.activeMission);
  const hasPassenger = useGameStore((state) => state.hasPassenger);

  const beaconRingRef = useRef<THREE.Mesh>(null);
  const goatGroupRef = useRef<THREE.Group>(null);
  const boatRef = useRef<THREE.Group>(null);
  const goatBleatCooldown = useRef(0);
  const lastPotholeHit = useRef(0);
  const lastDistanceUpdate = useRef(0);

  // Active target checkpoint location
  const targetLocation = activeMission
    ? hasPassenger
      ? activeMission.dropoffLocation
      : activeMission.pickupLocation
    : null;

  useFrame((state, delta) => {
    // Animate destination beacon ring
    if (beaconRingRef.current) {
      beaconRingRef.current.rotation.z += delta * 1.5;
      beaconRingRef.current.position.y = 1.0 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
    }

    // Animate roaming Sylheti street goat
    if (goatGroupRef.current) {
      goatGroupRef.current.position.x = 25 + Math.sin(state.clock.elapsedTime * 0.8) * 9;
      goatGroupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) > 0 ? 0 : Math.PI;
    }

    // Animate traditional boat floating gently on Surma River
    if (boatRef.current) {
      boatRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.4) * 14;
      boatRef.current.position.y = -0.05 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
      boatRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.2) * 0.05;
    }

    const pos = vehicle3DState.position;

    // Throttled distance update to target
    if (targetLocation) {
      const dist = Math.hypot(pos.x - targetLocation.x, pos.z - targetLocation.z);
      if (state.clock.elapsedTime - lastDistanceUpdate.current > 0.25) {
        useGameStore.getState().setDistanceToTarget(dist);
        lastDistanceUpdate.current = state.clock.elapsedTime;
      }
    }

    // Check proximity to roaming goat
    if (goatGroupRef.current) {
      const goatDist = Math.hypot(pos.x - goatGroupRef.current.position.x, pos.z - goatGroupRef.current.position.z);
      if (goatDist < 6.5 && state.clock.elapsedTime - goatBleatCooldown.current > 5.5) {
        soundService.playGoatBleat();
        comedyEventBus.emit('GOAT_BLOCKING');
        goatBleatCooldown.current = state.clock.elapsedTime;
      }
    }

    // Check potholes (fixed locations near Zindabazar and Chowhatta)
    const potholes = [
      { x: -15, z: 5 },
      { x: 10, z: -18 },
      { x: 30, z: 25 },
      { x: -35, z: -20 },
    ];

    potholes.forEach((pot) => {
      const pDist = Math.hypot(pos.x - pot.x, pos.z - pot.z);
      if (pDist < 2.5 && state.clock.elapsedTime - lastPotholeHit.current > 3.0) {
        soundService.playBump();
        useGameStore.getState().addChaos(8);
        comedyEventBus.emit('POTHOLE_HIT');
        comedyEventBus.emit('CNG_BOUNCE');
        lastPotholeHit.current = state.clock.elapsedTime;
      }
    });
  });

  return (
    <group>
      {/* ---------------- GROUND TERRAIN (Lush Sylheti Tea-Garden Green) ---------------- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#5E8C3A" roughness={0.85} />
      </mesh>

      {/* ---------------- SURMA RIVER (South end of map at z = -110) ---------------- */}
      <group position={[0, -0.15, -110]}>
        {/* River Water Surface with deep shimmering blue */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[500, 56]} />
          <meshStandardMaterial
            color="#0284c7"
            roughness={0.15}
            metalness={0.3}
            transparent
            opacity={0.88}
          />
        </mesh>
        {/* River Stone Ghat Embankments */}
        <mesh position={[0, 0.25, 28]}>
          <boxGeometry args={[500, 0.7, 2.5]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[0, 0.25, -28]}>
          <boxGeometry args={[500, 0.7, 2.5]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>

        {/* Traditional Wooden Country Boat (নৌকা) floating on Surma */}
        <group ref={boatRef} position={[0, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[1.2, 1.8, 6.5, 12]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          {/* Bamboo Canopy Hood */}
          <mesh position={[0, 0.7, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.2, 1.2, 2.8, 12, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#d97706" side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>

      {/* ---------------- HISTORIC KEANE BRIDGE (কিন ব্রিজ) ---------------- */}
      <group position={[5, 0.2, -110]}>
        {/* Bridge Road Deck */}
        <mesh position={[0, 0.25, 0]} receiveShadow>
          <boxGeometry args={[15, 0.6, 62]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Iconic Red Bowstring Steel Arch Trusses */}
        {[-7.2, 7.2].map((x, idx) => (
          <group key={idx} position={[x, 1, 0]}>
            {/* Top Red Curved Arch */}
            <mesh position={[0, 5.0, 0]}>
              <cylinderGeometry args={[23, 23, 0.6, 32, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.4} />
            </mesh>
            {/* Vertical Steel Suspension Hangers */}
            {[-25, -17, -9, 0, 9, 17, 25].map((z, pIdx) => (
              <mesh key={pIdx} position={[0, 2.8, z]}>
                <cylinderGeometry args={[0.18, 0.18, 6.0, 8]} />
                <meshStandardMaterial color="#dc2626" />
              </mesh>
            ))}
          </group>
        ))}

        {/* Bridge Entrance Arch Signboard */}
        <mesh position={[0, 5.5, 30]}>
          <boxGeometry args={[14, 1.2, 0.3]} />
          <meshStandardMaterial color="#991b1b" />
        </mesh>
      </group>

      {/* ---------------- HISTORIC ALI AMJAD'S CLOCK TOWER ---------------- */}
      <AliAmjadClockTower position={[22, 0, -84]} />

      {/* ---------------- ROAD NETWORK (Asphalt with Markings) ---------------- */}
      {/* 1. Grand Avenue (Zindabazar to Keane Bridge: North-South) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -10]} receiveShadow>
        <planeGeometry args={[16, 240]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      {/* Yellow Center Dashed Lines */}
      {Array.from({ length: 24 }).map((_, i) => (
        <mesh key={`yd_${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -120 + i * 10]}>
          <planeGeometry args={[0.3, 5]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
      ))}

      {/* 2. East-West Commercial Highway (Ambarkhana to Chowhatta) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 15]} receiveShadow>
        <planeGeometry args={[260, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      {/* East-West Yellow Center Dashes */}
      {Array.from({ length: 24 }).map((_, i) => (
        <mesh
          key={`xyd_${i}`}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          position={[-120 + i * 10, 0.02, 15]}
        >
          <planeGeometry args={[0.3, 5]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
      ))}

      {/* ---------------- CHOWHATTA ROUNDABOUT & SHAHEED MINAR ---------------- */}
      {/* Mission 1 Dropoff Location at (40, -35) */}
      <group position={[40, 0, -35]}>
        {/* Circular Outer Roadway Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
          <ringGeometry args={[16, 30, 32]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Shaheed Minar Island */}
        <ChowhattaShaheedMinar position={[0, 0, 0]} />
      </group>

      {/* ---------------- ZINDABAZAR COMMERCIAL HUB ---------------- */}
      {/* Mission 1 Pickup Point at (-45, 10) */}
      {/* 1. City Centre Shopping Complex */}
      <group position={[-45, 0, 35]}>
        <mesh position={[0, 9, 0]} castShadow receiveShadow>
          <boxGeometry args={[26, 18, 28]} />
          <meshStandardMaterial color="#1e293b" metalness={0.2} />
        </mesh>
        {/* Glass Windows Facade Grid */}
        <mesh position={[0, 9, 14.1]}>
          <planeGeometry args={[22, 14]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} />
        </mesh>
        {/* Neon Billboard */}
        <mesh position={[0, 19.5, 14.2]}>
          <boxGeometry args={[20, 2.4, 0.3]} />
          <meshStandardMaterial color="#059669" emissive="#059669" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* 2. Al-Hamra Shopping City */}
      <group position={[-45, 0, -25]}>
        <mesh position={[0, 8, 0]} castShadow receiveShadow>
          <boxGeometry args={[24, 16, 26]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {/* Gold Trim Entrance Banner */}
        <mesh position={[0, 4, 13.1]}>
          <boxGeometry args={[18, 3, 0.2]} />
          <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Roadside Tea Stalls in Zindabazar */}
      <RoadsideTongStall position={[-38, 0, 10]} rotation={Math.PI / 2} />
      <RoadsideTongStall position={[-14, 0, 20]} rotation={0} />

      {/* Parked Rickshaws in Zindabazar & Chowhatta */}
      <ParkedRickshaw position={[-32, 0, 9]} rotation={0.3} />
      <ParkedRickshaw position={[-30, 0, 11]} rotation={-0.2} />
      <ParkedRickshaw position={[32, 0, -22]} rotation={1.2} />

      {/* ---------------- AMBARKHANA JUNCTION ---------------- */}
      {/* Mission 2 Pickup Point at (65, 40) */}
      <group position={[65, 0, 45]}>
        {/* Pach Bhai & Pansi Restaurant Building */}
        <mesh position={[0, 10, 0]} castShadow receiveShadow>
          <boxGeometry args={[28, 20, 24]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {/* Rooftop Satkora Biryani Neon Signboard */}
        <mesh position={[0, 21.5, 12.1]}>
          <boxGeometry args={[22, 3.2, 0.4]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.7} />
        </mesh>

        {/* Giant Iconic 7-Layer Tea (সাত রঙের চা) Roadside Billboard */}
        <group position={[-16, 0, 10]} rotation={[0, -0.4, 0]}>
          <mesh position={[0, 4, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 8, 8]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[0, 8, 0]}>
            <boxGeometry args={[8, 5, 0.3]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.3} />
          </mesh>
        </group>

        {/* Fruit & Vegetable Market Stalls */}
        {[-8, 0, 8].map((x, idx) => (
          <group key={idx} position={[x, 0, 14]}>
            <mesh position={[0, 1.2, 0]} castShadow>
              <boxGeometry args={[4.5, 2.4, 3]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            <mesh position={[0, 2.4, 0.2]} rotation={[0.2, 0, 0]}>
              <boxGeometry args={[4.8, 0.1, 3.6]} />
              <meshStandardMaterial color={idx % 2 === 0 ? '#ea580c' : '#16a34a'} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ---------------- BANDAR BAZAR WHOLESALE DISTRICT ---------------- */}
      {/* Mission 3 Pickup Point at (-25, -60) */}
      <group position={[-25, 0, -60]}>
        {/* Traditional Market Sheds */}
        <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[18, 7, 18]} />
          <meshStandardMaterial color="#57534e" />
        </mesh>
        {/* Corrugated Tin Roof */}
        <mesh position={[0, 7.2, 0]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[20, 0.2, 20]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} />
        </mesh>
        {/* Chicken Delivery Crates Stacked */}
        {[-3, 0, 3].map((x, idx) => (
          <mesh key={idx} position={[x, 0.5 + idx * 0.4, 10]} castShadow>
            <boxGeometry args={[1.6, 0.8, 1.6]} />
            <meshStandardMaterial color="#b45309" wireframe />
          </mesh>
        ))}
      </group>

      {/* ---------------- OVERHEAD BANGLA DIRECTIONAL ROAD SIGNS ---------------- */}
      <OverheadSignGantry
        position={[0, 0, 30]}
        titleBn="আম্বরখানা ও বিমানবন্দর"
        subEn="Ambarkhana & Airport"
      />
      <OverheadSignGantry
        position={[0, 0, -50]}
        titleBn="কিন ব্রিজ ও সুরমা নদী"
        subEn="Keane Bridge & Surma River"
      />

      {/* ---------------- SYLHET TEA GARDEN HILLS ---------------- */}
      {/* Northeast outskirts */}
      <TeaGardenHills position={[110, 0, 80]} />
      <TeaGardenHills position={[-110, 0, 80]} />

      {/* ---------------- ROAMING SYLHETI STREET GOAT ---------------- */}
      <group ref={goatGroupRef} position={[25, 0, 18]}>
        {/* Goat Body */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.55, 0.5, 0.9]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.85, 0.45]}>
          <boxGeometry args={[0.26, 0.32, 0.35]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        {/* Horns */}
        <mesh position={[-0.1, 1.05, 0.35]} rotation={[0.2, 0, -0.3]}>
          <cylinderGeometry args={[0.02, 0.04, 0.22, 6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.1, 1.05, 0.35]} rotation={[0.2, 0, 0.3]}>
          <cylinderGeometry args={[0.02, 0.04, 0.22, 6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Legs */}
        {[-0.2, 0.2].map((x, lx) =>
          [-0.3, 0.3].map((z, lz) => (
            <mesh key={`${lx}_${lz}`} position={[x, 0.2, z]}>
              <cylinderGeometry args={[0.04, 0.04, 0.4, 6]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          ))
        )}
      </group>

      {/* ---------------- STREET LIGHTS ALONG GRAND AVENUE ---------------- */}
      {[-8, 8].map((x, side) =>
        [-90, -50, -10, 30, 70].map((z, idx) => (
          <group key={`${side}_${idx}`} position={[x, 0, z]}>
            {/* Pole */}
            <mesh position={[0, 3.2, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.12, 6.4, 8]} />
              <meshStandardMaterial color="#334155" metalness={0.7} />
            </mesh>
            {/* Curved Arm */}
            <mesh position={[side === 0 ? 0.6 : -0.6, 6.3, 0]}>
              <boxGeometry args={[1.2, 0.08, 0.08]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            {/* Lamp Head */}
            <mesh position={[side === 0 ? 1.1 : -1.1, 6.15, 0]}>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
            <pointLight
              position={[side === 0 ? 1.1 : -1.1, 6.0, 0]}
              color="#fef08a"
              intensity={0.8}
              distance={12}
            />
          </group>
        ))
      )}

      {/* ---------------- 2. WEST CONCRETE BRIDGE (সুরমা পশ্চিম সেতু) ---------------- */}
      <group position={[-90, 0.2, -110]}>
        {/* Concrete Bridge Deck */}
        <mesh position={[0, 0.25, 0]} receiveShadow>
          <boxGeometry args={[16, 0.6, 62]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
        {/* Guardrails */}
        {[-7.8, 7.8].map((x, idx) => (
          <mesh key={idx} position={[x, 0.8, 0]}>
            <boxGeometry args={[0.3, 0.8, 62]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        ))}
        {/* Concrete Piers */}
        {[-20, 0, 20].map((z, idx) => (
          <mesh key={idx} position={[0, -2.5, z]}>
            <boxGeometry args={[14, 5.0, 3.5]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        ))}
      </group>

      {/* ---------------- 3. PROCEDURAL CNG STATIONS ---------------- */}
      {[
        { x: -35, z: 20 },
        { x: 35, z: -60 },
        { x: 0, z: -150 },
      ].map((st, idx) => (
        <group key={`cng_st_${idx}`} position={[st.x, 0, st.z]}>
          {/* Green Overhead Canopy */}
          <mesh position={[0, 4.2, 0]} castShadow>
            <boxGeometry args={[12, 0.4, 8]} />
            <meshStandardMaterial color="#1F6B3A" roughness={0.4} />
          </mesh>
          {/* Canopy Pillars */}
          {[-4.5, 4.5].map((x, pIdx) => (
            <mesh key={pIdx} position={[x, 2.1, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 4.2, 8]} />
              <meshStandardMaterial color="#F2C230" />
            </mesh>
          ))}
          {/* Refuel Pad (Player stops here for 3s to refill) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <planeGeometry args={[10, 6]} />
            <meshStandardMaterial color="#1F6B3A" />
          </mesh>
          {/* Two CNG Fuel Dispensers */}
          {[-2, 2].map((x, dIdx) => (
            <mesh key={dIdx} position={[x, 1.0, 0]} castShadow>
              <boxGeometry args={[1.0, 2.0, 0.8]} />
              <meshStandardMaterial color="#F2C230" />
            </mesh>
          ))}
          {/* Small Office Hut */}
          <mesh position={[7, 1.8, 0]} castShadow>
            <boxGeometry args={[4, 3.6, 5]} />
            <meshStandardMaterial color="#26282B" />
          </mesh>
        </group>
      ))}

      {/* ---------------- 4. POLICE CHECKPOINTS ---------------- */}
      {[
        { x: 0, z: 60 },
        { x: 40, z: -35 },
        { x: -80, z: 15 },
      ].map((cp, idx) => (
        <group key={`police_cp_${idx}`} position={[cp.x, 0, cp.z]}>
          {/* Police Shaded Stand */}
          <mesh position={[7, 1.8, 0]} castShadow>
            <boxGeometry args={[3.2, 3.6, 3.2]} />
            <meshStandardMaterial color="#1e3a8a" />
          </mesh>
          {/* Striped Checkpoint Road Barriers */}
          {[-4, 4].map((x, bIdx) => (
            <mesh key={bIdx} position={[x, 0.6, 0]} castShadow>
              <boxGeometry args={[2.5, 1.2, 0.3]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
          ))}
          {/* Pink Alert Warning Beacon Light */}
          <pointLight position={[7, 4.0, 0]} color="#ec4899" intensity={3.5} distance={15} />
          <mesh position={[7, 3.9, 0]}>
            <sphereGeometry args={[0.3, 12, 12]} />
            <meshBasicMaterial color="#ec4899" />
          </mesh>
        </group>
      ))}

      {/* ---------------- 5. SHRINE QUARTER GATE (Zone 4) ---------------- */}
      <group position={[120, 0, -80]}>
        {/* White Arched Gate */}
        <mesh position={[0, 4.5, 0]} castShadow>
          <boxGeometry args={[14, 9, 3]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Green Central Dome */}
        <mesh position={[0, 10.5, 0]}>
          <sphereGeometry args={[3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#1F6B3A" />
        </mesh>
        {/* Flanking Minarets */}
        {[-8, 8].map((x, idx) => (
          <group key={idx} position={[x, 0, 0]}>
            <mesh position={[0, 7.5, 0]} castShadow>
              <cylinderGeometry args={[0.9, 1.1, 15, 12]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
            <mesh position={[0, 15.5, 0]}>
              <coneGeometry args={[1.1, 2.5, 12]} />
              <meshStandardMaterial color="#F2C230" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ---------------- 6. UNIVERSITY & STADIUM (Zone 5) ---------------- */}
      <group position={[-130, 0, -80]}>
        {/* University Red Brick Arch Gate */}
        <mesh position={[0, 3.5, 0]} castShadow>
          <boxGeometry args={[18, 7, 2.5]} />
          <meshStandardMaterial color="#B3372B" roughness={0.8} />
        </mesh>
        {/* Stadium Oval Stand and Floodlights */}
        <group position={[-25, 0, -15]}>
          <mesh position={[0, 4, 0]}>
            <cylinderGeometry args={[25, 28, 8, 24, 1, true]} />
            <meshStandardMaterial color="#475569" side={THREE.DoubleSide} />
          </mesh>
          {/* 4 Floodlight Towers */}
          {[
            [-20, -20],
            [20, -20],
            [-20, 20],
            [20, 20],
          ].map(([fx, fz], fIdx) => (
            <group key={fIdx} position={[fx, 0, fz]}>
              <mesh position={[0, 8, 0]}>
                <cylinderGeometry args={[0.3, 0.4, 16, 6]} />
                <meshStandardMaterial color="#64748b" />
              </mesh>
              <mesh position={[0, 16.5, 0]}>
                <boxGeometry args={[3, 1.8, 0.4]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ---------------- 7. RAIL & BUS HUB (Zone 6) ---------------- */}
      <group position={[120, 0, 80]}>
        {/* Long Station Building with Platform Canopy */}
        <mesh position={[0, 4.5, 0]} castShadow>
          <boxGeometry args={[35, 9, 14]} />
          <meshStandardMaterial color="#B3372B" roughness={0.7} />
        </mesh>
        {/* Platform Canopy Roof */}
        <mesh position={[0, 9.5, 0]}>
          <boxGeometry args={[38, 0.5, 18]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} />
        </mesh>
        {/* Station Clock Tower */}
        <mesh position={[0, 14.5, 0]} castShadow>
          <boxGeometry args={[5, 11, 5]} />
          <meshStandardMaterial color="#B3372B" />
        </mesh>
        <mesh position={[0, 20.5, 0]}>
          <coneGeometry args={[3.5, 3.0, 4]} />
          <meshStandardMaterial color="#F2C230" />
        </mesh>
      </group>

      {/* ---------------- DESTINATION OBJECTIVE CHECKPOINT BEACON ---------------- */}
      {targetLocation && (
        <group position={[targetLocation.x, 0, targetLocation.z]}>
          {/* Ground Beacon Disc */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
            <ringGeometry args={[1.5, 4.0, 32]} />
            <meshBasicMaterial
              color={hasPassenger ? '#10b981' : '#f59e0b'}
              transparent
              opacity={0.65}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Floating Pulsing Beacon Ring */}
          <mesh ref={beaconRingRef} position={[0, 1.2, 0]}>
            <torusGeometry args={[2.5, 0.15, 16, 32]} />
            <meshBasicMaterial color={hasPassenger ? '#10b981' : '#facc15'} />
          </mesh>

          {/* Light Pillar */}
          <pointLight
            position={[0, 2, 0]}
            color={hasPassenger ? '#10b981' : '#f59e0b'}
            intensity={3.5}
            distance={15}
          />
        </group>
      )}
    </group>
  );
};
