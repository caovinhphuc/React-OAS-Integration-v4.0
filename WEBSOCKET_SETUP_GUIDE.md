# 🔌 WebSocket Setup Guide - React OAS Integration v4.0

## 📋 Tổng Quan

Hướng dẫn thiết lập và sử dụng WebSocket (Socket.IO) cho real-time communication giữa Frontend và Backend. WebSocket cho phép truyền dữ liệu hai chiều, real-time với độ trễ thấp.

## ✅ Dependencies Đã Cài Đặt

### Frontend (React)

- ✅ `socket.io-client@4.7.2` - Client library cho WebSocket
- ✅ `react@18.2.0` - React framework
- ✅ `redux@5.0.0` - State management (optional)

### Backend (Node.js)

- ✅ `socket.io@4.8.1` - Server library cho WebSocket
- ✅ `ws@8.18.3` - WebSocket protocol implementation

## 🎯 Tính Năng Chính

- ✅ **Real-time Data Sync** - Đồng bộ dữ liệu tức thời
- ✅ **AI Analytics** - Phân tích AI real-time
- ✅ **Auto Reconnection** - Tự động kết nối lại
- ✅ **Event-based Communication** - Giao tiếp dựa trên events
- ✅ **Room Support** - Hỗ trợ phòng chat/channels
- ✅ **Binary Data** - Truyền dữ liệu binary
- ✅ **Fallback to Polling** - Tự động chuyển sang polling nếu WebSocket fail

## 🚀 Quick Start

### 1. Khởi động Backend Server

```bash
# Option 1: Start backend only
cd backend
npm start

# Option 2: Start từ root directory
npm run backend

# Option 3: Start tất cả services (Frontend + Backend + AI)
npm run dev

# Option 4: Start với custom script
bash start_dev_servers.sh
```

**Backend server sẽ chạy tại:** `http://localhost:3001`

**WebSocket endpoint:** `ws://localhost:3001/socket.io/`

### 2. Verify Backend đang chạy

```bash
# Check health endpoint
curl http://localhost:3001/health

# Check ports
npm run check:ports

# Test WebSocket connection
npm run test:websocket
```

### 3. Kết nối từ Frontend

#### Basic Connection

```javascript
import io from 'socket.io-client';

// Kết nối đến backend
const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000
});

// Connection events
socket.on('connect', () => {
  console.log('✅ Connected to WebSocket server');
  console.log('Socket ID:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('❌ Disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
});

// Lắng nghe welcome message
socket.on('welcome', (data) => {
  console.log('Welcome:', data.message);
  console.log('Timestamp:', data.timestamp);
});
```

#### Request Real-time Data

```javascript
// Yêu cầu dashboard data
socket.emit('request_data', {
  type: 'dashboard',
  filters: {
    dateRange: 'today',
    metrics: ['sales', 'orders', 'revenue']
  },
  timestamp: new Date().toISOString()
});

// Lắng nghe data updates
socket.on('data_update', (data) => {
  console.log('Data update:', data);
  // Update UI với data mới
});
```

#### Request AI Analysis

```javascript
// Yêu cầu AI prediction
socket.emit('ai_analysis', {
  type: 'prediction',
  data: {
    sales: [100, 150, 200, 180, 220],
    dates: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05']
  },
  model: 'sales_forecast',
  options: {
    horizon: 7, // predict next 7 days
    confidence: 0.95
  }
});

// Lắng nghe AI results
socket.on('ai_result', (result) => {
  console.log('AI result:', result);
  console.log('Prediction:', result.prediction);
  console.log('Confidence:', result.confidence);
});
```

## 📡 WebSocket Events API

### 🔵 Client → Server (Emit Events)

#### `request_data` - Yêu cầu Real-time Data

Yêu cầu dữ liệu real-time từ server.

```javascript
socket.emit('request_data', {
  type: 'dashboard',      // Type: 'dashboard' | 'analytics' | 'orders' | 'inventory'
  filters: {
    dateRange: 'today',   // 'today' | 'week' | 'month' | 'custom'
    metrics: ['sales', 'orders', 'revenue'],
    storeId: 'store-001'  // Optional: filter by store
  },
  timestamp: new Date().toISOString()
});
```

**Response:** Server sẽ emit `data_update` event với data tương ứng.

#### `ai_analysis` - Yêu cầu AI Analysis

Yêu cầu phân tích AI từ server.

