// BGM disabled - hide music buttons on all pages
(function(){
  var btn = document.getElementById('isle-music-btn');
  if (btn) btn.style.display = 'none';
  var audio = document.getElementById('isle-bg-music');
  if (audio) audio.remove();
})();

// Report room visit to update 江屿's 想念 status (miss -1, 1h cooldown per room, handled server-side).
(function(){
  try {
    var STATUS_API = 'https://yraoaeeayaervwjjalvn.supabase.co/functions/v1/isle-status';
    // Map current page filename to a room id recognized by the isle-status function.
    var path = (location.pathname || '').toLowerCase();
    var ROOM_MAP = {
      'bedroom': 'bedroom',
      'living': 'living',
      'kitchen': 'kitchen',
      'study': 'study',
      'bathroom': 'bathroom',
      'greenhouse': 'greenhouse'
    };
    var room = null;
    for (var key in ROOM_MAP) {
      if (path.indexOf(key) !== -1) { room = ROOM_MAP[key]; break; }
    }
    if (!room) return; // not a known room page, skip
    fetch(STATUS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'visit_room', room: room })
    }).catch(function(e){ console.error('room visit report failed:', e); });
  } catch (e) {
    console.error('room visit report error:', e);
  }
})();
