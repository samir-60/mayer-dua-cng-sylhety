import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// -------------------------------------------------------------
// 1. SYLHETI TEA STALL (টং দোকান - রঙ চা ও কলা)
// -------------------------------------------------------------
export const StreetTeaStall: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  shopNameBn?: string;
}> = ({ position, rotationY = 0, shopNameBn = 'মায়ের দোয়া লাল চা' }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Wooden Bench & Stall Counter Base */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.9, 1.6]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
      {/* Wooden Countertop */}
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[3.4, 0.08, 1.8]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>

      {/* Slanted Corrugated Tin Roof with Blue/Green Tarpaulin (পলিথিন ছাদ) */}
      <mesh position={[0, 2.2, 0.2]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[3.8, 0.08, 2.4]} />
        <meshStandardMaterial color="#0284c7" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Bamboo Corner Support Posts */}
      {[-1.5, 1.5].map((x, px) =>
        [-0.7, 0.7].map((z, pz) => (
          <mesh key={`${px}_${pz}`} position={[x, 1.1, z]}>
            <cylinderGeometry args={[0.04, 0.05, 2.2, 8]} />
            <meshStandardMaterial color="#d97706" />
          </mesh>
        ))
      )}

      {/* Big Aluminium Tea Kettle (কেতলি) with spout */}
      <group position={[-0.8, 1.15, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.25, 0.3, 0.45, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Kettle Handle */}
        <mesh position={[0, 0.3, 0]}>
          <torusGeometry args={[0.18, 0.02, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Steam Spout */}
        <mesh position={[0.25, 0.12, 0]} rotation={[0, 0, -0.6]}>
          <cylinderGeometry args={[0.04, 0.06, 0.2, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
        </mesh>
      </group>

      {/* Hanging Bunch of Yellow Bananas (কলার ছড়া) */}
      <group position={[0.6, 1.9, 0.6]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.18, 0.5, 8]} />
          <meshStandardMaterial color="#eab308" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <coneGeometry args={[0.15, 0.3, 8]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
      </group>

      {/* Glass Showcase with Biscuits & Paan Leaves */}
      <mesh position={[0.5, 1.15, 0]}>
        <boxGeometry args={[0.9, 0.4, 0.6]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.6} />
      </mesh>

      {/* Customer Bench (কাঠের টুল ও বেঞ্চ) */}
      <mesh position={[0, 0.25, 1.4]} castShadow>
        <boxGeometry args={[2.8, 0.1, 0.45]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>
      {[-1.1, 1.1].map((bx, bIdx) => (
        <mesh key={bIdx} position={[bx, 0.12, 1.4]}>
          <cylinderGeometry args={[0.04, 0.04, 0.24, 6]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
      ))}

      {/* Shop Front Signboard (হাতে আঁকা সাইনবোর্ড) */}
      <group position={[0, 2.5, 0.4]}>
        <mesh>
          <boxGeometry args={[2.6, 0.45, 0.05]} />
          <meshStandardMaterial color="#F6F1E4" />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[2.5, 0.35, 0.02]} />
          <meshStandardMaterial color="#1F6B3A" />
        </mesh>
      </group>
    </group>
  );
};

// -------------------------------------------------------------
// 2. PEDESTRIAN (সিলেটি পথচারী - মামা, ছাত্র ও যাত্রী)
// -------------------------------------------------------------
export const LowPolyPedestrian: React.FC<{
  position: [number, number, number];
  color?: string;
  hasBackpack?: boolean;
  hasLungi?: boolean;
  speed?: number;
  walkRange?: number;
}> = ({
  position,
  color = '#0284c7',
  hasBackpack = false,
  hasLungi = true,
  speed = 1.2,
  walkRange = 8.0,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * speed * 3.0;

    // Gentle back-and-forth walking along sidewalk
    groupRef.current.position.z = position[2] + Math.sin(t * 0.3) * walkRange;
    groupRef.current.rotation.y = Math.cos(t * 0.3) > 0 ? 0 : Math.PI;

    // Limb swinging animation
    const swing = Math.sin(t) * 0.45;
    if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
    if (leftArmRef.current) leftArmRef.current.rotation.x = -swing;
    if (rightArmRef.current) rightArmRef.current.rotation.x = swing;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Torso */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.38, 0.55, 0.24]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.38, 0]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>
      {/* Hair / Cap */}
      <mesh position={[0, 1.48, 0]}>
        <boxGeometry args={[0.22, 0.08, 0.22]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Backpack if student */}
      {hasBackpack && (
        <mesh position={[0, 0.95, -0.18]} castShadow>
          <boxGeometry args={[0.3, 0.4, 0.16]} />
          <meshStandardMaterial color="#b91c1c" />
        </mesh>
      )}

      {/* Legs (Lungi or Pants) */}
      {hasLungi ? (
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 0.65, 12]} />
          <meshStandardMaterial color="#047857" />
        </mesh>
      ) : (
        <>
          <mesh ref={leftLegRef} position={[-0.1, 0.35, 0]}>
            <boxGeometry args={[0.12, 0.65, 0.14]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh ref={rightLegRef} position={[0.1, 0.35, 0]}>
            <boxGeometry args={[0.12, 0.65, 0.14]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </>
      )}

      {/* Arms */}
      <mesh ref={leftArmRef} position={[-0.24, 0.92, 0]}>
        <boxGeometry args={[0.09, 0.45, 0.09]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh ref={rightArmRef} position={[0.24, 0.92, 0]}>
        <boxGeometry args={[0.09, 0.45, 0.09]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// 3. ELECTRIC POLE WITH BUNDLED WIRES (বৈদ্যুতিক তারের জটলা)
// -------------------------------------------------------------
export const StreetElectricPole: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Concrete Pole */}
      <mesh position={[0, 4.0, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.18, 8.0, 8]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} />
      </mesh>
      {/* Crossbar 1 */}
      <mesh position={[0, 7.2, 0]}>
        <boxGeometry args={[2.0, 0.08, 0.08]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      {/* Crossbar 2 */}
      <mesh position={[0, 6.4, 0]}>
        <boxGeometry args={[1.6, 0.08, 0.08]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      {/* Ceramic Insulators */}
      {[-0.8, -0.4, 0.4, 0.8].map((ix, idx) => (
        <mesh key={idx} position={[ix, 7.3, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 0.12, 6]} />
          <meshStandardMaterial color="#bae6fd" />
        </mesh>
      ))}
      {/* Tangled Wire Nest Ball (আইকনিক তারের জটলা) */}
      <mesh position={[0, 6.0, 0]}>
        <dodecahedronGeometry args={[0.35, 1]} />
        <meshStandardMaterial color="#0f172a" wireframe />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// 4. MAIN SYLHET STREET LIFE & ELEVATED ROAD NETWORK
// -------------------------------------------------------------
export const SylhetStreetLife: React.FC = () => {
  return (
    <group>
      {/* ---------------- ELEVATED SOLID ASPHALT ROADS (No Z-Fighting!) ---------------- */}
      {/* 1. Grand Avenue (North-South Main Spine: Z = -130 to +110, width 16) */}
      <mesh position={[0, 0.04, -10]} receiveShadow>
        <boxGeometry args={[16, 0.08, 240]} />
        <meshStandardMaterial color="#26282B" roughness={0.8} />
      </mesh>
      {/* Road Markings: Yellow Center Dashed Lines */}
      {Array.from({ length: 24 }).map((_, i) => (
        <mesh key={`yd_${i}`} position={[0, 0.09, -120 + i * 10]}>
          <boxGeometry args={[0.3, 0.02, 5]} />
          <meshBasicMaterial color="#F2C230" />
        </mesh>
      ))}

      {/* Raised Sidewalks along Grand Avenue */}
      {/* Left Sidewalk */}
      <mesh position={[-9.2, 0.12, -10]} receiveShadow>
        <boxGeometry args={[2.4, 0.16, 240]} />
        <meshStandardMaterial color="#64748b" roughness={0.7} />
      </mesh>
      {/* Right Sidewalk */}
      <mesh position={[9.2, 0.12, -10]} receiveShadow>
        <boxGeometry args={[2.4, 0.16, 240]} />
        <meshStandardMaterial color="#64748b" roughness={0.7} />
      </mesh>

      {/* 2. East-West Commercial Highway (Z = 15, X = -130 to +130, width 16) */}
      <mesh position={[0, 0.04, 15]} receiveShadow>
        <boxGeometry args={[260, 0.08, 16]} />
        <meshStandardMaterial color="#26282B" roughness={0.8} />
      </mesh>
      {/* East-West Yellow Dashes */}
      {Array.from({ length: 26 }).map((_, i) => (
        <mesh key={`xyd_${i}`} position={[-125 + i * 10, 0.09, 15]}>
          <boxGeometry args={[5, 0.02, 0.3]} />
          <meshBasicMaterial color="#F2C230" />
        </mesh>
      ))}

      {/* ---------------- STREET TEA STALLS (টং দোকান) ---------------- */}
      {/* Near Zindabazar Point (X = -12, Z = 25) */}
      <StreetTeaStall position={[-12, 0.12, 25]} rotationY={Math.PI / 2} shopNameBn="মায়ের দোয়া স্পেশাল চা" />
      {/* Near Chowhatta Point (X = 12, Z = -30) */}
      <StreetTeaStall position={[12, 0.12, -30]} rotationY={-Math.PI / 2} shopNameBn="সুরমা টি ক্যাফে" />
      {/* Near Keane Bridge Ghat (X = -12, Z = -75) */}
      <StreetTeaStall position={[-12, 0.12, -75]} rotationY={Math.PI / 2} shopNameBn="কিন ব্রিজ ঘাট চা স্টল" />

      {/* ---------------- ELECTRIC WIRE POLES ---------------- */}
      {[-10.5, 10.5].map((x, side) =>
        [-90, -50, -10, 30, 70].map((z, idx) => (
          <StreetElectricPole key={`pole_${side}_${idx}`} position={[x, 0, z]} />
        ))
      )}

      {/* ---------------- PEDESTRIANS WALKING ON SIDEWALKS (মানুষ ও পথচারী) ---------------- */}
      {/* Left Sidewalk Walkers */}
      <LowPolyPedestrian position={[-9.2, 0.2, 5]} color="#b91c1c" hasLungi={true} speed={1.1} />
      <LowPolyPedestrian position={[-9.2, 0.2, 35]} color="#0369a1" hasBackpack={true} hasLungi={false} speed={1.4} />
      <LowPolyPedestrian position={[-9.2, 0.2, -45]} color="#047857" hasLungi={true} speed={1.0} />
      <LowPolyPedestrian position={[-9.2, 0.2, -80]} color="#d97706" hasLungi={true} speed={1.2} />

      {/* Right Sidewalk Walkers */}
      <LowPolyPedestrian position={[9.2, 0.2, 18]} color="#7c3aed" hasLungi={false} speed={1.3} />
      <LowPolyPedestrian position={[9.2, 0.2, -15]} color="#0284c7" hasLungi={true} speed={0.9} />
      <LowPolyPedestrian position={[9.2, 0.2, -60]} color="#dc2626" hasBackpack={true} hasLungi={false} speed={1.5} />
      <LowPolyPedestrian position={[9.2, 0.2, 60]} color="#15803d" hasLungi={true} speed={1.1} />

      {/* People chatting near Tea Stall benches */}
      <group position={[-12, 0.12, 22]}>
        {/* Uncle sitting drinking tea */}
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.35, 0.45, 0.3]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.13, 10, 10]} />
          <meshStandardMaterial color="#92400e" />
        </mesh>
        {/* Tea glass in hand */}
        <mesh position={[0.2, 0.6, 0.2]}>
          <cylinderGeometry args={[0.03, 0.02, 0.08, 6]} />
          <meshStandardMaterial color="#ef4444" transparent opacity={0.8} />
        </mesh>
      </group>
    </group>
  );
};