```javascript
socket.emit('ai_analysis', {
  type: 'prediction',     // 'prediction' | 'classification' | 'clustering' | 'anomaly'
  data: {
    sales: [100, 150, 200, 180, 220],
    dates: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05']
  },
  model: 'sales_forecast', // Model name
  options: {
    horizon: 7,           // Prediction horizon (days)
    confidence: 0.95,     // Confidence level
    includeIntervals: true // Include confidence intervals
  }
});
```

**Response:** Server sẽ emit `ai_result` event với kết quả phân tích.

#### `subscribe` - Subscribe to Channel

Subscribe vào một channel để nhận updates.

```javascript
socket.emit('subscribe', {
  channel: 'sales_updates', // Channel name
  filters: {
    storeId: 'store-001',
    category: 'electronics'
  }
});
```

#### `unsubscribe` - Unsubscribe from Channel

Hủy subscribe khỏi channel.

```javascript
socket.emit('unsubscribe', {
  channel: 'sales_updates'
});
```

#### `ping` - Health Check

Kiểm tra connection health.

```javascript
socket.emit('ping', {
  timestamp: new Date().toISOString()
});
```

**Response:** Server sẽ emit `pong` event.

---

### 🟢 Server → Client (Listen Events)

#### `connect` - Connection Established

Được emit khi kết nối thành công.

```javascript
socket.on('connect', () => {
  console.log('Connected to server');
  console.log('Socket ID:', socket.id);
});
```

#### `disconnect` - Connection Lost

Được emit khi mất kết nối.

```javascript
socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  // Reasons: 'transport close', 'ping timeout', 'client namespace disconnect', etc.
});
```

#### `connect_error` - Connection Error

Được emit khi có lỗi kết nối.

```javascript
socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
});
```

#### `welcome` - Welcome Message

Message chào mừng khi client kết nối thành công.

```javascript
socket.on('welcome', (data) => {
  console.log('Welcome:', data.message);
  // Response format:
  // {
  //   message: "Connected to React OAS Backend",
  //   timestamp: "2024-12-11T05:00:00.000Z",
  //   socketId: "abc123",
  //   version: "4.0.0"
  // }
});
```

#### `data_update` - Real-time Data Update

Real-time data update từ server.

```javascript
socket.on('data_update', (data) => {
  console.log('Data update:', data);
  // Response format:
  // {
  //   id: "update-001",
  //   type: "dashboard",
  //   timestamp: "2024-12-11T05:00:00.000Z",
  //   data: {
  //     sales: 15000,
  //     orders: 120,
  //     revenue: 250000
  //   },
  //   status: "active"
  // }
});
```

#### `ai_result` - AI Analysis Result

Kết quả phân tích AI từ server.

```javascript
socket.on('ai_result', (result) => {
  console.log('AI result:', result);
  // Response format:
  // {
  //   id: "ai-001",
  //   type: "prediction",
  //   timestamp: "2024-12-11T05:00:00.000Z",
  //   prediction: [230, 245, 260, 275, 290, 305, 320],
  //   confidence: 0.92,
  //   intervals: {
  //     lower: [210, 225, 240, 255, 270, 285, 300],
  //     upper: [250, 265, 280, 295, 310, 325, 340]
  //   },
  //   analysis: "Sales trend is increasing with 92% confidence",
  //   metadata: {
  //     model: "sales_forecast",
  //     version: "1.0.0",
  //     processingTime: 125
  //   }
  // }
});
```

#### `error` - Error Event

Được emit khi có lỗi xảy ra.

```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error);
  // Response format:
  // {
  //   code: "ERR_001",
  //   message: "Invalid request format",
  //   timestamp: "2024-12-11T05:00:00.000Z"
  // }
});
```

#### `pong` - Ping Response

Response cho ping request.

```javascript
socket.on('pong', (data) => {
  console.log('Pong received:', data);
  // Response format:
  // {
  //   timestamp: "2024-12-11T05:00:00.000Z",
  //   latency: 25 // ms
  // }
});
```

#### `notification` - System Notification

Thông báo từ hệ thống.

```javascript
socket.on('notification', (notification) => {
  console.log('Notification:', notification);
  // Response format:
  // {
  //   id: "notif-001",
  //   type: "info" | "warning" | "error" | "success",
  //   title: "System Update",
  //   message: "New features available",
  //   timestamp: "2024-12-11T05:00:00.000Z",
  //   priority: "high" | "medium" | "low"
  // }
});
```

## 🧪 Testing WebSocket

### Chạy Test Script

