let isPlaying = false;
let currentSongIndex = 0;
let playlist = [];

const audioPlayer = document.getElementById('audioPlayer');
const title = document.getElementById('title');
const next_song = document.getElementById('next_song');
const playlist_wrapper = document.getElementById('playlist_wrapper');
const image = document.getElementById('image');
const title_amount = document.getElementById('title_amount');

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
        image.classList.remove('rotate-img');
    } else {
        audioPlayer.play();
        isPlaying = true;
        image.classList.add('rotate-img');
    }
}

function loadSong(index) {
    if (index >= 0 && index < playlist.length) {
        const file = playlist[index];
        const objectURL = URL.createObjectURL(file);
        audioPlayer.src = objectURL;
        audioPlayer.play();
        image.classList.add('rotate-img');
        isPlaying = true;
        title.innerHTML = cut_string(file.name + '', 80);

        // Zeige den nächsten Song an
        if (index < playlist.length - 1) {
            next_song.innerHTML = "Nächster Song: " + cut_string(playlist[index + 1].name, 40);
        } else {
            next_song.innerHTML = "Nächster Song: Ende der Playlist";
        }

        render_playlist(index);
        title_amount.innerHTML = show_title_number(index)
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


function render_playlist(current_song_index) {
    playlist_wrapper.innerHTML = '';
    for(let i = 0; i < playlist.length; i++) {
        let playlist_song = document.createElement('div');
        playlist_song.classList.add('playlist-title');
        if(current_song_index === i) {
            playlist_song.classList.add('current-title');
        }
        playlist_song.innerText = cut_string(playlist[i].name, 40);
        playlist_song.addEventListener('click', ()=> {
            loadSong(i);
            setTimeout(() => {
                window.scrollTo(0,0);
            }, 700);
        })
        playlist_wrapper.appendChild(playlist_song);
    }
}

function cut_string(val, max) {
    let cutted_string = '';

    for(let i = 0; i < val.length; i++) {
        if(i < max) {
            cutted_string = cutted_string + val[i];
        }else {
            cutted_string = cutted_string + '...'
            break;
        }
    }

    return cutted_string;
}

function show_title_number(current_title_index) {
    const max_titles = playlist.length;
    const current_title = current_title_index + 1;

    return `Titel: ${current_title} von ${max_titles}`;
}


// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#loop