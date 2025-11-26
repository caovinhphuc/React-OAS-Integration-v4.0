# 🔌 WebSocket Setup Guide - React OAS Integration v4.0

## 📋 Tổng Quan

Hướng dẫn thiết lập và sử dụng WebSocket (Socket.IO) cho real-time communication giữa Frontend và Backend.

## ✅ Đã Cài Đặt

### Frontend (React)

- ✅ `socket.io-client@4.8.1` - Client library cho WebSocket

### Backend (Node.js)

- ✅ `socket.io@4.8.1` - Server library cho WebSocket

## 🚀 Quick Start

### 1. Khởi động Backend Server

```bash
# Start backend server (WebSocket server sẽ tự động khởi động)
cd backend
npm start

# Hoặc từ root
npm run backend
```

Backend server sẽ chạy tại: `http://localhost:3001`

### 2. Kết nối từ Frontend

```javascript
import io from 'socket.io-client';

// Kết nối đến backend
const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling']
});

// Lắng nghe welcome message
socket.on('welcome', (data) => {
  console.log('Welcome:', data.message);
  console.log('Timestamp:', data.timestamp);
});

// Yêu cầu real-time data
socket.emit('request_data', {
  type: 'dashboard',
  timestamp: new Date().toISOString()
});

// Lắng nghe data updates
socket.on('data_update', (data) => {
  console.log('Data update:', data);
});

// Yêu cầu AI analysis
socket.emit('ai_analysis', {
  data: [1, 2, 3, 4, 5],
  model: 'test'
});

// Lắng nghe AI results
socket.on('ai_result', (result) => {
  console.log('AI result:', result);
});
```

## 📡 WebSocket Events

### Client → Server (Emit)

#### `request_data`

Yêu cầu real-time data từ server.

```javascript
socket.emit('request_data', {
  type: 'dashboard', // hoặc 'analytics', 'orders', etc.
  timestamp: new Date().toISOString()
});
```

#### `ai_analysis`

Yêu cầu AI analysis.

```javascript
socket.emit('ai_analysis', {
  data: [1, 2, 3, 4, 5],
  model: 'prediction' // hoặc 'classification', 'clustering', etc.
});
```

### Server → Client (Listen)

#### `welcome`

Message chào mừng khi client kết nối.

```javascript
socket.on('welcome', (data) => {
  // data.message: "Connected to React OAS Backend"
  // data.timestamp: ISO timestamp
});
```

#### `data_update`

Real-time data update từ server.

```javascript
socket.on('data_update', (data) => {
  // data.id: unique ID
  // data.timestamp: ISO timestamp
  // data.value: data value
  // data.status: status ('active', 'pending', etc.)
});
```

#### `ai_result`

AI analysis result từ server.

```javascript
socket.on('ai_result', (result) => {
  // result.id: unique ID
  // result.prediction: prediction value
  // result.confidence: confidence score (0-1)
  // result.timestamp: ISO timestamp
  // result.analysis: analysis description
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

```bash
# Backend URL (default: http://localhost:3001)
REACT_APP_API_URL=http://localhost:3001
```

### Backend Configuration

Backend server tự động cấu hình WebSocket với:

```javascript
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
```

### Frontend Configuration

```javascript
const socket = io(API_URL, {
  transports: ['websocket', 'polling'], // Fallback to polling nếu WebSocket fail
  timeout: 5000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});
```

## 📱 React Component Example

### Hook để sử dụng WebSocket

```javascript
// hooks/useWebSocket.js
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export function useWebSocket(url) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const newSocket = io(url, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected to WebSocket');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from WebSocket');
    });

    newSocket.on('data_update', (newData) => {
      setData(newData);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [url]);

  return { socket, connected, data };
}
```

### Sử dụng trong Component

```javascript
// components/Dashboard.jsx
import { useWebSocket } from '../hooks/useWebSocket';

function Dashboard() {
  const { socket, connected, data } = useWebSocket('http://localhost:3001');

  useEffect(() => {
    if (socket && connected) {
      // Request data khi component mount
      socket.emit('request_data', {
        type: 'dashboard'
      });
    }
  }, [socket, connected]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Status: {connected ? '✅ Connected' : '❌ Disconnected'}</p>
      {data && (
        <div>
          <p>Value: {data.value}</p>
          <p>Status: {data.status}</p>
        </div>
      )}
    </div>
  );
}
```

## 🔍 Troubleshooting

### Connection Failed

**Problem:** WebSocket không kết nối được

**Solutions:**

1. Kiểm tra backend server có đang chạy không:

   ```bash
   curl http://localhost:3001/health
   ```

2. Kiểm tra CORS configuration trong backend

3. Kiểm tra firewall/proxy settings

### Messages Not Received

**Problem:** Không nhận được messages từ server

**Solutions:**

1. Kiểm tra event names có đúng không
2. Kiểm tra socket connection status:

   ```javascript
   console.log('Socket connected:', socket.connected);
   ```

3. Kiểm tra server logs để xem có emit message không

### Connection Timeout

**Problem:** Connection timeout sau vài giây

**Solutions:**

1. Tăng timeout value:

   ```javascript
   const socket = io(url, {
     timeout: 10000 // 10 seconds
   });
   ```

2. Kiểm tra network latency

3. Sử dụng polling transport:

   ```javascript
   const socket = io(url, {
     transports: ['polling'] // Force polling
   });
   ```

## 📚 Additional Resources

- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Socket.IO Client API](https://socket.io/docs/v4/client-api/)
- [Socket.IO Server API](https://socket.io/docs/v4/server-api/)

## 🎯 Best Practices

1. **Always check connection status** before emitting events
2. **Handle disconnection** gracefully with reconnection logic
3. **Clean up sockets** in useEffect cleanup
4. **Use TypeScript** for better type safety (optional)
5. **Monitor connection** health in production

---

**✅ WebSocket đã được cài đặt và sẵn sàng sử dụng!**
