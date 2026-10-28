import React, { useEffect, useRef } from 'react';
import { vehicle3DState } from '../game/sharedVehicleState';
import { useGameStore } from '../stores/useGameStore';
import { ZONES } from '../game/config';

export const Minimap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetLocation = useGameStore((state) => {
    const mission = state.activeMission;
    if (!mission) return null;
    return state.hasPassenger ? mission.dropoffLocation : mission.pickupLocation;
  });

  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const scale = 0.35; // world units to minimap pixels

      const playerPos = vehicle3DState.position;
      const heading = vehicle3DState.headingY;

      // Clear with warm paper background
      ctx.fillStyle = '#F6F1E4';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      // Center on player and rotate with vehicle heading
      ctx.translate(cx, cy);
      ctx.rotate(heading);
      ctx.translate(-playerPos.x * scale, playerPos.z * scale);

      // 1. Draw Surma River (Runs East-West around z = -110, width ~56 -> canvasY = 110 * scale)
      ctx.fillStyle = '#9DB4C0';
      ctx.fillRect(-200, (110 - 28) * scale, 400, 56 * scale);

      // 2. Draw Bridges
      // Iron Bridge at x = 5, width 15
      ctx.fillStyle = '#F2C230';
      ctx.fillRect((5 - 7.5) * scale, (110 - 32) * scale, 15 * scale, 64 * scale);
      // West Bridge at x = -90, width 16
      ctx.fillStyle = '#26282B';
      ctx.fillRect((-90 - 8) * scale, (110 - 32) * scale, 16 * scale, 64 * scale);

      // 3. Draw Main Roads (Charcoal)
      ctx.strokeStyle = '#26282B';
      ctx.lineWidth = 14 * scale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // North-South Spine (Grand Avenue: z = -180 to 160 -> mapY = 180 to -160)
      ctx.beginPath();
      ctx.moveTo(0, 180 * scale);
      ctx.lineTo(0, -160 * scale);
      ctx.stroke();

      // East-West Commercial Highway (z = 15 -> mapY = -15)
      ctx.beginPath();
      ctx.moveTo(-160 * scale, -15 * scale);
      ctx.lineTo(160 * scale, -15 * scale);
      ctx.stroke();

      // River Bank Road (z = -70 -> mapY = 70)
      ctx.beginPath();
      ctx.moveTo(-150 * scale, 70 * scale);
      ctx.lineTo(150 * scale, 70 * scale);
      ctx.stroke();

      // Road dashes (signal yellow)
      ctx.strokeStyle = '#F2C230';
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.moveTo(0, 170 * scale);
      ctx.lineTo(0, -150 * scale);
      ctx.stroke();

      // 4. Draw Zone Centers
      Object.values(ZONES).forEach((zone) => {
        const [zx, , zz] = zone.center;
        ctx.fillStyle = zone.color;
        ctx.beginPath();
        ctx.arc(zx * scale, -zz * scale, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Draw CNG Stations (Green Squares)
      const cngStations = [
        { x: -35, z: 20 },
        { x: 35, z: -60 },
        { x: 0, z: -150 },
        { x: -100, z: -30 },
      ];
      ctx.fillStyle = '#1F6B3A';
      cngStations.forEach((st) => {
        ctx.fillRect(st.x * scale - 3, -st.z * scale - 3, 6, 6);
      });

      // 6. Draw Police Checkpoints (Pink Circles)
      const policePoints = [
        { x: 0, z: 60 },
        { x: 40, z: -35 },
        { x: -80, z: 15 },
      ];
      ctx.fillStyle = '#EC4899';
      policePoints.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x * scale, -p.z * scale, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // 7. Draw Destination Marker
      if (targetLocation) {
        ctx.fillStyle = '#DC2626';
        ctx.strokeStyle = '#F2C230';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(targetLocation.x * scale, -targetLocation.z * scale, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();

      // 8. Draw Player Arrow in the center (Fixed pointing UP)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = '#1F6B3A';
      ctx.strokeStyle = '#26282B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -9);
      ctx.lineTo(6, 7);
      ctx.lineTo(0, 4);
      ctx.lineTo(-6, 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Compass N label at top
      ctx.fillStyle = '#26282B';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('N', cx, 11);

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [targetLocation]);

  return (
    <div className="relative border-2 border-[#26282B] shadow-[3px_3px_0px_#26282B] bg-[#F6F1E4] rounded-sm overflow-hidden p-0.5">
      <canvas
        ref={canvasRef}
        width={112}
        height={112}
        className="block"
      />
      <div className="absolute bottom-0.5 left-1 text-[8px] font-black text-[#26282B] tracking-tight uppercase">
        ম্যাপ
      </div>
    </div>
  );
};
