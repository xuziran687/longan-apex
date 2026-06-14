import request from '@/utils/request'

export function getConversationsApi() {
  return request.get('/chat/conversations')
}

export function getMessagesApi(conversationId) {
  return request.get('/chat/messages', { params: { conversationId } })
}

export function sendMessageApi(data) {
  return request.post('/chat/send', data)
}

export function markReadApi(conversationId) {
  return request.put('/chat/messages/read', null, { params: { conversationId } })
}

export function getSysMessagesApi(params) {
  return request.get('/chat/sys-messages', { params })
}

export function getSysUnreadCountApi() {
  return request.get('/chat/sys-messages/unread-count')
}

export function markSysReadApi(id) {
  return request.put(`/chat/sys-messages/${id}/read`)
}
