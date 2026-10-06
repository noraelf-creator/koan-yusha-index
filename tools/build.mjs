// content/ のMarkdown・HTMLから data/site-data.js を作る。
// 使い方: node tools/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { Marked } from 'marked';

const ROOT = path.resolve('.');
const C = (p) => path.join(ROOT, 'content', p);
const REV = (p) => C(path.join('改訂版', p));

// ---------- 分類（大題）と各ページ（中題） ----------
const GROUPS = [
  { id: 'start', label: 'はじめに', icon: 'home' },
  { id: 'ho', label: 'HO', icon: 'doc' },
  { id: 'read', label: '読み合わせ', icon: 'chat' },
  { id: 'card', label: 'カード', icon: 'cards' },
  { id: 'gm', label: 'GM資料', icon: 'flag' },
  { id: 'canon', label: '正本（真相）', icon: 'key' },
  { id: 'check', label: 'チェック', icon: 'check' },
  { id: 'play', label: '仮想プレイ', icon: 'dice' },
  { id: 'ref', label: '参照', icon: 'books' },
  { id: 'log', label: '変更履歴', icon: 'clock' },
];
const P = [];
const add = (group, sub, id, nav, file, kind = 'doc', audience = '') => P.push({ group, sub, id, nav, file, kind, audience });

add('start', '', 'about', 'このサイトの使い方', C('サイトの使い方.md'), 'doc', '');
add('start', '', 'master', 'PROJECT_MASTER（全体の案内）', REV('PROJECT_MASTER.md'), 'doc', '制作');
add('start', '', 'report', 'REPORT（評価と課題）', REV('REPORT.md'), 'doc', '制作');

add('ho', '共通', 'ho-common', '共通HO', REV('03_改稿/HO/00_共通HO.md'), 'ho', 'PL配布');
const pcs = [['1', 'アベル'], ['2', 'ライトニング'], ['3', 'ルキナ'], ['4', 'ウエスカー'], ['5', 'ソフィー']];
const MARKS = '①②③④⑤⑥';
for (const [n, name] of pcs) {
  const dir = REV(`05_完成版/HO/PC${n}_${name}`);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort((a, b) => a.localeCompare(b, 'ja'));
  for (const f of files) {
    const label = f.replace(/^PC\d_[^_]+_/, '').replace(/\.md$/, '').replace(/_/g, ' ');
    const k = MARKS.indexOf(label[0]);
    const sid = (k >= 0 ? k + 1 : 9) + (label.includes('-2') ? 'b' : '');
    add('ho', `PC${n} ${name}`, `ho-pc${n}-${sid}`, label, path.join(dir, f), 'ho', 'PL配布');
  }
}

const readSubs = [
  ['オープニング', ['R01', 'R02']], ['出動', ['R03']], ['帰り道・取り調べ', ['R04', 'R05', 'R06']],
  ['事件の発覚', ['R07']], ['第二議論', ['R08']], ['投票のあと', ['R09', 'R10']],
  ['出動・四天王', ['R11', 'R12', 'R13', 'R14', 'R15']], ['エンディング', ['R16', 'R17', 'R18', 'R19', 'R20', 'R21']],
];
const readDir = REV('03_改稿/読み合わせ');
const readFiles = fs.readdirSync(readDir);
for (const [sub, ids] of readSubs) for (const rid of ids) {
  const f = readFiles.find((x) => x.startsWith(rid + '_'));
  const nav = rid + ' ' + f.replace(/^R\d+_/, '').replace(/\.md$/, '').replace(/_/g, '／');
  add('read', sub, rid.toLowerCase(), nav, path.join(readDir, f), 'read', 'PL配布');
}
const CARD = (f) => REV('03_改稿/カード/' + f);
add('card', '第一議論', 'card-common', '共通資料（C01〜C20）', CARD('共通資料_第一議論の開始時.md'), 'card', 'PL配布');
add('card', '第一議論', 'card-guide', '推理の手引き', CARD('推理の手引き_第一議論.md'), 'card', 'PL配布');
add('card', '第一議論', 'card-search', '調査カード（S01〜S17）', CARD('調査カード_第一・第二議論.md'), 'card', 'PL配布');
add('card', '第二議論', 'card-second', '追加カード（N01〜N03）', CARD('第二議論の開始時_追加カード.md'), 'card', 'PL配布');
add('card', '第二議論', 'card-vote', '投票用紙と推理メモ', CARD('投票用紙と推理メモ.md'), 'doc', 'PL配布');
add('card', '第三議論', 'card-third', '予告状の資料と解読シート（Y01〜Y06）', CARD('第三議論_予告状の資料カード.md'), 'card', 'PL配布');

