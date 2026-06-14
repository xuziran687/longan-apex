<template>
  <div style="width:300px;margin:100px auto;">
    <el-input ref="emailRef" v-model="form.email" placeholder="邮箱" @keydown.enter="focusPassword" />
    <el-input ref="passwordRef" v-model="form.password" type="password" placeholder="密码" style="margin-top:10px" @keydown.enter="login"/>
    <el-button type="primary" @click="login" style="margin-top:10px;width:100%">
      登录
    </el-button>
    <div style="text-align:center;margin-top:15px;">
      <span style="color:#999;font-size:13px;">没有账号？</span>
      <el-link type="primary" @click="router.push('/register')">去注册</el-link>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const emailRef = ref(null)
const passwordRef = ref(null)

function focusPassword() {
  passwordRef.value.focus()
}
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus' // 补充导入
import { useUserStore } from '../stores/user' // 1. 导入 Store
import { loginApi } from '../api/user'

const router = useRouter()
const userStore = useUserStore() // 2. 实例化 Store



const form = reactive({
  email: '',
  password: ''
})

const login = async () => {
  try {
    const res = await loginApi(form)
    
    // Spring Boot 返回的 Token 存入本地
    localStorage.setItem('token', res.data.token)
    
    // 触发 Store 获取详细信息
    await userStore.fetchUserInfo() 

    ElMessage.success('欢迎回来，' + userStore.username)
    router.push('/home')
  } catch (e) {
    ElMessage.error('邮箱或密码错误')
  }
}
</script>