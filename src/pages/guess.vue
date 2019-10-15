<template>
  <div class="guess">
    <mx-canvas ref="canvas" />
    <div class="game-time">{{gameTime}}</div>
    <div class="tip" v-if="tipObj">
      第<span class="tip__important">{{tipObj.index}}</span>个提示：<span class="tip__important">{{tipObj.tip}}</span>
    </div>
    <div class="chat-box">
      <div class="chat-wrap">
        <div class="chat" v-for="(msg, index) in msgs" :key="`chat_${index}`" :class="{'bingo': msg.bingo}">
          <template v-if="!msg.bingo">
            <span class="chat__name">{{msg.username}}</span>：
            <span class="chat__msg">{{msg.message}}</span>
          </template>
          <template v-else>
            <span class="chat__name">{{msg.username}}</span> 猜对了，答案是
            <span class="chat__msg">{{msg.message}}</span>，本轮游戏结束
          </template>
        </div>
      </div>
      <div class="chat-box__input">
        <input type="text" class="input" v-model="message" @keydown.enter="sendMsg" placeholder="输入答案，回车发送">
        <button class="send-msg-btn" @click="sendMsg">发送</button>
      </div>
    </div>
  </div>
</template>

<script>
import MxCanvas from '@/components/mx-canvas'
import axios from '@/utils/axios'
export default {
  name: 'Guess',
  components: {
    MxCanvas
  },
  data() {
    return {
      ws: null,
      msgs: [],
      message: '',
      tipObj: null,
      gameTime: 60
    }
  },
  created() {
    this.ws = new WebSocket('ws://localhost:8090')
    this.ws.onmessage = msg => {
      var pathObj = null
      var msgObj = null
      var chatWrap = document.getElementsByClassName('chat-wrap')[0]
      switch (true) {
        case Boolean(msg.data.match(/^startdraw:/)):
          pathObj = JSON.parse(msg.data.slice(10))

          this.$refs.canvas.startDraw(pathObj)
          break
        case Boolean(msg.data.match(/^drawing:/)):
          pathObj = JSON.parse(msg.data.slice(8))

          this.$refs.canvas.drawing(pathObj)
          break
        case Boolean(msg.data.match(/^enddraw/)):
          this.$refs.canvas.endDraw()
          break
        case Boolean(msg.data.match(/^msg:/)):
          msgObj = JSON.parse(msg.data.slice(4))
          this.msgs.push(msgObj)
          if (this.msgs.length > 200) {
            this.msgs.shift()
          }
          chatWrap.scrollTop = chatWrap.scrollHeight
          break
        case Boolean(msg.data.match(/^bingo:/)):
          msgObj = JSON.parse(msg.data.slice(6))
          this.msgs.push({
            ...msgObj,
            bingo: true
          })
          if (this.msgs.length > 200) {
            this.msgs.shift()
          }
          chatWrap.scrollTop = chatWrap.scrollHeight
          break
        case Boolean(msg.data.match(/^tip:/)):
          this.tipObj = JSON.parse(msg.data.slice(4))
          break
        case Boolean(msg.data.match(/^timedown:/)):
          this.gameTime = msg.data.slice(9)
          break
        case Boolean(msg.data.match(/^startgame:/)):
          this.$refs.canvas.clear()
          break
      }
    }
  },
  methods: {
    sendMsg() {
      axios.post('/api/message', {
        message: this.message
      }).then(res => {
        if (res.status === 200) {
          this.message = ''
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.guess {
  width: 1200px;
  margin: 0 auto;
  position: relative;

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

  .tip {
    position: absolute;
    top: 0;
    left: 300px;

    &__important {
      color: red;
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
}
</style>