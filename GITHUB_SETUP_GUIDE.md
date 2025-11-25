# 🚀 HƯỚNG DẪN TẠO GITHUB REPOSITORY MỚI

## 📋 BƯỚC 1: CHUẨN BỊ REPOSITORY

### 1.1 Chạy script chuẩn bị

```bash
# Chạy script để kiểm tra và chuẩn bị repository
./scripts/prepare_github_repo.sh
```

Script này sẽ:

- ✅ Kiểm tra Git repository
- ✅ Kiểm tra .gitignore
- ✅ Kiểm tra LICENSE
- ✅ Kiểm tra các file nhạy cảm
- ✅ Hiển thị trạng thái hiện tại

### 1.2 Kiểm tra các file quan trọng

```bash
# Kiểm tra .gitignore
cat .gitignore

# Kiểm tra LICENSE
cat LICENSE

# Kiểm tra README.md
cat README.md | head -50
```

---

## 📝 BƯỚC 2: KIỂM TRA VÀ COMMIT THAY ĐỔI

### 2.1 Xem các thay đổi

```bash
# Xem status
git status

# Xem các file đã thay đổi
git status --short
```

### 2.2 Kiểm tra file nhạy cảm (QUAN TRỌNG!)

**Đảm bảo các file sau KHÔNG được commit:**

```bash
# Kiểm tra các file nhạy cảm
git check-ignore .env
git check-ignore automation/config/google-credentials.json
git check-ignore automation/config/service_account.json
```

Nếu kết quả trống, file đó CHƯA được ignore → cần thêm vào .gitignore

### 2.3 Thêm các file vào staging

```bash
# Thêm tất cả file (trừ những file trong .gitignore)
git add .

# Hoặc thêm từng file cụ thể
git add README.md
git add LICENSE
git add .gitignore
git add ARCHITECTURE_GUIDE.md
git add ROADMAP_NEXT_STEPS.md
```

### 2.4 Commit changes

```bash
# Commit với message rõ ràng
git commit -m "feat: Initial commit - React OAS Integration v3.0

- Complete architecture guide
- Updated README with full documentation
- Added LICENSE (MIT)
- Comprehensive .gitignore for security
- Automation, AI Service, and Google Sheets integration
- Analytics and Recommendations modules in development"
```

---

## 🌐 BƯỚC 3: TẠO REPOSITORY TRÊN GITHUB

### 3.1 Tạo repository mới trên GitHub

**Cách 1: Qua GitHub Web Interface**

1. Truy cập: <https://github.com/new>
2. Điền thông tin:
   - **Repository name**: `React-OAS-Integration-v3.0`
   - **Description**: `🤖 AI-Powered Automation Platform với tích hợp Google Sheets và ONE Page System`
   - **Visibility**:
     - ☑️ **Public** (nếu muốn chia sẻ)
     - ☑️ **Private** (nếu muốn bảo mật)
   - **Initialize repository**:
     - ❌ KHÔNG chọn "Add a README file"
     - ❌ KHÔNG chọn "Add .gitignore"
     - ❌ KHÔNG chọn "Choose a license"
3. Click **"Create repository"**

**Cách 2: Qua GitHub CLI (nếu đã cài)**

```bash
# Cài đặt GitHub CLI (nếu chưa có)
# macOS: brew install gh

# Login
gh auth login

# Tạo repository
gh repo create React-OAS-Integration-v3.0 \
  --public \
  --description "🤖 AI-Powered Automation Platform với tích hợp Google Sheets và ONE Page System" \
  --source=. \
  --remote=origin \
  --push
```

---

## 📤 BƯỚC 4: PUSH CODE LÊN GITHUB

### 4.1 Nếu đã có remote origin (repo hiện tại)

```bash
# Kiểm tra remote hiện tại
git remote -v

# Nếu muốn thay đổi remote URL
git remote set-url origin https://github.com/USERNAME/REPO_NAME.git

# Push lên GitHub
git branch -M main
git push -u origin main
```