add('gm', '', 'gm-guide', 'GM進行ガイド', REV('03_改稿/GM進行ガイド.md'), 'doc', 'GM専用');
add('gm', '', 'gm-dist', '配布物一覧と配布タイミング', REV('05_完成版/配布物一覧と配布タイミング.md'), 'doc', 'GM専用');

add('canon', '', 'canon-truth', '真相', REV('01_正本/真相.md'), 'doc', 'GM専用');
add('canon', '', 'canon-tl', 'タイムライン', REV('01_正本/タイムライン.md'), 'doc', 'GM専用');
add('canon', '', 'canon-chars', 'キャラクター表', REV('01_正本/キャラクター表.md'), 'doc', 'GM専用');
add('canon', '', 'canon-clues', '手がかりマップ', REV('01_正本/手がかりマップ.md'), 'doc', 'GM専用');

add('check', '', 'check-structure', '構成チェック', REV('02_チェック/構成チェック.md'), 'doc', '制作');
add('check', '', 'check-integrity', '整合性チェック', REV('02_チェック/整合性チェック.md'), 'doc', '制作');
add('check', '', 'check-inventory', '棚卸し（INVENTORY）', REV('00_INVENTORY.md'), 'doc', '制作');

const PLAY = (f) => REV('04_仮想プレイ/' + f);
add('play', '第1回 標準', 'play1-log', 'ログ', PLAY('第1回_標準プレイ_ログ.md'), 'doc', '制作');
add('play', '第1回 標準', 'play1-rev', '振り返り', PLAY('第1回_振り返り.md'), 'doc', '制作');
add('play', '第2回 難しめ', 'play2-log', 'ログ', PLAY('第2回_難しめプレイ_ログ.md'), 'doc', '制作');
add('play', '第2回 難しめ', 'play2-rev', '振り返り', PLAY('第2回_振り返り.md'), 'doc', '制作');
add('play', '第3回 初心者卓', 'play3-log', 'ログ', PLAY('第3回_初心者卓_ログ.md'), 'doc', '制作');
add('play', '第3回 初心者卓', 'play3-rev', '振り返り', PLAY('第3回_振り返り.md'), 'doc', '制作');
add('play', '第4回 修正後', 'play4', '修正後の再プレイ', PLAY('第4回_修正後の再プレイ.md'), 'doc', '制作');

add('ref', '作業メモ', 'ref-judge', '判断メモ（J01〜J33）', C('参照/判断メモ（J01〜J33）.md'), 'doc', '参照');
add('ref', '作業メモ', 'ref-gmlines', '旧GM資料 密談と電話の台詞', C('参照/旧GM資料_密談と電話の台詞.md'), 'doc', '参照');
add('ref', '作業メモ', 'ref-dfe3', 'DFE3ネタバレ図版（文字起こし）', C('参照/DFE3ネタバレ図版_文字起こし.md'), 'doc', '参照');
add('ref', '作者の指示（改訂元）', 'ref-req2', '議論パートVer.2 指示書', C('参照/作者指示_議論パートVer2.md'), 'doc', '参照');
add('ref', '作者の指示（改訂元）', 'ref-req1', '新版ストーリー再構成 指示書', C('参照/作者指示_新版ストーリー再構成.md'), 'doc', '参照');

add('log', '', 'changelog', 'CHANGELOG', REV('CHANGELOG.md'), 'doc', '制作');

