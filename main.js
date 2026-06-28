/**
 * ==========================================
 * مشغل الموسيقى - تطبيق كامل
 * ==========================================
 * تطبيق مشغل موسيقى مخصص بدون مكتبات خارجية
 * يستخدم Vanilla JavaScript مع DOM Manipulation
 */

// ==========================================
// 1️⃣ بيانات الأغنيات (Music Data)
// ==========================================
const songs = [
    {
        id: 1,
        title: 'O Allah',
        artist: 'Harrisj',
        duration: 240,
        src: '/Harris J  O Allah Official Music .mp3',
        image: '/30ed48297a239c30896c22c8e269b0c5.jpg'
    },
    {
        id: 2,
        title: 'Salati',
        artist: 'Harrisj',
        duration: 300,
        src: '/Harris J - Salati (My Prayer)   Official Lyric Video.mp3',
        image: '/30ed48297a239c30896c22c8e269b0c5.jpg'
    },
    {
        id: 3,
        title: 'madinah',
        artist: 'Maher_Zain___Harris_J_',
        duration: 220,
        src: '/Maher_Zain___Harris_J_-_Qalbi_Fil_Madinah___Official_Lyric_Video___قلبي_في_المدينة(128k).mp3',
        image: '/30ed48297a239c30896c22c8e269b0c5.jpg'
    },
    {
        id: 4,
        title: 'madinah',
        artist: 'Harrisj',
        duration: 280,
        src: '/Maher_Zain___Harris_J_-_Qalbi_Fil_Madinah___Official_Lyric_Video___قلبي_في_المدينة(128k).mp3',
        image: '/4bd7363410de3be51805b2fc804a40ac.jpg'
    },
    {
        id: 5,
        title: 'salati',
        artist: 'harris',
        duration: 250,
        src: '/Harris J - Salati (My Prayer)   Official Lyric Video.mp3',
        image: '/30ed48297a239c30896c22c8e269b0c5.jpg'
    }
];

// ==========================================
// 2️⃣ حالة التطبيق (Application State)
// ==========================================
const playerState = {
    currentSongIndex: 0,      // فهرس الأغنية الحالية
    isPlaying: false,         // هل المشغل يعمل؟
    currentTime: 0,           // الوقت الحالي للأغنية
    isDarkMode: localStorage.getItem('darkMode') === 'true' // الوضع الداكن
};

// ==========================================
// 3️⃣ عناصر DOM (DOM Elements)
// ==========================================
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const volumeControl = document.getElementById('volumeControl');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const albumArt = document.getElementById('albumArt');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const playlistContainer = document.getElementById('playlistContainer');
const themeToggle = document.getElementById('themeToggle');

// ==========================================
// 4️⃣ دالة تنسيق الوقت بصيغة MM:SS
// ==========================================
/**
 * تحويل الثواني إلى صيغة MM:SS
 * @param {number} seconds - عدد الثواني
 * @returns {string} الوقت بصيغة MM:SS
 */
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// ==========================================
// 5️⃣ تهيئة المشغل
// ==========================================
/**
 * تحميل الأغنية الأولى وتعيين المشغل
 */
function initializePlayer() {
    loadSong(playerState.currentSongIndex);
    renderPlaylist();
    initializeDarkMode();
    setupEventListeners();
    
    console.log('✅ تم تهيئة المشغل بنجاح');
}

// ==========================================
// 6️⃣ تحميل الأغنية (Load Song)
// ==========================================
/**
 * تحميل أغنية محددة في المشغل
 * @param {number} index - فهرس الأغنية المراد تحميلها
 */
