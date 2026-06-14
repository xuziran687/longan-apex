<template>
  <div class="not-found">
    <h1>404</h1>
    <p>页面不存在</p>
    <el-button type="primary" @click="$router.push('/home')">返回首页</el-button>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #64748b;
}
.not-found h1 {
  font-size: 80px;
  color: #0ea5e9;
  margin: 0;
}
.not-found p {
  font-size: 18px;
  margin: 16px 0 24px;
}
</style>