// ---------- 道具 ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = (h) => String(h).replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const norm = (s) => strip(s).replace(/\s+/g, '').trim();
function fnv(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h >>> 0; }
const SPEAKERS = { 'アベル': 'abel', '映画の勇者': 'abel', 'ライトニング': 'lightning', '映画の魔法使い': 'lightning', 'ルキナ': 'lukina', '映画の僧侶': 'lukina', 'ウエスカー': 'westker', '映画の騎士': 'westker', 'ソフィー': 'sophie', '映画のエルフ': 'sophie', 'ロト': 'roto', '野良エルフ': 'merle', 'メルル': 'merle', 'バリー': 'barry', '容疑者の男': 'barry', 'クラウド': 'cloud', 'カムイ': 'kamui' };
const PC_KEYS = ['', 'abel', 'lightning', 'lukina', 'westker', 'sophie'];
const PC_NAMES = { 'アベル': 'abel', 'ライトニング': 'lightning', 'ルキナ': 'lukina', 'ウエスカー': 'westker', 'ソフィー': 'sophie' };
const NOTE_COL = /^(情報の限界|注意点|注意|備考|この分岐で明かさないこと)$/;

function makeCtx(page) {
  const used = new Map();
  const toc = [];
  const aid = (text, kind = 'a') => {
    const base = kind + fnv(norm(text)).toString(36);
    const n = (used.get(base) || 0) + 1; used.set(base, n);
    return n === 1 ? base : base + '-' + n;
  };
  return { page, aid, toc, noteSeq: 0 };
}

// ---------- Markdownの描画 ----------
function makeMarked(ctx) {
  const m = new Marked({ gfm: true, breaks: true });
  m.use({ renderer: {
    heading({ tokens, depth, text }) {
      const inner = this.parser.parseInline(tokens);
      const id = ctx.aid(text, 'h');
      if (depth === 2 || depth === 3) ctx.toc.push({ id, text: strip(inner), level: depth });
      return `<h${depth} id="${id}" class="h${depth}" data-a="${id}">${inner}</h${depth}>\n`;
    },
    paragraph({ tokens, text }) {
      const inner = this.parser.parseInline(tokens);
      return `<p data-a="${ctx.aid(text)}">${inner}</p>\n`;
    },
    listitem(item) {
      const inner = this.parser.parse(item.tokens, !!item.loose);
      return `<li data-a="${ctx.aid(item.text)}">${inner}</li>\n`;
    },
    blockquote({ tokens, text }) {
      const inner = this.parser.parse(tokens).replace(/ data-a="[^"]*"/g, '');
      const tag = /^「/.test(text.trim()) ? ' class="tagline"' : '';
      return `<blockquote${tag} data-a="${ctx.aid(text)}">${inner}</blockquote>\n`;
    },
    table(token) { return renderTable.call(this, token, ctx); },
    hr() { return '<hr>\n'; },
    code({ text }) { return `<pre class="code" data-a="${ctx.aid(text)}"><code>${esc(text)}</code></pre>\n`; },
  } });
  return m;
}

function renderTable(token, ctx) {
  const P = this.parser;
  const head = token.header.map((c) => strip(P.parseInline(c.tokens)).trim());
  const noteIdx = head.map((h, i) => (NOTE_COL.test(h) ? i : -1)).filter((i) => i >= 0);
  const keep = head.map((_, i) => i).filter((i) => !noteIdx.includes(i));
  const notes = [];
  let html = '<div class="table-wrap"><table>\n<thead><tr>';
  for (const i of keep) html += `<th>${P.parseInline(token.header[i].tokens)}</th>`;
  html += '</tr></thead>\n<tbody>\n';
  for (const row of token.rows) {
    const cells = row.map((c) => P.parseInline(c.tokens));
    const rowText = cells.map(strip).join(' ');
    const id = ctx.aid(rowText, 'r');
    const rowNotes = [];
    for (const i of noteIdx) {
      if (!strip(cells[i]).trim() || /^[-—]$/.test(strip(cells[i]).trim())) continue;
      const nid = 'n' + id + '-' + i;
      const first = strip(cells[keep[0]]).trim();
      const second = keep[1] !== undefined ? strip(cells[keep[1]]).trim() : '';
      const label = (first.length <= 8 && second ? first + ' ' + second : first).slice(0, 60);
      rowNotes.push(nid);
      notes.push({ nid, label, kind: head[i], body: cells[i] });
    }
    html += `<tr data-a="${id}">`;
    keep.forEach((i, k) => {
      const nw = k === 0 && strip(cells[i]).trim().length <= 8 ? ' class="nw"' : '';
      const mark = k === 0 && rowNotes.length ? rowNotes.map((n) => `<button type="button" class="note-mark" data-note="${n}" title="注意点を開く">注</button>`).join('') : '';
      html += `<td${nw}>${cells[i]}${mark}</td>`;
    });
    html += '</tr>\n';
  }
  html += '</tbody></table></div>\n';
  if (notes.length) {
    html += '<div class="notes-group"><div class="notes-label">注意点</div>\n';
    for (const n of notes) {
      html += `<details class="note ${n.kind === '情報の限界' ? 'limit' : 'caution'}" id="${n.nid}" data-a="${ctx.aid(n.label + n.kind + strip(n.body))}"><summary><span class="note-chip">${esc(n.kind)}</span>${esc(n.label)}</summary><div class="note-body">${n.body}</div></details>\n`;
    }
    html += '</div>\n';
  }
  return html;
}

