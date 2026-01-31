let isPlaying = false;
let currentSongIndex = 0;
let playlist = [];
let favorites = [];
let favorites_playlist = [];
let is_favorites_available = false;
let is_favorites_only = false;
let current_Theme = "theme_dark";

const titleCollator = new Intl.Collator("de", {
  numeric: true,
  sensitivity: "base",
});

function getSortableTitle(fileName) {
  return (fileName ?? "")
    .toString()
    .replace(/\.[^/.]+$/, "")
    .trim();
}

function sortPlaylistByTitleAsc(files) {
  return files.sort((a, b) => {
    const aTitle = getSortableTitle(a?.name);
    const bTitle = getSortableTitle(b?.name);

    const byTitle = titleCollator.compare(aTitle, bTitle);
    if (byTitle !== 0) return byTitle;

    const byFullName = titleCollator.compare(a?.name ?? "", b?.name ?? "");
    if (byFullName !== 0) return byFullName;

    return (a?.size ?? 0) - (b?.size ?? 0);
  });
}

const audioPlayer = document.getElementById("audioPlayer");
const btn_play_pause = document.getElementById("btn_play_pause");
const title = document.getElementById("title");
const next_song = document.getElementById("next_song");
const playlist_wrapper = document.getElementById("playlist_wrapper");
const image = document.getElementById("image");
const title_amount = document.getElementById("title_amount");
const btn_favorite = document.getElementById("btn_favorite");
const btn_only_favorites = document.getElementById("btn_only_favorites");
const r = document.querySelector(":root");

const theme_teal = document.getElementById("theme_teal");
const theme_dark = document.getElementById("theme_dark");
const theme_white = document.getElementById("theme_white");
const theme_green = document.getElementById("theme_green");
const theme_minimal = document.getElementById("theme_minimal");
const theme_blue = document.getElementById("theme_blue");
const theme_mint = document.getElementById("theme_mint");

const theme_blush = document.getElementById("theme_blush");
const theme_carbon = document.getElementById("theme_carbon");
const theme_navy = document.getElementById("theme_navy");
const theme_ember = document.getElementById("theme_ember");
const theme_forest = document.getElementById("theme_forest");
const theme_ice = document.getElementById("theme_ice");

const theme_solar = document.getElementById("theme_solar");
const theme_violet = document.getElementById("theme_violet");
const theme_synth = document.getElementById("theme_synth");
const theme_sand = document.getElementById("theme_sand");
const theme_copper = document.getElementById("theme_copper");
const theme_aurora = document.getElementById("theme_aurora");
const theme_matrix = document.getElementById("theme_matrix");
const theme_royal = document.getElementById("theme_royal");
const theme_crimson = document.getElementById("theme_crimson");
const theme_steel = document.getElementById("theme_steel");

const playButton = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="black" class="bi bi-pause-fill" viewBox="0 0 16 16">
<path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/>
</svg>`;
const pauseButton = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="black" class="bi bi-play-fill" viewBox="0 0 16 16">
<path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
</svg>`;
const red_heart = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
</svg>`;
const grey_heart = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="grey" class="bi bi-heart-fill" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
</svg>`;

class Theme {
  static set_light_Theme() {
    r.style.setProperty("--main-bg-color", "white");
    r.style.setProperty("--secondary-color", "black");
    r.style.setProperty("--tertiary-color", "white");
    r.style.setProperty("--button-color", "rgba(199, 199, 199, 0.324)");
  }

