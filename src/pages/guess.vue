<template>
  <div class="guess">
    <mx-canvas ref="canvas"/>
  </div>
</template>

<script>
import MxCanvas from '@/components/mx-canvas'
export default {
  name: 'Guess',
  components: {
    MxCanvas
  },
  data() {
    return {
      ws: null
    }
  },
  created() {
    this.ws = new WebSocket('ws://localhost:8090')
    this.ws.onmessage = msg => {
      var pathObj = null
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
      }
    }
  }
}
</script>

<style>

</style>