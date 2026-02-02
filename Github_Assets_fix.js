// ==UserScript==
// @name         Github Assets Fixer for Dev-Sidecar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解决 Dev-Sidecar 代理下 Webpack 根路径计算错误的问题
// @author       You
// @match        https://github.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 官方 CDN 根路径
    const CDN_BASE = 'https://github.githubassets.com/assets/';
    // Dev-Sidecar 的代理特征
    const DS_PROXY_SIGNATURE = 'ds_script_proxy';

    /**
     * URL 修正函数
     * 不管 f.p 把路径算错成了什么，我们都在这里给它“掰弯”回正轨
     */
    function fixUrl(url) {
        if (!url) return url;

        // 1. 如果 URL 是相对路径 (例如 "/assets/chunk-123.js")，说明 f.p 算成了域名根目录
        //    或者 URL 包含了 Dev-Sidecar 的代理签名
        //    并且它是 assets 目录下的 js 或 css
        if (
            (url.toString().startsWith('/assets/') || url.toString().includes('assets/')) &&
            (url.toString().endsWith('.js') || url.toString().endsWith('.css'))
        ) {
            // 提取文件名
            const fileName = url.toString().split('/').pop();
            // 强制返回官方 CDN 地址
            return CDN_BASE + fileName;
        }

        return url;
    }

    // =========================================================
    // 核心黑科技：劫持 Script 标签的 src 赋值操作
    // 当 Webpack 执行 script.src = f.p + "chunk.js" 时，会触发这里
    // =========================================================
    const originalScriptDesc = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
    Object.defineProperty(HTMLScriptElement.prototype, 'src', {
        enumerable: true,
        configurable: true,
        get: function() {
            return originalScriptDesc.get.call(this);
        },
        set: function(newVal) {
            // 在赋值前，先修正 URL
            const fixedVal = fixUrl(newVal);
            // 调用原生赋值
            originalScriptDesc.set.call(this, fixedVal);
        }
    });

    // =========================================================
    // 同理：劫持 Link 标签的 href 赋值操作 (修复 CSS)
    // =========================================================
    const originalLinkDesc = Object.getOwnPropertyDescriptor(HTMLLinkElement.prototype, 'href');
    Object.defineProperty(HTMLLinkElement.prototype, 'href', {
        enumerable: true,
        configurable: true,
        get: function() {
            return originalLinkDesc.get.call(this);
        },
        set: function(newVal) {
            const fixedVal = fixUrl(newVal);
            originalLinkDesc.set.call(this, fixedVal);
        }
    });

    console.log('Github Assets Fixer: 拦截器已启动，f.p 错误将被自动修正。');

})();
