<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { Howl } from 'howler'

const props = defineProps({
  audioSrc: {
    type: String,
    required: true
  },
  audioDisplayName: {
    type: String,
    required: true
  },
  audioLoopStart: {
    type: Number,
    required: true
  },
  audioLoopEnd: {
    type: Number,
    required: true
  }
})

const audioNameDisplay = props.audioDisplayName
const audioDataSrc = props.audioSrc

const audioDataVolume = ref(1)
const audioDataLoopStart = props.audioLoopStart
const audioDataLoopEnd = props.audioLoopEnd
/*
const audioDataLength = 0

const audioCurrTimeDisplay = ref('0:00')
const audioTotalTimeDisplay = ref('0:00')
const audioCurrProgressBar = ref(0)
*/
const audioIsPauseButton = ref(false)
const audioShouldLoop = true

const audioCurrTime = ref(0)
const audioCurrTimeSetInterval = ref<number | null>(null)

const htmlDivTogglePlay = ref<HTMLDivElement | null>(null)
const htmlDivProgress = ref<HTMLDivElement | null>(null)
const htmlDivTimeline = ref<HTMLDivElement | null>(null)
const htmlDivVolumeButton = ref<HTMLDivElement | null>(null)
const htmlDivVolume = ref<HTMLDivElement | null>(null)
const htmlDivVolumeSlider = ref<HTMLDivElement | null>(null)
const htmlDivVolumePercentage = ref<HTMLDivElement | null>(null)
const htmlDivTime = ref<HTMLDivElement | null>(null)
const htmlDivCurrent = ref<HTMLDivElement | null>(null)
const htmlDivDivider = ref<HTMLDivElement | null>(null)
const htmlDivLength = ref<HTMLDivElement | null>(null)

