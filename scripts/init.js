const { execSync } = require('child_process');
const { existsSync } = require('fs');

try {
  if (existsSync('src/current_project')) {
    execSync('rm -rf src/current_project');
    execSync('git rm --cached current_project');
  }
  execSync('git submodule add --depth=1 git@github.com:j33app2/overseas-web-common.git src/current_project', {
    stdio: 'inherit',
  });
  execSync('git clone git@github.com:j33app2/overseas-web-common.git --recurse-submodules');
  execSync('git submodule init');
  execSync('git submodule update --init --recursive --depth 1');
  console.log('success');
} catch (e) { }
