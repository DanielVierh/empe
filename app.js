let isPlaying = false;
let currentSongIndex = 0;
let playlist = [];

const audioPlayer = document.getElementById('audioPlayer');
const title = document.getElementById('title');
const next_song = document.getElementById('next_song');
const playlist_wrapper = document.getElementById('playlist_wrapper');

document.getElementById('fileInput').addEventListener('change', function (event) {
    const files = event.target.files;
    if (files.length > 0) {
        playlist = Array.from(files);
        currentSongIndex = 0;
        loadSong(currentSongIndex);
    }
});

audioPlayer.addEventListener('ended', function () {
    nextSong();
});

function playPause() {
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        console.log("Pause");
    } else {
        audioPlayer.play();
        isPlaying = true;
        console.log("Play");
    }
}

function loadSong(index) {
    if (index >= 0 && index < playlist.length) {
        const file = playlist[index];
        const objectURL = URL.createObjectURL(file);
        audioPlayer.src = objectURL;
        audioPlayer.play();
        isPlaying = true;
        title.innerHTML = splitVal(file.name, '.', 0);

        // Zeige den nächsten Song an
        if (index < playlist.length - 1) {
            next_song.innerHTML = "Nächster Song: " + splitVal(playlist[index + 1].name, '.', 0);
        } else {
            next_song.innerHTML = "Nächster Song: Ende der Playlist";
        }

        render_playlist(index);
    }
}

function nextSong() {
    if (currentSongIndex < playlist.length - 1) {
        currentSongIndex++;
        loadSong(currentSongIndex);
    }
}

function prevSong() {
    if (currentSongIndex > 0) {
        currentSongIndex--;
        loadSong(currentSongIndex);
    }
}

function splitVal(val, marker, pos) {
    const elem = val.split(marker);
    return elem[pos];
}

function render_playlist(current_song_index) {
    playlist_wrapper.innerHTML = '';
    for(let i = 0; i < playlist.length; i++) {
        let playlist_song = document.createElement('div');
        playlist_song.classList.add('playlist-title');
        if(current_song_index === i) {
            playlist_song.classList.add('current-title');
        }
        playlist_song.innerText = splitVal(playlist[i].name, '.', 0);
        playlist_song.addEventListener('click', ()=> {
            loadSong(i);
            setTimeout(() => {
                window.scrollTo(0,0);
            }, 700);
        })
        playlist_wrapper.appendChild(playlist_song);
    }
}


// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#loop