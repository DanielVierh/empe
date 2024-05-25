
let isPlaying = false;
const audioPlayer = document.getElementById('audioPlayer');
const title = document.getElementById('title');


function playPause() {
    if(isPlaying === false) {
        audioPlayer.play();
        isPlaying = true;
        console.log("Play");
    }else{
        audioPlayer.pause();
        isPlaying = false;
        console.log("Pause");
    }
}



document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const objectURL = URL.createObjectURL(file);
        audioPlayer.src = objectURL;
        audioPlayer.play();
        isPlaying = true;
        title.innerHTML = splitVal(file.name + '', '.', '0');
    }
});


function splitVal(val, marker, pos) {
    const elem = val.split(marker);
    const retVal = elem[pos];
    return retVal;
}