  static set_Teal_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(5, 19, 44, 0.856)");
    r.style.setProperty("--secondary-color", "aqua");
    r.style.setProperty("--tertiary-color", "teal");
    r.style.setProperty("--button-color", "rgba(0, 128, 128, 0.324)");
  }
  static set_dark_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(5, 5, 5, 0.856)");
    r.style.setProperty("--secondary-color", "white");
    r.style.setProperty("--tertiary-color", "grey");
    r.style.setProperty("--button-color", "rgba(239, 243, 243, 0.324)");
  }
  static set_minimal_Theme() {
    r.style.setProperty("--main-bg-color", "black");
    r.style.setProperty("--secondary-color", "rgb(111, 109, 109)");
    r.style.setProperty("--tertiary-color", "white");
    r.style.setProperty("--button-color", "rgba(255, 255, 255, 0.324)");
  }
  static set_blue_Theme() {
    r.style.setProperty("--main-bg-color", "rgb(13, 96, 180)");
    r.style.setProperty("--secondary-color", "rgb(254, 254, 254)");
    r.style.setProperty("--tertiary-color", "rgb(12, 21, 208)");
    r.style.setProperty("--button-color", "rgb(11, 192, 248)");
  }
  static set_green_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(50, 180, 3, 1)");
    r.style.setProperty("--secondary-color", "rgb(155, 248, 145)");
    r.style.setProperty("--tertiary-color", "rgb(45, 237, 20)");
    r.style.setProperty("--button-color", "rgba(254, 254, 254, 0.324)");
  }
  static set_mint_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(5, 5, 5, 0.856)");
    r.style.setProperty("--secondary-color", "rgb(3, 216, 67)");
    r.style.setProperty("--tertiary-color", "rgb(7, 64, 4)");
    r.style.setProperty("--button-color", "rgba(20, 97, 18, 0.882)");
  }

  // Femininer Look: Rosé/Neon-Pink auf dunklem Plum
  static set_blush_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(27, 8, 18, 0.90)");
    r.style.setProperty("--secondary-color", "rgb(255, 244, 250)");
    r.style.setProperty("--tertiary-color", "rgb(255, 77, 181)");
    r.style.setProperty("--button-color", "rgba(255, 77, 181, 0.22)");
  }

  // Maskuline Farbschemata
  static set_carbon_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(8, 10, 13, 0.92)");
    r.style.setProperty("--secondary-color", "rgb(236, 243, 255)");
    r.style.setProperty("--tertiary-color", "rgb(0, 229, 255)");
    r.style.setProperty("--button-color", "rgba(0, 229, 255, 0.18)");
  }

  static set_navy_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(5, 14, 35, 0.92)");
    r.style.setProperty("--secondary-color", "rgb(235, 244, 255)");
    r.style.setProperty("--tertiary-color", "rgb(64, 140, 255)");
    r.style.setProperty("--button-color", "rgba(64, 140, 255, 0.18)");
  }

  static set_ember_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(12, 6, 4, 0.92)");
    r.style.setProperty("--secondary-color", "rgb(255, 243, 235)");
    r.style.setProperty("--tertiary-color", "rgb(255, 120, 40)");
    r.style.setProperty("--button-color", "rgba(255, 120, 40, 0.20)");
  }

  static set_forest_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(6, 16, 10, 0.92)");
    r.style.setProperty("--secondary-color", "rgb(235, 255, 244)");
    r.style.setProperty("--tertiary-color", "rgb(0, 214, 120)");
    r.style.setProperty("--button-color", "rgba(0, 214, 120, 0.18)");
  }

  static set_ice_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(6, 10, 18, 0.92)");
    r.style.setProperty("--secondary-color", "rgb(235, 250, 255)");
    r.style.setProperty("--tertiary-color", "rgb(120, 255, 246)");
    r.style.setProperty("--button-color", "rgba(120, 255, 246, 0.16)");
  }

  // Weitere Themes
  static set_solar_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(16, 10, 2, 0.92)");
    r.style.setProperty("--secondary-color", "rgb(255, 245, 230)");
    r.style.setProperty("--tertiary-color", "rgb(255, 200, 0)");
    r.style.setProperty("--button-color", "rgba(255, 200, 0, 0.20)");
  }

  static set_violet_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(12, 6, 20, 0.92)");
    r.style.setProperty("--secondary-color", "rgb(244, 240, 255)");
    r.style.setProperty("--tertiary-color", "rgb(170, 120, 255)");
    r.style.setProperty("--button-color", "rgba(170, 120, 255, 0.18)");
  }

  static set_synth_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(7, 6, 18, 0.92)");
    r.style.setProperty("--secondary-color", "rgb(246, 246, 255)");
    r.style.setProperty("--tertiary-color", "rgb(255, 60, 220)");
    r.style.setProperty("--button-color", "rgba(255, 60, 220, 0.18)");
  }

  static set_sand_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(18, 13, 7, 0.92)");
    r.style.setProperty("--secondary-color", "rgb(255, 246, 235)");
    r.style.setProperty("--tertiary-color", "rgb(255, 164, 74)");
    r.style.setProperty("--button-color", "rgba(255, 164, 74, 0.18)");
  }

  static set_copper_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(12, 8, 7, 0.92)");
    r.style.setProperty("--secondary-color", "rgb(255, 245, 240)");
    r.style.setProperty("--tertiary-color", "rgb(200, 105, 60)");
    r.style.setProperty("--button-color", "rgba(200, 105, 60, 0.20)");
  }

  static set_aurora_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(4, 12, 18, 0.92)");
    r.style.setProperty("--secondary-color", "rgb(230, 250, 255)");
    r.style.setProperty("--tertiary-color", "rgb(0, 255, 170)");
    r.style.setProperty("--button-color", "rgba(0, 255, 170, 0.16)");
  }

  static set_matrix_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(0, 7, 2, 0.94)");
    r.style.setProperty("--secondary-color", "rgb(211, 255, 226)");
    r.style.setProperty("--tertiary-color", "rgb(0, 255, 80)");
    r.style.setProperty("--button-color", "rgba(0, 255, 80, 0.16)");
  }

  static set_royal_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(9, 8, 24, 0.92)");
    r.style.setProperty("--secondary-color", "rgb(245, 244, 255)");
    r.style.setProperty("--tertiary-color", "rgb(90, 70, 255)");
    r.style.setProperty("--button-color", "rgba(90, 70, 255, 0.18)");
  }

  static set_crimson_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(14, 5, 6, 0.92)");
    r.style.setProperty("--secondary-color", "rgb(255, 238, 240)");
    r.style.setProperty("--tertiary-color", "rgb(255, 55, 80)");
    r.style.setProperty("--button-color", "rgba(255, 55, 80, 0.18)");
  }

  static set_steel_Theme() {
    r.style.setProperty("--main-bg-color", "rgba(7, 12, 16, 0.92)");
    r.style.setProperty("--secondary-color", "rgb(235, 245, 255)");
    r.style.setProperty("--tertiary-color", "rgb(155, 190, 255)");
    r.style.setProperty("--button-color", "rgba(155, 190, 255, 0.16)");
  }
  static set_XXXXXXX_Theme() {
    r.style.setProperty("--main-bg-color", "XXXX");
    r.style.setProperty("--secondary-color", "XXXX");
    r.style.setProperty("--tertiary-color", "XXXXX");
    r.style.setProperty("--button-color", "XXXX");
  }
}

