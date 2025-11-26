#!/bin/bash

# 🔍 GOOGLE SHEETS API KEY TESTER
# Script để test API key và Sheet connection

echo "🔍 Testing Google Sheets API Key..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ File .env không tồn tại!"
    echo "💡 Hãy copy từ .env.example: cp .env.example .env"
    exit 1
fi

# Read API key from .env
API_KEY=$(grep "REACT_APP_GOOGLE_SHEETS_API_KEY" .env | cut -d '=' -f2)
SHEET_ID=$(grep "REACT_APP_GOOGLE_SHEETS_ID" .env | cut -d '=' -f2)

echo "📋 Checking configuration..."

# Check API key
if [ -z "$API_KEY" ] || [ "$API_KEY" = "your-google-sheets-api-key-here" ]; then
    echo "❌ API Key chưa được cấu hình!"
    echo "💡 Hãy cập nhật REACT_APP_GOOGLE_SHEETS_API_KEY trong file .env"
    echo "📖 Xem hướng dẫn chi tiết: GOOGLE_CLOUD_API_KEY_GUIDE.md"
    exit 1
fi

# Check Sheet ID
if [ -z "$SHEET_ID" ] || [ "$SHEET_ID" = "your_actual_sheet_id_here" ]; then
    echo "❌ Sheet ID chưa được cấu hình!"
    echo "💡 Hãy cập nhật REACT_APP_GOOGLE_SHEETS_ID trong file .env"
    echo "📖 Xem hướng dẫn: GOOGLE_SHEETS_SETUP_GUIDE.md"
    exit 1
fi

echo "✅ API Key: ${API_KEY:0:20}..."
echo "✅ Sheet ID: ${SHEET_ID:0:20}..."

# Test API key validity
echo ""
echo "🧪 Testing API key with Google Sheets API..."

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
    "https://sheets.googleapis.com/v4/spreadsheets/$SHEET_ID?key=$API_KEY")

case $RESPONSE in
    200)
        echo "✅ SUCCESS: API key và Sheet ID đều hợp lệ!"
        echo "🎉 Bạn có thể chạy React app: npm start"
        ;;
    400)
        echo "❌ BAD REQUEST: Có lỗi trong request"
        echo "💡 Kiểm tra lại Sheet ID và API key"
        ;;
    403)
        echo "❌ FORBIDDEN: API key không có quyền truy cập"
        echo "💡 Kiểm tra:"
        echo "   - API key có enable Google Sheets API không?"
        echo "   - Sheet có được share public không?"
        ;;
    404)
        echo "❌ NOT FOUND: Sheet không tồn tại hoặc không accessible"
        echo "💡 Kiểm tra:"
        echo "   - Sheet ID có đúng không?"
        echo "   - Sheet có được share public không?"
        ;;
    *)
        echo "❌ ERROR: HTTP $RESPONSE"
        echo "💡 Có thể là network issue hoặc API quota"
        ;;
esac

echo ""
echo "📖 Để xem hướng dẫn chi tiết:"
echo "   🔑 API Key: cat GOOGLE_CLOUD_API_KEY_GUIDE.md"
echo "   📊 Setup Sheets: cat GOOGLE_SHEETS_SETUP_GUIDE.md"
echo "   ⚡ Quick setup: cat APPS_SCRIPT_QUICK_CARD.md"
