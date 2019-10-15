<template>
  <canvas class="my-canvas" width="800" height="600"></canvas>
</template>

<script>
export default {
  name: 'MxCanvas',
  data() {
    return {
      ctx: null
    }
  },
  methods: {
    startDraw(pathObj) {
      this.ctx.fillStyle = pathObj.color
      this.ctx.strokeStyle = pathObj.color
      this.ctx.beginPath()
      this.ctx.arc(pathObj.x, pathObj.y, pathObj.lineWidth / 2, 0, 2 * Math.PI)
      this.ctx.fill()
      this.ctx.beginPath()
      this.ctx.moveTo(pathObj.x, pathObj.y)
    },
    drawing(pathObj) {
      this.ctx.fillStyle = pathObj.color
      this.ctx.strokeStyle = pathObj.color
      this.ctx.lineWidth = pathObj.lineWidth
      this.ctx.lineTo(pathObj.x, pathObj.y)
      this.ctx.stroke()
      this.ctx.closePath()
      this.ctx.arc(pathObj.x, pathObj.y, pathObj.lineWidth / 2, 0, 2 * Math.PI)
      this.ctx.fill()
      this.ctx.beginPath()
      this.ctx.moveTo(pathObj.x, pathObj.y)
    },
    endDraw() {
      this.ctx.closePath()
    },
    clear() {
      this.ctx.clearRect(0, 0, this.$el.width, this.$el.height);
    }
  },
  mounted() {
    var canvas = this.$el
    this.ctx = canvas.getContext('2d')
  }
}
</script>

<style>
.my-canvas {
  border: 1px solid #000;
}
</style>