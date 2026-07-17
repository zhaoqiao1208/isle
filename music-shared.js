// BGM disabled - hide music buttons on all pages
(function(){
  var btn = document.getElementById('isle-music-btn');
  if (btn) btn.style.display = 'none';
  var audio = document.getElementById('isle-bg-music');
  if (audio) audio.remove();
})();