//########################################
//* Init
//########################################

window.onload = init();

function init() {
  load_local_storage();

  // Stellt sicher, dass (auch ohne stored Theme) ein Theme angewendet
  // und der aktive Button markiert wird.
  check_Theme();
  setActiveThemeButton(current_Theme);
}

function setActiveThemeButton(themeId) {
  const buttons = document.querySelectorAll(".theme-btn");
  buttons.forEach((btn) => {
    btn.classList.remove("is-active");
    btn.setAttribute("aria-pressed", "false");
  });

  const active = document.getElementById(themeId);
  if (active) {
    active.classList.add("is-active");
    active.setAttribute("aria-pressed", "true");
  }
}

//########################################
//* Window Onload Load Local Storage
//########################################
function load_local_storage() {
  if (localStorage.getItem("stored_favorites") !== null) {
    try {
      favorites = JSON.parse(localStorage.getItem("stored_favorites"));
    } catch (error) {
      console.log(error);
      favorites = [];
    }
  }
  if (localStorage.getItem("stored_Empe_Theme") !== null) {
    try {
      current_Theme = JSON.parse(localStorage.getItem("stored_Empe_Theme"));
      check_Theme();
    } catch (error) {
      console.log(error);
      current_Theme = "theme_dark";
    }
  }
}

//########################################
//* Save to local Storage
//########################################
function save_into_storage() {
  localStorage.setItem("stored_favorites", JSON.stringify(favorites));
  localStorage.setItem("stored_Empe_Theme", JSON.stringify(current_Theme));
}

//########################################
//ANCHOR -  Choose files
//########################################
document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const files = event.target.files;
    if (files.length > 0) {
      is_favorites_only = false;
      playlist = sortPlaylistByTitleAsc(Array.from(files));
      currentSongIndex = 0;
      loadSong(currentSongIndex);
    }
  });

