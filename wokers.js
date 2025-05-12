export default {
    /**
     * @param {Request} request
     * @param {any} env
     * @param {any} ctx
     */
    async fetch(request, env, ctx) {
        const self_domain_name = env.SELF_DOMAIN_NAME;//你猜这里要干啥
        const self_path = env.SELF_PATH;
  
        let targetUrl = '';
        // 构造实际的URL
        if (request.url.startsWith('https://')) {
            targetUrl = request.url.slice(`https://${self_domain_name}/${self_path}/`.length);
        }
        else if (request.url.startsWith('http://')) {
            targetUrl = request.url.slice(`http://${self_domain_name}/${self_path}/`.length);
        }
        else if(request.url.startsWith('wss://')) {
            targetUrl = request.url.slice(`wss://${self_domain_name}/${self_path}/`.length);
        }
  
        let host = '';
        // 识别实际域名
        if (targetUrl.match(/^\w*(:\/\/)/)) {
            host = (new URL(targetUrl)).hostname;
        }
        else {
            host = (new URL(`http://${targetUrl}`)).hostname;
        }// hostname仅域名，host包含端口
  
        // 修补协议头，考虑是否使用HTTPS
        if (!(targetUrl.match(/^\w*(:\/\/)/))) {
            if ((await env.DS.get(host)) == 'HTTP') {//修改所有的XXX_kv为实际的KV数据库名称
                targetUrl = `http://${targetUrl}`;
            }
            else {
                targetUrl = `https://${targetUrl}`;
            }
        }
  
        let internalResponse = await fetch(targetUrl, request);
  
        if (internalResponse.status == 525 && targetUrl.startsWith('https://')) {
            await env.DS.put(host, 'HTTP', { expirationTtl: 60 });
            internalResponse = await fetch(`http://${targetUrl.slice('https://'.length)}`, request);
        }
  
        return internalResponse;
    },
  };