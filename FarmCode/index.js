
/*
===================
【 QX 脚本配置 】:
===================

[rewrite_local]
https:\/\/gate-obt\.nqf\.qq\.com url script-request-header https://raw.githubusercontent.com/yuyi404/Script/master/FarmCode/index.js

*/

;(async () => {
  const url = $request.url;

  // 只处理登录接口
  if (!url.includes('gate-obt.nqf.qq.com/prod/ws')) {
    $done({});
    return;
  }

  // 已经抓到过 → 放行，不再拦截
  if (global.caughtFarmCode) {
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

  // 标记已抓到，以后不再拦截
  global.caughtFarmCode = true;

  let cmd = '';
  if (platform === 'qq') {
    cmd = `cd qq-farm-bot && pm2 start "node client.js --code ${code}" --name "qq-bot"`;
  } else {
    cmd = `cd qq-farm-bot && pm2 start "node client.js --code ${code} --wx" --name "wx-bot"`;
  }

  // 只弹一次通知
  $notify('已获取农场Code', '服务器运行命令', cmd);

  // 拦截这次请求（你要的拦截）
  $done({ status: 'reject' });
})();
