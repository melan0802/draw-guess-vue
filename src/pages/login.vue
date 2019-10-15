<template>
  <div class="login">
    <div class="project-name">你画我猜</div>
    <input v-model="username" type="text" placeholder="请输入姓名" class="username-input">
    <button class="confirm-btn" @click="login">确认</button>
  </div>
</template>

<script>
import axios from '@/utils/axios'
export default {
  name: 'Login',
  data() {
    return {
      username: ''
    }
  },
  methods: {
    login() {
      axios.post('/api/login', {username: this.username}).then(res => {
        if (res.data.success) {
          this.$router.push('/')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  text-align: center;
  .project-name {
    margin-top: 50px;
  }
  .username-input {
    box-sizing: border-box;
    width: 300px;
    padding: 0 10px;
    line-height: 30px;
    margin-top: 20px;
    outline: 0;
    border: 1px solid #000;
    border-radius: 5px;
  }
  .confirm-btn {
    display: block;
    margin: 20px auto 0;
    padding: 0;
    width: 300px;
    line-height: 30px;
    background-color: #ffffff;
    border: 1px solid #000;
    border-radius: 5px;
    outline: 0;
  }
}
</style>