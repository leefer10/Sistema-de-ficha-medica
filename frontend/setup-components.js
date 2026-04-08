const fs = require('fs');
const path = require('path');

const commonDir = path.join(__dirname, 'components', 'common');

if (!fs.existsSync(commonDir)) {
  fs.mkdirSync(commonDir, { recursive: true });
  console.log('✅ Created components/common directory');
}
