
/*
===================
【 QX  脚本配置 】 :
===================

[rewrite_local]
https:\/\/gate-obt\.nqf\.qq\.com url script-request-header https://raw.githubusercontent.com/yuyi404/Script/refs/heads/main/fram-code.js

*/

;(async () => {
  const url = $request.url;

  // 不是目标接口 → 直接放行
  if (!url.includes('gate-obt.nqf.qq.com/prod/ws')) {
    $done({});
    return;
  }

  // 已经抓到过 → 直接拦截
  if (globalThis.caught) {
    $done({ status: 'reject' });
    return;
  }

  const codeMatch = url.match(/code=([^&]+)/);
  const code = codeMatch ? codeMatch[1] : '';
  const platformMatch = url.match(/platform=([^&]+)/);
  const platform = platformMatch ? platformMatch[1] : '';

  if (!code) {
    $notify('获取失败', '', '未拿到 code');
    globalThis.caught = true;
    $done({ status: 'reject' });
    return;
  }

  // 抓到一次就标记
  globalThis.caught = true;

  let name, suffix;
  if (platform === 'qq') {
    name = 'qq-bot';
    suffix = '';
  } else {
    name = 'wx-bot';
    suffix = ' --wx';
  }

  const cmd = `cd qq-farm-bot && pm2 start "node client.js --code ${code}${suffix}" --name "${name}"`;

  // 只弹这一次
  $notify('已获取 code', '终端命令', cmd);

  // 抓到后立即拦截
  $done({ status: 'reject' });
})();
