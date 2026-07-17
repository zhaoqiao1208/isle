// Shared Isle Music Player - syncs across rooms via localStorage
(function(){
  var audio = document.getElementById('isle-bg-music');
  var btn = document.getElementById('isle-music-btn');
  if (!audio || !btn) return;
  audio.volume = 0.35;

  function saveTime() {
    if (!audio.paused && isFinite(audio.currentTime)) {
      localStorage.setItem('isle_music_time', audio.currentTime.toFixed(1));
    }
  }

  var state = localStorage.getItem('isle_music_state');
  var savedTime = parseFloat(localStorage.getItem('isle_music_time') || '0');

  if (state === 'playing') {
    var doSeekAndPlay = function() {
      // Re-read in case it was updated between script start and metadata load
      var t = parseFloat(localStorage.getItem('isle_music_time') || '0');
      if (isFinite(t) && t > 0) audio.currentTime = t;
      audio.play().then(function(){ btn.classList.add('playing'); }).catch(function(){});
    };

    if (audio.readyState >= 1) {
      doSeekAndPlay();
    } else {
      audio.addEventListener('loadedmetadata', function onMeta() {
        audio.removeEventListener('loadedmetadata', onMeta);
        doSeekAndPlay();
      });
      audio.load();
    }
  }

  function toggleIsleMusic() {
    if (audio.paused) {
      // Re-read saved time for fresh seek
      var t = parseFloat(localStorage.getItem('isle_music_time') || '0');
      if (isFinite(t) && t > 0 && audio.readyState >= 1) {
        audio.currentTime = t;
      }
      audio.play().then(function(){
        btn.classList.add('playing');
        localStorage.setItem('isle_music_state', 'playing');
      }).catch(function(){});
    } else {
      audio.pause();
      btn.classList.remove('playing');
      localStorage.setItem('isle_music_state', 'paused');
      saveTime();
    }
  }
  window.toggleIsleMusic = toggleIsleMusic;

  // Save time on every playback position update (most reliable)
  audio.addEventListener('timeupdate', saveTime);

  // Save on page hide (mobile-friendly alternative to beforeunload)
  window.addEventListener('pagehide', saveTime);
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') saveTime();
  });
  window.addEventListener('beforeunload', saveTime);

  // Intercept all link clicks to save time before navigation
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href]');
    if (link && !link.getAttribute('href').startsWith('#')) {
      saveTime();
    }
  });

  audio.addEventListener('pause', function(){ btn.classList.remove('playing'); });
  audio.addEventListener('play', function(){ btn.classList.add('playing'); });
})();
