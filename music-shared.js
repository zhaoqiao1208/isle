// Shared Isle Music Player
// Include this script + the audio tag + float button in every room page
(function(){
  var audio = document.getElementById('isle-bg-music');
  var btn = document.getElementById('isle-music-float');
  if (!audio || !btn) return;
  audio.volume = 0.35;

  var state = localStorage.getItem('isle_music_state');
  var savedTime = parseFloat(localStorage.getItem('isle_music_time') || '0');

  // Auto-resume if was playing
  if (state === 'playing') {
    audio.currentTime = savedTime;
    audio.play().then(function(){ btn.classList.add('playing'); }).catch(function(){});
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
    }
  }
  window.toggleIsleMusic = toggleIsleMusic;

  // Save progress periodically
  setInterval(function(){
    if (!audio.paused) localStorage.setItem('isle_music_time', audio.currentTime.toFixed(1));
  }, 1000);

  // Save on leave
  window.addEventListener('beforeunload', function(){
    if (!audio.paused) localStorage.setItem('isle_music_time', audio.currentTime.toFixed(1));
  });

  audio.addEventListener('pause', function(){ btn.classList.remove('playing'); });
  audio.addEventListener('play', function(){ btn.classList.add('playing'); });
})();
