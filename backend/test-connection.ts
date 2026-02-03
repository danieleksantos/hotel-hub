import { pool } from './src/database/db'; 

async function runTest() {
  try {
    console.log('--- Iniciando Teste de Conexão ---');
    
    const res = await pool.query('SELECT NOW(), version()');
    
    console.log('🚀 Conexão bem-sucedida!');
    console.log('Servidor do Banco:', res.rows[0].version);
    console.log('Hora no Banco:', res.rows[0].now);

    const tableCheck = await pool.query("SELECT COUNT(*) FROM users");
    console.log(`👤 Total de usuários cadastrados: ${tableCheck.rows[0].count}`);

  } catch (err) {
    console.error('❌ Erro ao conectar ao Neon:');
    console.error(err);
  } finally {
    await pool.end();
    process.exit();
  }
}

runTest();