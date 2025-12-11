#!/usr/bin/env node
/**
 * Test Google Sheets Service
 * Kiểm tra các chức năng Google Sheets có hoạt động không
 */

import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Service Account credentials (support both REACT_APP_ and non-prefix)
const getEnvVar = (reactAppName, fallbackName) => {
  return process.env[reactAppName] || process.env[fallbackName];
};

const SERVICE_ACCOUNT_CREDENTIALS = {
  type: 'service_account',
  project_id: getEnvVar('REACT_APP_GOOGLE_PROJECT_ID', 'GOOGLE_PROJECT_ID'),
  private_key_id: getEnvVar(
    'REACT_APP_GOOGLE_PRIVATE_KEY_ID',
    'GOOGLE_PRIVATE_KEY_ID'
  ),
  private_key: (
    getEnvVar('REACT_APP_GOOGLE_PRIVATE_KEY', 'GOOGLE_PRIVATE_KEY') || ''
  ).replace(/\\n/g, '\n'),
  client_email: getEnvVar(
    'REACT_APP_GOOGLE_CLIENT_EMAIL',
    'GOOGLE_SERVICE_ACCOUNT_EMAIL'
  ),
  client_id: getEnvVar('REACT_APP_GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_ID'),
  auth_uri:
    process.env.GOOGLE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
  token_uri:
    process.env.GOOGLE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url:
    process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL ||
    'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    process.env.GOOGLE_CLIENT_X509_CERT_URL ||
    `https://www.googleapis.com/robot/v1/metadata/x509/${getEnvVar('REACT_APP_GOOGLE_CLIENT_EMAIL', 'GOOGLE_SERVICE_ACCOUNT_EMAIL')}`,
};

const SHEET_ID =
  process.env.REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID ||
  process.env.REACT_APP_GOOGLE_SHEET_ID;

// Colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: msg => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: msg => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: msg => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  test: msg => console.log(`${colors.cyan}🧪 ${msg}${colors.reset}`),
};