// :::note 見出し ... ::: を <details> にする（既定は閉じる）
function splitNotes(md) {
  const out = []; const lines = md.split('\n'); let buf = []; let note = null;
  for (const line of lines) {
    const open = line.match(/^:::note\s*(.*)$/);
    if (!note && open) { if (buf.length) out.push({ type: 'md', text: buf.join('\n') }); buf = []; note = { type: 'note', title: open[1].trim(), body: [] }; continue; }
    if (note && line.trim() === ':::') { out.push(note); note = null; continue; }
    if (note) note.body.push(line); else buf.push(line);
  }
  if (note) out.push(note);
  if (buf.length) out.push({ type: 'md', text: buf.join('\n') });
  return out;
}
function noteKind(title) {
  if (/^情報の限界/.test(title)) return 'limit';
  if (/^(注意点|注意)/.test(title)) return 'caution';
  if (/制作|出典|新規執筆/.test(title)) return 'meta';
  return 'info';
}
function noteChip(title) {
  const m = title.match(/^([^｜|]+)[｜|](.+)$/);
  if (m) return `<span class="note-chip">${esc(m[1])}</span>${esc(m[2])}`;
  return esc(title);
}

function renderMd(md, ctx, opts = {}) {
  const mk = makeMarked(ctx);
  let html = '';
  for (const seg of splitNotes(md)) {
    if (seg.type === 'note') {
      const inner = renderMd(seg.body.join('\n'), ctx, opts);
      html += `<details class="note ${noteKind(seg.title)}" data-a="${ctx.aid('note' + seg.title)}"${opts.openNotes ? ' open' : ''}><summary>${noteChip(seg.title)}</summary><div class="note-body">${inner}</div></details>\n`;
      continue;
    }
    html += renderTokens(mk.lexer(seg.text), mk, ctx, opts);
  }
  return html;
}

