const containers = document.querySelector(".containers"),
musicImg= containers.querySelector(".image-area img"),
musicName= containers.querySelector(".songs-details .name"),
musicSinger= containers.querySelector(".songs-details .artist"),
mainAudio = containers.querySelector("#main-audio"),
playPauseBtn = containers.querySelector(".play-pause"),
prevBtn = containers.querySelector("#prev"),
nextBtn = containers.querySelector("#next"),
progressArea = containers.querySelector(".ProgressArea"),
progressBar = containers.querySelector(".progress-bar"),
repeatBtn = containers.querySelector("#repeat-playList"),
musicList = containers.querySelector(".musicqueue"),
showMoreBtn = containers.querySelector("#music-list"),
hideMusicBtn = musicList.querySelector("#close"),
ulTag = containers.querySelector("ul");


let musicIndex =Math.floor((Math.random()*songs.length)+1);
 window.addEventListener("load",()=>{
     loadMusic(musicIndex);
     playingNow();
 })

 function loadMusic(indexNum){
     musicName.innerText = songs[indexNum-1].name;
     musicSinger.innerText = songs[indexNum-1].artist;
     musicImg.src = `images/${songs[indexNum-1].img}.jpg`;
     mainAudio.src = `songs/${songs[indexNum-1].src}.mp3`;
     
 }

function playMusic()
{
    containers.classList.add("paused");
    playPauseBtn.querySelector("i").innerText="pause";
    mainAudio.play();
}

function pauseMusic()
{
    containers.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText="play_arrow";
    mainAudio.pause();
}

function nextMusic()
{
    musicIndex++;
    musicIndex > songs.length ? musicIndex =1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

function prevMusic()
{
    musicIndex--;
    musicIndex < 1 ? musicIndex =songs.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

 playPauseBtn.addEventListener("click",()=>{
     const isMusicPaused = containers.classList.contains("paused");
     isMusicPaused ? pauseMusic() : playMusic();
     playingNow();
 });

 nextBtn.addEventListener("click",()=>{
    nextMusic();
});

prevBtn.addEventListener("click",()=>{
    prevMusic();
});

mainAudio.addEventListener("timeupdate",(e)=>{
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime/duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = containers.querySelector(".current"),
    musicDuration = containers.querySelector(".duration");

    mainAudio.addEventListener("loadeddata",()=>{
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration/60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec<10)
        {
            totalSec=`0${totalSec}`;
        }
        musicDuration.innerText= `${totalMin}:${totalSec}`;

    });
        let currentMin = Math.floor(currentTime/60);
        let currentSec = Math.floor(currentTime % 60);
        if(currentSec<10)
        {
            currentSec=`0${currentSec}`;
        }
        musicCurrentTime.innerText= `${currentMin}:${currentSec}`;
    
});

progressArea.addEventListener("click",(e)=>{
    let progressWidthVal= progressArea.clientWidth; //getting width of progress bar
    let clickedOffsetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffsetX / progressWidthVal) * songDuration;
    playMusic(); //calling playMusic function
    playingNow();
});

repeatBtn.addEventListener("click", ()=>{
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch(getText){
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});


mainAudio.addEventListener("ended",()=>{
    //as the above icon we'll do accordingly to current song loop/shuffle/repeat
    let getText = repeatBtn.innerText; //getting this tag innerText
    switch(getText){
      case "repeat":
        nextMusic(); //calling nextMusic function
        break;
      case "repeat_one":
        mainAudio.currentTime = 0; //setting audio current time to 0
        loadMusic(musicIndex); //calling loadMusic function with argument, in the argument there is a index of current song
        playMusic(); //calling playMusic function
        break;
      case "shuffle":
        let randIndex = Math.floor((Math.random() * songs.length) + 1); //genereting random index/numb with max range of array length
        do{
          randIndex = Math.floor((Math.random() * songs.length) + 1);
        }while(musicIndex == randIndex); //this loop run until the next random number won't be the same of current musicIndex
        musicIndex = randIndex; //passing randomIndex to musicIndex
        loadMusic(musicIndex);
        playMusic();
        playingNow();
        break;
    }
});

showMoreBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click",()=>{
    showMoreBtn.click();
});


for (let i = 0; i < songs.length; i++) {
    //let's pass the song name, artist from the array
    let liTag = `<li li-index="${i+1}">
                  <div class="row">
                    <span>${songs[i].name}</span>
                    <p>${songs[i].artist}</p>
                  </div>
                  <span id="${songs[i].src}" class="audio-duration">3:40</span>
                  <audio class="${songs[i].src}" src="songs/${songs[i].src}.mp3"></audio>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag
    let liAudioDuartionTag = ulTag.querySelector(`#${songs[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${songs[i].src}`);
    liAudioTag.addEventListener("loadeddata", ()=>{
      let duration = liAudioTag.duration;
      let totalMin = Math.floor(duration / 60);
      let totalSec = Math.floor(duration % 60);
      if(totalSec < 10){ //if sec is less than 10 then add 0 before it
        totalSec = `0${totalSec}`;
      };
      liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
      liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
    });
  }

    const allLiTag = ulTag.querySelectorAll("li");
    function playingNow(){
    for (let j = 0; j < allLiTag.length; j++) {
      
      //if the li tag index is equal to the musicIndex then add playing class in it
      let audioTag = allLiTag[j].querySelector(".audio-duration");
      if(allLiTag[j].classList.contains("playing")){
        allLiTag[j].classList.remove("playing");
        let adDuration = audioTag.getAttribute("t-duration");
        audioTag.innerText = adDuration;
      }
      
      if(allLiTag[j].getAttribute("li-index") == musicIndex){
        allLiTag[j].classList.add("playing");
        audioTag.innerText = "Playing";
      }
      allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
}
    function clicked(element){
        let getLiIndex = element.getAttribute("li-index");
        musicIndex = getLiIndex; //updating current song index with clicked li index
        loadMusic(musicIndex);
        playMusic();
        playingNow();
      }








































































