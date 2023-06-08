const https = require("https");
const querystring = require("querystring");
// const url = require("url");

const port = 10101;

function onRequest(req, res) {
  const originUrl = new URL(req.url)
  console.log(`HTTPS 代理服务器接收到客户端请求：${req.url}`);
  const qs = querystring.parse(originUrl.search);
  const target = new URL(qs["target"])

  // const options = {
  //   hostname: target.hostname,
  //   port: 80,
  //   path: url.format(target),
  //   method: "GET"
  // };

  // 2.代发请求
  const proxy = https.request(target, _res => {
    // 3.修改响应头
    const fieldsToRemove = ["x-frame-options", "content-security-policy"];
    Object.keys(_res.headers).forEach(field => {
      if (!fieldsToRemove.includes(field.toLocaleLowerCase())) {
        res.setHeader(field, _res.headers[field]);
      }
    });
    _res.pipe(res, {
      end: true
    });
  });
  req.pipe(proxy, {
    end: true
  });
}

module.exports = {
  createServer: () => {
    // 创建代理服务
    console.log('createServer')
    https.createServer(onRequest).listen(port)
  },
  proxyUrl: 'http://localhost:10101/?target='
}
