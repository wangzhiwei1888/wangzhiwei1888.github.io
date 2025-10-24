---
title: nginx conf to json
date: 2025-10-24 08:57:09
tags:
---

python 版本
pip install crossplane

crossplane parse --indent=4 nginx.conf > nginx.json

crossplane build nginx.json

https://github.com/nginxinc/crossplane?tab=readme-ov-file#crossplane-parse


## 转换为 js 版本

```
nginx-parser.js

// nginx config lexer + parser (browser version)
// 用法：
//   import { parseNginx } from './nginx-parser.js';
//   const payload = parseNginx(nginxText, { filename:'nginx.conf', comments:true });

const EXTERNAL_PARSERS = {};   // 预留第三方指令解析器

// ---------- lexer ----------
function* lex(text, filename = 'nginx.conf') {
  let line = 1, col = 0, idx = 0;
  const len = text.length;

  function skipWhitespace() {
    while (idx < len && /\s/.test(text[idx])) {
      if (text[idx] === '\n') { line++; col = 0; }
      else col++;
      idx++;
    }
  }

  function readString(quote) {
    const start = ++idx;  // skip open quote
    col++;
    while (idx < len && text[idx] !== quote) {
      if (text[idx] === '\n') { line++; col = 0; }
      else if (text[idx] === '\\') { idx++; col++; } // skip escaped
      idx++; col++;
    }
    if (idx >= len) throw new Error(`Unterminated quoted string at ${filename}:${line}`);
    const val = text.slice(start, idx);
    idx++; col++; // skip close quote
    return [val, line, true];   // [token, lineno, quoted]
  }

  function readToken() {
    const start = idx;
    while (idx < len && !/\s|[{};#"'\\]/.test(text[idx])) {
      idx++; col++;
    }
    return text.slice(start, idx);
  }

  while (idx < len) {
    skipWhitespace();
    if (idx >= len) break;
    const ch = text[idx];

    if (ch === '#' || ch === ';' || ch === '{' || ch === '}') {
      const tok = ch === '#' ? text.slice(idx, text.indexOf('\n', idx)) || text.slice(idx)
                             : ch;
      yield [tok, line, false];
      if (tok === '\n') { line++; col = 0; }
      else col++;
      idx += tok.length;
    } else if (ch === '"' || ch === "'") {
      yield readString(ch);
    } else {
      const tok = readToken();
      if (tok) yield [tok, line, false];
    }
  }
}

// ---------- util ----------
class NgxParserDirectiveError extends Error {
  constructor(msg, lineno) {
    super(msg);
    this.name = 'NgxParserDirectiveError';
    this.lineno = lineno;
  }
}

// 简易版 analyze，只检查末尾符号
function analyze({ fname, stmt, term, ctx, strict, check_ctx, check_args }) {
  const dir = stmt.directive;
  if (dir === '#') return;          // 注释跳过
  if (dir.startsWith('#')) return;  // 行内注释也跳过
  // 更复杂的上下文/参数检查可在此扩展
  if (term !== ';' && term !== '{' && term !== '}') {
    throw new NgxParserDirectiveError(
      `directive "${dir}" is not terminated by ";" or "{"`, stmt.line);
  }
}

function enterBlockCtx(stmt, ctx) {
  // 返回新的上下文，简单拼路径
  return [...ctx, stmt.directive];
}

// ---------- parser ----------
export function parseNginx(text, {
  filename = 'nginx.conf',
  onerror = null,
  catchErrors = true,
  ignore = [],
  single = false,
  comments = false,
  strict = false,
  checkCtx = true,
  checkArgs = true
} = {}) {
  const tokens = [...lex(text, filename)]; // 先全部展开，方便 next()
  let tokIdx = 0;
  function next() {
    if (tokIdx >= tokens.length) return [null, -1, false];
    return tokens[tokIdx++];
  }
  function peek() {
    if (tokIdx >= tokens.length) return [null, -1, false];
    return tokens[tokIdx];
  }

  const payload = {
    status: 'ok',
    errors: [],
    config: []
  };

  function handleError(parsing, e) {
    const file = parsing.file;
    const errObj = { file, error: e.message, line: e.lineno || null };
    if (onerror) errObj.callback = onerror(e);

    parsing.status = 'failed';
    parsing.errors.push({ error: e.message, line: e.lineno || null });

    payload.status = 'failed';
    payload.errors.push(errObj);
  }

  function _parse(parsing, ctx = [], consume = false) {
    const fname = parsing.file;
    const parsed = [];

    while (true) {
      const [token, lineno, quoted] = next();
      if (!token) break;
      if (token === '}' && !quoted) break;
      if (consume) {
        if (token === '{' && !quoted) _parse(parsing, ctx, true);
        continue;
      }

      const directive = token;

      // 注释行
      if (directive.startsWith('#') && !quoted) {
        if (comments) {
          parsed.push({ directive: '#', line: lineno, args: [], comment: directive.slice(1).trim() });
        }
        continue;
      }

      const stmt = { directive, line: lineno, args: [] };
      if (!single) stmt.file = fname;

      // 收集参数
      const commentsInArgs = [];
      let term;
      while (true) {
        const [t, , q] = peek();
        if (!t || (!q && [';', '{', '}'].includes(t))) { term = t; next(); break; }
        next();
        if (t.startsWith('#') && !q) commentsInArgs.push(t.slice(1).trim());
        else stmt.args.push(t);
      }

      if (ignore.includes(stmt.directive)) {
        if (term === '{' && !quoted) _parse(parsing, ctx, true);
        continue;
      }

      // if 特殊处理
      if (stmt.directive === 'if') {
        const args = stmt.args;
        if (args.length && args[0].startsWith('(') && args[args.length - 1].endsWith(')')) {
          args[0] = args[0].slice(1).trimLeft();
          args[args.length - 1] = args[args.length - 1].slice(0, -1).trimRight();
        }
      }

      try {
        analyze({ fname, stmt, term, ctx, strict, check_ctx: checkCtx, check_args: checkArgs });
      } catch (e) {
        if (catchErrors) {
          handleError(parsing, e);
          if (e.message.includes('is not terminated') && term !== '}' && !quoted) {
            _parse(parsing, ctx, true);
          }
          continue;
        } else {
          throw e;
        }
      }

      // include 处理（浏览器端不做文件 IO，只留空壳）
      if (!single && stmt.directive === 'include') {
        stmt.includes = [];   // 实际文件列表无法获取，留空
      }

      if (term === '{' && !quoted) {
        const inner = enterBlockCtx(stmt, ctx);
        stmt.block = _parse(parsing, inner);
      }

      parsed.push(stmt);

      // 行内注释追加
      commentsInArgs.forEach(c => parsed.push({ directive: '#', line: stmt.line, args: [], comment: c }));
    }
    return parsed;
  }

  // 主流程
  const parsing = { file: filename, status: 'ok', errors: [], parsed: [] };
  try {
    parsing.parsed = _parse(parsing, []);
  } catch (e) {
    handleError(parsing, e);
  }
  payload.config.push(parsing);
  return payload;
}

// 预留外部解析器注册
export function registerExternalParser(parser, directives) {
  directives.forEach(d => { EXTERNAL_PARSERS[d] = parser; });
}

```

