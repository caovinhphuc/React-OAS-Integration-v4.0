import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import io from 'socket.io-client'

// Async thunk để kết nối WebSocket
export const connectWebSocket = createAsyncThunk(
  'dashboard/connectWebSocket',
  async (_, { dispatch }) => {
    const socket = io(window.location.origin, {
      path: '/ws',
    })

    socket.on('connect', () => {
      dispatch(setConnectionStatus('connected'))
      console.log('WebSocket connected')
    })

    socket.on('disconnect', () => {
      dispatch(setConnectionStatus('disconnected'))
      console.log('WebSocket disconnected')
    })

    socket.on('data_update', (data) => {
      dispatch(updateRealTimeData(data))
    })

    socket.on('welcome', (message) => {
      dispatch(setWelcomeMessage(message))
    })

    return socket
  },
)

const initialState = {
  connectionStatus: 'disconnected',
  realTimeData: [],
  welcomeMessage: null,
  isLoading: false,
  error: null,
  metrics: {
    totalRequests: 0,
    activeConnections: 0,
    averageResponseTime: 0,
    uptime: 0,
  },
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload
    },
    updateRealTimeData: (state, action) => {
      state.realTimeData.unshift(action.payload)
      // Giữ chỉ 100 record gần nhất
      if (state.realTimeData.length > 100) {
        state.realTimeData = state.realTimeData.slice(0, 100)
      }
      state.metrics.totalRequests += 1
    },
    setWelcomeMessage: (state, action) => {
      state.welcomeMessage = action.payload
    },
    updateMetrics: (state, action) => {
      state.metrics = { ...state.metrics, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWebSocket.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(connectWebSocket.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(connectWebSocket.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
  },
})

export const {
  setConnectionStatus,
  updateRealTimeData,
  setWelcomeMessage,
  updateMetrics,
  clearError,
} = dashboardSlice.actions

export default dashboardSlice.reducer
