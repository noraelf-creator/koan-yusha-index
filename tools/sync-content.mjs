// 改訂フォルダ（作業の正本）から content/ へMarkdownを写す。content/ がサイトの元データ。
// 使い方: node tools/sync-content.mjs
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'C:/00_【創作】一時フォルダ/_マダミス改訂_20261004/こちら公安勇者パーティ';
const ARCHIVE = 'C:/00_【創作】一時フォルダ/こちら公安勇者パーティ_HTMLアーカイブ/NEW_VERSION';
const DST = path.resolve('content/改訂版');
const REF = path.resolve('content/参照');
const copies = [
  ['PROJECT_MASTER.md', 'PROJECT_MASTER.md'],
  ['REPORT.md', 'REPORT.md'],
  ['CHANGELOG.md', 'CHANGELOG.md'],
  ['00_INVENTORY.md', '00_INVENTORY.md'],
  ['01_正本', '01_正本'],
  ['02_チェック', '02_チェック'],
  ['03_改稿/GM進行ガイド.md', '03_改稿/GM進行ガイド.md'],
  ['03_改稿/HO/00_共通HO.md', '03_改稿/HO/00_共通HO.md'],
  ['03_改稿/読み合わせ', '03_改稿/読み合わせ'],
  ['03_改稿/カード', '03_改稿/カード'],
  // PC別HOは、電話カードをPCごとに分けた完成版から写す
  ['05_完成版/プレイヤー配布/HO', '05_完成版/HO'],
  ['05_完成版/GM資料/配布物一覧と配布タイミング.md', '05_完成版/配布物一覧と配布タイミング.md'],
  ['04_仮想プレイ', '04_仮想プレイ'],
];
// 参照：作業メモと、作者の指示書（改訂元）
const refs = [
  [path.join(SRC, '_作業メモ/00_作業計画と判断メモ.md'), '判断メモ（J01〜J33）.md'],
  [path.join(SRC, '_作業メモ/密談・電話_旧GM資料_整理.md'), '旧GM資料_密談と電話の台詞.md'],
  [path.join(SRC, '_作業メモ/DFE3ネタバレ図版_文字起こし.md'), 'DFE3ネタバレ図版_文字起こし.md'],
  [path.join(ARCHIVE, 'discussion_v2/REQUEST_V2.md'), '作者指示_議論パートVer2.md'],
  [path.join(ARCHIVE, 'REQUEST_STORY_RESTRUCTURE.txt'), '作者指示_新版ストーリー再構成.md'],
];
function copy(from, to) {
  const st = fs.statSync(from);
  if (st.isDirectory()) {
    for (const f of fs.readdirSync(from)) copy(path.join(from, f), path.join(to, f));
  } else if (/\.(md|txt)$/.test(from)) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.writeFileSync(to.replace(/\.txt$/, '.md'), fs.readFileSync(from, 'utf8').replace(/\r\n/g, '\n'));
  }
}
fs.rmSync(DST, { recursive: true, force: true });
fs.rmSync(REF, { recursive: true, force: true });
for (const [a, b] of copies) copy(path.join(SRC, a), path.join(DST, b));
for (const [a, b] of refs) copy(a, path.join(REF, b));
let n = 0; (function count(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? count(p) : n++; } })(path.resolve('content'));
console.log('content files:', n);
