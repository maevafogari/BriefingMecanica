import postgres from 'postgres';
const sql = postgres('postgres://postgres:senaisp@localhost:5432/mecanica1');
export default sql;