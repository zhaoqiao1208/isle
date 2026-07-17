// Shared Isle Music Player - syncs across rooms via localStorage
(function(){
  var audio = document.getElementById('isle-bg-music');
  var btn = document.getElementById('isle-music-btn');
  if (!audio || !btn) return;
  audio.volume = 0.35;

  var state = localStorage.getItem('isle_music_state');
  var savedTime = parseFloat(localStorage.getItem('isle_music_time') || '0');

  if (state === 'playing') {
    var doSeekAndPlay = function() {
      audio.currentTime = savedTime;
      audio.play().then(function(){ btn.classList.add('playing'); }).catch(function(){});
    };

    if (audio.readyState >= 1) {
      doSeekAndPlay();
    } else {
      audio.addEventListener('loadedmetadata', function onMeta() {
        audio.removeEventListener('loadedmetadata', onMeta);
        doSeekAndPlay();
      });
      // Trigger load since preload=none
      audio.load();
    }
  }

  function toggleIsleMusic() {
    if (audio.paused) {
      audio.play().then(function(){
        btn.classList.add('playing');
        localStorage.setItem('isle_music_state', 'playing');
      }).catch(function(){});
    } else {
      audio.pause();
      btn.classList.remove('playing');
      localStorage.setItem('isle_music_state', 'paused');
      localStorage.setItem('isle_music_time', audio.currentTime.toFixed(1));
    }
  }
  window.toggleIsleMusic = toggleIsleMusic;

  setInterval(function(){
    if (!audio.paused) localStorage.setItem('isle_music_time', audio.currentTime.toFixed(1));
  }, 1000);

  window.addEventListener('beforeunload', function(){
    if (!audio.paused) localStorage.setItem('isle_music_time', audio.currentTime.toFixed(1));
  });

  audio.addEventListener('pause', function(){ btn.classList.remove('playing'); });
  audio.addEventListener('play', function(){ btn.classList.add('playing'); });
})();
