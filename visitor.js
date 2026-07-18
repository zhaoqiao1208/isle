// Visitor mode UI restrictions - included AFTER page-specific scripts
// Relies on ISLE_VISITOR being set by music-shared.js
(function(){
  if (typeof ISLE_VISITOR === 'undefined' || !ISLE_VISITOR) return;

  document.addEventListener('DOMContentLoaded', function() {
    // Kitchen: hide regen buttons and order section
    var voiceActions = document.getElementById('voice-actions');
    if (voiceActions) voiceActions.style.display = 'none';
    var orderSection = document.querySelector('.order-section');
    if (orderSection) orderSection.style.display = 'none';

    // Greenhouse: hide all action buttons
    // (buttons are rendered dynamically, use MutationObserver)
    var potsGrid = document.getElementById('pots-grid');
    if (potsGrid) {
      var hideGreenActions = function() {
        var btns = potsGrid.querySelectorAll('.pot-btn');
        for (var i = 0; i < btns.length; i++) {
          var btn = btns[i];
          if (!btn.classList.contains('harvest')) { // hide all except... actually hide all
            btn.style.display = 'none';
          }
        }
        // hide all pot-btn
        var allBtns = potsGrid.querySelectorAll('.pot-btn');
        allBtns.forEach(function(b) { b.style.display = 'none'; });
      };
      hideGreenActions();
      var obs = new MutationObserver(hideGreenActions);
      obs.observe(potsGrid, { childList: true, subtree: true });
    }

    // Bathroom: hide reply area
    var replyArea = document.getElementById('reply-area');
    if (replyArea) replyArea.style.display = 'none';

    // Living: hide input area
    var inputArea = document.querySelector('.input-area');
    if (inputArea) inputArea.style.display = 'none';

    // Add a subtle visitor badge
    var badge = document.createElement('div');
    badge.style.cssText = 'position:fixed;bottom:12px;right:12px;background:rgba(0,0,0,0.05);color:rgba(0,0,0,0.3);padding:4px 10px;border-radius:12px;font-size:10px;z-index:9999;pointer-events:none;';
    badge.textContent = '\ud83d\udc41\ufe0f \u8bbf\u5ba2\u6a21\u5f0f';
    document.body.appendChild(badge);
  });
})();
