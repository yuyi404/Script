
/*
===================
【 QX  脚本配置 】 :
===================

[rewrite_local]
https:\/\/gate-obt\.nqf\.qq\.com url script-request-header https://raw.githubusercontent.com/yuyi404/Script/refs/heads/main/fram-code.js

*/

;(async()=>{
  const url = $request.url;

  if (!url.includes('gate-obt.nqf.qq.com/prod/ws')) {
    $done({});
    return;
  }

  if (globalThis.caught) {
    $done({ status: 'reject' });
    return;
  }
  globalThis.caught = true;

  const codeMatch = url.match(/code=([^&]+)/);
  const code = codeMatch ? codeMatch[1] : '';

  const platformMatch = url.match(/platform=([^&]+)/);
  const platform = platformMatch ? platformMatch[1] : '';

  if (!code) {
    $notify('获取失败', '', '未拿到 code');
    $done({ status: 'reject' });
    return;
  }

  let name, suffix;
  if (platform === 'qq') {
    name = 'qq-bot';
    suffix = '';
  } else {
    name = 'wx-bot';
    suffix = ' --wx';
  }

  const cmd = `pm2 start "node client.js --code ${code}${suffix}" --name "${name}"`;

  $notify('已获取 code', '终端命令', cmd);

  $done({ status: 'reject' });
})();