```bash
# Test WebSocket connection
npm run test:websocket
```

Test script sẽ kiểm tra:

- ✅ WebSocket connection
- ✅ Welcome message
- ✅ Real-time data updates
- ✅ AI analysis results

### Test Manually

1. **Start backend server:**

   ```bash
   cd backend
   npm start
   ```

2. **Run test script:**

   ```bash
   npm run test:websocket
   ```

3. **Expected output:**

   ```
   🔌 WebSocket Connection Test
   ======================================================================

   🔗 Connecting to: http://localhost:3001
      ✅ Connected to WebSocket server
      📡 Socket ID: [socket-id]
      ✅ Received welcome message
      📨 Message: Connected to React OAS Backend
      ✅ Received data update
      ✅ Received AI result

   ✅ ALL TESTS PASSED
   ```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)

```bash
# Backend WebSocket URL
REACT_APP_API_URL=http://localhost:3001

# WebSocket Configuration
REACT_APP_WS_TIMEOUT=10000
REACT_APP_WS_RECONNECTION_ATTEMPTS=5
REACT_APP_WS_RECONNECTION_DELAY=1000

# Feature Flags
REACT_APP_ENABLE_WEBSOCKET=true
REACT_APP_ENABLE_AI_ANALYTICS=true
```

#### Backend (.env)

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# WebSocket Configuration
WS_CORS_ORIGIN=*
WS_PING_TIMEOUT=60000
WS_PING_INTERVAL=25000