async function testGoogleSheets() {
  console.log('\n🧪 KIỂM TRA GOOGLE SHEETS SERVICE\n');
  console.log('='.repeat(50));

  // Check environment variables (support both REACT_APP_ and non-prefix)
  log.test('Bước 1: Kiểm tra Environment Variables...');

  // Map environment variables (support both formats)
  const projectId =
    process.env.REACT_APP_GOOGLE_PROJECT_ID || process.env.GOOGLE_PROJECT_ID;
  const privateKey =
    process.env.REACT_APP_GOOGLE_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY;
  const clientEmail =
    process.env.REACT_APP_GOOGLE_CLIENT_EMAIL ||
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const clientId =
    process.env.REACT_APP_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const privateKeyId =
    process.env.REACT_APP_GOOGLE_PRIVATE_KEY_ID ||
    process.env.GOOGLE_PRIVATE_KEY_ID;

  if (!projectId || !privateKey || !clientEmail || !clientId || !privateKeyId) {
    log.error('Thiếu biến môi trường cần thiết:');
    if (!projectId)
      log.error('  - REACT_APP_GOOGLE_PROJECT_ID hoặc GOOGLE_PROJECT_ID');
    if (!privateKey)
      log.error('  - REACT_APP_GOOGLE_PRIVATE_KEY hoặc GOOGLE_PRIVATE_KEY');
    if (!clientEmail)
      log.error(
        '  - REACT_APP_GOOGLE_CLIENT_EMAIL hoặc GOOGLE_SERVICE_ACCOUNT_EMAIL'
      );
    if (!clientId)
      log.error('  - REACT_APP_GOOGLE_CLIENT_ID hoặc GOOGLE_CLIENT_ID');
    if (!privateKeyId)
      log.error(
        '  - REACT_APP_GOOGLE_PRIVATE_KEY_ID hoặc GOOGLE_PRIVATE_KEY_ID'
      );
    return false;
  }
  log.success('Tất cả biến môi trường đã có');

  if (!SHEET_ID) {
    log.error(
      'Thiếu REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID hoặc REACT_APP_GOOGLE_SHEET_ID'
    );
    return false;
  }
  log.success(`Sheet ID: ${SHEET_ID}`);

  // Initialize auth
  log.test('\nBước 2: Khởi tạo Google Auth...');
  log.info(`   Project ID: ${SERVICE_ACCOUNT_CREDENTIALS.project_id}`);
  log.info(`   Client Email: ${SERVICE_ACCOUNT_CREDENTIALS.client_email}`);

  let auth;
  try {
    auth = new google.auth.JWT(
      SERVICE_ACCOUNT_CREDENTIALS.client_email,
      null,
      SERVICE_ACCOUNT_CREDENTIALS.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    log.success('Google Auth đã khởi tạo');
  } catch (error) {
    log.error(`Lỗi khởi tạo auth: ${error.message}`);
    if (error.message.includes('private_key')) {
      log.error(
        '   → Kiểm tra GOOGLE_PRIVATE_KEY có đầy đủ không (bao gồm BEGIN/END)'
      );
    }
    return false;
  }

  // Initialize Sheets API
  log.test('\nBước 3: Khởi tạo Google Sheets API...');
  let sheets;
  try {
    sheets = google.sheets({ version: 'v4', auth });
    log.success('Google Sheets API đã khởi tạo');
  } catch (error) {
    log.error(`Lỗi khởi tạo Sheets API: ${error.message}`);
    return false;
  }

  // Test 1: Get Spreadsheet Metadata
  log.test('\nBước 4: Test 1 - Lấy thông tin Spreadsheet...');
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });
    const title = response.data.properties.title;
    const sheetCount = response.data.sheets.length;
    log.success(`✅ Kết nối thành công!`);
    log.info(`   Tên: ${title}`);
    log.info(`   Số sheets: ${sheetCount}`);
    log.info(
      `   Sheets: ${response.data.sheets.map(s => s.properties.title).join(', ')}`
    );
  } catch (error) {
    log.error(`❌ Lỗi: ${error.message}`);
    if (error.code === 403) {
      log.error('   → Service Account chưa có quyền truy cập sheet này');
      log.error(
        '   → Cần share sheet với email: ' +
          SERVICE_ACCOUNT_CREDENTIALS.client_email
      );
    }
    return false;
  }

  // Test 2: Read Data
  log.test('\nBước 5: Test 2 - Đọc dữ liệu từ Sheet...');
  try {
    const firstSheet = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });
    const firstSheetName = firstSheet.data.sheets[0].properties.title;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${firstSheetName}!A1:Z10`,
    });

    const rows = response.data.values || [];
    log.success(`✅ Đọc thành công!`);
    log.info(`   Sheet: ${firstSheetName}`);
    log.info(`   Số dòng: ${rows.length}`);
    if (rows.length > 0) {
      log.info(`   Số cột: ${rows[0].length}`);
      log.info(`   Dòng đầu tiên: ${rows[0].slice(0, 5).join(', ')}...`);
    }
  } catch (error) {
    log.error(`❌ Lỗi đọc dữ liệu: ${error.message}`);
    return false;
  }

  // Test 3: Write Data (Test write to a test cell)
  log.test('\nBước 6: Test 3 - Ghi dữ liệu vào Sheet (Test cell)...');
  try {
    const firstSheet = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });
    const firstSheetName = firstSheet.data.sheets[0].properties.title;
    const testRange = `${firstSheetName}!Z999`; // Test cell ở cuối sheet

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: testRange,
      valueInputOption: 'RAW',
      requestBody: {
        values: [['TEST_' + Date.now()]],
      },
    });

    log.success(`✅ Ghi thành công!`);
    log.info(`   Range: ${testRange}`);
    log.info(`   Updated cells: ${response.data.updatedCells}`);
  } catch (error) {
    log.error(`❌ Lỗi ghi dữ liệu: ${error.message}`);
    if (error.code === 403) {
      log.error('   → Service Account chưa có quyền ghi');
    }
    return false;
  }

  // Test 4: Append Data
  log.test('\nBước 7: Test 4 - Thêm dữ liệu vào cuối Sheet...');
  try {
    const firstSheet = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });
    const firstSheetName = firstSheet.data.sheets[0].properties.title;

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${firstSheetName}!A:Z`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [['APPEND_TEST', Date.now(), 'Test data']],
      },
    });

    log.success(`✅ Thêm dữ liệu thành công!`);
    log.info(`   Updated rows: ${response.data.updates.updatedRows}`);
  } catch (error) {
    log.error(`❌ Lỗi thêm dữ liệu: ${error.message}`);
    return false;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  log.success('🎉 TẤT CẢ CÁC TEST ĐÃ THÀNH CÔNG!');
  log.info('Google Sheets Service hoạt động bình thường ✅');
  console.log('');

  return true;
}

// Run test
testGoogleSheets()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    log.error(`Lỗi không mong đợi: ${error.message}`);
    console.error(error);
    process.exit(1);
  });
