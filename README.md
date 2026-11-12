# Bistro HOLIC

Bistro HOLICのサイト制作プロジェクトです。HTML・CSS・JavaScriptで構成しており、依存パッケージのインストールやビルドは不要です。

## ローカルで確認する

リポジトリのルートで実行します。

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

ブラウザで <http://127.0.0.1:8000/> を開きます。

| ページ | 編集ファイル |
|---|---|
| トップ | `dist/index.html` |
| ランチ | `dist/lunch/index.html` |
| ディナー | `dist/dinner/index.html` |
| 店主のこだわり | `dist/chef/index.html` |
| 共通スタイル・アニメーション | `dist/styles.css`、`dist/site.js` |

## 現在の状態

デプロイ済みの [Bistro HOLIC](https://bistro-holic.shotsukamoto.chatgpt.site/) バージョン3のソースを保存しています。GitHubへのpushと、既存サイトへのデプロイは別です。`.openai/hosting.json` は既存のSitesプロジェクトのホスティング設定です。

トップは白基調のランチと黒基調のディナー。PCでは見出しと写真の左右、および境界線の傾きを反転させています。スマホでは縦に並び、両方の写真がスクロールで現れます。

## 次のデザイン改修メモ

以下は検討中です。

- トップの「店主のこだわり」は、直前の「ワインとコース」と暗い配色・写真と見出しの横並びが続く。明るい紙色と、見出しから入る短い特集のような構図を候補にする。
- 「店主のこだわり」の個別ページは、仕込みの話ごとに写真と本文の順序、余白、見出しの大きさに変化をつける。料理人のインタビューや雑誌の特集も参考にする。
- トップの「アクセス」は、駅からの徒歩時間と地図へのリンクを先に見せる。店先の写真を到着の目印に使い、スマホで営業時間も見つけやすくする。

参考探しは [frontend-reference-hunt](https://github.com/LucasSantana-Dev/frontend-reference-hunt)、既存ページの批評と構図の見直しは [Impeccable](https://impeccable.style/docs/improve-design/)、PCとスマホの表示確認は [Playwright Interactive](https://github.com/openai/skills/tree/main/skills/.curated/playwright-interactive) が候補です。