# AI Service
AI_SERVICE_URL=http://localhost:8000
```

### Backend Configuration (server.js)

```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// WebSocket Configuration
const io = socketIo(server, {
  cors: {
    origin: process.env.WS_CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: parseInt(process.env.WS_PING_TIMEOUT) || 60000,
  pingInterval: parseInt(process.env.WS_PING_INTERVAL) || 25000,
  transports: ['websocket', 'polling'],
  allowEIO3: true, // Backward compatibility
  maxHttpBufferSize: 1e6, // 1MB
  connectTimeout: 45000
});

// Connection handler
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  // Send welcome message
  socket.emit('welcome', {
    message: 'Connected to React OAS Backend',
    timestamp: new Date().toISOString(),
    socketId: socket.id,
    version: '4.0.0'
  });

  // Handle events
  socket.on('request_data', (data) => {
    // Handle data request
  });

  socket.on('ai_analysis', (data) => {
    // Handle AI analysis request
  });

  socket.on('disconnect', (reason) => {
    console.log(`❌ Client disconnected: ${socket.id} - ${reason}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`🌐 WebSocket server ready for connections`);
});
```

### Frontend Configuration (React)

#### Option 1: Using Environment Variables

```javascript
import io from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const WS_TIMEOUT = parseInt(process.env.REACT_APP_WS_TIMEOUT) || 10000;
const WS_RECONNECTION_ATTEMPTS = parseInt(process.env.REACT_APP_WS_RECONNECTION_ATTEMPTS) || 5;
const WS_RECONNECTION_DELAY = parseInt(process.env.REACT_APP_WS_RECONNECTION_DELAY) || 1000;

const socket = io(API_URL, {
  transports: ['websocket', 'polling'],
  timeout: WS_TIMEOUT,
  reconnection: true,
  reconnectionAttempts: WS_RECONNECTION_ATTEMPTS,
  reconnectionDelay: WS_RECONNECTION_DELAY,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  autoConnect: true,
  withCredentials: false
});
```

#### Option 2: Using Config File

```javascript
// config/websocket.config.js
export const WEBSOCKET_CONFIG = {
  url: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  options: {
    transports: ['websocket', 'polling'],
    timeout: 10000,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,
    autoConnect: true,
    withCredentials: false,
    forceNew: false,
    multiplex: true,
    path: '/socket.io/'
  }
};

// Usage
import io from 'socket.io-client';
import { WEBSOCKET_CONFIG } from './config/websocket.config';

const socket = io(WEBSOCKET_CONFIG.url, WEBSOCKET_CONFIG.options);
```

## 📱 React Implementation Examples

### 1. Custom Hook - useWebSocket

```javascript
// hooks/useWebSocket.js
import { useEffect, useState, useCallback, useRef } from 'react';
import io from 'socket.io-client';

export function useWebSocket(url, options = {}) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    // Create socket connection
    const newSocket = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      ...options
    });

    // Connection events
    newSocket.on('connect', () => {
      setConnected(true);
      setError(null);
      reconnectAttempts.current = 0;
      console.log('✅ WebSocket connected:', newSocket.id);
    });

    newSocket.on('disconnect', (reason) => {
      setConnected(false);
      console.log('❌ WebSocket disconnected:', reason);
    });

    newSocket.on('connect_error', (err) => {
      setError(err.message);
      reconnectAttempts.current += 1;
      console.error('Connection error:', err.message);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts');
    });

    newSocket.on('reconnect_failed', () => {
      setError('Failed to reconnect after multiple attempts');
    });

    // Store all received messages
    const handleMessage = (event, data) => {
      setLastMessage({ event, data, timestamp: new Date() });
    };

    // Listen to all events
    newSocket.onAny(handleMessage);

    setSocket(newSocket);

    // Cleanup
    return () => {
      newSocket.offAny(handleMessage);
      newSocket.close();
    };
  }, [url]);

  // Emit event helper
  const emit = useCallback((event, data) => {
    if (socket && connected) {
      socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit:', event);
    }
  }, [socket, connected]);

  // Subscribe to specific event
  const on = useCallback((event, callback) => {
    if (socket) {
      socket.on(event, callback);
      return () => socket.off(event, callback);
    }
  }, [socket]);

  // Unsubscribe from event
  const off = useCallback((event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  }, [socket]);

  return {
    socket,
    connected,
    error,
    lastMessage,
    reconnectAttempts: reconnectAttempts.current,
    emit,
    on,
    off
  };
}
```

### 2. Context Provider - WebSocketProvider

```javascript
// contexts/WebSocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const WebSocketContext = createContext(null);

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children, url }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const newSocket = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('✅ WebSocket connected');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('❌ WebSocket disconnected');
    });

    newSocket.on('notification', (notification) => {
      setNotifications(prev => [...prev, notification]);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [url]);

  const value = {
    socket,
    connected,
    notifications,
    clearNotifications: () => setNotifications([])
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
```

### 3. Dashboard Component Example

```javascript
// components/Dashboard/LiveDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Card, Statistic, Badge, Alert } from 'antd';

function LiveDashboard() {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  const { socket, connected, error, emit, on } = useWebSocket(API_URL);

  const [dashboardData, setDashboardData] = useState({
    sales: 0,
    orders: 0,
    revenue: 0
  });
  const [aiPrediction, setAiPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Subscribe to data updates
  useEffect(() => {
    if (!connected) return;

    // Request initial data
    emit('request_data', {
      type: 'dashboard',
      filters: { dateRange: 'today' }
    });

    // Listen for data updates
    const unsubscribe = on('data_update', (data) => {
      console.log('Received data update:', data);
      setDashboardData(data.data);
    });

    return unsubscribe;
  }, [connected, emit, on]);

  // Request AI prediction
  const requestPrediction = () => {
    if (!connected) return;

    setLoading(true);
    emit('ai_analysis', {
      type: 'prediction',
      data: {
        sales: [100, 150, 200, 180, 220],
        dates: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05']
      },
      model: 'sales_forecast',
      options: { horizon: 7 }
    });
  };

  // Listen for AI results
  useEffect(() => {
    if (!connected) return;

    const unsubscribe = on('ai_result', (result) => {
      console.log('Received AI result:', result);
      setAiPrediction(result);
      setLoading(false);
    });

    return unsubscribe;
  }, [connected, on]);

  return (
    <div className="live-dashboard">
      <div className="status-bar">
        <Badge
          status={connected ? 'success' : 'error'}
          text={connected ? 'Connected' : 'Disconnected'}
        />
      </div>

      {error && (
        <Alert
          message="Connection Error"
          description={error}
          type="error"
          closable
        />
      )}

      <div className="metrics-grid">
        <Card>
          <Statistic
            title="Sales Today"
            value={dashboardData.sales}
            prefix="$"
          />
        </Card>
        <Card>
          <Statistic
            title="Orders"
            value={dashboardData.orders}
          />
        </Card>
        <Card>
          <Statistic
            title="Revenue"
            value={dashboardData.revenue}
            prefix="$"
          />
        </Card>
      </div>

      <Card title="AI Prediction">
        <button
          onClick={requestPrediction}
          disabled={!connected || loading}
        >
          {loading ? 'Loading...' : 'Get Prediction'}
        </button>

        {aiPrediction && (
          <div className="prediction-result">
            <p>Prediction: {JSON.stringify(aiPrediction.prediction)}</p>
            <p>Confidence: {(aiPrediction.confidence * 100).toFixed(1)}%</p>
            <p>Analysis: {aiPrediction.analysis}</p>
          </div>
        )}
      </Card>
    </div>
  );
}

export default LiveDashboard;
```

### 4. Real-time Notifications Component

```javascript
// components/Notifications/RealTimeNotifications.jsx
import React, { useEffect, useState } from 'react';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import { notification } from 'antd';

function RealTimeNotifications() {
  const { socket, connected, notifications } = useWebSocketContext();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (!socket || !connected) return;

    const handleNotification = (notif) => {
      api[notif.type]({
        message: notif.title,
        description: notif.message,
        placement: 'topRight',
        duration: 4.5
      });
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket, connected, api]);

  return (
    <>
      {contextHolder}
      <div className="notifications-list">
        {notifications.map((notif, index) => (
          <div key={index} className={`notification notification-${notif.type}`}>
            <strong>{notif.title}</strong>
            <p>{notif.message}</p>
            <small>{new Date(notif.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </>
  );
}

export default RealTimeNotifications;
```

## 🔍 Troubleshooting

### 1. Connection Failed

**Triệu chứng:** WebSocket không kết nối được, hiển thị "Connection error: websocket error"

**Nguyên nhân:**

- Backend server không chạy
- Port bị block hoặc đã được sử dụng
- CORS configuration sai
- Firewall/proxy chặn connection

**Giải pháp:**

```bash
# Step 1: Kiểm tra backend có chạy không
curl http://localhost:3001/health

# Step 2: Kiểm tra port status
lsof -i:3001
npm run check:ports

# Step 3: Start backend nếu chưa chạy
cd backend
npm start

# Step 4: Test WebSocket connection
npm run test:websocket
```

**Kiểm tra CORS trong backend:**

```javascript
// backend/server.js
const io = socketIo(server, {
  cors: {
    origin: "*", // Hoặc specific origin: "http://localhost:3000"
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

### 2. Messages Not Received

**Triệu chứng:** Kết nối thành công nhưng không nhận được messages

**Nguyên nhân:**

- Event name không khớp
- Socket chưa connected khi emit
- Server không emit event
- Listener chưa được setup đúng

**Giải pháp:**

```javascript
// Kiểm tra connection status trước khi emit
if (socket.connected) {
  socket.emit('request_data', { type: 'dashboard' });
} else {
  console.warn('Socket not connected yet');
}

// Debug: Log tất cả events
socket.onAny((event, ...args) => {
  console.log(`Event received: ${event}`, args);
});

// Kiểm tra event names
console.log('Listening events:', socket.eventNames());
```

**Kiểm tra server logs:**

```bash
# View backend logs
tail -f logs/backend.log

# Hoặc check console output nếu chạy trong terminal
```

### 3. Connection Timeout

**Triệu chứng:** Connection timeout sau vài giây

**Nguyên nhân:**

- Network latency cao
- Server response chậm
- Timeout setting quá thấp
- DNS resolution issues

**Giải pháp:**

```javascript
// Tăng timeout value
const socket = io(url, {
  timeout: 20000, // 20 seconds
  reconnectionDelay: 2000,
  reconnectionDelayMax: 10000
});

// Sử dụng polling transport nếu WebSocket fail
const socket = io(url, {
  transports: ['polling', 'websocket'], // Try polling first
  upgrade: true // Allow upgrade to WebSocket
});

// Force polling only (for debugging)
const socket = io(url, {
  transports: ['polling']
});
```

### 4. Frequent Disconnections

**Triệu chứng:** Socket disconnect và reconnect liên tục

**Nguyên nhân:**

- Network không ổn định
- Server restart
- Ping timeout
- Memory leaks

**Giải pháp:**

```javascript
// Tăng ping timeout
const socket = io(url, {
  pingTimeout: 60000,    // 60 seconds
  pingInterval: 25000,   // 25 seconds
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000
});

// Monitor connection health
socket.on('ping', () => {
  console.log('Ping sent');
});

socket.on('pong', (latency) => {
  console.log('Pong received, latency:', latency, 'ms');
});

// Handle reconnection
socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected after', attemptNumber, 'attempts');
});

socket.on('reconnect_failed', () => {
  console.error('Failed to reconnect');
  // Implement fallback logic
});
```

### 5. Memory Leaks

**Triệu chứng:** Ứng dụng chậm dần theo thời gian, memory tăng

**Nguyên nhân:**

- Không cleanup listeners
- Socket không được close
- Event listeners duplicate

**Giải pháp:**

```javascript
// React: Always cleanup in useEffect
useEffect(() => {
  const socket = io(url);

  const handleDataUpdate = (data) => {
    // Handle data
  };

  socket.on('data_update', handleDataUpdate);

  // Cleanup function
  return () => {
    socket.off('data_update', handleDataUpdate);
    socket.close();
  };
}, [url]);

// Remove all listeners
socket.removeAllListeners();

// Check active listeners
console.log('Active listeners:', socket.eventNames());
```

### 6. CORS Errors

**Triệu chứng:** "Access-Control-Allow-Origin" error trong browser console

**Nguyên nhân:**

- CORS không được cấu hình đúng
- Origin không được allow
- Credentials setting sai

**Giải pháp:**

```javascript
// Backend: Cấu hình CORS đúng
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://your-domain.com"
    ],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  }
});

