<template>
  <div class="draw">
    <mx-canvas
      ref="canvas"
      @mousedown.native="startDraw"
      @mousemove.native="drawing"
      @mouseup.native="endDraw"
    />
    <div class="chat-box">
      <div class="chat-wrap">
        <div class="chat" v-for="(msg, index) in msgs" :key="`chat_${index}`" :class="{'bingo': msg.bingo}">
          <span class="chat__name">{{msg.username}}</span>：
          <span class="chat__msg">{{msg.message}}</span>
        </div>
      </div>
    </div>
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
      <button @click="clear">清空</button>
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
      msgs: [],
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
    this.ws = new WebSocket('ws://172.16.10.108:8090')
    var chatWrap = document.getElementsByClassName('chat-wrap')[0]
    this.ws.onmessage = msg => {
      if (msg.data.match(/^startgame:/)) {
        this.$refs.canvas.clear()
        axios.get('/api/topic').then(res => {
          this.topic = res.data
        })
      } else if (msg.data.match(/^timedown:/)) {
        this.gameTime = msg.data.slice(9)
      } else if (msg.data.match(/^bingo:/)) {
        var msgObj = JSON.parse(msg.data.slice(6))
        alert(msgObj.username + '猜对了')
      } else if (msg.data.match(/^msg:/)) {
        this.msgs.push(JSON.parse(msg.data.slice(4)))
        if (this.msgs.length > 200) {
          this.msgs.shift()
        }
        chatWrap.scrollTop = chatWrap.scrollHeight
      }
    }
    axios.get('/api/username').then(res => {
      this.username = res.data
    })
  },
  methods: {
    clear() {
      this.$refs.canvas.clear()
    },
    startDraw(e) {
      if (e.button === 0) {
        const pathObj = {
          x: e.offsetX,
          y: e.offsetY,
          lineWidth: this.currentBrushWidth,
          color: this.currentBrushColor
        }
        this.isMousedown = true
        this.$refs.canvas.startDraw(pathObj)
        this.ws.send('startdraw:' + JSON.stringify(pathObj))
      }
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
.controller-bar {
  display: flex;
  width: 800px;
  justify-content: space-between;
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
.chat-box {
    display: inline-block;
    position: relative;
    overflow: hidden;
    width: 300px;
    height: 600px;
    border: 1px solid #000;

    .chat-wrap {
      overflow-y: scroll;
      height: 500px;

      .chat {
        &.bingo {
          color: red;
        }
      }
    }

    &__input {
      position: absolute;
      bottom: 0;

      .input {
        width: 200px;
        padding: 0 10px;
        line-height: 25px;
        outline: 0;
        border: 1px solid #000;
      }

      .send-msg-btn {
        padding: 0 7px;
        line-height: 25px;
        border: 1px solid #000;
        outline: 0;
        background-color: #ffffff;
      }
    }
  }
</style>