```
a.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script type="module">
      import { parseNginx } from "./nginx-parser.js";

      const conf = `
      user  nginx;
      worker_processes  auto;
      
      events {
          worker_connections  1024;
      }
      
      http {
          include       mime.types;
          default_type  application/octet-stream;
      
          server {
              listen 80;
              location / {
                  root /usr/share/nginx/html;
              }
          }
      }
      `;

      const payload = parseNginx(conf, { comments: true });
      console.log(JSON.stringify(payload, null, 2));
    </script>
  </body>
</html>


```


```

nginx-builder.js

// nginx config builder (browser version)
// 用法：
//   import { build, buildFiles } from './nginx-builder.js';
//   const txt = build(payload, { indent:4, tabs:false, header:true });

const EXTERNAL_BUILDERS = {};

// 与 Python 版行为完全一致的转义检测
function* _escape(string) {
  let prev = '', char = '';
  for (let i = 0; i < string.length; i++) {
    char = string[i];
    if (prev === '\\' || prev + char === '${') {
      prev += char;
      yield prev;
      prev = '';
      continue;
    }
    if (prev === '$') yield prev;
    if (char !== '\\' && char !== '$') yield char;
    prev = char;
  }
  if (char === '\\' || char === '$') yield char;
}

function _needsQuotes(str) {
  if (str === '') return true;
  const gen = _escape(str);
  // 首字符
  let { value: char, done } = gen.next();
  if (done) return false;
  if (/\s/.test(char) || ['{', '}', ';', '"', "'", '${'].includes(char)) return true;

  let expanding = false;
  for (const ch of gen) {
    if (/\s/.test(ch) || ['{', ';', '"', "'"].includes(ch)) return true;
    if (ch === (expanding ? '}' : '${')) expanding = !expanding;
  }
  return expanding;
}

// 把字符串转成 nginx 可识别的带引号格式
function _enquote(arg) {
  if (!_needsQuotes(arg)) return arg;
  // 浏览器里 repr 等价 JSON.stringify 后去头尾引号再自己加
  let s = JSON.stringify(arg);
  // JSON 会把 \ 变成 \\，我们需要单 \
  s = s.replace(/\\\\/g, '\\');
  // 再包一层引号
  return `"${s.slice(1, -1)}"`;
}

/**
 * 将 payload 构建成字符串
 * @param {Array} payload  对应 python 里的 parsed 数组
 * @param {Object} opts
 *        indent:number     缩进空格数
 *        tabs:boolean      用 tab 代替空格
 *        header:boolean    是否带生成头注释
 * @returns {string}  nginx 文本
 */
export function build(payload, { indent = 4, tabs = false, header = false } = {}) {
  const padChar = tabs ? '\t' : ' ';
  const padding = (d) => padChar.repeat(tabs ? d : d * indent);

  let head = '';
  if (header) {
    head += '# This config was built from JSON using NGINX crossplane.\n';
    head += '# If you encounter any bugs please report them here:\n';
    head += '# https://github.com/nginxinc/crossplane/issues\n\n';
  }

  function _buildBlock(block, depth, lastLine) {
    let out = '';
    const margin = padding(depth);

    for (const stmt of block) {
      const dir = _enquote(stmt.directive);
      const line = stmt.line || 0;

      // 行尾注释合并
      if (dir === '#' && line === lastLine) {
        out += ' #' + stmt.comment;
        continue;
      }
      if (dir === '#') {
        out += (out ? '\n' : '') + margin + '#' + stmt.comment;
        lastLine = line;
        continue;
      }

      // 外部自定义构造器
      if (EXTERNAL_BUILDERS[dir]) {
        out += (out ? '\n' : '') + margin + EXTERNAL_BUILDERS[dir](stmt, padding, indent, tabs);
        lastLine = line;
        continue;
      }

      // 普通指令
      const args = stmt.args.map(_enquote);
      let built;
      if (dir === 'if') {
        built = `if (${args.join(' ')})`;
      } else if (args.length) {
        built = `${dir} ${args.join(' ')}`;
      } else {
        built = dir;
      }

      if (stmt.block == null) {
        built += ';';
      } else {
        built += ' {';
        const inner = _buildBlock(stmt.block, depth + 1, line);
        built += inner + '\n' + margin + '}';
      }
      out += (out ? '\n' : '') + margin + built;
      lastLine = line;
    }
    return out;
  }

  const body = _buildBlock(payload, 0, 0);
  return head + body;
}

/**
 * 为浏览器准备的“写盘”封装：返回 filename => content 的 Map
 * @param {Object} payload   crossplane.parse 的完整输出
 * @param {Object} opts      同 build 函数
 * @returns {Map}            key=绝对路径，value=文本
 */
export function buildFiles(payload, { indent = 4, tabs = false, header = false } = {}) {
  const map = new Map();
  for (const config of payload.config) {
    const content = build(config.parsed, { indent, tabs, header });
    map.set(config.file, content.replace(/\n+$/, '\n')); // 保证末尾一个换行
  }
  return map;
}

/**
 * 注册第三方构造器
 * @param {Function} builder     function(stmt, padding, indent, tabs)->string
 * @param {Array<string>} dirs   指令列表
 */
export function registerExternalBuilder(builder, dirs) {
  dirs.forEach(d => { EXTERNAL_BUILDERS[d] = builder; });
}
```

