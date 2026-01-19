const fs = require('fs');
const XLSX = require('xlsx');
const workbook = XLSX.readFile('SAUCE LABS.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const header = data[0];
const rows = data.slice(60, 70);

fs.writeFileSync('excel_output.json', JSON.stringify({ header, rows }, null, 2), 'utf8');
