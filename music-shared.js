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

// ===== Visitor mode UI restrictions =====
// Hides interactive elements on relevant pages when ?visitor=1
// NOTE: Living room (留言板) stays fully interactive — it's meant for guests to leave messages.
(function(){
  if (!ISLE_VISITOR) return;

  document.addEventListener('DOMContentLoaded', function() {
    // Kitchen: hide regen buttons and order section
    var voiceActions = document.getElementById('voice-actions');
    if (voiceActions) voiceActions.style.display = 'none';
    var orderSection = document.querySelector('.order-section');
    if (orderSection) orderSection.style.display = 'none';

    // Greenhouse: hide all action buttons (rendered dynamically)
    var potsGrid = document.getElementById('pots-grid');
    if (potsGrid) {
      var hideGreenActions = function() {
        var btns = potsGrid.querySelectorAll('.pot-btn');
        for (var i = 0; i < btns.length; i++) btns[i].style.display = 'none';
      };
      hideGreenActions();
      var obs = new MutationObserver(hideGreenActions);
      obs.observe(potsGrid, { childList: true, subtree: true });
    }

    // Bathroom: hide reply area
    var replyArea = document.getElementById('reply-area');
    if (replyArea) replyArea.style.display = 'none';

    // Add a subtle visitor badge
    var badge = document.createElement('div');
    badge.style.cssText = 'position:fixed;bottom:12px;right:12px;background:rgba(0,0,0,0.05);color:rgba(0,0,0,0.3);padding:4px 10px;border-radius:12px;font-size:10px;z-index:9999;pointer-events:none;';
    badge.textContent = '\ud83d\udc41\ufe0f \u8bbf\u5ba2\u6a21\u5f0f';
    document.body.appendChild(badge);
  });
})();