### 4.2 Nếu chưa có remote origin (repo mới)

```bash
# Thêm remote origin
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Đổi tên branch thành main (nếu cần)
git branch -M main

# Push lên GitHub
git push -u origin main
```

### 4.3 Nếu muốn tạo repo hoàn toàn mới

```bash
# Xóa remote cũ (nếu có)
git remote remove origin

# Thêm remote mới
git remote add origin https://github.com/USERNAME/NEW_REPO_NAME.git

# Push lên GitHub
git push -u origin main
```

---

## 🔐 BƯỚC 5: BẢO MẬT VÀ CẤU HÌNH

### 5.1 Bảo vệ branch main (Recommended)

1. Vào GitHub repository
2. Settings → Branches
3. Add rule cho branch `main`:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date

### 5.2 Thêm GitHub Secrets (nếu cần)

Settings → Secrets and variables → Actions:

- `GOOGLE_SHEETS_CREDENTIALS`
- `ONE_USERNAME`
- `ONE_PASSWORD`
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`

### 5.3 Tạo .env.example

```bash
# Tạo file .env.example từ template
cp .env .env.example

# Xóa các giá trị nhạy cảm trong .env.example
# Giữ lại cấu trúc nhưng thay giá trị bằng placeholder
```

---

## ✅ BƯỚC 6: HOÀN TẤT VÀ KIỂM TRA

### 6.1 Kiểm tra repository trên GitHub

Sau khi push, truy cập:

- Repository: `https://github.com/USERNAME/REPO_NAME`
- README sẽ tự động hiển thị
- LICENSE sẽ hiển thị ở header

### 6.2 Thêm repository topics (tags)

Vào repository → Click "⚙️ Settings" → Scroll xuống "Topics":

- `react`
- `ai`
- `automation`
- `google-sheets`
- `fastapi`
- `selenium`
- `machine-learning`
- `analytics`

### 6.3 Tạo GitHub Pages (tùy chọn)

```bash
# Settings → Pages
# Source: Deploy from a branch
# Branch: main /docs folder
```

---

## 📋 CHECKLIST HOÀN TẤT

Trước khi push, đảm bảo:

- [ ] ✅ `.gitignore` đã bao gồm tất cả file nhạy cảm
- [ ] ✅ `LICENSE` file đã có
- [ ] ✅ `README.md` đã cập nhật đầy đủ
- [ ] ✅ Không có file credentials trong repository
- [ ] ✅ Các file `.env` không được commit
- [ ] ✅ `node_modules/` và `venv/` không được commit
- [ ] ✅ Log files không được commit
- [ ] ✅ `.env.example` đã được tạo (template)

---

## 🚨 LƯU Ý QUAN TRỌNG

### ⚠️ KHÔNG BAO GIỜ COMMIT

- ❌ File `.env` với credentials thật
- ❌ `google-credentials.json` hoặc `service_account.json`
- ❌ Mật khẩu hoặc API keys trong code
- ❌ `node_modules/` hoặc `venv/`
- ❌ Log files với thông tin nhạy cảm

### ✅ NÊN CÓ

- ✅ `.env.example` với placeholder values
- ✅ Documentation đầy đủ trong README
- ✅ LICENSE file
- ✅ .gitignore hoàn chỉnh

---

## 🎯 QUICK START COMMANDS

```bash
# 1. Chuẩn bị repository
./scripts/prepare_github_repo.sh

# 2. Kiểm tra status
git status

# 3. Thêm files
git add .

# 4. Commit
git commit -m "feat: Initial commit - React OAS Integration v3.0"

# 5. Thêm remote (nếu repo mới)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# 6. Push
git push -u origin main
```

---

## 📚 TÀI LIỆU THAM KHẢO

- [GitHub Documentation](https://docs.github.com/)
- [Git Best Practices](https://git-scm.com/book)
- [.gitignore Templates](https://github.com/github/gitignore)

---

**🎉 Chúc mừng! Repository của bạn đã sẵn sàng trên GitHub!**
