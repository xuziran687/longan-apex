import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

let client = null
let messageCallback = null
let connected = false

export function connectSocket(onMessage) {
  if (connected) return
  messageCallback = onMessage

  const token = localStorage.getItem('token')
  if (!token) return

  client = new Client({
    webSocketFactory: () => new SockJS('/ws'),
    connectHeaders: {
      Authorization: 'Bearer ' + token
    },
    onConnect: () => {
      connected = true
      client.subscribe('/user/topic/messages', (msg) => {
        if (messageCallback) {
          messageCallback(JSON.parse(msg.body))
        }
      })
    },
    onDisconnect: () => {
      connected = false
    },
    onStompError: (frame) => {
      // WebSocket error handled silently
      connected = false
    }
  })

  client.activate()
}

export function disconnectSocket() {
  if (client) {
    client.deactivate()
    client = null
    connected = false
  }
}

export function isConnected() {
  return connected
}
