<template>
  <div class="draw">
    <mx-canvas
      ref="canvas"
      @mousedown.native="startDraw"
      @mousemove.native="drawing"
      @mouseup.native="endDraw"
    />
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
import axios from 'axios'
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
      currentBrushColor: '#000000'
    }
  },
  created() {
    this.ws = new WebSocket('ws://localhost:8090')
    axios.get('http://localhost:3000/api/username').then(res => {
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