// 汎用：トークン列を描画（HO・カードの特別扱いを含む）
function renderTokens(tokens, mk, ctx, opts) {
  let html = '';
  let cardOpen = false;
  const closeCard = () => { if (cardOpen) { html += '</div></section>\n'; cardOpen = false; } };
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type === 'space') continue;
    // ページ見出し（h1）は上部のタイトルに使うので本文では省く
    if (t.type === 'heading' && t.depth === 1 && !ctx.h1Done) { ctx.h1Done = true; ctx.h1 = strip(mk.parseInline(t.text)); continue; }
    // HO：見出し直後の「PCn／…」はキッカー
    if (opts.kind === 'ho' && t.type === 'paragraph' && /^PC\d／|^（.*(配布|読む|渡される|配る)|^\d+歳/.test(t.text) && !ctx.kicker) { ctx.kicker = strip(mk.parseInline(t.text)); continue; }
    // HO：「▼ …」は小見出し
    if (t.type === 'paragraph' && /^▼\s*/.test(t.text) && !t.text.includes('\n')) {
      const text = t.text.replace(/^▼\s*/, '');
      const id = ctx.aid(text, 'h');
      ctx.toc.push({ id, text, level: 3 });
      html += `<h3 id="${id}" class="ho-sec" data-a="${id}">${mk.parseInline(text)}</h3>\n`;
      continue;
    }
    // 「**大事なこと…**」「**★…**」＋直後のリスト → 強調ボックス
    if (t.type === 'paragraph' && /^\*\*(大事なこと|★|要点)/.test(t.text)) {
      let inner = mk.parser([t]);
      let j = i + 1; while (tokens[j] && tokens[j].type === 'space') j++;
      if (tokens[j] && tokens[j].type === 'list') { inner += mk.parser([tokens[j]]); i = j; }
      html += `<div class="callout">${inner}</div>\n`;
      continue;
    }
    // カード：カード名の見出しごとにカード枠を作る
    if (opts.kind === 'card' && t.type === 'heading' && t.depth === 2) {
      closeCard();
      const title = t.text;
      if (/^([CSNY]\d{2}[\s　]|資料[AB]|T\d)/.test(title)) {
        const ex = title.match(/《(EX：[^》]+)》/);
        const clean = title.replace(/\s*《[^》]+》/, '');
        const id = ctx.aid(clean, 'h');
        ctx.toc.push({ id, text: clean, level: 2 });
        const tone = /^N/.test(clean) ? ' extra' : /^Y/.test(clean) ? ' ex' : /^(資料|C)/.test(clean) ? ' public' : '';
        html += `<section class="cardx${tone}" id="${id}"><header class="cardx-head" data-a="${id}"><span class="cardx-title">${esc(clean)}</span>${ex ? `<span class="badge ex">${esc(ex[1])}</span>` : ''}</header><div class="cardx-body">\n`;
        cardOpen = true;
        continue;
      }
      if (/進め方|ルール/.test(title)) {
        // 進め方は折りたたみ（注意点と同じ扱い）
        let j = i + 1; const body = [];
        while (j < tokens.length && !(tokens[j].type === 'heading' && tokens[j].depth <= 2) && tokens[j].type !== 'hr') { body.push(tokens[j]); j++; }
        html += `<details class="note info" data-a="${ctx.aid('note' + title)}"><summary><span class="note-chip">進め方</span>${esc(title)}</summary><div class="note-body">${mk.parser(body)}</div></details>\n`;
        i = j - 1;
        continue;
      }
    }
    // カード：「**C01　カード名**」で始まる段落を1枚のカード枠にする（本文は同じ段落の2行目以降）
    if (opts.kind === 'card' && t.type === 'paragraph' && /^\*\*([CSNY]\d{2}|T\d)[\s　]/.test(t.text)) {
      closeCard();
      const lines = t.text.split('\n');
      const mh = lines[0].match(/^\*\*([^*]+)\*\*(.*)$/);
      const title = mh ? mh[1].trim() : strip(mk.parseInline(lines[0]));
      const tail = mh ? mh[2].trim() : '';
      const id = ctx.aid(title, 'h');
      ctx.toc.push({ id, text: title, level: 2 });
      const tone = /^N/.test(title) ? ' extra' : /^Y/.test(title) ? ' ex' : /^C/.test(title) ? ' public' : '';
      html += `<section class="cardx${tone}" id="${id}"><header class="cardx-head" data-a="${id}"><span class="cardx-title">${esc(title)}</span>${tail ? `<span class="badge">${mk.parseInline(tail)}</span>` : ''}</header><div class="cardx-body">\n`;
      const rest = lines.slice(1).join('\n').trim();
      if (rest) html += `<p data-a="${ctx.aid(rest)}">${mk.parseInline(rest)}</p>\n`;
      cardOpen = true;
      continue;
    }
    if (opts.kind === 'card' && cardOpen && t.type === 'heading') closeCard();
    if (t.type === 'hr' && cardOpen) { closeCard(); continue; }
    html += mk.parser([t]);
  }
  closeCard();
  return html;
}