// Frontend: Match credentials setting
const socket = io(url, {
  withCredentials: true
});
```

### 7. Port Conflicts

**Triệu chứng:** "Port already in use" error

**Giải pháp:**

```bash
# Kill process on port 3001
npm run kill:port 3001

# Or manually
lsof -ti:3001 | xargs kill -9

# Fix all port conflicts
npm run fix:ports

# Check all ports
npm run check:ports
```

### 8. Performance Issues

**Triệu chứng:** Slow response, high latency, lag

**Giải pháp:**

```javascript
// 1. Reduce message frequency
let lastEmit = 0;
const THROTTLE_MS = 1000;

function throttledEmit(event, data) {
  const now = Date.now();
  if (now - lastEmit > THROTTLE_MS) {
    socket.emit(event, data);
    lastEmit = now;
  }
}

// 2. Use binary data for large payloads
socket.emit('large_data', Buffer.from(largeData));

// 3. Compress data before sending
const compressed = pako.gzip(JSON.stringify(data));
socket.emit('compressed_data', compressed);

// 4. Batch multiple updates
const updates = [];
function batchUpdate(update) {
  updates.push(update);
  if (updates.length >= 10) {
    socket.emit('batch_update', updates);
    updates.length = 0;
  }
}

// 5. Monitor performance
const startTime = Date.now();
socket.emit('request_data', { type: 'dashboard' });

