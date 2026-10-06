# こちら公安勇者パーティ 制作INDEX（改訂版）

公開サイト：https://noraelf-creator.github.io/koan-yusha-index/

『こちら公安勇者パーティ』（マダミス5）の制作資料を読み、気になった箇所に修正案を残すためのサイト。2026-10-05の総点検・改稿・仮想プレイの結果を載せている。画面と仕組みは「お母さんは大統領」の制作INDEXと同じ。

## 画面

- 左：大題（分類）と中題（ページ一覧＋見出し）の2列。幅はドラッグで変えられる
- 中央：本文。読み合わせは話者ごとの色分け（配役・目安はチップ）、HOはPCの色の見出しカード、カードは1枚ずつの枠
- 右：修正案。本文の段落・台詞・表の行にカーソルを合わせて「✎」→ その箇所の修正案を書く。たたむと細い帯になる

## 修正案の保存先

- 共有保存：Cloudflare Worker `mother-president-sync`（D1 `mother-president-author-notes`）、projectId `koan_yusha`、page_id の先頭 `rv1-`。他作品のメモとは projectId で分かれる
- **いまは端末内の下書きのみ**。この作品の編集キーをまだWorkerに登録していないため、「編集キー」で解除しようとすると「この作品の編集キーは設定されていません」になる。修正案は端末のブラウザーに下書きとして残り、「すべて」タブからMarkdown／JSONで書き出せる。登録後に解除すれば「下書きを共有へ送る」で送れる
- 編集キーはこのリポジトリに含めない

## 編集キーの登録（Cloudflareにログインできるときに1回だけ）

Workerのソースと設定は mother-president-index の `v2/cloudflare/`。作品ごとのキーは Secret `ADDITIONAL_PROJECT_KEYS`（JSON：projectId → キー）で持つ。Workerのコードは変えない。

```
cd C:\02_claude.projects\mother-president-index\v2\cloudflare
npx wrangler login
npx wrangler secret list                        # ADDITIONAL_PROJECT_KEYS がすでにあるか（名前だけ見える）
npx wrangler secret put ADDITIONAL_PROJECT_KEYS
# 入力例：{"koan_yusha":"<作者用の編集キー>"}
```

- `secret put` は値を丸ごと置き換える。すでに `ADDITIONAL_PROJECT_KEYS` がある場合（同じWorkerを使う M.T.A. の `mta` など）、今の値は読み出せないので、ほかの作品のキーも同じJSONに入れ直すこと。入れ忘れると、その作品で解除できなくなる
- 編集キーは長いランダムな文字列にし、リポジトリの外（`.private` など）に保管する。メモ欄・チャットに貼らない

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

このサイトは公開されている（URLを知っていれば誰でも読める。検索エンジンには載せない設定）。真相・GM情報を含むので、プレイヤーにURLを教えないこと。
