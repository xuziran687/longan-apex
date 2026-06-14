import request from '../utils/request'

export const collectGoodsApi = (goodsId) => {
  return request.post(`/goods/collect/${goodsId}`)
}

export const uncollectGoodsApi = (goodsId) => {
  return request.delete(`/goods/collect/${goodsId}`)
}

export const getCollectListApi = (params) => {
  return request.get('/goods/collect/list', { params })
}

export const checkCollectedApi = (goodsId) => {
  return request.get(`/goods/collect/check/${goodsId}`)
}