function loadSong(index) {
    // التأكد من أن الفهرس صحيح
    if (index < 0) {
        playerState.currentSongIndex = songs.length - 1;
    } else if (index >= songs.length) {
        playerState.currentSongIndex = 0;
    } else {
        playerState.currentSongIndex = index;
    }

    const currentSong = songs[playerState.currentSongIndex];

    // تحديث الصوت
    audioPlayer.src = currentSong.src;

    // تحديث واجهة المستخدم
    songTitle.textContent = currentSong.title;
    artistName.textContent = currentSong.artist;
    albumArt.src = currentSong.image;
    albumArt.alt = currentSong.title;

    // تحديث مدة الأغنية
    durationDisplay.textContent = formatTime(currentSong.duration);

    // تحديث قائمة التشغيل
    updatePlaylistUI();

    // إعادة تعيين شريط التقدم
    progressBar.max = currentSong.duration;
    progressBar.value = 0;
    currentTimeDisplay.textContent = '0:00';
}

// ==========================================
// 7️⃣ تشغيل/إيقاف الأغنية
// ==========================================
/**
 * تبديل حالة التشغيل (play/pause)
 */
function togglePlayPause() {
    if (playerState.isPlaying) {
        audioPlayer.pause();
        playerState.isPlaying = false;
        updatePlayButtonUI();
    } else {
        audioPlayer.play();
        playerState.isPlaying = true;
        updatePlayButtonUI();
    }
}

/**
 * تحديث نمط زر التشغيل
 */
function updatePlayButtonUI() {
    const icon = playerState.isPlaying ? '⏸️' : '▶️';
    playBtn.innerHTML = `<span class="icon">${icon}</span>`;
    playBtn.setAttribute('aria-label', playerState.isPlaying ? 'إيقاف' : 'تشغيل');
}

// ==========================================
// 8️⃣ الانتقال إلى الأغنية السابقة/التالية
// ==========================================
/**
 * الانتقال إلى الأغنية السابقة
 */
function previousSong() {
    loadSong(playerState.currentSongIndex - 1);
    
    // إعادة التشغيل تلقائياً
    if (playerState.isPlaying) {
        audioPlayer.play();
    }
}

/**
 * الانتقال إلى الأغنية التالية
 */
function nextSong() {
    loadSong(playerState.currentSongIndex + 1);
    
    // إعادة التشغيل تلقائياً
    if (playerState.isPlaying) {
        audioPlayer.play();
    }
}

// ==========================================
// 9️⃣ التحكم بشريط التقدم
// ==========================================
/**
 * تحديث شريط التقدم أثناء التشغيل
 */
function updateProgressBar() {
    if (!isNaN(audioPlayer.currentTime)) {
        progressBar.value = audioPlayer.currentTime;
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
    }
}

/**
 * تغيير موضع التشغيل عند النقر على شريط التقدم
 */
function seekSong(event) {
    const newTime = (event.target.value / event.target.max) * audioPlayer.duration;
    audioPlayer.currentTime = newTime;
}

// ==========================================
// 🔟 التحكم بمستوى الصوت
// ==========================================
/**
 * تحديث مستوى الصوت
 */
function changeVolume(event) {
    const volume = event.target.value;
    audioPlayer.volume = volume / 100;
    
    // تحديث رمز الصوت
    updateVolumeIcon(volume);
}

/**
 * تحديث رمز الصوت بناءً على مستوى الصوت
 */
function updateVolumeIcon(volume) {
    const volumeLabel = document.querySelector('.volume-label');
    
    if (volume == 0) {
        volumeLabel.textContent = '🔇';
    } else if (volume < 30) {
        volumeLabel.textContent = '🔈';
    } else {
        volumeLabel.textContent = '🔊';
    }
}

// ==========================================
// 1️⃣1️⃣ عرض قائمة التشغيل
// ==========================================
/**
 * تحديث وعرض قائمة التشغيل
 */
