const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../build")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend server is running",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

// API Routes
app.get("/api/status", (req, res) => {
  res.json({
    service: "React OAS Backend",
    version: "3.0",
    status: "operational",
    uptime: process.uptime(),
  });
});

// ============================================
// Authentication Endpoints
// ============================================

// Mock user database (in production, use proper database)
const users = [
  {
    email: "admin@mia.vn",
    password: "admin123", // In production, use hashed passwords
    fullName: "Admin User",
    role: "admin",
    permissions: ["*"],
  },
  {
    email: "user@mia.vn",
    password: "user123",
    fullName: "Regular User",
    role: "user",
    permissions: ["read"],
  },
];

// Login endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, mfaToken } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email và mật khẩu là bắt buộc",
      });
    }

    // Find user
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Email hoặc mật khẩu không đúng",
      });
    }

    // Check password (in production, use bcrypt to compare hashed passwords)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: "Email hoặc mật khẩu không đúng",
      });
    }

    // Generate token
    const token = `token_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}`;
    const sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}`;

    // Create user object (without password)
    const userObj = {
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      permissions: user.permissions,
      id: user.email.replace("@", "_").replace(".", "_"),
    };

    // Create session object
    const session = {
      session_id: sessionId,
      user_id: userObj.id,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };

    console.log(`✅ User logged in: ${email} at ${new Date().toISOString()}`);

    // Return success response
    res.json({
      success: true,
      user: userObj,
      session: session,
      token: token,
      message: "Đăng nhập thành công",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server khi xử lý đăng nhập",
    });
  }
});

// Verify session/token endpoint (support both GET and POST)
app.get("/api/auth/verify", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Token không được cung cấp",
      });
    }

    // In production, verify JWT token
    // For now, just check if token format is valid
    if (token.startsWith("token_")) {
      res.json({
        success: true,
        valid: true,
        message: "Token hợp lệ",
      });
    } else {
      res.status(401).json({
        success: false,
        error: "Token không hợp lệ",
      });
    }
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server khi xác minh token",
    });
  }
});

app.post("/api/auth/verify", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Token không được cung cấp",
      });
    }

    // In production, verify JWT token
    // For now, just check if token format is valid
    if (token.startsWith("token_")) {
      res.json({
        success: true,
        valid: true,
        message: "Token hợp lệ",
      });
    } else {
      res.status(401).json({
        success: false,
        error: "Token không hợp lệ",
      });
    }
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server khi xác minh token",
    });
  }
});

// Logout endpoint
app.post("/api/auth/logout", async (req, res) => {
  try {
    // In production, invalidate session/token in database
    console.log("User logged out");
    res.json({
      success: true,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server khi đăng xuất",
    });
  }
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send welcome message
  socket.emit("welcome", {
    message: "Connected to React OAS Backend",
    timestamp: new Date().toISOString(),
  });

  // Handle real-time data requests
  socket.on("request_data", (data) => {
    console.log("Data request received:", data);

    // Simulate real-time data
    const mockData = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      value: Math.random() * 100,
      status: "active",
    };

    socket.emit("data_update", mockData);
  });

  // Handle AI analytics requests
  socket.on("ai_analysis", (data) => {
    console.log("AI analysis request:", data);

    // Simulate AI processing
    setTimeout(() => {
      const aiResult = {
        id: Date.now(),
        prediction: Math.random() * 100,
        confidence: Math.random(),
        timestamp: new Date().toISOString(),
        analysis: "AI analysis completed",
      };

      socket.emit("ai_result", aiResult);
    }, 1000);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// ============================================
// Retail/Dashboard API Endpoints
// ============================================

// Retail Dashboard
app.get("/api/retail/dashboard", (req, res) => {
  res.json({
    success: true,
    data: {
      totalSales: 1250000,
      totalOrders: 342,
      averageOrderValue: 3654,
      conversionRate: 3.2,
      topProducts: [
        { name: "Product A", sales: 45000, quantity: 120 },
        { name: "Product B", sales: 38000, quantity: 95 },
      ],
    },
  });
});

// Sales Metrics
app.get("/api/retail/sales", (req, res) => {
  const timeframe = req.query.timeframe || "7d";
  res.json({
    success: true,
    data: {
      timeframe,
      totalSales: 1250000,
      growth: 12.5,
      metrics: [
        { date: "2025-11-19", sales: 180000 },
        { date: "2025-11-20", sales: 195000 },
        { date: "2025-11-21", sales: 210000 },
      ],
    },
  });
});

// Inventory Status
app.get("/api/retail/inventory", (req, res) => {
  res.json({
    success: true,
    data: {
      totalItems: 1250,
      lowStock: 45,
      outOfStock: 12,
      categories: [
        { name: "Electronics", count: 450, lowStock: 15 },
        { name: "Clothing", count: 320, lowStock: 8 },
      ],
    },
  });
});

// Customer Analytics
app.get("/api/retail/customers", (req, res) => {
  const timeframe = req.query.timeframe || "7d";
  res.json({
    success: true,
    data: {
      timeframe,
      totalCustomers: 1250,
      newCustomers: 85,
      activeCustomers: 450,
      segments: [
        { segment: "VIP", count: 120, revenue: 450000 },
        { segment: "Regular", count: 880, revenue: 650000 },
      ],
    },
  });
});

// Products
app.get("/api/retail/products", (req, res) => {
  res.json({
    success: true,
    data: {
      products: [
        { id: 1, name: "Product A", price: 99, stock: 45 },
        { id: 2, name: "Product B", price: 149, stock: 28 },
      ],
    },
  });
});

// Stores
app.get("/api/retail/stores", (req, res) => {
  res.json({
    success: true,
    data: {
      stores: [
        { id: 1, name: "Store A", location: "City A", sales: 450000 },
        { id: 2, name: "Store B", location: "City B", sales: 380000 },
      ],
    },
  });
});

// ============================================
// Serve React app for all non-API routes
// IMPORTANT: This must be LAST, after all API routes
// ============================================
app.get("*", (req, res) => {
  // Only serve React app for non-API routes
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "../build/index.html"));
  } else {
    // Return 404 for undefined API routes
    res.status(404).json({
      success: false,
      error: "API endpoint not found",
      path: req.path,
    });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 WebSocket server ready for connections`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});
