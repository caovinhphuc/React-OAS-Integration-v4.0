const { Server } = require('socket.io')
const http = require('http')

const server = http.createServer()

const io = new Server(server, {
  path: '/ws',
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  console.log('WS client connected:', socket.id)

  socket.emit('welcome', {
    message: 'Connected via WS 3002',
    timestamp: new Date().toISOString(),
  })
})

server.listen(3002, () => {
  console.log('WebSocket server running on ws://localhost:3002/ws')
})
