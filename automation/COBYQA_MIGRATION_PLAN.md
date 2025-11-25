# 🔄 Kế Hoạch Di Chuyển COBYQA

## 📍 Tình Trạng Hiện Tại

- **File hiện tại**: `automation/main copy.py` (COBYQA optimization library)
- **File liên quan**: `ai-service/ai_service.py` có endpoint `/ai/optimization` (nhưng chỉ là mock)

## 🎯 Phân Tích

### **Tại Sao Nên Di Chuyển Về `ai-service`?**

✅ **Lý do hợp lý:**
1. `ai-service` đã có endpoint `/ai/optimization` - có thể tích hợp COBYQA
2. Optimization là tính năng AI/ML - phù hợp với ai-service
3. Tách biệt concerns: automation vs AI services

❌ **Lý do không nên:**
1. File COBYQA thiếu dependencies (`.framework`, `.problem`, `.utils`, `.settings`)
2. Chưa có use case cụ thể trong ai-service
3. Có thể chỉ là file copy nhầm

## 💡 Đề Xuất

### **Option 1: Di Chuyển Và Tích Hợp** (Nếu muốn dùng)

```bash
# 1. Tạo cấu trúc trong ai-service
mkdir -p ai-service/optimization

# 2. Di chuyển file
mv "automation/main copy.py" ai-service/optimization/cobyqa_minimize.py

# 3. Tạo module wrapper
# ai-service/optimization/__init__.py
from .cobyqa_minimize import minimize

# 4. Tích hợp vào ai_service.py
from optimization import minimize as cobyqa_minimize

@app.post("/ai/optimization/solve")
async def solve_optimization(problem: OptimizationProblem):
    result = cobyqa_minimize(
        fun=problem.objective,
        x0=problem.initial_guess,
        bounds=problem.bounds,
        constraints=problem.constraints
    )
    return result
```

### **Option 2: Xóa File** (Khuyến nghị - nếu không dùng)

```bash
# File này thiếu dependencies và chưa có use case
rm "automation/main copy.py"
```

### **Option 3: Giữ Nguyên** (Nếu đang nghiên cứu)

- Giữ file ở automation
- Tạo documentation rõ ràng
- Đánh dấu là "experimental" hoặc "research"

## 🔍 Kiểm Tra Trước Khi Quyết Định

1. **Có cần optimization trong ai-service không?**
   - Warehouse optimization?
   - Resource allocation?
   - Schedule optimization?

2. **Có đầy đủ dependencies không?**
   - Cần tạo các modules: `.framework`, `.problem`, `.utils`, `.settings`

3. **Có use case cụ thể không?**
   - Nếu không có → Xóa
   - Nếu có → Di chuyển và tích hợp

## 📝 Kết Luận

**Khuyến nghị**:
- Nếu **KHÔNG** có kế hoạch dùng optimization → **Xóa file**
- Nếu **CÓ** kế hoạch → **Di chuyển về ai-service** và tích hợp vào endpoint `/ai/optimization`

