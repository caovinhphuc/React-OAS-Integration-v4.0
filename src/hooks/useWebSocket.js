/**
 * React Hook for WebSocket
 * Sử dụng trong React components
 */

import { useEffect, useRef, useState } from 'react'
import { getWebSocketClient } from '../utils/websocket'

/**
 * Hook để sử dụng WebSocket trong React components
 * @param {string} url - WebSocket server URL (optional)
 * @param {string|string[]} rooms - Room IDs to join (optional)
 * @returns {object} WebSocket client và connection state
 */
export function useWebSocket(url = null, rooms = []) {
  const [client] = useState(() => getWebSocketClient(url))
  const [connected, setConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)
  const [error, setError] = useState(null)
  const roomsRef = useRef(Array.isArray(rooms) ? rooms : [rooms].filter(Boolean))

  useEffect(() => {
    // Connect on mount
    client.connect().catch((err) => {
      setError(err)
      console.error('WebSocket connection error:', err)
    })

    // Setup listeners
    const onConnected = () => {
      setConnected(true)
      setError(null)

      // Join rooms after connection
      roomsRef.current.forEach((room) => {
        if (room) {
          client.joinRoom(room)
        }
      })
    }

    const onDisconnected = () => {
      setConnected(false)
    }

    const onMessage = (data) => {
      setLastMessage(data)
    }

    const onError = (err) => {
      setError(err)
    }

    client.on('connected', onConnected)
    client.on('disconnected', onDisconnected)
    client.on('message', onMessage)
    client.on('error', onError)

    // Cleanup on unmount
    return () => {
      client.off('connected', onConnected)
      client.off('disconnected', onDisconnected)
      client.off('message', onMessage)
      client.off('error', onError)

      // Leave all rooms
      roomsRef.current.forEach((room) => {
        if (room) {
          client.leaveRoom(room)
        }
      })
    }
  }, [client])

  // Join new rooms when rooms prop changes
  useEffect(() => {
    if (connected) {
      const newRooms = Array.isArray(rooms) ? rooms : [rooms].filter(Boolean)
      const oldRooms = roomsRef.current

      // Join new rooms
      newRooms.forEach((room) => {
        if (room && !oldRooms.includes(room)) {
          client.joinRoom(room)
        }
      })

      // Leave old rooms
      oldRooms.forEach((room) => {
        if (room && !newRooms.includes(room)) {
          client.leaveRoom(room)
        }
      })

      roomsRef.current = newRooms
    }
  }, [connected, rooms, client])

  return {
    client,
    connected,
    lastMessage,
    error,
    send: (type, data) => client.send(type, data),
    joinRoom: (roomId) => {
      if (!roomsRef.current.includes(roomId)) {
        roomsRef.current.push(roomId)
      }
      client.joinRoom(roomId)
    },
    leaveRoom: (roomId) => {
      roomsRef.current = roomsRef.current.filter((r) => r !== roomId)
      client.leaveRoom(roomId)
    },
    broadcastToRoom: (roomId, data) => client.broadcastToRoom(roomId, data),
  }
}

export default useWebSocket
