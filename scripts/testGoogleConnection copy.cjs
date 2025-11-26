const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
require('dotenv').config();

async function testGoogleConnection() {
  try {
    console.log('Testing Google Service Account connection...');

    // Validate environment variables
    const requiredVars = [
      'GOOGLE_SERVICE_ACCOUNT_EMAIL',
      'GOOGLE_PRIVATE_KEY',
      'REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID',
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      throw new Error(
        `Missing environment variables: ${missingVars.join(', ')}`
      );
    }

    // Create credentials object
    const credentials = {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: process.env.GOOGLE_AUTH_URI,
      token_uri: process.env.GOOGLE_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
    };

    // Create Google Auth client
    const auth = new GoogleAuth({
      credentials: credentials,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });

    // Test authentication
    const authClient = await auth.getClient();
    const accessToken = await authClient.getAccessToken();

    console.log('✅ Google Service Account connection successful!');
    console.log('Access token obtained:', accessToken.token ? 'Yes' : 'No');
    console.log(
      'Service Account email:',
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    );
    console.log(
      'Sheet ID configured:',
      process.env.REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID ? 'Yes' : 'No'
    );

    // Test Google Sheets API connection
    console.log('\n📊 Testing Google Sheets API...');
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    const sheetId = process.env.REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID;
    if (sheetId) {
      try {
        const response = await sheets.spreadsheets.get({
          spreadsheetId: sheetId,
        });
        console.log('✅ Google Sheets API connection successful!');
        console.log('   Spreadsheet title:', response.data.properties.title);
        console.log('   Number of sheets:', response.data.sheets.length);
        console.log(
          '   Sheet names:',
          response.data.sheets.map(s => s.properties.title).join(', ')
        );

        // Test read data
        const firstSheetName = response.data.sheets[0].properties.title;
        const readResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: sheetId,
          range: `${firstSheetName}!A1:Z10`,
        });
        const rows = readResponse.data.values || [];
        console.log('✅ Read data successful!');
        console.log('   Sheet:', firstSheetName);
        console.log('   Rows read:', rows.length);
        if (rows.length > 0) {
          console.log('   Columns:', rows[0].length);
          console.log('   First row sample:', rows[0].slice(0, 5).join(', '));
        }
      } catch (error) {
        console.error('❌ Google Sheets API test failed:', error.message);
        if (error.code === 403) {
          console.error('   → Service Account chưa có quyền truy cập sheet');
          console.error(
            '   → Share sheet với email:',
            process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
          );
        }
      }
    }

    console.log(
      '\nGoogle Maps API configured:',
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? 'Yes' : 'No'
    );
    console.log(
      'Telegram Bot configured:',
      process.env.TELEGRAM_BOT_TOKEN ? 'Yes' : 'No'
    );
    console.log(
      'Email service configured:',
      process.env.SENDGRID_API_KEY || process.env.SMTP_USER ? 'Yes' : 'No'
    );
  } catch (error) {
    console.error('❌ Google Service Account connection failed:');
    console.error(error.message);

    if (error.message.includes('Missing environment variables')) {
      console.error('\n💡 Make sure to:');
      console.error('1. Copy env.example to .env');
      console.error('2. Fill in all required environment variables');
      console.error(
        '3. Get the values from your Google Service Account JSON file'
      );
    }
  }
}

testGoogleConnection();
