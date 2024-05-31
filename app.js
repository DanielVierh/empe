let isPlaying = false;
let currentSongIndex = 0;
let playlist = [];
let favorites = [];
let favorites_playlist = [];
let is_favorites_available = false;
let is_favorites_only = false;


const audioPlayer = document.getElementById('audioPlayer');
const btn_play_pause = document.getElementById('btn_play_pause');
const title = document.getElementById('title');
const next_song = document.getElementById('next_song');
const playlist_wrapper = document.getElementById('playlist_wrapper');
const image = document.getElementById('image');
const title_amount = document.getElementById('title_amount');
const btn_favorite = document.getElementById('btn_favorite');
const btn_only_favorites = document.getElementById('btn_only_favorites');
const theme_minimal = document.getElementById('theme_minimal');
const r = document.querySelector(':root');
const theme_mint = document.getElementById('theme_mint');

const playButton = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="black" class="bi bi-pause-fill" viewBox="0 0 16 16">
<path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/>
</svg>`
const pauseButton = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="black" class="bi bi-play-fill" viewBox="0 0 16 16">
<path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
</svg>`;
const red_heart = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
</svg>`;
const grey_heart = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="grey" class="bi bi-heart-fill" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
</svg>`;


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
        btn_play_pause.innerHTML = pauseButton;
    } else {
        audioPlayer.play();
        isPlaying = true;
        image.classList.add('rotate-img');
        btn_play_pause.innerHTML = playButton;
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
        isPlaying = false;
        playPause();
        title.innerHTML = cut_string(file.name + '', 70);
        const song_id = file.name + file.size;
        if(is_Favorites(song_id)) {
            btn_favorite.innerHTML = red_heart;
        }else {
            btn_favorite.innerHTML = grey_heart;
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
        btn_favorite.innerHTML = red_heart;
        render_playlist(currentSongIndex);
        save_into_storage();
    }else {
        const excl_index = favorites.indexOf(song_id);
        favorites.splice(excl_index, 1);
        btn_favorite.innerHTML = grey_heart;
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

//ANCHOR - Set Themes

theme_teal.addEventListener('click', ()=> {
    set_Theme('rgba(5, 19, 44, 0.856)', 
    'aqua', 
    'teal', 
    'rgba(0, 128, 128, 0.324)')
})

theme_dark.addEventListener('click', ()=> {
    set_Theme('rgba(5, 5, 5, 0.856)', 
    'white', 
    'grey', 
    'rgba(239, 243, 243, 0.324)')
})

theme_white.addEventListener('click', ()=> {
    set_Theme('white', 
    'black', 
    'white', 
    'rgba(199, 199, 199, 0.324)')
})

theme_minimal.addEventListener('click', ()=> {
    set_Theme('black', 
    'rgb(111, 109, 109)', 
    'white', 
    'rgba(255, 255, 255, 0.324)')
})

theme_blue.addEventListener('click', ()=> {
    set_Theme('rgb(13, 96, 180)', 
    'rgb(254, 254, 254)', 
    'rgb(12, 21, 208)', 
    'rgb(11, 192, 248)')
})

theme_green.addEventListener('click', ()=> {
    set_Theme('rgba(50, 180, 3, 1)', 
    'rgb(155, 248, 145)', 
    'rgb(45, 237, 20)', 
    'rgba(254, 254, 254, 0.324)')
})

theme_mint.addEventListener('click', ()=> {
    set_Theme('rgba(5, 5, 5, 0.856)', 
    'rgb(3, 216, 67)', 
    'rgb(7, 64, 4)', 
    'rgba(20, 97, 18, 0.882)')
})



//* Set Theme
function set_Theme(main, secondary, tertiary, buttons) {
    r.style.setProperty('--main-bg-color', main);
    r.style.setProperty('--secondary-color', secondary);
    r.style.setProperty('--tertiary-color', tertiary);
    r.style.setProperty('--button-color', buttons);
}