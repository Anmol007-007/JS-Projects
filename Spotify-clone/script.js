console.log("Welcome to Spotify");
let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let currentView = 'home';
let selectedPlaylistId = null;
let navHistory = [{ view: 'home', playlistId: null }];
let historyPointer = 0;
let playQueue = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let queueIndex = 0;
let activePlaylistId = 'ncs';
let bottomBar = document.querySelector('.bottom');
let currentTimeDisplay = document.getElementById('currentTime');
let totalDurationDisplay = document.getElementById('totalDuration');
let volumeSlider = document.getElementById('volumeSlider');
let volumeIcon = document.getElementById('volumeIcon');
let shuffleBtn = document.getElementById('shuffle');
let repeatBtn = document.getElementById('repeat');
let isShuffle = false;
let isRepeat = false;
let isDragging = false;
let lastVolume = 0.8;
let songs = [
    { songName: "Warriyo - Mortals [NCS Release]", filePath: "songs/1.mp3", coverPath: "covers/1.jpg" },
    { songName: "Cielo - Huma-Huma", filePath: "songs/2.mp3", coverPath: "covers/2.jpg" },
    { songName: "DEAF KEV - Invincible [NCS Release]", filePath: "songs/3.mp3", coverPath: "covers/3.jpg" },
    { songName: "Different Heaven & EH!DE - My Heart [NCS Release]", filePath: "songs/4.mp3", coverPath: "covers/4.jpg" },
    { songName: "Janji-Heroes-Tonight-feat-Johnning [NCS Release]", filePath: "songs/5.mp3", coverPath: "covers/5.jpg" },
    { songName: "Rabba - Salam-e-Ishq", filePath: "songs/6.mp3", coverPath: "covers/6.jpg" },
    { songName: "Sakhiyaan - Salam-e-Ishq", filePath: "songs/7.mp3", coverPath: "covers/7.jpg" },
    { songName: "Bhula Dena - Salam-e-Ishq", filePath: "songs/8.mp3", coverPath: "covers/8.jpg" },
    { songName: "Tumhari Kasam - Salam-e-Ishq", filePath: "songs/9.mp3", coverPath: "covers/9.jpg" },
    { songName: "Na Jaana - Salam-e-Ishq", filePath: "songs/10.mp3", coverPath: "covers/10.jpg" },
]
const formatTime = (time) => {
    if (isNaN(time) || time === Infinity) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
const playlists = {
    ncs: {
        id: 'ncs',
        title: "Best of NCS",
        tag: "PLAYLIST",
        desc: "No Copyright Sounds - Elevate your focus with the ultimate collection.",
        cover: "covers/1.jpg",
        gradient: "#1f2a22",
        songIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
    liked: {
        id: 'liked',
        title: "Liked Songs",
        tag: "PLAYLIST",
        desc: "Your personal collection of favorite tracks.",
        cover: "covers/liked-songs.png",
        gradient: "#2c1256",
        songIndices: []
    },
    lofi: {
        id: 'lofi',
        title: "Chill Lofi Mix",
        tag: "PLAYLIST",
        desc: "Relax and study with smooth lo-fi beats.",
        cover: "covers/2.jpg",
        gradient: "#1b263b",
        songIndices: [1, 4, 7, 8]
    },
    workout: {
        id: 'workout',
        title: "Workout Beats",
        tag: "PLAYLIST",
        desc: "Power up your gym session with energetic music.",
        cover: "covers/3.jpg",
        gradient: "#581845",
        songIndices: [0, 2, 3, 6, 9]
    }
};
let likedSongIndices = [];
try {
    likedSongIndices = JSON.parse(localStorage.getItem('spotify-liked-songs')) || [];
} catch (e) {
    console.error("Failed to load liked songs from local storage", e);
}
playlists.liked.songIndices = likedSongIndices;
audioElement.volume = volumeSlider.value / 100;
const updateBottomBarArt = (index) => {
    let container = document.querySelector('.album-art-container');
    if (container) {
        container.style.backgroundImage = `url('${songs[index].coverPath}')`;
        container.style.backgroundSize = 'cover';
        container.style.backgroundPosition = 'center';
    }
}
updateBottomBarArt(songIndex);
const playSong = (index) => {
    const isNewSong = (songIndex !== index) || (audioElement.src === "");
    songIndex = index;
    if (isNewSong) {
        audioElement.src = songs[songIndex].filePath;
        audioElement.currentTime = 0;
    }
    audioElement.play()
        .then(() => {
            gif.style.opacity = 1;
            bottomBar.classList.add('playing-active');
            masterPlay.classList.remove('fa-play-circle');
            masterPlay.classList.add('fa-pause-circle');
            masterSongName.innerText = songs[songIndex].songName;
            updateBottomBarArt(songIndex);
            syncSongListUI();
        })
        .catch(err => {
            console.error("Audio play failed:", err);
        });
}
const pauseSong = () => {
    audioElement.pause();
    gif.style.opacity = 0;
    bottomBar.classList.remove('playing-active');
    masterPlay.classList.remove('fa-pause-circle');
    masterPlay.classList.add('fa-play-circle');
    syncSongListUI();
}
const syncSongListUI = () => {
    const activeSongItems = Array.from(document.querySelectorAll('.page-view:not([style*="display: none"]) .songItem'));
    activeSongItems.forEach((element) => {
        const globalIdx = parseInt(element.getAttribute('data-index'));
        const playIcon = element.querySelector('.songItemPlay');
        const heartIcon = element.querySelector('.heart-btn');
        if (heartIcon) {
            const isLiked = likedSongIndices.includes(globalIdx);
            heartIcon.className = isLiked ? "fas fa-heart heart-btn liked" : "far fa-heart heart-btn";
        }
        if (playIcon) {
            if (globalIdx === songIndex) {
                element.classList.add('playing-row');
                if (!audioElement.paused) {
                    playIcon.classList.remove('fa-play-circle');
                    playIcon.classList.add('fa-pause-circle');
                } else {
                    playIcon.classList.remove('fa-pause-circle');
                    playIcon.classList.add('fa-play-circle');
                }
            } else {
                element.classList.remove('playing-row');
                playIcon.classList.remove('fa-pause-circle');
                playIcon.classList.add('fa-play-circle');
            }
        }
    });
    const playlistPlayBtn = document.getElementById('playlist-action-play');
    if (playlistPlayBtn) {
        const icon = playlistPlayBtn.querySelector('i');
        if (icon) {
            if (activePlaylistId === selectedPlaylistId && !audioElement.paused) {
                icon.className = "fas fa-pause";
            } else {
                icon.className = "fas fa-play";
            }
        }
    }
}
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        playSong(songIndex);
    } else {
        pauseSong();
    }
});
const renderSongList = (containerElement, songIndicesToRender) => {
    if (!containerElement) return;
    containerElement.innerHTML = '';
    if (songIndicesToRender.length === 0) {
        containerElement.innerHTML = `
            <div class="empty-list-message" style="padding: 40px 16px; text-align: center; color: var(--text-secondary); font-size: 0.95rem; font-weight: 500; width: 100%;">
                <i class="far fa-heart" style="font-size: 2.2rem; margin-bottom: 12px; display: block; opacity: 0.4;"></i>
                Songs you like will appear here. Find more music in Search.
            </div>`;
        return;
    }
    songIndicesToRender.forEach((globalIdx, viewIdx) => {
        const song = songs[globalIdx];
        if (!song) return;
        const songItem = document.createElement('div');
        songItem.className = 'songItem';
        songItem.setAttribute('data-index', globalIdx);
        songItem.setAttribute('data-queue-index', viewIdx);
        songItem.innerHTML = `
            <span class="song-index-display">${viewIdx + 1}</span>
            <img src="${song.coverPath}" alt="cover">
            <span class="songName">${song.songName}</span>
            <span class="songlistplay">
                <i class="far fa-heart heart-btn" data-index="${globalIdx}"></i>
                <span class="timestamp" id="duration-${globalIdx}">0:00</span>
                <i id="${globalIdx}" class="far songItemPlay fa-play-circle"></i>
            </span>
        `;
        containerElement.appendChild(songItem);
        const tempAudio = new Audio(song.filePath);
        tempAudio.addEventListener('loadedmetadata', () => {
            const timeSpan = document.getElementById(`duration-${globalIdx}`);
            if (timeSpan) {
                timeSpan.innerText = formatTime(tempAudio.duration);
            }
        });
    });
    syncSongListUI();
}
const toggleLikeSong = (globalIndex) => {
    const idx = likedSongIndices.indexOf(globalIndex);
    if (idx === -1) {
        likedSongIndices.push(globalIndex);
    } else {
        likedSongIndices.splice(idx, 1);
    }
    localStorage.setItem('spotify-liked-songs', JSON.stringify(likedSongIndices));
    playlists.liked.songIndices = likedSongIndices;
    syncSongListUI();
    if (currentView === 'playlist-detail' && selectedPlaylistId === 'liked') {
        const songsContainer = document.getElementById('playlist-songs-container');
        renderSongList(songsContainer, playlists.liked.songIndices);
    }
    if (currentView === 'library') {
        const likedCountEl = document.getElementById('library-liked-count');
        if (likedCountEl) {
            likedCountEl.innerText = `Playlist • ${likedSongIndices.length} song${likedSongIndices.length === 1 ? '' : 's'}`;
        }
    }
}
const playPlaylist = (playlistId) => {
    const pl = playlists[playlistId];
    if (pl && pl.songIndices.length > 0) {
        playQueue = [...pl.songIndices];
        activePlaylistId = playlistId;
        playSongFromQueue(0);
    }
}
const setQueueFromContainer = (container, clickedGlobalIdx) => {
    const songRows = Array.from(container.querySelectorAll('.songItem'));
    const queueIndices = songRows.map(row => parseInt(row.getAttribute('data-index')));
    playQueue = queueIndices;
    activePlaylistId = selectedPlaylistId || 'ncs';
    const qIdx = playQueue.indexOf(clickedGlobalIdx);
    if (songIndex === clickedGlobalIdx) {
        if (audioElement.paused) {
            playSongFromQueue(qIdx);
        } else {
            pauseSong();
        }
    } else {
        playSongFromQueue(qIdx);
    }
}
const playSongFromQueue = (index) => {
    if (index < 0 || index >= playQueue.length) return;
    queueIndex = index;
    playSong(playQueue[queueIndex]);
}
const navigateTo = (viewName, playlistId = null, pushState = true) => {
    document.querySelectorAll('.page-view').forEach(view => {
        view.style.display = 'none';
    });
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.playlist-item').forEach(item => {
        item.classList.remove('active');
    });
    currentView = viewName;
    selectedPlaylistId = playlistId;
    let targetGradient = '#121212';
    if (viewName === 'home') {
        document.getElementById('home-view').style.display = 'flex';
        document.getElementById('menu-home').classList.add('active');
        document.getElementById('header-search-bar').style.display = 'none';
        targetGradient = '#1a222c';
        const hr = new Date().getHours();
        const welcomeMsg = document.getElementById('welcome-message');
        if (welcomeMsg) {
            if (hr < 12) welcomeMsg.innerText = "Good morning";
            else if (hr < 18) welcomeMsg.innerText = "Good afternoon";
            else welcomeMsg.innerText = "Good evening";
        }
    }
    else if (viewName === 'search') {
        document.getElementById('search-view').style.display = 'flex';
        document.getElementById('menu-search').classList.add('active');
        document.getElementById('header-search-bar').style.display = 'flex';
        document.getElementById('search-input').focus();
        targetGradient = '#121212';
    }
    else if (viewName === 'library') {
        document.getElementById('library-view').style.display = 'flex';
        document.getElementById('menu-library').classList.add('active');
        document.getElementById('header-search-bar').style.display = 'none';
        targetGradient = '#1c1b1f';
        const likedCountEl = document.getElementById('library-liked-count');
        if (likedCountEl) {
            likedCountEl.innerText = `Playlist • ${likedSongIndices.length} song${likedSongIndices.length === 1 ? '' : 's'}`;
        }
    }
    else if (viewName === 'playlist-detail' && playlistId) {
        const pl = playlists[playlistId];
        if (pl) {
            document.getElementById('playlist-view').style.display = 'flex';
            document.getElementById(`playlist-${playlistId}`)?.classList.add('active');
            document.getElementById('header-search-bar').style.display = 'none';
            document.getElementById('banner-playlist-title').innerText = pl.title;
            document.getElementById('banner-playlist-tag').innerText = pl.tag;
            document.getElementById('banner-playlist-desc').innerText = pl.desc;
            const banner = document.getElementById('dynamic-banner');
            if (banner) {
                if (playlistId === 'liked') {
                    banner.style.background = 'linear-gradient(transparent, rgba(18, 18, 18, 0.9)), linear-gradient(135deg, #450af5, #c4efd9)';
                } else {
                    banner.style.background = `linear-gradient(transparent, rgba(18, 18, 18, 0.9)), url('${pl.cover}')`;
                    banner.style.backgroundSize = 'cover';
                    banner.style.backgroundPosition = 'center';
                }
            }
            targetGradient = pl.gradient;
            const songsContainer = document.getElementById('playlist-songs-container');
            renderSongList(songsContainer, pl.songIndices);
        }
    }
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.background = `linear-gradient(to bottom, ${targetGradient} 0%, var(--bg-base) 40%)`;
    }
    if (pushState) {
        navHistory = navHistory.slice(0, historyPointer + 1);
        navHistory.push({ view: viewName, playlistId: playlistId });
        historyPointer = navHistory.length - 1;
    }
    updateNavButtons();
}
const updateNavButtons = () => {
    const backBtn = document.getElementById('nav-back');
    const forwardBtn = document.getElementById('nav-forward');
    if (backBtn) backBtn.disabled = (historyPointer <= 0);
    if (forwardBtn) forwardBtn.disabled = (historyPointer >= navHistory.length - 1);
}
document.querySelector('.main-content').addEventListener('click', (e) => {
    if (e.target.classList.contains('heart-btn')) {
        e.stopPropagation();
        const globalIdx = parseInt(e.target.getAttribute('data-index'));
        toggleLikeSong(globalIdx);
        return;
    }
    if (e.target.classList.contains('songItemPlay')) {
        e.stopPropagation();
        const globalIdx = parseInt(e.target.id);
        const container = e.target.closest('.songItemContainer');
        setQueueFromContainer(container, globalIdx);
        return;
    }
    const songRow = e.target.closest('.songItem');
    if (songRow) {
        const globalIdx = parseInt(songRow.getAttribute('data-index'));
        const container = songRow.closest('.songItemContainer');
        setQueueFromContainer(container, globalIdx);
        return;
    }
    const playBtn = e.target.closest('.play-card-btn, .play-shelf-btn');
    if (playBtn) {
        e.stopPropagation();
        const card = playBtn.closest('[data-playlist]');
        if (card) {
            const playlistId = card.getAttribute('data-playlist');
            playPlaylist(playlistId);
        }
        return;
    }
    const card = e.target.closest('.grid-card, .shelf-card');
    if (card) {
        const playlistId = card.getAttribute('data-playlist');
        if (playlistId) {
            navigateTo('playlist-detail', playlistId);
        }
        return;
    }
    const genreCard = e.target.closest('[data-search-genre]');
    if (genreCard) {
        const genre = genreCard.getAttribute('data-search-genre');
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = genre;
            searchInput.dispatchEvent(new Event('input'));
        }
        return;
    }
});
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        if (view) {
            navigateTo(view);
        }
    });
});
document.querySelectorAll('.playlist-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const playlistId = item.getAttribute('data-playlist');
        if (playlistId) {
            navigateTo('playlist-detail', playlistId);
        }
    });
});
document.getElementById('nav-back').addEventListener('click', () => {
    if (historyPointer > 0) {
        historyPointer--;
        const state = navHistory[historyPointer];
        navigateTo(state.view, state.playlistId, false);
    }
});
document.getElementById('nav-forward').addEventListener('click', () => {
    if (historyPointer < navHistory.length - 1) {
        historyPointer++;
        const state = navHistory[historyPointer];
        navigateTo(state.view, state.playlistId, false);
    }
});
const playlistActionPlay = document.getElementById('playlist-action-play');
if (playlistActionPlay) {
    playlistActionPlay.addEventListener('click', () => {
        if (selectedPlaylistId) {
            if (activePlaylistId === selectedPlaylistId) {
                if (audioElement.paused) {
                    audioElement.play();
                    masterPlay.classList.replace('fa-play-circle', 'fa-pause-circle');
                    gif.style.opacity = 1;
                    bottomBar.classList.add('playing-active');
                } else {
                    pauseSong();
                }
                syncSongListUI();
            } else {
                playPlaylist(selectedPlaylistId);
            }
        }
    });
}
const searchInput = document.getElementById('search-input');
const searchClearBtn = document.getElementById('search-clear-btn');
const searchResultsContainer = document.getElementById('search-results-container');
const searchResultsList = document.getElementById('search-results-list');
if (searchInput) {
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length > 0) {
            if (searchClearBtn) searchClearBtn.style.display = 'block';
            if (searchResultsContainer) searchResultsContainer.style.display = 'block';
            const matchingIndices = [];
            songs.forEach((song, index) => {
                if (song.songName.toLowerCase().includes(query)) {
                    matchingIndices.push(index);
                }
            });
            renderSongList(searchResultsList, matchingIndices);
        } else {
            if (searchClearBtn) searchClearBtn.style.display = 'none';
            if (searchResultsContainer) searchResultsContainer.style.display = 'none';
            if (searchResultsList) searchResultsList.innerHTML = '';
        }
    });
}
if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
        searchClearBtn.style.display = 'none';
        if (searchResultsContainer) searchResultsContainer.style.display = 'none';
        if (searchResultsList) searchResultsList.innerHTML = '';
    });
}
navigateTo('home', null, false);
audioElement.addEventListener('timeupdate', () => {
    if (audioElement.duration) {
        const progressPercent = (audioElement.currentTime / audioElement.duration) * 100;
        if (!isDragging) {
            myProgressBar.value = progressPercent;
            currentTimeDisplay.innerText = formatTime(audioElement.currentTime);
        }
        totalDurationDisplay.innerText = formatTime(audioElement.duration);
    }
});
myProgressBar.addEventListener('mousedown', () => { isDragging = true; });
myProgressBar.addEventListener('touchstart', () => { isDragging = true; });
myProgressBar.addEventListener('input', () => {
    if (audioElement.duration) {
        const dragTime = (myProgressBar.value / 100) * audioElement.duration;
        currentTimeDisplay.innerText = formatTime(dragTime);
    }
});
myProgressBar.addEventListener('change', () => {
    if (audioElement.duration) {
        audioElement.currentTime = (myProgressBar.value / 100) * audioElement.duration;
    }
    isDragging = false;
});
window.addEventListener('mouseup', () => { if (isDragging) isDragging = false; });
window.addEventListener('touchend', () => { if (isDragging) isDragging = false; });
const playNext = () => {
    if (playQueue.length === 0) return;
    if (isShuffle) {
        let randomQueueIndex = queueIndex;
        if (playQueue.length > 1) {
            while (randomQueueIndex === queueIndex) {
                randomQueueIndex = Math.floor(Math.random() * playQueue.length);
            }
        }
        queueIndex = randomQueueIndex;
    } else {
        queueIndex = queueIndex + 1;
        if (queueIndex >= playQueue.length) {
            queueIndex = 0;
        }
    }
    playSongFromQueue(queueIndex);
}
document.getElementById('next').addEventListener('click', playNext);
document.getElementById('previous').addEventListener('click', () => {
    if (playQueue.length === 0) return;
    queueIndex = queueIndex - 1;
    if (queueIndex < 0) {
        queueIndex = playQueue.length - 1;
    }
    playSongFromQueue(queueIndex);
});
volumeSlider.addEventListener('input', () => {
    const vol = volumeSlider.value / 100;
    audioElement.volume = vol;
    updateVolumeIcon(vol);
    if (vol > 0) {
        lastVolume = vol;
    }
});
const updateVolumeIcon = (vol) => {
    volumeIcon.className = "fas";
    if (vol === 0) {
        volumeIcon.classList.add('fa-volume-mute');
    } else if (vol < 0.5) {
        volumeIcon.classList.add('fa-volume-down');
    } else {
        volumeIcon.classList.add('fa-volume-up');
    }
}
volumeIcon.addEventListener('click', () => {
    if (audioElement.volume > 0) {
        audioElement.volume = 0;
        volumeSlider.value = 0;
        updateVolumeIcon(0);
    } else {
        audioElement.volume = lastVolume;
        volumeSlider.value = lastVolume * 100;
        updateVolumeIcon(lastVolume);
    }
});
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active-toggle', isShuffle);
});
repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active-toggle', isRepeat);
});
audioElement.addEventListener('ended', () => {
    if (isRepeat) {
        audioElement.currentTime = 0;
        audioElement.play();
    } else {
        playNext();
    }
});
audioElement.addEventListener('loadedmetadata', () => {
    totalDurationDisplay.innerText = formatTime(audioElement.duration);
});