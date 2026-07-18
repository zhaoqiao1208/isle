// BGM disabled - hide music buttons on all pages
(function(){
  var btn = document.getElementById('isle-music-btn');
  if (btn) btn.style.display = 'none';
  var audio = document.getElementById('isle-bg-music');
  if (audio) audio.remove();
})();

// Visitor mode detection (shared across all pages)
var ISLE_VISITOR = (new URLSearchParams(window.location.search)).get('visitor') === '1';

// Propagate visitor param to all internal links on the page
if (ISLE_VISITOR) {
  document.addEventListener('DOMContentLoaded', function() {
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      if (href && href.indexOf('http') !== 0 && href.indexOf('//') !== 0 && href.indexOf('mailto') !== 0) {
        links[i].setAttribute('href', href + (href.indexOf('?') === -1 ? '?' : '&') + 'visitor=1');
      }
    }
  });
}

// Report room visit to update status (miss -1, 1h cooldown per room).
// Visitors do NOT trigger status changes.
(function(){
  if (ISLE_VISITOR) return;
  try {
    var STATUS_API = 'https://yraoaeeayaervwjjalvn.supabase.co/functions/v1/isle-status';
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
    if (!room) return;
    fetch(STATUS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'visit_room', room: room })
    }).catch(function(e){ console.error('room visit report failed:', e); });
  } catch (e) {
    console.error('room visit report error:', e);
  }
})();
