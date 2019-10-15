<template>
  <div class="draw">
    <mx-canvas
      ref="canvas"
      @mousedown.native="startDraw"
      @mousemove.native="drawing"
      @mouseup.native="endDraw"
    />
    <div class="topic">{{topic}}</div>
    <div class="game-time">{{gameTime}}</div>
    <div class="controller-bar">
      <div class="brush-wrap">
        <div
          v-for="(width, index) in brushWidthList"
          :key="'brush_width_' + index"
          :style="{
            borderColor: currentBrushColor,
            backgroundColor: (currentBrushWidth === width ? currentBrushColor : '#fff')
          }"
          @click="currentBrushWidth = width"
          class="brush"
        >
          <span
            class="brush__point" 
            :style="{
              width: width + 'px',
              height: width + 'px',
              backgroundColor: (currentBrushWidth === width ? '#fff' : currentBrushColor)
            }"
          ></span>
        </div>
      </div>
      <div class="brush-color-wrap">
        <div
          v-for="(color, index) in brushColorList"
          :key="'brush_color_' + index"
          :style="{backgroundColor: color}"
          :class="{'brush-color--active': color === currentBrushColor}"
          @click="currentBrushColor = color"
          class="brush-color"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import MxCanvas from '@/components/mx-canvas'
import axios from '@/utils/axios'
export default {
  name: 'Draw',
  components: {
    MxCanvas
  },
  data() {
    return {
      isMousedown: false,
      ws: null,
      brushWidthList: [
        3,
        7,
        10,
        13,
        20
      ],
      brushColorList: [
        '#000000', '#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee'
      ],
      currentBrushWidth: 3,
      currentBrushColor: '#000000',
      topic: '',
      gameTime: 60
    }
  },
  created() {
    this.ws = new WebSocket('ws://localhost:8090')
    this.ws.onmessage = msg => {
      if (msg.data.match(/^startgame:/)) {
        this.$refs.canvas.clear()
        axios.get('/api/topic').then(res => {
          this.topic = res.data
        })
      } else if (msg.data.match(/^timedown:/)) {
        this.gameTime = msg.data.slice(9)
      }
    }
    axios.get('/api/username').then(res => {
      this.username = res.data
    })
  },
  methods: {
    startDraw(e) {
      const pathObj = {
        x: e.offsetX,
        y: e.offsetY,
        lineWidth: this.currentBrushWidth,
        color: this.currentBrushColor
      }
      this.isMousedown = true
      this.$refs.canvas.startDraw(pathObj)
      this.ws.send('startdraw:' + JSON.stringify(pathObj))
    },
    drawing(e) {
      if (!this.isMousedown) {
        return
      }
      const pathObj = {
        x: e.offsetX,
        y: e.offsetY,
        lineWidth: this.currentBrushWidth,
        color: this.currentBrushColor
      }
      this.$refs.canvas.drawing(pathObj)
      this.ws.send('drawing:' + JSON.stringify(pathObj))
    },
    endDraw() {
      this.isMousedown = false
      this.$refs.canvas.endDraw()
      this.ws.send('enddraw')
    }
  }
}
</script>

<style lang="scss" scoped>
.draw {
  position: relative;
  margin: 0 auto;
  width: 1200px;
  .topic {
    position: absolute;
    top: 10px;
    left: 70px;
  }
  .game-time {
    position: absolute;
    top: 0;
    left: 0;
    width: 66px;
    height: 66px;
    line-height: 66px;
    text-align: center;
    border-radius: 50%;
    color: red;
    font-weight: bold;
    font-size: 18px;
    border: 1px solid #000;
  }
}
.brush {
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px solid; 
  border-radius: 4px;
  background-color: #ffffff;

  &__point {
    content: '';
    display: inline-block;
    border-radius: 50%;
    overflow: hidden;
    vertical-align: middle;
  }
}
.brush-color-wrap {
  .brush-color {
    display: inline-block;
    box-sizing: border-box;
    width: 20px;
    height: 30px;

    &--active {
      border: 2px solid #000;
    }
  }
}
</style>