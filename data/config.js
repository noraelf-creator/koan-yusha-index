// 公開してよい設定だけを書く。作者キーやその他の秘密はここに書かない。
window.SITE_CONFIG = {
  siteTitle: 'こちら公安勇者パーティ',
  siteSub: '制作INDEX・改訂版',
  projectId: 'koan_yusha',
  // 修正案の共有保存先（この作品専用のWorker。ソースは cloudflare/）
  memoApi: 'https://koan-yusha-sync.noraelf-mta-review.workers.dev',
  // 改訂版のページのメモは page_id の先頭にこれを付けて保存する
  pagePrefix: 'rv1-',
  // 端末内の保存領域の名前（他作品のINDEXと混ざらないように）
  storagePrefix: 'koan-rv1:',
  legacySessionKey: '',
  v2Url: ''
};
