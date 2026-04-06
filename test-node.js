// Quick test - just verify Node works
const fs = require('fs');
const os = require('os');

console.log('✅ Node.js está funcionando!');
console.log(`   Versión: ${process.version}`);
console.log(`   Sistema: ${os.platform()}`);
console.log('');
console.log('Ahora ejecuta: node setup-routes.js');