socket.on('data_update', (data) => {
  const latency = Date.now() - startTime;
  console.log('Latency:', latency, 'ms');

  if (latency > 1000) {
    console.warn('High latency detected');
  }
});
```

## 🎯 Best Practices

### 1. Connection Management

```javascript
// ✅ GOOD: Check connection before emit
if (socket.connected) {
  socket.emit('request_data', { type: 'dashboard' });
} else {
  console.warn('Socket not connected');
  // Queue request or show error
}

// ❌ BAD: Emit without checking
socket.emit('request_data', { type: 'dashboard' });
```

### 2. Event Listeners Cleanup

```javascript
// ✅ GOOD: Cleanup in useEffect
useEffect(() => {
  const handleUpdate = (data) => { /* ... */ };
  socket.on('data_update', handleUpdate);

  return () => {
    socket.off('data_update', handleUpdate);
  };
}, [socket]);

// ❌ BAD: No cleanup
useEffect(() => {
  socket.on('data_update', (data) => { /* ... */ });
}, [socket]);
```

### 3. Error Handling

```javascript
// ✅ GOOD: Comprehensive error handling
socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
  // Show user-friendly error
  showNotification('Connection failed. Retrying...');
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
  // Log to error tracking service
  logError(error);
});

// ❌ BAD: No error handling
socket.on('connect_error', () => {});
```

### 4. Reconnection Strategy

```javascript
// ✅ GOOD: Smart reconnection
const socket = io(url, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5 // Add jitter
});

let reconnectCount = 0;
socket.on('reconnect_attempt', () => {
  reconnectCount++;
  if (reconnectCount > 3) {
    console.warn('Multiple reconnection attempts');
    // Consider fallback strategy
  }
});

// ❌ BAD: Infinite reconnection
const socket = io(url, {
  reconnectionAttempts: Infinity // Can cause issues
});
```

### 5. Data Validation

```javascript
// ✅ GOOD: Validate received data
socket.on('data_update', (data) => {
  if (!data || typeof data !== 'object') {
    console.error('Invalid data received');
    return;
  }

  if (!data.timestamp || !data.value) {
    console.error('Missing required fields');
    return;
  }

  // Process valid data
  updateDashboard(data);
});

