// Isle Global Music Player
// Persists playback state across page navigations via localStorage

const MUSIC_SRC = 'https://yraoaeeayaervwjjalvn.supabase.co/storage/v1/object/public/music/a-thousand-years.mp3';
const LS_PLAYING = 'isle_music_playing';
const LS_TIME = 'isle_music_time';

let isleMusicAudio = null;
let isleMusicPlaying = false;

function isleMusicInit() {
  isleMusicAudio = document.getElementById('isle-music');
  if (!isleMusicAudio) {
    isleMusicAudio = document.createElement('audio');
    isleMusicAudio.id = 'isle-music';
    isleMusicAudio.loop = true;
    isleMusicAudio.preload = 'none';
    isleMusicAudio.crossOrigin = 'anonymous';
    isleMusicAudio.src = MUSIC_SRC;
    document.body.appendChild(isleMusicAudio);
  }
  isleMusicAudio.volume = 0.35;

  // Restore state
  const wasPlaying = localStorage.getItem(LS_PLAYING) === 'true';
  const savedTime = parseFloat(localStorage.getItem(LS_TIME) || '0');

  if (wasPlaying) {
    isleMusicAudio.currentTime = savedTime;
    isleMusicAudio.play().then(() => {
      isleMusicPlaying = true;
      isleMusicUpdateUI(true);
    }).catch(() => {
      // Autoplay blocked, need user interaction
      isleMusicPlaying = false;
      isleMusicUpdateUI(false);
    });
  }

  // Save progress periodically
  setInterval(() => {
    if (!isleMusicAudio.paused) {
      localStorage.setItem(LS_TIME, isleMusicAudio.currentTime.toString());
    }
  }, 2000);

  // Save before leaving page
  window.addEventListener('beforeunload', () => {
    if (!isleMusicAudio.paused) {
      localStorage.setItem(LS_TIME, isleMusicAudio.currentTime.toString());
    }
  });

  isleMusicAudio.addEventListener('pause', () => {
    isleMusicPlaying = false;
    isleMusicUpdateUI(false);
  });

  isleMusicAudio.addEventListener('play', () => {
    isleMusicPlaying = true;
    isleMusicUpdateUI(true);
  });
}

function isleMusicToggle() {
  if (!isleMusicAudio) return;
  if (isleMusicAudio.paused) {
    isleMusicAudio.play().then(() => {
      localStorage.setItem(LS_PLAYING, 'true');
    }).catch(() => {});
  } else {
    isleMusicAudio.pause();
    localStorage.setItem(LS_PLAYING, 'false');
  }
}

function isleMusicUpdateUI(playing) {
  // Update any play button on the page
  const btn = document.getElementById('music-btn');
  const bar = document.getElementById('music-bar');
  if (btn) {
    btn.classList.toggle('playing', playing);
  }
  if (bar) {
    bar.classList.toggle('playing', playing);
  }
  // Mini button for sub-pages
  const mini = document.getElementById('music-mini-btn');
  if (mini) {
    mini.classList.toggle('playing', playing);
  }
}

// Auto-init when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', isleMusicInit);
} else {
  isleMusicInit();
}
