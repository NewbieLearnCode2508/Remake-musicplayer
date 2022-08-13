const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "MP3-musicplayer";

const audio = $("#audio");
const listSongs = $(".list-songs");
const dashBoard = $(".dashboard");
const cdThumb = $(".cd-thumb");
const cd = $(".cd-player");
const playBtn = $(".toggle-btn");
const nextBtn = $(".next-btn");
const prevBtn = $(".prev-btn");
const progress = $(".progress");
const progressLine = $(".progress-line");
const repeatBtn = $(".repeat-btn");
const randBtn = $(".rand-btn");
const toggleVolume = $(".volume-icon");
const volumeValue = $("#volume");
const cdThumAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
    duration: 10000,
    iterations: Infinity,
});

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    isMuteVolume: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Cô thắm về làng",
            singer: "Phát Hồ",
            path: "./assets/song/Côthắmkhôngvề.mp3",
            img: "./assets/img/Côthắmkhôngvề.png",
        },
        {
            name: "Sai lầm lớn nhất",
            singer: "Đình Dũng",
            path: "./assets/song/Sailầmcủaanh.mp3",
            img: "./assets/img/Sailầmlớnnhất.png",
        },
        {
            name: "Cô dâu đẹp nhất",
            singer: "Hai bạn nam",
            path: "./assets/song/Côdâuđẹpnhất.mp3",
            img: "./assets/img/Côdâuđẹpnhất.png",
        },
        {
            name: "Let her go",
            singer: "Passenger",
            path: "./assets/song/Lethergo.mp3",
            img: "./assets/img/Lethergo.png",
        },
        {
            name: "Khuê mộc lan",
            singer: "Hương Ly & Jombie",
            path: "./assets/song/Khuêmộclan.mp3",
            img: "./assets/img/Khuêmộclan.png",
        },
        {
            name: "That girl",
            singer: "Olly Murs",
            path: "./assets/song/That Girl.mp3",
            img: "./assets/img/Thatgirl.png",
        },
        {
            name: "sakura anata ni deaete",
            singer: "Night core",
            path: "./assets/song/Sakura anata ni deaete yokatta.mp3",
            img: "./assets/img/sakuraanatanideaete.png",
        },
        {
            name: "Lối Nhỏ",
            singer: "Đen Vâu",
            path: "./assets/song/Đen - Lối Nhỏ.mp3",
            img: "./assets/img/Lốinhỏ.png",
        },
        {
            name: "Muốn Được cùng em",
            singer: "Đen Vâu",
            path: "./assets/song/Muốnđượccùngem.mp3",
            img: "./assets/img/Muốnđượccùngem.png",
        },
        {
            name: "Cô đơn bao lâu anh mới biết",
            singer: "Đen Vâu",
            path: "./assets/song/Cô đơn bao lâu anh mới biết.mp3",
            img: "./assets/img/Côđơnbaolâuanhmớibiết.png",
        },
        {
            name: "Sẽ chẳng yêu người khác đâu",
            singer: "Đen Vâu",
            path: "./assets/song/Sẽ chẳng yêu người khác đâu.mp3",
            img: "./assets/img/Sẽchẳngyêungườikhácđâu.png",
        },
        {
            name: "Kiss me more",
            singer: "Doja Cat",
            path: "./assets/song/Kiss Me More.mp3",
            img: "./assets/img/kissmemore.png",
        },
        {
            name: "Khó vẽ nụ cười",
            singer: "Đạt G x DuUyên",
            path: "./assets/song/Khó Vẽ Nụ Cười.mp3",
            img: "./assets/img/Khóvẽnụcười.png",
        },
        {
            name: "Tình Đơn Phương",
            singer: "Edward Dương Nguyễn",
            path: "./assets/song/TÌNH ĐƠN PHƯƠNG ACOUSTIC.mp3",
            img: "./assets/img/Tìnhđơnphương.png",
        },
        {
            name: "Chưa bao giờ",
            singer: "Trung Quân",
            path: "./assets/song/Chua bao giờ.mp3",
            img: "./assets/img/Chưabaogiờ.png",
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        this.currentIndex = this.config.currentIndex ?? 0;
    },
    handlEvents: function () {
        //margin top list song
        const _this = this;
        cdThumAnimate.pause();
        window.onload = () => {
            listSongs.style.marginTop = dashBoard.clientHeight + "px";
            _this.activePlayingSong();
        };
        const cdWidth = cd.offsetWidth;
        document.onscroll = () => {
            const scrollApp =
                document.documentElement.scrollTop || window.scrollY;
            const newWidth = cdWidth - scrollApp;
            if (newWidth > 0) {
                cd.style.width = newWidth + "px";
                cd.style.opacity = newWidth / cdWidth;
            } else {
                cd.style.width = 0 + "px";
            }
        };

        playBtn.onclick = () => {
            playBtn.classList.toggle("active");
            _this.isPlaying = !_this.isPlaying;
            if (_this.isPlaying) {
                _this.playSong();
            } else {
                _this.pauseSong();
            }
        };

        //Handle next button
        nextBtn.onclick = () => {
            if (_this.isRandom) {
                _this.mixSong();
            } else {
                _this.nextSong();
            }
            _this.loadCurrentSong();
            _this.setConfig("currentIndex", _this.currentIndex);
            _this.playSong();
        };

        //Handle previous button
        prevBtn.onclick = () => {
            if (_this.isRandom) {
                _this.mixSong();
            } else {
                this.prevSong();
            }
            _this.loadCurrentSong();
            _this.setConfig("currentIndex", _this.currentIndex);
            _this.playSong();
        };

        //Handle progress
        audio.ontimeupdate = () => {
            if (audio.duration) {
                const progressPercent =
                    (audio.currentTime / audio.duration) * 100;
                progress.value = progressPercent;
                progressLine.style.width = progressPercent + "%";
            }
        };

        progress.oninput = () => {
            progressLine.style.width = progress.value + "%";
            audio.currentTime = progress.value * (audio.duration / 100);
            _this.playSong();
        };

        //Handle repeat song
        repeatBtn.onclick = () => {
            this.isRepeat = !this.isRepeat;
            repeatBtn.classList.toggle("active");
            _this.setConfig("isRepeat", _this.isRepeat);
        };

        //Handle random song
        randBtn.onclick = () => {
            this.isRandom = !this.isRandom;
            randBtn.classList.toggle("active");
            _this.setConfig("isRandom", _this.isRandom);
        };

        audio.onended = () => {
            progress.value = 0;
            progressLine.style.width = 0;
            if (_this.isRepeat) {
                _this.repeatSong();
            } else if (_this.isRandom) {
                _this.mixSong();
            } else {
                nextBtn.click();
            }
            _this.loadCurrentSong();
            audio.play();
        };

        //Select song
        listSongs.onclick = (e) => {
            const songNode = e.target.closest(".song-item:not(active)");
            if (songNode) {
                _this.currentIndex = Number(
                    songNode.getAttribute("data-index")
                );
                _this.setConfig("currentIndex", _this.currentIndex);
                _this.loadCurrentSong();
                _this.playSong();
                _this.activePlayingSong();
            }
        };

        //Volume setting
        toggleVolume.onclick = () => {
            _this.isMuteVolume = !_this.isMuteVolume;
            _this.setConfig("isMuteVolume", _this.isMuteVolume);
            if (_this.isMuteVolume) {
                console.log("tat am");
                audio.muted = true;
            } else {
                console.log("mo am");
                audio.muted = false;
            }
            toggleVolume.classList.toggle("off");
        };

        volumeValue.oninput = () => {
            audio.volume = volumeValue.value / 100;
        };
    },
    loadCurrentSong: function () {
        cdThumb.style.background =
            "url(" +
            this.songs[this.currentIndex].img +
            ") top center / cover no-repeat";
        audio.src = this.songs[this.currentIndex].path;
        progress.value = 0;
        this.activePlayingSong();
        this.scrollIntoView();
    },
    playSong: function () {
        this.isPlaying = true;
        audio.play();
        playBtn.classList.add("active");
        cdThumAnimate.play();
    },
    pauseSong: function () {
        this.isPlaying = false;
        audio.pause();
        cdThumAnimate.pause();
        playBtn.classList.remove("active");
    },
    repeatSong: function () {
        audio.currentTime = 0;
    },
    mixSong: function () {
        while (true) {
            var randomIdx = Math.floor(Math.random() * this.songs.length);
            if (this.currentIndex != randomIdx) {
                this.currentIndex = randomIdx;
                break;
            }
        }
    },
    nextSong: function () {
        if (this.currentIndex < this.songs.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    renderSong: function () {
        const html = this.songs.map((song, index) => {
            return `
            <div data-index="${index}" class="song-item">
                <div style="background: url(${song.img}) top center / cover no-repeat;" class="song-img"></div>
                <div class="song-info">
                    <h2 class="song-name">${song.name}</h2>
                    <h4 class="song-singer">${song.singer}</h4>
                </div>
                <div class="song-option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`;
        });
        listSongs.innerHTML = html.join("");
    },
    activePlayingSong: function () {
        const songsList = $$(".song-item");
        songsList.forEach((element) => {
            element.classList.remove("active");
        });
        songsList[this.currentIndex].classList.add("active");
    },
    scrollIntoView: function () {
        setTimeout(() => {
            $(".song-item.active").scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 500);
    },
    start: function () {
        this.loadConfig();
        this.renderSong();
        this.loadCurrentSong();
        this.handlEvents();
        this.isRandom
            ? randBtn.classList.add("active", this.isRandom)
            : randBtn.classList.remove("active", this.isRandom);
        this.isRepeat
            ? repeatBtn.classList.add("active", this.isRepeat)
            : repeatBtn.classList.remove("active", this.isRepeat);
        this.isMuteVolume
            ? toggleVolume.classList.add("active", this.isMuteVolume)
            : toggleVolume.classList.remove("active", this.isMuteVolume);
    },
};

app.start();
