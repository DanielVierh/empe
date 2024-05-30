let isPlaying = false;
let currentSongIndex = 0;
let playlist = [];
let favorites = [];
let favorites_playlist = [];
let is_favorites_available = false;
let is_favorites_only = false;


const audioPlayer = document.getElementById('audioPlayer');
const title = document.getElementById('title');
const next_song = document.getElementById('next_song');
const playlist_wrapper = document.getElementById('playlist_wrapper');
const image = document.getElementById('image');
const title_amount = document.getElementById('title_amount');
const btn_favorite = document.getElementById('btn_favorite');
const btn_only_favorites = document.getElementById('btn_only_favorites');

//########################################
//* Init
//########################################

window.onload = init();


function init() {
    load_local_storage();
}

//########################################
//* Window Onload Load Local Storage
//########################################
function load_local_storage() {
    if (localStorage.getItem('stored_favorites') !== null) {
        try {
            favorites = JSON.parse(
                localStorage.getItem('stored_favorites'),
            );
           
        } catch (error) {
            console.log(error);
            favorites = [];
        }
    }
}

//########################################
//* Save to local Storage
//########################################
function save_into_storage() {
    localStorage.setItem('stored_favorites', JSON.stringify(favorites));
}


//########################################
//ANCHOR -  Choose files
//########################################
document.getElementById('fileInput').addEventListener('change', function (event) {
    const files = event.target.files;
    if (files.length > 0) {
        is_favorites_only = false;
        playlist = Array.from(files);
        currentSongIndex = 0;
        loadSong(currentSongIndex);
    }
});


//########################################
//ANCHOR -  Song end -> Next
//########################################
audioPlayer.addEventListener('ended', ()=> {
    isPlaying = true;
    playPause();
    nextSong();
});

//########################################
//ANCHOR - playPause
//########################################
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

//ANCHOR -  Load Song
function loadSong(index) {
    if (index >= 0 && index < playlist.length) {
        const file = playlist[index];
        const objectURL = URL.createObjectURL(file);
        audioPlayer.src = objectURL;
        audioPlayer.play();
        image.classList.add('rotate-img');
        isPlaying = true;
        title.innerHTML = cut_string(file.name + '', 80);
        const song_id = file.name + file.size;
        if(is_Favorites(song_id)) {
            btn_favorite.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
          </svg>`;
        }else {
            btn_favorite.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="grey" class="bi bi-heart-fill" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
          </svg>`;
        }

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

//ANCHOR - nextSong
function nextSong() {
    if (currentSongIndex < playlist.length - 1) {
        currentSongIndex++;
        loadSong(currentSongIndex);
    }
}

//ANCHOR - prevSong
function prevSong() {
    if (currentSongIndex > 0) {
        currentSongIndex--;
        loadSong(currentSongIndex);
    }
}


//ANCHOR - Render Func
function render_playlist(current_song_index) {
    //* Reset Values
    playlist_wrapper.innerHTML = '';
    favorites_playlist = [];
    is_favorites_available = false;
    //* Loop Titles
    for(let i = 0; i < playlist.length; i++) {
        let playlist_song = document.createElement('div');
        playlist_song.classList.add('playlist-title');
        if(current_song_index === i) {
            playlist_song.classList.add('current-title');
        }
        playlist_song.innerText = cut_string(playlist[i].name, 50);
        //* Favorite Titles
        const song_id = playlist[i].name + playlist[i].size;
        if(is_Favorites(song_id)) {
            is_favorites_available = true;
            favorites_playlist.push(i);
            playlist_song.classList.add('favorite-title');
        }
        //* Event Listener
        playlist_song.addEventListener('click', ()=> {
            loadSong(i);
            currentSongIndex = i;
            // setTimeout(() => {
            //     window.scrollTo(0,0);
            // }, 700);
        })
        playlist_wrapper.appendChild(playlist_song);
    }
    if( is_favorites_available === true && is_favorites_only === false) {
        btn_only_favorites.style.display = 'block';
    }else {
        btn_only_favorites.style.display = 'none';
    }

}

//ANCHOR - Helper func to cut string
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

//ANCHOR - Title nr
function show_title_number(current_title_index) {
    const max_titles = playlist.length;
    const current_title = current_title_index + 1;

    return `Titel: ${current_title} von ${max_titles}`;
}

//ANCHOR - 10 sec Rewind
function rewind10() {
    audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
}

//ANCHOR - 10 sec forward
function forward10() {
    audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 10);
}

//ANCHOR - Add and remove favorites
function add_as_favorite() {
    const file = playlist[currentSongIndex];
    if(file) {
        const song_id = file.name + file.size;
    //Wenn es noch nicht existiert, hinzufügen
    if(!favorites.includes(song_id)) {
        favorites.push(song_id);
        btn_favorite.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
        </svg>`;
        render_playlist(currentSongIndex);
        save_into_storage();
    }else {
        const excl_index = favorites.indexOf(song_id);
        favorites.splice(excl_index, 1);
        btn_favorite.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="grey" class="bi bi-heart-fill" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
        </svg>`;
        render_playlist(currentSongIndex);
        save_into_storage();
    }
    }
}

//ANCHOR - Check if favorite
function is_Favorites(songid) {
    try {
        for(let i = 0; i < favorites.length; i++) {
            if(favorites[i] === songid) {
                return true
                break;
            }
        }
        return
    } catch (error) {
        console.log(error);
        return
    }
}

btn_only_favorites.addEventListener('click', ()=> {
   
    let new_playlist = [];
    for(let i = 0; i < favorites_playlist.length; i++) {
        new_playlist.push(playlist[favorites_playlist[i]]);
    }
    is_favorites_only = true;
    playlist = new_playlist;
    currentSongIndex = 0;
    loadSong(currentSongIndex);
    btn_only_favorites.style.display = 'none';
})


// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#loop