b.html

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script type="module">
      import { build, buildFiles } from "./nginx-builder.js";

      const payload = {
        config: [
          {
            file: "/etc/nginx/nginx.conf",
            parsed: [
              {
                directive: "user",
                line: 2,
                args: ["nginx"],
                file: "nginx.conf",
              },
              {
                directive: "worker_processes",
                line: 3,
                args: ["auto"],
                file: "nginx.conf",
              },
              {
                directive: "events",
                line: 5,
                args: [],
                file: "nginx.conf",
                block: [
                  {
                    directive: "worker_connections",
                    line: 6,
                    args: ["1024"],
                    file: "nginx.conf",
                  },
                ],
              },
              {
                directive: "http",
                line: 9,
                args: [],
                file: "nginx.conf",
                block: [
                  {
                    directive: "include",
                    line: 10,
                    args: ["mime.types"],
                    file: "nginx.conf",
                    includes: [],
                  },
                  {
                    directive: "default_type",
                    line: 11,
                    args: ["application/octet-stream"],
                    file: "nginx.conf",
                  },
                  {
                    directive: "server",
                    line: 13,
                    args: [],
                    file: "nginx.conf",
                    block: [
                      {
                        directive: "listen",
                        line: 14,
                        args: ["80"],
                        file: "nginx.conf",
                      },
                      {
                        directive: "location",
                        line: 15,
                        args: ["/"],
                        file: "nginx.conf",
                        block: [
                          {
                            directive: "root",
                            line: 16,
                            args: ["/usr/share/nginx/html"],
                            file: "nginx.conf",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      // 1. 只拿文本
      const txt = build(payload.config[0].parsed, { header: true });
      console.log(txt);

      // 2. 拿全部文件
      const fileMap = buildFiles(payload);
      for (const [name, content] of fileMap) {
        console.log("===", name, "===");
        console.log(content);
      }
    </script>
  </body>
</html>


```
