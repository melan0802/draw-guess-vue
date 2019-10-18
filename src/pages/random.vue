<template>
  <div class="random">
    <div class="name" :class="{'name--ensure': ensure}">{{username}}</div>
    <div>
      <button @click="startSelect">选择</button>
      <button @click="startGame">开始</button>
      <button @click="viewBoard">查看排行</button>
    </div>
    <table class="board" v-show="boardVisible">
      <thead>
        <th>
          <td>username</td>
          <td>score</td>
        </th>
      </thead>
      <tbody>
        <tr v-for="(scoreItem, index) in score" :key="`score-item-${index}`">
          <td>{{scoreItem.username}}</td>
          <td>{{scoreItem.score}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from '@/utils/axios'
export default {
  name: 'Random',
  data() {
    return {
      username: '',
      ensure: false,
      boardVisible: false,
      score: []
    }
  },
  methods: {
    viewBoard() {
      axios.get('/api/score').then(res => {
        this.score = res.data
        this.boardVisible = true
      })
    },
    startSelect() {
      axios.get('/api/usernames').then(res => {
        var nameList = res.data
        var count = 20


        if(nameList.length < 1) {
          alert('人数太少')
        }

        this.ensure = false
        var intId = setInterval(() => {
          if (count !== 0) {
            this.username = nameList[Math.floor(Math.random() * nameList.length)]
            count--
          } else {
            this.username = nameList[Math.floor(Math.random() * nameList.length)]
            this.ensure = true
            clearInterval(intId)
            axios.post('/api/random-user', {username: this.username})
          }
        }, 100)
      })
    },
    startGame() {
      axios.post('/api/start-game', {
        username: this.username
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.random {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;

  .name {
    font-size: 38px;
    font-weight: bold;
    &--ensure {
      color: #b80000;
    }
  }
}
</style>