// ❌ BAD: No validation
socket.on('data_update', (data) => {
  updateDashboard(data); // May crash if data is invalid
});
```

### 6. Performance Optimization

```javascript
// ✅ GOOD: Throttle frequent updates
import { throttle } from 'lodash';

const throttledUpdate = throttle((data) => {
  socket.emit('update', data);
}, 1000);

// ✅ GOOD: Batch updates
const updates = [];
const flushUpdates = () => {
  if (updates.length > 0) {
    socket.emit('batch_update', updates);
    updates.length = 0;
  }
};

setInterval(flushUpdates, 5000);

// ❌ BAD: Emit on every change
onChange((data) => {
  socket.emit('update', data); // Too frequent
});
```

### 7. Security

```javascript
// ✅ GOOD: Validate and sanitize data
socket.on('user_input', (input) => {
  // Validate input
  if (typeof input !== 'string' || input.length > 1000) {
    return;
  }

  // Sanitize
  const sanitized = DOMPurify.sanitize(input);
  processInput(sanitized);
});

// ✅ GOOD: Use authentication
const socket = io(url, {
  auth: {
    token: getAuthToken()
  }
});

// ❌ BAD: No validation or auth
socket.on('user_input', (input) => {
  processInput(input); // Security risk
});
```

### 8. Monitoring & Logging

```javascript
// ✅ GOOD: Monitor connection health
let connectionStartTime = Date.now();

socket.on('connect', () => {
  connectionStartTime = Date.now();
  logMetric('websocket_connected', 1);
});

socket.on('disconnect', () => {
  const duration = Date.now() - connectionStartTime;
  logMetric('websocket_duration', duration);
});

socket.on('data_update', (data) => {
  const latency = Date.now() - new Date(data.timestamp).getTime();
  logMetric('websocket_latency', latency);
});

