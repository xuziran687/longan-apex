import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getConversationsApi, getMessagesApi, sendMessageApi, markReadApi } from '@/api/chat'
import { connectSocket, disconnectSocket } from '@/utils/socket'

export const useChatStore = defineStore('chat', () => {
  const conversations = ref([])
  const currentConversationId = ref(null)
  const messages = ref([])
  const unreadTotal = ref(0)

  const currentConversation = computed(() =>
    conversations.value.find(c => c.id === currentConversationId.value) || null
  )

  function handleIncomingMessage(msg) {
    const conv = conversations.value.find(c => c.targetId === msg.senderId)
    if (conv) {
      conv.lastMsg = msg.content
      conv.updateTime = msg.createTime
      if (msg.senderId !== conv.targetId) {
        conv.unread = (conv.unread || 0) + 1
      }
    }
    unreadTotal.value = conversations.value.reduce((sum, c) => sum + (c.unread || 0), 0)
    if (currentConversationId.value && conversations.value.find(c => c.id === currentConversationId.value)?.targetId === msg.senderId) {
      messages.value.push(msg)
    }
  }

  async function fetchConversations() {
    const res = await getConversationsApi()
    if (res.code === 200) {
      conversations.value = res.data || []
      unreadTotal.value = conversations.value.reduce((sum, c) => sum + (c.unread || 0), 0)
    }
  }

  async function fetchMessages(conversationId) {
    const res = await getMessagesApi(conversationId)
    if (res.code === 200) {
      messages.value = res.data || []
    }
  }

  function selectConversation(conversationId) {
    currentConversationId.value = conversationId
    fetchMessages(conversationId)
    markReadApi(conversationId)
    const conv = conversations.value.find(c => c.id === conversationId)
    if (conv) {
      conv.unread = 0
      unreadTotal.value = conversations.value.reduce((sum, c) => sum + (c.unread || 0), 0)
    }
  }

  async function sendMessage(data) {
    const res = await sendMessageApi(data)
    if (res.code === 200) {
      messages.value.push(res.data)
      const conv = conversations.value.find(c => c.id === data.conversationId)
      if (conv) {
        conv.lastMsg = data.content
        conv.updateTime = new Date()
      }
      return res.data
    }
    return null
  }

  function initSocket() {
    connectSocket(handleIncomingMessage)
  }

  function destroySocket() {
    disconnectSocket()
  }

  return {
    conversations,
    currentConversationId,
    messages,
    unreadTotal,
    currentConversation,
    fetchConversations,
    fetchMessages,
    selectConversation,
    sendMessage,
    initSocket,
    destroySocket
  }
})