const getTimeCodeFromNum = (num: string) => {
  let seconds: number = parseInt(num)
  let minutes = parseInt(String(seconds / 60))
  seconds -= minutes * 60
  const hours = parseInt(String(minutes / 60))
  minutes -= hours * 60
  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, '0')}`
  return `${String(hours).padStart(2, '0')}:${minutes}:${String(seconds % 60).padStart(2, '0')}`
}

function checkBGMLoop(howler: Howl) {
  const seek = howler.seek()
  if (seek >= audioDataLoopEnd && seek - audioDataLoopEnd < 0.5) {
    howler.seek(audioDataLoopStart)
    // seek will trigger update progress, so exit immediately for progress to be updated by next call
    return
  }
}

function audioInit() {
  const playButton = htmlDivTogglePlay.value!

  const progressBar = htmlDivProgress.value!
  const timeline = htmlDivTimeline.value!

  const volumeButton = htmlDivVolumeButton.value!
  const volumeButtonIcon = htmlDivVolume.value!
  const volumeSlider = htmlDivVolumeSlider.value!
  const volumePercentage = htmlDivVolumePercentage.value!

  const audioTime = htmlDivTime.value!
  const audioCurrentTime = htmlDivCurrent.value!
  const audioDivider = htmlDivDivider.value!
  const audioLength = htmlDivLength.value!

  let muted = false

  function pauseAudioIcon() {
    playButton.classList.remove('pause')
    playButton.classList.add('play')
  }

  const howler = new Howl({
    src: [audioDataSrc],
    html5: true,
    onpause: pauseAudioIcon,
    onplay: function() {
      playButton.classList.remove('play')
      playButton.classList.add('pause')
    },
    onend: function() {
      if (audioShouldLoop) {
        howler.seek(0)
        howler.play()
      } else {
        pauseAudioIcon()
      }
    },
    onload: function() {
      if (audioTime) {
        audioCurrentTime.innerText = '0:00'
        audioDivider.innerText = '/'
        audioLength.innerText = getTimeCodeFromNum(String(howler.duration()))
      }
    },
    onloaderror: function() {
      audioCurrentTime.innerText = 'Failed to load'
    },
    onvolume: function() {
      if (volumePercentage) {
        volumePercentage.style.width = howler.volume() * 100 + '%'
      }
    }
  })
  howler.volume(audioDataVolume.value)

  audioCurrTimeSetInterval.value = setInterval(() => {
    audioCurrTime.value = howler.seek()
  }, 100)

  if (audioShouldLoop && audioDataLoopEnd !== 0) {
    watch(
      audioCurrTime,
      () => {
        checkBGMLoop(howler)
      }
    )
  }

  let lastSeek = 0
  const updateProgress = function() {
    const seek = howler.seek()
    if (seek === lastSeek) {
      return
    }
    lastSeek = seek

    if (progressBar) {
      progressBar.style.width = (seek / howler.duration() * 100) + '%'
    }
    if (audioCurrentTime) {
      audioCurrentTime.innerText = getTimeCodeFromNum(String(seek))
    }
  }
  howler.on('seek', updateProgress)

  // update progress in every set interval
  if ((audioShouldLoop && audioDataLoopEnd !== 0) || progressBar || audioCurrentTime) {
    watch(
      audioCurrTime,
      () => {
        updateProgress()
      }
    )
  }

  // controls playing and pausing
  playButton.parentElement!.addEventListener('click', function() {
    if (howler.playing()) {
      howler.pause()
    } else {
      howler.play()
    }
  })

  // seek whenever the timeline is clicked
  if (timeline) {
    timeline.addEventListener('click', e => {
      const timelineWidth = window.getComputedStyle(timeline).width
      const timeToSeek = e.offsetX / parseInt(timelineWidth) * howler.duration()
      howler.seek(timeToSeek)
    })
  }

  // controls volume button: either mute or unmute
  if (volumeButton) {
    volumeButton.addEventListener('click', function() {
      if (muted) {
        howler.mute(false)
        volumeButtonIcon.classList.remove('icon-muted')
        volumeButtonIcon.classList.add('icon-volume-medium')
      } else {
        howler.mute(true)
        volumeButtonIcon.classList.add('icon-muted')
        volumeButtonIcon.classList.remove('icon-volume-medium')
      }
      muted = !muted
    })
  }

  // controls volume slider
  if (volumeSlider) {
    volumeSlider.addEventListener('click', e => {
      const sliderWidth = window.getComputedStyle(volumeSlider).width
      const newVolume = e.offsetX / parseInt(sliderWidth)
      howler.volume(newVolume)
    })
  }

  // control pause behavior
  if (audioIsPauseButton.value) {
    playButton.parentElement!.addEventListener('click', function() {
      howler.pause()
    })
    return
  }
}

onMounted(() => {
  audioInit()
})

onBeforeUnmount(() => {
  if (audioCurrTimeSetInterval.value)
    clearInterval(audioCurrTimeSetInterval.value)
})
</script>

<template>
  <div class="audio-player">
    <div class="timeline" ref="htmlDivTimeline">
      <div class="progress" ref="htmlDivProgress"></div>
    </div>
    <div class="controls">
      <div class="play-container">
        <div :class="['toggle-play', audioIsPauseButton ? 'pause' : 'play']" ref="htmlDivTogglePlay"></div>
      </div>
      <div class="time" ref="htmlDivTime">
        <div class="current" ref="htmlDivCurrent">Loading...</div>
        <div class="divider" ref="htmlDivDivider"></div>
        <div class="length" ref="htmlDivLength"></div>
      </div>
      <div class="name">{{ audioNameDisplay }}
      </div>
      <div class="volume-container">
        <div class="volume-button" ref="htmlDivVolumeButton">
          <div class="volume icon-volume-medium" ref="htmlDivVolume"></div>
        </div>
        <div class="volume-slider" ref="htmlDivVolumeSlider">
          <div class="volume-percentage" ref="htmlDivVolumePercentage"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.audio-player {
  height: 50px;
  width: 100%;
  max-width: 350px;
  background: #444;
  border-radius: 5px;
  border: 1px solid #444;
  font-family: arial;
  color: white;
  font-size: 1em;
  overflow: hidden;
  display: grid;
  grid-template-rows: 6px auto;
}

.audio-pause {
  height: 40px;
  width: 40px;
  background: #444;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.67);
  font-family: arial;
  color: white;
  font-size: 1em;
  overflow: hidden;
}

.audio-player .timeline {
  background: white;
  width: 100%;
  position: relative;
  cursor: pointer;
}

.audio-player .timeline .progress {
  background: lightblue;
  width: 0;
  height: 100%;
  transition: 0.25s;
}

.audio-player .controls {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 0 5px 0 0px;
}

.audio-player .controls > * {
  display: flex;
  justify-content: center;
  align-items: center;
}

.audio-player .controls .play-container {
  padding-left: 15px;
}

.audio-player .controls .play-container:hover {
  cursor: pointer;
  transform: scale(1.2);
}

.audio-player .controls .toggle-play.play {
  cursor: pointer;
  position: relative;
  left: 0;
  height: 0;
  width: 0;
  border: 7px solid rgba(0, 0, 0, 0);
  border-left: 13px solid white;
}

.audio-player .controls .toggle-play.pause {
  height: 15px;
  width: 20px;
  cursor: pointer;
  position: relative;
}

.audio-player .controls .toggle-play.pause:before {
  position: absolute;
  top: 0;
  left: 0;
  background: white;
  content: "";
  height: 15px;
  width: 3px;
}

.audio-player .controls .toggle-play.pause:after {
  position: absolute;
  top: 0;
  right: 8px;
  background: white;
  content: "";
  height: 15px;
  width: 3px;
}

.audio-player .controls .time {
  display: flex;
}

.audio-player .controls .time > * {
  padding: 2px;
}

.audio-player .controls .volume-container {
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.audio-player .controls .volume-container .volume-button {
  height: 26px;
  display: flex;
  align-items: center;
}

.audio-player .controls .volume-container .volume-button .volume {
  transform: scale(0.7);
}

.audio-player .controls .volume-container .volume-button .icon-volume-medium {
  font-family: Roboto, sans-serif;
  width: 0;
  height: 0;
  border: 7px solid;
  border-left: none;
  border-top-color: transparent;
  border-bottom-color: transparent;
  padding: 6px 3px;
  box-shadow: inset 4px 0;
  margin: 4px 16px 4px 5px;
  display: inline-block;
  vertical-align: middle;
  position: relative;
  font-style: normal;
  color: currentColor;
  text-align: left;
  text-indent: -9999px;
  direction: ltr;
  box-sizing: border-box;
  transition: all .2s;
}

.audio-player .controls .volume-container .volume-button .icon-volume-medium::before {
  content: '';
  pointer-events: none;
  border-style: double;
  border-width: 6px;
  left: -2px;
  width: 15px;
  height: 15px;
  position: absolute;
  border-radius: 50%;
  border-top-color: transparent;
  border-bottom-color: transparent;
  border-left-color: transparent;
  top: 50%;
  transform: translateY(-50%);
}

.audio-player .controls .volume-container .volume-button .icon-muted {
  font-family: Roboto, sans-serif;
  width: 0;
  height: 0;
  border: 7px solid;
  border-left: none;
  border-top-color: transparent;
  border-bottom-color: transparent;
  padding: 6px 3px;
  box-shadow: inset 4px 0;
  margin: 4px 16px 4px 5px;
  display: inline-block;
  vertical-align: middle;
  position: relative;
  font-style: normal;
  color: currentColor;
  text-align: left;
  text-indent: -9999px;
  direction: ltr;
  box-sizing: border-box;
  transition: all .2s;
}

.audio-player .controls .volume-container .volume-button .icon-muted:before {
  content: '';
  pointer-events: none;
  transform: translateY(-50%) rotate(45deg);
  width: 10px;
  height: 2px;
  box-shadow: inset 0 0 0 32px;
  left: 17px;
  position: absolute;
  top: 50%;
}

.audio-player .controls .volume-container .volume-button .icon-muted:after {
  content: '';
  pointer-events: none;
  transform: translateY(-50%) rotate(45deg);
  height: 10px;
  width: 2px;
  left: 21px;
  box-shadow: inset 0 0 0 32px;
  position: absolute;
  top: 50%;
}

.audio-player .controls .volume-container .volume-slider {
  position: absolute;
  left: -3px;
  /* top: 0; */
  z-index: -1;
  width: 0;
  height: 15px;
  background: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.67);
  transition: 0.25s;
}

.audio-player .controls .volume-container .volume-slider .volume-percentage {
  background: coral;
  height: 100%;
  width: 75%;
}

.audio-player .controls .volume-container:hover .volume-slider {
  left: -123px;
  width: 120px;
}

.audio-player .controls .name {
  text-align: center;
  text-overflow: ellipsis;
  padding: 0 4px;
  line-height: normal;
}

.audio-player .controls .name a {
  color: inherit;
}
</style>
