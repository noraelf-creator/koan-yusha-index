# こちら公安勇者パーティ 制作INDEX（改訂版）

公開サイト：https://noraelf-creator.github.io/koan-yusha-index/

『こちら公安勇者パーティ』（マダミス5）の制作資料を読み、気になった箇所に修正案を残すためのサイト。2026-10-05の総点検・改稿・仮想プレイの結果を載せている。画面と仕組みは「お母さんは大統領」の制作INDEXと同じ。

## 画面

- 左：大題（分類）と中題（ページ一覧＋見出し）の2列。幅はドラッグで変えられる
- 中央：本文。読み合わせは話者ごとの色分け（配役・目安はチップ）、HOはPCの色の見出しカード、カードは1枚ずつの枠
- 右：修正案。本文の段落・台詞・表の行にカーソルを合わせて「✎」→ その箇所の修正案を書く。たたむと細い帯になる

## 修正案の保存先

- 共有保存：この作品専用の Cloudflare Worker `koan-yusha-sync`（D1 `koan-yusha-author-notes`、projectId `koan_yusha`、page_id の先頭 `rv1-`）。https://koan-yusha-sync.noraelf-mta-review.workers.dev 。他作品のWorker・DBとは別
- 閲覧は誰でも可。サイト上部の「編集キー」に作者用の編集キーを入れると、その端末から共有保存できる（30日間有効）
- 解除していない間は、端末のブラウザーに下書きとして残る（あとで「下書きを共有へ送る」）。「すべて」タブから未反映の修正案をMarkdown／JSONで書き出せる
- 編集キーはこのリポジトリに含めない。作者用の控えは改訂フォルダの `.private/作者用編集キー.txt`

## Worker（`cloudflare/`）

お母さんは大統領と同じWorkerのコードと、この作品用の設定（`wrangler.jsonc`）。2026-10-06にデプロイ済み。

```
cd cloudflare
npx wrangler deploy                       # コードを直したとき
npx wrangler secret put AUTHOR_EDIT_KEY   # 編集キーを変えるとき（入れたら .private の控えも直す）
```

`https://koan-yusha-sync.noraelf-mta-review.workers.dev/api/health` が `api: ok, d1: ok` なら動いている。

## 更新のしかた

```
npm install          # 初回だけ（marked など）
npm run sync         # 改訂フォルダ（_マダミス改訂_20261004/こちら公安勇者パーティ）から content/ へ写す
npm run build        # content/ → data/site-data.js
npm run serve        # http://127.0.0.1:8765/ で確認（ローカルでは共有保存に接続できない）
```

そのあと commit → push すれば、1〜2分でサイトに出る。

`content/` がサイトの元データ。`content/参照/` は作業メモ（判断メモ・旧GM資料の台詞・DFE3図版の書き起こし）と、改訂元の作者の指示書（REQUEST_V2・新版ストーリー再構成）の写し。`content/サイトの使い方.md` はこのリポジトリにだけある（syncで消えない）。

## フォルダ

| 場所 | 内容 |
|---|---|
| `index.html`, `assets/` | 画面（静的サイト） |
| `data/site-data.js` | ビルド結果（全ページのHTMLと目次） |
| `data/config.js` | 共有保存の接続先（公開してよい値だけ） |
| `content/` | 元のMarkdown |
| `tools/` | 写し・ビルド・ローカル確認・スクリーンショット |
| `cloudflare/` | 共有保存のWorker（`koan-yusha-sync`） |

このサイトは公開されている（URLを知っていれば誰でも読める。検索エンジンには載せない設定）。真相・GM情報を含むので、プレイヤーにURLを教えないこと。
