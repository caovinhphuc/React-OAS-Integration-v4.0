# ⚡ QUICK START - Tạo GitHub Repository

## 🚀 Cách nhanh nhất (3 bước)

### Bước 1: Chuẩn bị repository

```bash
./scripts/prepare_github_repo.sh
```

### Bước 2: Tạo repository trên GitHub

**Qua Web:**

1. Truy cập: <https://github.com/new>
2. Repository name: `React-OAS-Integration-v3.0`
3. Description: `🤖 AI-Powered Automation Platform`
4. **KHÔNG** chọn "Add README", "Add .gitignore", "Choose license"
5. Click "Create repository"

**Hoặc qua CLI:**

```bash
gh repo create React-OAS-Integration-v3.0 \
  --public \
  --description "🤖 AI-Powered Automation Platform" \
  --source=. \
  --remote=origin \
  --push
```

### Bước 3: Push code

```bash
# Nếu repo đã tồn tại và muốn update
./scripts/push_to_github.sh

# Hoặc thủ công:
git add .
git commit -m "feat: Initial commit - React OAS Integration v3.0"
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## 📝 Commit message mẫu

```bash
git commit -m "feat: Initial commit - React OAS Integration v3.0

✨ Features:
- Complete automation system
- AI Service with FastAPI
- Google Sheets integration
- Frontend dashboard

📚 Documentation:
- Comprehensive README
- Architecture guide
- Roadmap and guides

🔐 Security:
- Enhanced .gitignore
- LICENSE (MIT)
- Environment variables template"
```

---

## ✅ Checklist nhanh

- [ ] ✅ Chạy `./scripts/prepare_github_repo.sh`
- [ ] ✅ Kiểm tra không có file nhạy cảm
- [ ] ✅ Tạo repository trên GitHub
- [ ] ✅ Push code lên GitHub
- [ ] ✅ Kiểm tra README hiển thị đúng
- [ ] ✅ Thêm repository topics/tags

---

**Xem chi tiết tại:** [`GITHUB_SETUP_GUIDE.md`](GITHUB_SETUP_GUIDE.md)
