// Kiểm tra tĩnh cho index.html. Chạy: node check.js
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*)<\/script>/);
let fail = 0;
const ok = (name, cond, extra = '') => { console.log((cond ? 'OK   ' : 'LỖI ') + name + (cond ? '' : ' ' + extra)); if (!cond) fail++; };

ok('có thẻ <script>', !!m);
const js = m ? m[1] : '';
let parsed = true, err = '';
try { new Function(js); } catch (e) { parsed = false; err = e.message; }
ok('script nạp không lỗi cú pháp', parsed, err);

// mỗi menu trong PRACT/NAV phải có view tương ứng trong VIEWS
const views = (js.match(/const VIEWS=\{([^}]*)\}/) || [, ''])[1].split(',').map(s => s.split(':')[0].trim());
const pract = [...(js.match(/const PRACT=\[([\s\S]*?)\];/) || [, ''])[1].matchAll(/\['(\w+)'/g)].map(x => x[1]);
const nav = [...(js.match(/const NAV=\[([\s\S]*?)\];/) || [, ''])[1].matchAll(/\['(\w+)'/g)].map(x => x[1]).filter(k => k !== 'PRACT');
ok('mọi tab Luyện có view', pract.every(k => views.includes(k)), pract.filter(k => !views.includes(k)).join());
ok('mọi tab thanh dưới có view', nav.every(k => views.includes(k)), nav.filter(k => !views.includes(k)).join());
ok('mọi view là hàm đã khai báo', views.every(k => new RegExp('function ' + ({ home: 'vHome', lib: 'vLib', card: 'vCard', quiz: 'vQuiz', type: 'vType', listen: 'vListen', hard: 'vHard', read: 'vRead', gram: 'vGram', set: 'vSet' })[k] + '\\b').test(js)), views.join());

// bảng động từ bất quy tắc: mỗi dòng đủ 4 cột, không trùng
const irr = (js.match(/const IRR=`([^`]*)`/) || [, ''])[1].split(';').map(r => r.split('|'));
ok('bảng bất quy tắc: mọi dòng đủ 4 cột', irr.every(r => r.length === 4), irr.filter(r => r.length !== 4).map(r => r[0]).join());
ok('bảng bất quy tắc: không trùng V1', new Set(irr.map(r => r[0])).size === irr.length);

ok('không dùng alert()', !/\balert\(/.test(js));
ok('không gọi thư viện/CDN ngoài', !/<script[^>]+src=|<link[^>]+href=["']http/.test(html));
ok('nút chỉ có biểu tượng đều có aria-label', !/<button(?![^>]*aria-label)[^>]*>\s*[🔊✏️🗑]\s*<\/button>/u.test(js));

// mẫu nhập nhanh: mỗi dòng "en | vi | ví dụ"
const sample = fs.readFileSync(path.join(__dirname, 'data', 'mau-nhap-nhanh.txt'), 'utf8').split('\n').filter(Boolean);
ok('data/mau-nhap-nhanh.txt: mỗi dòng có "en | vi"', sample.every(l => l.split('|').length >= 2));

// đồng bộ: file SQL phải bật RLS và có chính sách theo auth.uid(); không được nhúng service_role key
const sql = fs.readFileSync(path.join(__dirname, 'sync', 'supabase.sql'), 'utf8');
ok('sync/supabase.sql bật RLS', /enable row level security/i.test(sql));
ok('sync/supabase.sql có chính sách auth.uid()', /auth\.uid\(\)\s*=\s*user_id/.test(sql));
ok('index.html không nhúng service_role key', !/service_role/i.test(html));
ok('token đồng bộ ở khoá riêng, không nằm trong S', /const SK='english-lab-sync'/.test(js));
ok('seed có id cố định (tránh nhân đôi khi đồng bộ)', /'seed-i'\+k/.test(js) && /seed-t0/.test(js) && /seed-n0/.test(js));

console.log(fail ? `\n${fail} mục lỗi` : '\nTất cả xanh');
process.exit(fail ? 1 : 0);
