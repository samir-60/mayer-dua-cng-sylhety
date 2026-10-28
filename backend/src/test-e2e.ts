import assert from 'assert';

const API_BASE = 'http://localhost:5000/api';

async function runE2ETests() {
  console.log('🧪 ========================================================');
  console.log('🧪 MAYER DUA CNG SIMULATOR — INTEGRATION & E2E TESTS');
  console.log('🧪 ========================================================\n');

  // 1. Test Health Endpoint
  console.log('▶ [1/8] Testing /api/health...');
  const healthRes = await fetch(`${API_BASE}/health`);
  assert.strictEqual(healthRes.status, 200);
  const health = await healthRes.json();
  assert.strictEqual(health.status, 'ok');
  assert.strictEqual(health.game, 'MAYER DUA: FUNNY SYLHETI CNG SIMULATOR');
  console.log('✅ Health check passed!\n');

  // 2. Test Guest Session Creation
  console.log('▶ [2/8] Testing POST /api/guest-session...');
  const guestRes = await fetch(`${API_BASE}/guest-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'বদরুল টেস্ট পাইলট' }),
  });
  assert.strictEqual(guestRes.status, 200);
  const guestData = await guestRes.json();
  assert.ok(guestData.token.startsWith('guest_'));
  assert.strictEqual(guestData.player.taka, 150);
  assert.deepStrictEqual(guestData.player.unlockedMissions, ['mission_1']);
  const token = guestData.token;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  console.log(`✅ Guest session created! Player ID: ${guestData.player.id}, Token: ${token}\n`);

  // 3. Test Profile
  console.log('▶ [3/8] Testing GET /api/player/me...');
  const meRes = await fetch(`${API_BASE}/player/me`, { headers });
  assert.strictEqual(meRes.status, 200);
  const me = await meRes.json();
  assert.strictEqual(me.player.name, 'বদরুল টেস্ট পাইলট');
  console.log('✅ Player profile verified!\n');

  // 4. Test Missions Listing
  console.log('▶ [4/8] Testing GET /api/missions...');
  const missionsRes = await fetch(`${API_BASE}/missions`, { headers });
  assert.strictEqual(missionsRes.status, 200);
  const missionsData = await missionsRes.json();
  assert.strictEqual(missionsData.missions.length, 10);
  const m1 = missionsData.missions.find((m: any) => m.id === 'mission_1');
  assert.ok(m1);
  assert.strictEqual(m1.isUnlocked, true);
  assert.strictEqual(m1.isAvailableInMvp, true);
  console.log(`✅ Loaded ${missionsData.missions.length} missions (Mission 1 unlocked)!\n`);

  // 5. Test Mission Start (Anti-Cheat Token Issuance)
  console.log('▶ [5/8] Testing POST /api/missions/mission_1/start...');
  const startRes = await fetch(`${API_BASE}/missions/mission_1/start`, {
    method: 'POST',
    headers,
  });
  assert.strictEqual(startRes.status, 200);
  const startData = await startRes.json();
  assert.ok(startData.sessionToken.startsWith('ms_'));
  assert.ok(startData.challengeNonce);
  console.log(`✅ Issued server mission session: ${startData.sessionToken}\n`);

  // 6. Test Mission Completion & Automatic Satirical Newspaper Generation
  console.log('▶ [6/8] Testing POST /api/missions/mission_1/complete...');
  const completeRes = await fetch(`${API_BASE}/missions/mission_1/complete`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      sessionToken: startData.sessionToken,
      timeElapsedSeconds: 24, // realistic time > minimum bound
      chaosScore: 45,
      fareNegotiatedTaka: 50,
      damagePercent: 5,
      specialEventsTriggered: ['HORN_SPAM', 'POTHOLE_HIT'],
      completedObjectives: ['PICKUP', 'DROPOFF'],
    }),
  });
  assert.strictEqual(completeRes.status, 200);
  const completeData = await completeRes.json();
  assert.strictEqual(completeData.success, true);
  assert.ok(completeData.takaEarned > 150);
  assert.ok(completeData.newBalance > 300);
  assert.strictEqual(completeData.unlockedNextMissionId, 'mission_2');

  const newspaper = completeData.newspaper;
  assert.ok(newspaper.headlineBn);
  assert.ok(newspaper.leadArticleBn);
  assert.strictEqual(newspaper.witnesses.length, 3);
  console.log('✅ Mission validated! Reward calculated authoritatively on server.');
  console.log(`📰 Newspaper Headline Generated: "${newspaper.headlineBn}"`);
  console.log(`📰 Newspaper Witness #1: ${newspaper.witnesses[0].nameBn} (${newspaper.witnesses[0].roleBn})`);
  console.log(`🔓 Unlocked Next Mission: ${completeData.unlockedNextMissionId}\n`);

  // 7. Test Garage & Item Purchasing
  console.log('▶ [7/8] Testing GET /api/garage & POST /api/garage/purchase...');
  const garageRes = await fetch(`${API_BASE}/garage`, { headers });
  assert.strictEqual(garageRes.status, 200);
  const garage = await garageRes.json();
  assert.ok(garage.items.length >= 10);

  // Buy "১০০ হাত দূরে থাকুন" Decal (350 Tk or cheaper decal "আল্লাহ সর্বশক্তিমান" 200 Tk)
  const buyRes = await fetch(`${API_BASE}/garage/purchase`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ itemId: 'decal_allah_shorboshoktiman' }),
  });
  assert.strictEqual(buyRes.status, 200);
  const buyData = await buyRes.json();
  assert.strictEqual(buyData.success, true);
  console.log(`✅ Purchased garage decal item! New balance: ${buyData.newTaka} ৳\n`);

  // 8. Test Leaderboard Rankings
  console.log('▶ [8/8] Testing GET /api/leaderboard...');
  const lbRes = await fetch(`${API_BASE}/leaderboard`);
  assert.strictEqual(lbRes.status, 200);
  const lb = await lbRes.json();
  assert.ok(lb.leaderboard.length >= 5);
  console.log(`✅ Leaderboard active with ${lb.leaderboard.length} ranked Sylheti drivers!\n`);

  console.log('🎉 ========================================================');
  console.log('🎉 ALL 8 FULL-STACK END-TO-END TESTS PASSED WITH 100% SUCCESS!');
  console.log('🎉 ========================================================\n');
}

runE2ETests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
