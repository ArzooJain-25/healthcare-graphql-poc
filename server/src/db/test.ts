import 'dotenv/config';
import { query } from './index';

async function testConnection() {
  try {
    console.log('Testing PostgreSQL connection...');
    const departments = await query('SELECT * FROM departments');
    console.log('✅ Connection successful!');
    console.log(`Found ${departments.length} departments:`);
    console.table(departments);
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    process.exit();
  }
}

testConnection();
