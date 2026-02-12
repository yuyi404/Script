/*
===================
【 QX 脚本配置 】:
===================

[rewrite_local]
https:\/\/gate-obt\.nqf\.qq\.com url script-request-header https://raw.githubusercontent.com/yuyi404/Script/master/FarmCode/index.js

*/

;(async () => {
  const url = $request.url;

  if (!url.includes('gate-obt.nqf.qq.com/prod/ws')) {
    $done({});
    return;
  }

  // 只抓一次
  if (globalThis.codeCaptured) {
    $done({});
    return;
  }

  const codeMatch = url.match(/code=([^&]+)/);
  const code = codeMatch ? codeMatch[1] : '';
  const platformMatch = url.match(/platform=([^&]+)/);
  const platform = platformMatch ? platformMatch[1] : '';

  if (!code) {
    $done({});
    return;
  }

  globalThis.codeCaptured = true;

  let cmd = '';
  if (platform === 'qq') {
    cmd = `cd qq-farm-bot && pm2 start "node client.js --code ${code}" --name "qq-bot"`;
  } else {
    cmd = `cd qq-farm-bot && pm2 start "node client.js --code ${code} --wx" --name "wx-bot"`;
  }

  // 只通知一次
  $notify('农场 code 获取成功', '复制去服务器运行', cmd);
  $done({});
})();
