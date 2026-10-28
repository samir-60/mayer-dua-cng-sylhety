import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../stores/useGameStore';
import { soundService } from '../services/sound.service';
import { comedyEventBus } from '../comedy/ComedyEventBus';
import { vehicle3DState } from './sharedVehicleState';

interface StreetPassengerData {
  id: string;
  nameBn: string;
  nameEn: string;
  pos: [number, number, number];
  dropoffPos: [number, number, number];
  dropoffNameBn: string;
  fareTaka: number;
}

export const PassengerNPC: React.FC = () => {
  const { activeMission, hasPassenger, setDialogueModalOpen, setPassengerPickedUp } = useGameStore();

  const armRef = useRef<THREE.Mesh>(null);
  const streetArmRefs = useRef<(THREE.Mesh | null)[]>([]);
  const markerRef = useRef<THREE.Mesh>(null);
  const dialogueTriggered = useRef(false);
  const lastInteractionTime = useRef(0);

  // Roadside street passenger pickup spots along Grand Avenue in Sylhet
  const streetPassengers: StreetPassengerData[] = useMemo(() => [
    {
      id: 'street_pass_1',
      nameBn: 'কাদের চাচা',
      nameEn: 'Kader Chacha',
      pos: [-9.5, 0, 22],
      dropoffPos: [40, 0, -35], // Chowhatta Shaheed Minar
      dropoffNameBn: 'চৌহাট্টা শহীদ মিনার',
      fareTaka: 60,
    },
    {
      id: 'street_pass_2',
      nameBn: 'সুমন ছাত্র',
      nameEn: 'Sumon Student',
      pos: [9.5, 0, -25],
      dropoffPos: [-45, 0, 35], // Zindabazar Hub
      dropoffNameBn: 'জিন্দাবাজার সিটি সেন্টার',
      fareTaka: 50,
    },
    {
      id: 'street_pass_3',
      nameBn: 'লন্ডনী চাচা',
      nameEn: 'Londoni Chacha',
      pos: [-9.5, 0, -65],
      dropoffPos: [5, 0, -110], // Keane Bridge
      dropoffNameBn: 'ঐতিহাসিক কিন ব্রিজ',
      fareTaka: 80,
    },
  ], []);

  useFrame((state, delta) => {
    // Waving arm animation
    if (armRef.current) {
      armRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 6) * 0.4 + 1.2;
    }
    streetArmRefs.current.forEach((arm) => {
      if (arm) {
        arm.rotation.z = Math.sin(state.clock.elapsedTime * 6) * 0.4 + 1.2;
      }
    });

    // Pulsing indicator marker
    if (markerRef.current) {
      markerRef.current.position.y = 2.4 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      markerRef.current.rotation.y += delta * 2;
    }

    const pos = vehicle3DState.position;
    const speed = Math.abs(vehicle3DState.speed);

    // 1. Check Active Mission Passenger Pickup
    if (activeMission && !hasPassenger) {
      const { pickupLocation } = activeMission;
      const dist = Math.hypot(pos.x - pickupLocation.x, pos.z - pickupLocation.z);

      if (dist < 6.5 && speed < 3.5 && !dialogueTriggered.current) {
        dialogueTriggered.current = true;
        soundService.playPickupChime();
        comedyEventBus.emit('PASSENGER_PICKUP');
        setDialogueModalOpen(true);
      } else if (dist > 14.0) {
        dialogueTriggered.current = false;
      }
    }

    // 2. Check Street Passenger Pickup (Available in Free Roam or between missions)
    if (!hasPassenger && state.clock.elapsedTime - lastInteractionTime.current > 3.0) {
      for (const sp of streetPassengers) {
        const dist = Math.hypot(pos.x - sp.pos[0], pos.z - sp.pos[2]);
        if (dist < 5.5 && speed < 3.0) {
          lastInteractionTime.current = state.clock.elapsedTime;
          soundService.playPickupChime();
          soundService.speakSylheti('মামা, কিন ব্রিজ যাইতায় নি? জলদি লও!', sp.nameBn, true);
          comedyEventBus.emit('PASSENGER_PICKUP');

          // Pick up street passenger
          setPassengerPickedUp(sp.fareTaka);
          useGameStore.setState({
            currentObjectiveTextBn: `যাত্রী নিয়ে ${sp.dropoffNameBn} যান`,
            currentObjectiveTextEn: `Drive passenger to ${sp.dropoffNameBn}`,
          });
          break;
        }
      }
    }
  });

  return (
    <group>
      {/* 1. Active Mission Passenger (if in mission and not yet boarded) */}
      {activeMission && !hasPassenger && (
        <group position={[activeMission.pickupLocation.x, 0, activeMission.pickupLocation.z]}>
          {/* Classic Sylheti Uncle */}
          <group position={[0, 0, 0]}>
            {/* Panjabi Torso */}
            <mesh position={[0, 0.9, 0]} castShadow>
              <boxGeometry args={[0.55, 1.2, 0.4]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
            {/* Head with beard */}
            <mesh position={[0, 1.7, 0]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color="#b45309" />
            </mesh>
            {/* Prayer Cap (Tupi) */}
            <mesh position={[0, 1.95, 0]}>
              <cylinderGeometry args={[0.18, 0.2, 0.16, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            {/* Waving Arm */}
            <mesh ref={armRef} position={[0.35, 1.3, 0]}>
              <boxGeometry args={[0.12, 0.55, 0.12]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
          </group>

          {/* Floating Exclamation Marker */}
          <mesh ref={markerRef} position={[0, 2.4, 0]}>
            <sphereGeometry args={[0.32, 16, 16]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.8} />
          </mesh>

          {/* Pickup Beacon on Ground */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
            <ringGeometry args={[1.5, 3.5, 24]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.65} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* 2. Street Passengers Waiting on Sidewalks (Visible whenever player has no passenger) */}
      {!hasPassenger &&
        streetPassengers.map((sp, idx) => (
          <group key={sp.id} position={sp.pos}>
            {/* Pedestrian Body in Colorful Panjabi */}
            <mesh position={[0, 0.85, 0]} castShadow>
              <boxGeometry args={[0.45, 1.1, 0.35]} />
              <meshStandardMaterial color={idx === 0 ? '#0284c7' : idx === 1 ? '#ea580c' : '#15803d'} />
            </mesh>
            {/* Head */}
            <mesh position={[0, 1.55, 0]}>
              <sphereGeometry args={[0.18, 12, 12]} />
              <meshStandardMaterial color="#92400e" />
            </mesh>
            {/* Cap */}
            <mesh position={[0, 1.75, 0]}>
              <cylinderGeometry args={[0.15, 0.17, 0.14, 12]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
            {/* Waving Arm to hail CNG */}
            <mesh
              ref={(el) => (streetArmRefs.current[idx] = el)}
              position={[0.3, 1.2, 0]}
            >
              <boxGeometry args={[0.1, 0.5, 0.1]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>

            {/* Glowing Golden Beacon Disc on Sidewalk */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
              <ringGeometry args={[1.0, 2.5, 16]} />
              <meshBasicMaterial color="#facc15" transparent opacity={0.6} side={THREE.DoubleSide} />
            </mesh>

            {/* Floating Pickup Pin */}
            <mesh position={[0, 2.2, 0]}>
              <sphereGeometry args={[0.22, 12, 12]} />
              <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.6} />
            </mesh>
          </group>
        ))}
    </group>
  );
};