function renderPlaylist() {
    playlistContainer.innerHTML = '';

    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = 'playlist-item';
        
        // إضافة فئة active للأغنية الحالية
        if (index === playerState.currentSongIndex) {
            li.classList.add('active');
        }

        li.innerHTML = `
            <div class="playlist-item-text">
                <div class="playlist-item-title">${song.title}</div>
                <div class="playlist-item-artist">${song.artist}</div>
            </div>
            <span class="playlist-item-duration">${formatTime(song.duration)}</span>
        `;

        // إضافة مستمع الحدث للنقر على الأغنية
        li.addEventListener('click', () => {
            loadSong(index);
            audioPlayer.play();
            playerState.isPlaying = true;
            updatePlayButtonUI();
        });

        playlistContainer.appendChild(li);
    });
}

/**
 * تحديث الفئة النشطة في قائمة التشغيل
 */
function updatePlaylistUI() {
    const allItems = document.querySelectorAll('.playlist-item');
    
    allItems.forEach((item, index) => {
        if (index === playerState.currentSongIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ==========================================
// 1️⃣2️⃣ نمط داكن/فاتح
// ==========================================
/**
 * تهيئة الوضع الداكن من التخزين المحلي
 */
function initializeDarkMode() {
    if (playerState.isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<span class="icon">☀️</span>';
    }
}

/**
 * تبديل الوضع الداكن
 */
function toggleDarkMode() {
    playerState.isDarkMode = !playerState.isDarkMode;
    document.body.classList.toggle('dark-mode');

    // حفظ التفضيل في التخزين المحلي
    localStorage.setItem('darkMode', playerState.isDarkMode);

    // تحديث الرمز
    const icon = playerState.isDarkMode ? '☀️' : '🌙';
    themeToggle.innerHTML = `<span class="icon">${icon}</span>`;
}

// ==========================================
// 1️⃣3️⃣ معالجات الأحداث (Event Listeners)
// ==========================================
/**
 * إعداد جميع مستمعي الأحداث
 */
function setupEventListeners() {
    // أزرار التحكم
    playBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', previousSong);
    nextBtn.addEventListener('click', nextSong);

    // شريط التقدم والصوت
    progressBar.addEventListener('input', seekSong);
    volumeControl.addEventListener('input', changeVolume);

    // أحداث المشغل الصوتي
    audioPlayer.addEventListener('timeupdate', updateProgressBar);
    audioPlayer.addEventListener('ended', nextSong); // الانتقال للأغنية التالية تلقائياً
    audioPlayer.addEventListener('loadedmetadata', () => {
        // تحديث مدة الأغنية عند تحميل البيانات
        progressBar.max = audioPlayer.duration;
        durationDisplay.textContent = formatTime(audioPlayer.duration);
    });

    // تبديل الوضع الداكن
    themeToggle.addEventListener('click', toggleDarkMode);

    // التحكم بلوحة المفاتيح
    document.addEventListener('keydown', handleKeyboardControls);

    console.log('✅ تم إعداد جميع مستمعي الأحداث');
}

// ==========================================
// 1️⃣4️⃣ اختصارات لوحة المفاتيح
// ==========================================
/**
 * معالجة اختصارات لوحة المفاتيح
 * - Space: تشغيل/إيقاف
 * - ArrowRight: الأغنية التالية
 * - ArrowLeft: الأغنية السابقة
 */
function handleKeyboardControls(event) {
    if (event.code === 'Space') {
        event.preventDefault(); // منع السلوك الافتراضي
        togglePlayPause();
    } else if (event.code === 'ArrowRight') {
        nextSong();
    } else if (event.code === 'ArrowLeft') {
        previousSong();
    }
}

// ==========================================
// 1️⃣5️⃣ بدء التطبيق
// ==========================================
// تشغيل التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initializePlayer);

// رسالة في Console للتطوير
console.log('%c🎵 مرحباً بك في مشغل الموسيقى!', 'color: #6366f1; font-size: 18px; font-weight: bold;');
console.log('%cاختصارات لوحة المفاتيح:', 'color: #ec4899; font-weight: bold;');
console.log('Space - تشغيل/إيقاف | ← الأغنية السابقة | → الأغنية التالية');