// ✅ GOOD: Log important events
socket.onAny((event, ...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[WebSocket] ${event}:`, args);
  }
});
```

### 9. Testing

```javascript
// ✅ GOOD: Mock socket for testing
import { io } from 'socket.io-client';

jest.mock('socket.io-client');

describe('useWebSocket', () => {
  it('should connect to server', () => {
    const mockSocket = {
      on: jest.fn(),
      emit: jest.fn(),
      connected: true
    };

    io.mockReturnValue(mockSocket);

    const { result } = renderHook(() => useWebSocket('http://localhost:3001'));

    expect(result.current.connected).toBe(true);
  });
});
```

### 10. Documentation

```javascript
// ✅ GOOD: Document events
/**
 * Request real-time dashboard data
 * @param {Object} options - Request options
 * @param {string} options.type - Data type ('dashboard' | 'analytics')
 * @param {Object} options.filters - Filter options
 * @param {string} options.filters.dateRange - Date range filter
 * @returns {void}
 * @emits data_update - When data is available
 */
function requestData(options) {
  socket.emit('request_data', options);
}
```

## 📊 Performance Metrics

### Recommended Thresholds

| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| Connection Time | < 500ms | 500-1000ms | > 1000ms |
| Latency | < 100ms | 100-500ms | > 500ms |
| Reconnection Rate | < 1/hour | 1-5/hour | > 5/hour |
| Message Rate | < 100/sec | 100-500/sec | > 500/sec |
| Memory Usage | < 50MB | 50-100MB | > 100MB |

### Monitoring Example

```javascript
// Monitor WebSocket health
class WebSocketMonitor {
  constructor(socket) {
    this.socket = socket;
    this.metrics = {
      connectionTime: 0,
      latency: [],
      reconnections: 0,
      messagesReceived: 0,
      messagesSent: 0,
      errors: 0
    };

    this.setupMonitoring();
  }

  setupMonitoring() {
    const startTime = Date.now();

    this.socket.on('connect', () => {
      this.metrics.connectionTime = Date.now() - startTime;
    });

    this.socket.on('reconnect', () => {
      this.metrics.reconnections++;
    });

    this.socket.on('error', () => {
      this.metrics.errors++;
    });

    this.socket.onAny(() => {
      this.metrics.messagesReceived++;
    });
  }

  getMetrics() {
    return {
      ...this.metrics,
      avgLatency: this.metrics.latency.reduce((a, b) => a + b, 0) / this.metrics.latency.length,
      health: this.calculateHealth()
    };
  }

  calculateHealth() {
    if (this.metrics.errors > 10) return 'critical';
    if (this.metrics.reconnections > 5) return 'warning';
    return 'good';
  }
}

// Usage
const monitor = new WebSocketMonitor(socket);
setInterval(() => {
  console.log('WebSocket Metrics:', monitor.getMetrics());
}, 60000); // Log every minute
```

## 🧪 Testing Guide

### Unit Testing

```javascript
// test/useWebSocket.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import { useWebSocket } from '../hooks/useWebSocket';
import io from 'socket.io-client';

jest.mock('socket.io-client');

describe('useWebSocket', () => {
  let mockSocket;

  beforeEach(() => {
    mockSocket = {
      on: jest.fn(),
      emit: jest.fn(),
      off: jest.fn(),
      close: jest.fn(),
      connected: true
    };

    io.mockReturnValue(mockSocket);
  });

  it('should establish connection', () => {
    const { result } = renderHook(() => useWebSocket('http://localhost:3001'));

    expect(io).toHaveBeenCalledWith('http://localhost:3001', expect.any(Object));
    expect(result.current.socket).toBe(mockSocket);
  });

  it('should emit events', () => {
    const { result } = renderHook(() => useWebSocket('http://localhost:3001'));

    act(() => {
      result.current.emit('test_event', { data: 'test' });
    });

    expect(mockSocket.emit).toHaveBeenCalledWith('test_event', { data: 'test' });
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => useWebSocket('http://localhost:3001'));

    unmount();

    expect(mockSocket.close).toHaveBeenCalled();
  });
});
```

### Integration Testing

```bash
# Run WebSocket test
npm run test:websocket

# Run all tests
npm run test:all
```

## 📚 Additional Resources

### Official Documentation

- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Socket.IO Client API](https://socket.io/docs/v4/client-api/)
- [Socket.IO Server API](https://socket.io/docs/v4/server-api/)
- [WebSocket Protocol RFC](https://tools.ietf.org/html/rfc6455)

### Project Documentation

- [WebSocket Troubleshooting Guide](./WEBSOCKET_TROUBLESHOOTING.md)
- [Port Configuration Guide](./verify_port_config.sh)
- [Development Workflow](./start_dev_servers.sh)

### Tutorials & Examples

- [Real-time Dashboard Example](./src/components/Dashboard/LiveDashboard.jsx)
- [WebSocket Hook Example](./src/hooks/useWebSocket.js)
- [Context Provider Example](./src/contexts/WebSocketContext.jsx)

### Tools

- [Socket.IO Client Tool](https://amritb.github.io/socketio-client-tool/)
- [WebSocket Test Tool](https://www.websocket.org/echo.html)
- [Postman WebSocket Support](https://www.postman.com/features/websocket-client/)

## 🚀 Quick Commands

```bash
# Start backend server
npm run backend

# Test WebSocket connection
npm run test:websocket

# Check backend health
curl http://localhost:3001/health

# Check ports
npm run check:ports

# Fix port conflicts
npm run fix:ports

# Start all services
npm run dev

# View backend logs
tail -f logs/backend.log

# Kill process on port
npm run kill:port 3001
```

## 📝 Checklist

### Development Setup

- [ ] Backend server installed and running
- [ ] `socket.io-client` installed in frontend
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] WebSocket test passing

### Production Deployment

- [ ] SSL/TLS configured for wss://
- [ ] Load balancer configured for sticky sessions
- [ ] Connection pooling configured
- [ ] Monitoring and logging setup
- [ ] Error tracking integrated
- [ ] Rate limiting implemented
- [ ] Authentication/authorization implemented
- [ ] Backup connection strategy (polling)

### Performance

- [ ] Connection time < 500ms
- [ ] Latency < 100ms
- [ ] Reconnection rate < 1/hour
- [ ] Memory usage monitored
- [ ] Message rate optimized

---

## ✅ Summary

WebSocket (Socket.IO) đã được cài đặt và cấu hình đầy đủ cho React OAS Integration v4.0:

- ✅ **Real-time Communication** - Giao tiếp hai chiều tức thời
- ✅ **Auto Reconnection** - Tự động kết nối lại khi mất kết nối
- ✅ **Event-based API** - API dựa trên events dễ sử dụng
- ✅ **Production Ready** - Sẵn sàng cho production với monitoring
- ✅ **Well Documented** - Tài liệu đầy đủ và ví dụ cụ thể
- ✅ **Best Practices** - Tuân thủ best practices và security

**🎉 WebSocket đã sẵn sàng sử dụng!**
