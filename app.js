let isPlaying = false;
let currentSongIndex = 0;
let playlist = [];

const audioPlayer = document.getElementById('audioPlayer');
const title = document.getElementById('title');

document.getElementById('fileInput').addEventListener('change', function(event) {
    const files = event.target.files;
    if (files.length > 0) {
        playlist = Array.from(files);
        currentSongIndex = 0;
        loadSong(currentSongIndex);
    }
});

audioPlayer.addEventListener('ended', function() {
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


// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#loop