//########################################
//ANCHOR -  Song end -> Next
//########################################
audioPlayer.addEventListener("ended", () => {
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
    image.classList.remove("rotate-img");
    btn_play_pause.innerHTML = pauseButton;
  } else {
    audioPlayer.play();
    isPlaying = true;
    image.classList.add("rotate-img");
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
    image.classList.add("rotate-img");
    isPlaying = false;
    playPause();
    title.innerHTML = cut_string(file.name + "", 70);
    document.title = cut_string(file.name + "", 70);
    const song_id = file.name + file.size;
    if (is_Favorites(song_id)) {
      btn_favorite.innerHTML = red_heart;
    } else {
      btn_favorite.innerHTML = grey_heart;
    }

    // Zeige den nächsten Song an
    if (index < playlist.length - 1) {
      next_song.innerHTML =
        "Nächster Song: " + cut_string(playlist[index + 1].name, 40);
    } else {
      next_song.innerHTML = "Nächster Song: Ende der Playlist";
    }

    render_playlist(index);
    title_amount.innerHTML = show_title_number(index);

    // Aktualisiere die Media Session
    updateMediaSession();
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
  playlist_wrapper.innerHTML = "";
  favorites_playlist = [];
  is_favorites_available = false;
  //* Loop Titles
  for (let i = 0; i < playlist.length; i++) {
    let playlist_song = document.createElement("div");
    playlist_song.classList.add("playlist-title");
    if (current_song_index === i) {
      playlist_song.classList.add("current-title");
    }
    playlist_song.innerText = cut_string(playlist[i].name, 50);
    //* Favorite Titles
    const song_id = playlist[i].name + playlist[i].size;
    if (is_Favorites(song_id)) {
      is_favorites_available = true;
      favorites_playlist.push(i);
      playlist_song.classList.add("favorite-title");
    }
    //* Event Listener
    playlist_song.addEventListener("click", () => {
      loadSong(i);
      currentSongIndex = i;
      // setTimeout(() => {
      //     window.scrollTo(0,0);
      // }, 700);
    });
    playlist_wrapper.appendChild(playlist_song);
  }
  if (is_favorites_available === true && is_favorites_only === false) {
    btn_only_favorites.style.display = "block";
  } else {
    btn_only_favorites.style.display = "none";
  }
}

//ANCHOR - Helper func to cut string
function cut_string(val, max) {
  let cutted_string = "";

  for (let i = 0; i < val.length; i++) {
    if (i < max) {
      cutted_string = cutted_string + val[i];
    } else {
      cutted_string = cutted_string + "...";
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
  audioPlayer.currentTime = Math.min(
    audioPlayer.duration,
    audioPlayer.currentTime + 10,
  );
}

//ANCHOR - Add and remove favorites
function add_as_favorite() {
  const file = playlist[currentSongIndex];
  if (file) {
    const song_id = file.name + file.size;
    //Wenn es noch nicht existiert, hinzufügen
    if (!favorites.includes(song_id)) {
      favorites.push(song_id);
      btn_favorite.innerHTML = red_heart;
      render_playlist(currentSongIndex);
      save_into_storage();
    } else {
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
    for (let i = 0; i < favorites.length; i++) {
      if (favorites[i] === songid) {
        return true;
        break;
      }
    }
    return;
  } catch (error) {
    console.log(error);
    return;
  }
}

btn_only_favorites.addEventListener("click", () => {
  let new_playlist = [];
  for (let i = 0; i < favorites_playlist.length; i++) {
    new_playlist.push(playlist[favorites_playlist[i]]);
  }
  is_favorites_only = true;
  playlist = sortPlaylistByTitleAsc(new_playlist);
  currentSongIndex = 0;
  loadSong(currentSongIndex);
  btn_only_favorites.style.display = "none";
});

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#loop

//ANCHOR - Set Themes

// Markiere bei jedem Klick den aktiven Theme-Button (ohne alle einzelnen
// Theme-Handler dupliziert anfassen zu müssen).
document.addEventListener("click", (event) => {
  const themeButton = event.target?.closest?.(".theme-btn");
  if (!themeButton || !themeButton.id) return;
  setActiveThemeButton(themeButton.id);
});

theme_teal.addEventListener("click", () => {
  Theme.set_Teal_Theme();
  current_Theme = "theme_teal";
  save_into_storage();
});

theme_dark.addEventListener("click", () => {
  Theme.set_dark_Theme();
  current_Theme = "theme_dark";
  save_into_storage();
});

theme_white.addEventListener("click", () => {
  Theme.set_light_Theme();
  current_Theme = "theme_white";
  save_into_storage();
});

theme_minimal.addEventListener("click", () => {
  Theme.set_minimal_Theme();
  current_Theme = "theme_minimal";
  save_into_storage();
});

theme_blue.addEventListener("click", () => {
  Theme.set_blue_Theme();
  current_Theme = "theme_blue";
  save_into_storage();
});

theme_green.addEventListener("click", () => {
  Theme.set_green_Theme();
  current_Theme = "theme_green";
  save_into_storage();
});

theme_mint.addEventListener("click", () => {
  Theme.set_mint_Theme();
  current_Theme = "theme_mint";
  save_into_storage();
});

theme_blush.addEventListener("click", () => {
  Theme.set_blush_Theme();
  current_Theme = "theme_blush";
  save_into_storage();
});

theme_carbon.addEventListener("click", () => {
  Theme.set_carbon_Theme();
  current_Theme = "theme_carbon";
  save_into_storage();
});

theme_navy.addEventListener("click", () => {
  Theme.set_navy_Theme();
  current_Theme = "theme_navy";
  save_into_storage();
});

theme_ember.addEventListener("click", () => {
  Theme.set_ember_Theme();
  current_Theme = "theme_ember";
  save_into_storage();
});

theme_forest.addEventListener("click", () => {
  Theme.set_forest_Theme();
  current_Theme = "theme_forest";
  save_into_storage();
});

theme_ice.addEventListener("click", () => {
  Theme.set_ice_Theme();
  current_Theme = "theme_ice";
  save_into_storage();
});

theme_solar.addEventListener("click", () => {
  Theme.set_solar_Theme();
  current_Theme = "theme_solar";
  save_into_storage();
});

theme_violet.addEventListener("click", () => {
  Theme.set_violet_Theme();
  current_Theme = "theme_violet";
  save_into_storage();
});

theme_synth.addEventListener("click", () => {
  Theme.set_synth_Theme();
  current_Theme = "theme_synth";
  save_into_storage();
});

theme_sand.addEventListener("click", () => {
  Theme.set_sand_Theme();
  current_Theme = "theme_sand";
  save_into_storage();
});

theme_copper.addEventListener("click", () => {
  Theme.set_copper_Theme();
  current_Theme = "theme_copper";
  save_into_storage();
});

theme_aurora.addEventListener("click", () => {
  Theme.set_aurora_Theme();
  current_Theme = "theme_aurora";
  save_into_storage();
});

theme_matrix.addEventListener("click", () => {
  Theme.set_matrix_Theme();
  current_Theme = "theme_matrix";
  save_into_storage();
});

theme_royal.addEventListener("click", () => {
  Theme.set_royal_Theme();
  current_Theme = "theme_royal";
  save_into_storage();
});

theme_crimson.addEventListener("click", () => {
  Theme.set_crimson_Theme();
  current_Theme = "theme_crimson";
  save_into_storage();
});

theme_steel.addEventListener("click", () => {
  Theme.set_steel_Theme();
  current_Theme = "theme_steel";
  save_into_storage();
});

function check_Theme() {
  switch (current_Theme) {
    case "theme_teal":
      Theme.set_Teal_Theme();
      break;
    case "theme_dark":
      Theme.set_dark_Theme();
      break;
    case "theme_white":
      Theme.set_light_Theme();
      break;
    case "theme_minimal":
      Theme.set_minimal_Theme();
      break;
    case "theme_blue":
      Theme.set_blue_Theme();
      break;
    case "theme_green":
      Theme.set_green_Theme();
      break;
    case "theme_mint":
      Theme.set_mint_Theme();
      break;

    case "theme_blush":
      Theme.set_blush_Theme();
      break;
    case "theme_carbon":
      Theme.set_carbon_Theme();
      break;
    case "theme_navy":
      Theme.set_navy_Theme();
      break;
    case "theme_ember":
      Theme.set_ember_Theme();
      break;
    case "theme_forest":
      Theme.set_forest_Theme();
      break;
    case "theme_ice":
      Theme.set_ice_Theme();
      break;

    case "theme_solar":
      Theme.set_solar_Theme();
      break;
    case "theme_violet":
      Theme.set_violet_Theme();
      break;
    case "theme_synth":
      Theme.set_synth_Theme();
      break;
    case "theme_sand":
      Theme.set_sand_Theme();
      break;
    case "theme_copper":
      Theme.set_copper_Theme();
      break;
    case "theme_aurora":
      Theme.set_aurora_Theme();
      break;
    case "theme_matrix":
      Theme.set_matrix_Theme();
      break;
    case "theme_royal":
      Theme.set_royal_Theme();
      break;
    case "theme_crimson":
      Theme.set_crimson_Theme();
      break;
    case "theme_steel":
      Theme.set_steel_Theme();
      break;

    default:
      break;
  }

  // Falls Theme programmatisch gesetzt wird (z.B. aus localStorage)
  setActiveThemeButton(current_Theme);
}

// Update Media Session API
function updateMediaSession() {
  if ("mediaSession" in navigator) {
    const currentFile = playlist[currentSongIndex];
    if (currentFile) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: cut_string(currentFile.name, 70),
        artist: "Empe", // Optional: Füge den Künstlernamen hinzu
        album: "Empe Playlist", // Optional: Füge den Albumnamen hinzu
        artwork: [
          { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
          { src: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        ],
      });

      // Set action handlers
      navigator.mediaSession.setActionHandler("play", playPause);
      navigator.mediaSession.setActionHandler("pause", playPause);
      navigator.mediaSession.setActionHandler("previoustrack", prevSong);
      navigator.mediaSession.setActionHandler("nexttrack", nextSong);
    }
  }
}
