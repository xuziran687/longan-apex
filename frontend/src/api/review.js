import request from '@/utils/request'

export function createReviewApi(data) {
  return request.post('/order/review', data)
}

export function getReviewsApi(goodsId, params) {
  return request.get(`/order/review/goods/${goodsId}`, { params })
}
