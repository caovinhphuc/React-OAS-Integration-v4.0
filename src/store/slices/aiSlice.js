import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunk để gọi AI API
export const fetchAIAnalysis = createAsyncThunk(
  'ai/fetchAnalysis',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8000/api/analyze', {
        data: data,
        type: 'general',
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || error.message)
    }
  },
)

export const fetchPrediction = createAsyncThunk(
  'ai/fetchPrediction',
  async (modelType, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/predict/${modelType}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || error.message)
    }
  },
)

export const fetchAvailableModels = createAsyncThunk(
  'ai/fetchModels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8000/api/models')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || error.message)
    }
  },
)

const initialState = {
  analysisResults: [],
  predictions: {},
  availableModels: [],
  isLoading: false,
  isAnalyzing: false,
  error: null,
  aiServiceStatus: 'disconnected',
}

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setAIServiceStatus: (state, action) => {
      state.aiServiceStatus = action.payload
    },
    addAnalysisResult: (state, action) => {
      state.analysisResults.unshift(action.payload)
      // Giữ chỉ 50 kết quả gần nhất
      if (state.analysisResults.length > 50) {
        state.analysisResults = state.analysisResults.slice(0, 50)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch AI Analysis
      .addCase(fetchAIAnalysis.pending, (state) => {
        state.isAnalyzing = true
        state.error = null
      })
      .addCase(fetchAIAnalysis.fulfilled, (state, action) => {
        state.isAnalyzing = false
        state.analysisResults.unshift(action.payload)
        if (state.analysisResults.length > 50) {
          state.analysisResults = state.analysisResults.slice(0, 50)
        }
      })
      .addCase(fetchAIAnalysis.rejected, (state, action) => {
        state.isAnalyzing = false
        state.error = action.payload
      })
      // Fetch Prediction
      .addCase(fetchPrediction.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPrediction.fulfilled, (state, action) => {
        state.isLoading = false
        state.predictions[action.meta.arg] = action.payload
      })
      .addCase(fetchPrediction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch Available Models
      .addCase(fetchAvailableModels.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAvailableModels.fulfilled, (state, action) => {
        state.isLoading = false
        state.availableModels = action.payload.available_models
      })
      .addCase(fetchAvailableModels.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setAIServiceStatus, addAnalysisResult } = aiSlice.actions

export default aiSlice.reducer