// ---------- 読み合わせ ----------
function renderReading(md, ctx) {
  const lines = md.split('\n');
  let i = 0; let headerLines = [];
  // 見出し
  if (lines[0].startsWith('# ')) { ctx.h1 = lines[0].slice(2).trim(); ctx.h1Done = true; i = 1; }
  // 最初の --- までがヘッダー
  while (i < lines.length && lines[i].trim() !== '---') { headerLines.push(lines[i]); i++; }
  i++; // skip ---
  let html = '<div class="read-head">';
  const metaBuf = []; const ruleBuf = []; const other = [];
  for (const l of headerLines) {
    const s = l.trim(); if (!s) continue;
    if (/^(読み手|配役)：/.test(s)) html += `<div class="readers" data-a="${ctx.aid(s)}"><span class="readers-label">配役</span>${formatReaders(s.replace(/^(読み手|配役)：/, ''))}</div>`;
    else if (/^目安：/.test(s)) html += `<div class="readers" data-a="${ctx.aid(s)}"><span class="readers-label">目安</span><span class="reader">${inlineMd(s.replace(/^目安：/, ''))}</span></div>`;
    else if (/^出典：/.test(s)) metaBuf.push(s.replace(/^出典：/, ''));
    else if (/^【新規執筆】/.test(s)) { ctx.badges.push('新規執筆'); metaBuf.push(s.replace(/^【新規執筆】/, '新規執筆：')); }
    else if (/^- /.test(s)) ruleBuf.push(s);
    else if (/^\*\*(重要|読み手へ|注意|表記ルール)/.test(s)) other.push(s);
    else other.push(s);
  }
  html += '</div>\n';
  if (ruleBuf.length || other.length) html += `<div class="callout">${renderMd([...other, '', ...ruleBuf].join('\n'), ctx)}</div>\n`;
  if (metaBuf.length) html += `<details class="note meta" data-a="${ctx.aid('meta' + metaBuf.join())}"><summary><span class="note-chip">制作メモ</span>出典・改稿の記録</summary><div class="note-body">${renderMd(metaBuf.join('\n\n'), ctx)}</div></details>\n`;

  html += '<div class="script">\n';
  let aside = [];
  const flushAside = () => {
    if (!aside.length) return;
    const text = aside.join('\n').trim(); aside = [];
    if (!text) return;
    html += `<div class="aside">${renderMd(text, ctx)}</div>\n`;
  };
  for (; i < lines.length; i++) {
    const raw = lines[i]; const s = raw.trim();
    if (!s) { if (aside.length) aside.push(''); continue; }
    if (s === '---') { flushAside(); html += '<hr class="sep">\n'; continue; }
    let m;
    if ((m = s.match(/^(#{2,3})\s+(.*)$/))) {
      flushAside();
      const level = m[1].length; const text = m[2];
      const id = ctx.aid(text, 'h'); ctx.toc.push({ id, text, level });
      html += `<h${level} id="${id}" class="h${level} read-sec" data-a="${id}">${esc(text)}</h${level}>\n`;
      continue;
    }
    if (/^■/.test(s)) { flushAside(); html += `<div class="scene" data-a="${ctx.aid(s)}">${esc(s.replace(/^■\s*/, ''))}</div>\n`; continue; }
    if (/^ト書き：/.test(s)) { flushAside(); html += `<div class="reader-tag" data-a="${ctx.aid(s)}">${esc(s)}</div>\n`; continue; }
    if (/^（.*）$/.test(s) && !/「/.test(s.slice(0, 2))) { flushAside(); html += `<div class="stage" data-a="${ctx.aid(s)}">${inlineMd(s)}</div>\n`; continue; }
    if ((m = s.match(/^([^「」\s]{1,14}?)(（[^）「」]{1,12}）)?「([\s\S]*)」$/))) {
      flushAside();
      const who = m[1]; const mod = m[2] ? m[2].slice(1, -1) : '';
      const key = SPEAKERS[who] || (who === '地の文' ? 'narr' : 'npc');
      html += `<div class="line sp-${key}" data-a="${ctx.aid(s)}"><span class="who">${esc(who)}${mod ? `<small>${esc(mod)}</small>` : ''}</span><span class="say">「${inlineMd(m[3])}」</span></div>\n`;
      continue;
    }
    aside.push(raw);
  }
  flushAside();
  html += '</div>\n';
  return html;
}
function formatReaders(s) {
  return s.split(/[／、]/).map((part) => {
    const t = part.trim(); if (!t) return '';
    const pc = t.match(/PC(\d)/);
    const name = Object.keys(PC_NAMES).find((k) => t.startsWith(k));
    const who = pc ? PC_KEYS[+pc[1]] : name ? PC_NAMES[name] : '';
    return `<span class="reader${who ? ' rd-' + who : ''}">${inlineMd(t)}</span>`;
  }).join('');
}
const inlineMk = new Marked({ gfm: true, breaks: true });
const inlineMd = (s) => inlineMk.parseInline(s);

// ---------- 旧HTML（レビューv3） ----------
function renderLegacyHtml(src, ctx) {
  let h = src.replace(/<!--[\s\S]*?-->/g, '').replace(/\sstyle="[^"]*"/g, '');
  h = h.replace(/<div class="maker">([\s\S]*?)<\/div>/g, (_, inner) => `<details class="note meta"><summary><span class="note-chip">制作者向け</span>${esc(strip(inner).slice(0, 40))}…</summary><div class="note-body"><p>${inner}</p></div></details>`);
  h = h.replace(/<span class="tag ok">/g, '<span class="badge ok">').replace(/<span class="tag warn">/g, '<span class="badge warn">').replace(/<span class="tag unknown">/g, '<span class="badge unknown">').replace(/<span class="tag bad">/g, '<span class="badge bad">');
  h = h.replace(/<article class="card"/g, '<article class="cardx v3card"').replace(/<div class="card">/g, '<div class="cardx v3card">');
  h = h.replace(/<div class="player">/g, '<div class="player-box">').replace(/<div class="important">/g, '<div class="callout">');
  // 見出し・段落・行にアンカーを付ける
  h = h.replace(/<(h2|h3|h4)>([\s\S]*?)<\/\1>/g, (_, tag, inner) => {
    const id = ctx.aid(inner, 'h');
    if (tag !== 'h4') ctx.toc.push({ id, text: strip(inner), level: tag === 'h2' ? 2 : 3 });
    return `<${tag} id="${id}" class="${tag}" data-a="${id}">${inner}</${tag}>`;
  });
  h = h.replace(/<(p|li|tr)(\s[^>]*)?>([\s\S]*?)<\/\1>/g, (all, tag, attrs = '', inner) => `<${tag}${attrs} data-a="${ctx.aid(inner, tag === 'tr' ? 'r' : 'a')}">${inner}</${tag}>`);
  h = h.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>').replace(/<div class="scroll">/g, '<div>');
  return h;
}

// ---------- 組み立て ----------
const pages = [];
for (const p of P) {
  const ctx = makeCtx(p); ctx.badges = [];
  let html = '';
  if (p.kind === 'link') {
    html = '<div class="callout"><p>外部ページへのリンクです。</p></div>';
    ctx.h1 = p.nav;
  } else {
    const src = fs.readFileSync(p.file, 'utf8').replace(/\r\n/g, '\n');
    if (p.kind === 'read') html = renderReading(src, ctx);
    else if (p.kind === 'html') { html = renderLegacyHtml(src, ctx); ctx.h1 = p.nav; }
    else html = renderMd(src, ctx, { kind: p.kind });
  }
  if (p.kind === 'ho' && ctx.h1) {
    const hm = ctx.h1.match(/【(?:あなたは\s*)?(.+?)】/);
    const pcKey = (p.id.match(/^ho-pc(\d)/) || [])[1];
    const tone = pcKey ? PC_KEYS[+pcKey] : 'common';
    html = `<div class="ho-hero tone-${tone}"><div class="ho-kicker">${esc(ctx.kicker || '')}</div><div class="ho-name">${esc(hm ? hm[1] : ctx.h1)}</div></div>\n` + html;
  }
  const text = strip(html).replace(/\s+/g, ' ').trim();
  const rel = p.file ? path.relative(path.join(ROOT, 'content'), p.file).replace(/\\/g, '/') : '';
  const hoName = p.kind === 'ho' && ctx.h1 ? (ctx.h1.match(/【(?:あなたは\s*)?(.+?)】/) || [])[1] : null;
  pages.push({ id: p.id, group: p.group, sub: p.sub, nav: p.nav, kind: p.kind, audience: p.audience, title: hoName ? hoName + '　' + p.nav : (ctx.h1 || p.nav), badges: ctx.badges, source: rel, toc: ctx.toc, html, text });
}

const data = { version: 'rv1', built: new Date().toISOString(), groups: GROUPS, pages };
fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'data', 'site-data.js'), 'window.SITE_DATA=' + JSON.stringify(data) + ';\n');
const size = fs.statSync(path.join(ROOT, 'data', 'site-data.js')).size;
console.log('pages:', pages.length, 'size:', (size / 1024).toFixed(0) + 'KB');
for (const g of GROUPS) console.log(' ', g.label, pages.filter((x) => x.group === g.id).length);
