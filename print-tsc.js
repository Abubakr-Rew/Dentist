const { exec } = require('child_process');
exec('npx tsc --noEmit', (error, stdout, stderr) => {
  console.log("STDOUT:\\n", stdout);
  console.log("STDERR:\\n", stderr);
});
