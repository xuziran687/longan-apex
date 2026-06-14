<template>
  <div class="order-page">
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="我买到的" name="buy">
        <div class="filter-bar">
          <el-radio-group :model-value="orderStore.buyQuery.status" size="small" @change="orderStore.setBuyStatus">
            <el-radio-button :label="null">全部</el-radio-button>
            <el-radio-button :label="0">待付款</el-radio-button>
            <el-radio-button :label="1">待发货</el-radio-button>
            <el-radio-button :label="2">待收货</el-radio-button>
            <el-radio-button :label="3">已完成</el-radio-button>
            <el-radio-button :label="5">退款中</el-radio-button>
          </el-radio-group>
        </div>
        <div v-loading="orderStore.buyLoading">
          <div v-for="item in orderStore.buyList" :key="item.orderId" class="order-card" @click="router.push(`/order/detail?id=${item.orderId}`)">
            <el-image :src="item.imageUrl" fit="cover" class="order-img" />
            <div class="order-info">
              <div class="order-title">{{ item.title }}</div>
              <div class="order-meta">
                <span class="order-price">￥{{ item.price }}</span>
                <el-tag :type="orderStore.statusTagType(item.status)" size="small">{{ orderStore.statusText(item.status) }}</el-tag>
              </div>
              <div class="order-time">{{ item.createTime?.replace('T', ' ').substring(0, 19) }}</div>
            </div>
          </div>
        </div>
        <div class="pagination-wrapper" v-if="orderStore.buyTotal > 0">
          <el-pagination :current-page="orderStore.buyQuery.page" :page-size="orderStore.buyQuery.size"
            layout="prev, pager, next, total" :total="orderStore.buyTotal" background
            @current-change="(p) => { orderStore.buyQuery.page = p; orderStore.fetchBuyOrders() }" />
        </div>
        <el-empty v-if="!orderStore.buyLoading && orderStore.buyList.length === 0" description="暂无订单" />
      </el-tab-pane>

      <el-tab-pane label="我卖出的" name="sell">
        <div class="filter-bar">
          <el-radio-group :model-value="orderStore.sellQuery.status" size="small" @change="orderStore.setSellStatus">
            <el-radio-button :label="null">全部</el-radio-button>
            <el-radio-button :label="1">待发货</el-radio-button>
            <el-radio-button :label="2">待收货</el-radio-button>
            <el-radio-button :label="3">已完成</el-radio-button>
            <el-radio-button :label="5">退款中</el-radio-button>
          </el-radio-group>
        </div>
        <div v-loading="orderStore.sellLoading">
          <div v-for="item in orderStore.sellList" :key="item.orderId" class="order-card" @click="router.push(`/order/detail?id=${item.orderId}`)">
            <el-image :src="item.imageUrl" fit="cover" class="order-img" />
            <div class="order-info">
              <div class="order-title">{{ item.title }}</div>
              <div class="order-meta">
                <span class="order-price">￥{{ item.price }}</span>
                <el-tag :type="orderStore.statusTagType(item.status)" size="small">{{ orderStore.statusText(item.status) }}</el-tag>
              </div>
              <div class="order-time">{{ item.createTime?.replace('T', ' ').substring(0, 19) }}</div>
            </div>
          </div>
        </div>
        <div class="pagination-wrapper" v-if="orderStore.sellTotal > 0">
          <el-pagination :current-page="orderStore.sellQuery.page" :page-size="orderStore.sellQuery.size"
            layout="prev, pager, next, total" :total="orderStore.sellTotal" background
            @current-change="(p) => { orderStore.sellQuery.page = p; orderStore.fetchSellOrders() }" />
        </div>
        <el-empty v-if="!orderStore.sellLoading && orderStore.sellList.length === 0" description="暂无订单" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'

const router = useRouter()
const orderStore = useOrderStore()
const activeTab = ref('buy')

const handleTabChange = () => {
  if (activeTab.value === 'buy') {
    orderStore.fetchBuyOrders()
  } else {
    orderStore.fetchSellOrders()
  }
}

onMounted(() => {
  orderStore.fetchBuyOrders()
})
</script>

<style scoped>
.order-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 0;
}
.filter-bar {
  margin-bottom: 20px;
}
.order-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  margin-bottom: 12px;
  background: #fff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #f1f5f9;
}
.order-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  border-color: #e2e8f0;
}
.order-img {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  flex-shrink: 0;
}
.order-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.order-title {
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.order-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}
.order-price {
  color: #ff5000;
  font-weight: bold;
  font-size: 16px;
}
.order-time {
  font-size: 12px;
  color: #94a3b8;
}
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
:deep(.el-tabs__header) {
  margin-bottom: 20px;
}
</style>
