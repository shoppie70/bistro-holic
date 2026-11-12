# Bistro HOLIC

Bistro HOLICのサイト制作プロジェクトです。HTML・CSS・JavaScriptで構成しており、表示に依存パッケージのインストールやビルドは不要です。

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
| 共通スタイル・アニメーション | `dist/styles.css`、`dist/hero.css`、`dist/site.js` |

## 現在のデザイン

紙色と赤茶を基調に、トップはベージュ背景に茶色の大きなHOLICのロゴを置いています。その下に料理写真を広げ、縦組みの日本語と小さな店内写真を重ねて、料理と空間を紹介しています。ランチは余白を取った誌面風の構成、ディナーは写真と深い赤茶の背景、店主のこだわりは仕込みの時間を伝える短い特集です。個別ページも同じ書体と配色に揃えています。

トップのアクセス欄は徒歩時間と地図リンクを先に置き、スマホでは営業時間が店先写真より前に並びます。メニューと予約先、住所、営業時間は既存の案内を使っています。

動きは茶色のロゴから料理写真へつながる導入、縦組みの日本語の登場、一部の写真と見出しの表示、スマホメニューの開閉に絞っています。端末の「視差効果を減らす」設定にも対応しています。

日本語のウェブフォントは、見出しに「しっぽり明朝」の400・500、本文とナビゲーションに「Zen角ゴシック New」の400を使っています。必要な文字を抜き出したWOFFを自分のサーバーから配信し、先読みで表示の遅れを抑えています。ライセンスは `dist/assets/OFL-ShipporiMincho.txt` と `dist/assets/OFL-ZenKakuGothicNew.txt` です。新しい文言を加えた場合は、fonttoolsが使える環境で `python3 scripts/subset-fonts.py` を実行してフォントを更新します。

方向性と参考調査の状況は [design/direction.md](design/direction.md) に記録しています。外部サイトは環境のネットワーク制限により未確認です。

## スクリーンショットの撮影

PlaywrightとChromiumが使える環境で、ローカルサーバーを起動してから実行します。

```sh
node scripts/capture.cjs /tmp/holic-preview
```

4ページをPC・スマホ・幅320pxで確認し、スクリーンショットと確認結果を保存します。別のサーバーを使う場合は `HOLIC_PREVIEW_URL`、Chromiumの場所を変える場合は `CHROMIUM_PATH` を指定できます。

## GitHub Pages

確認用サイトの公開先は <https://shoppie70.github.io/bistro-holic/> です。

`main` に `dist` またはデプロイ設定の変更をpushすると、[Deploy GitHub Pages](https://github.com/shoppie70/bistro-holic/actions/workflows/pages.yml) が `dist` の内容を公開します。ビルドは不要で、画像・ウェブフォントを含む静的ファイルをそのまま配信します。Actions画面の「Run workflow」から手動での再公開もできます。

初回はリポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定します。非公開リポジトリの場合は、GitHub Pagesを利用できるプランが必要です。公開処理が成功したかは、Actionsの実行結果で確認できます。

## Sitesのホスティング

[公開中のBistro HOLIC](https://bistro-holic.shotsukamoto.chatgpt.site/) バージョン3を元に改修しています。GitHubへのpushと既存サイトへのデプロイは別です。`.openai/hosting.json` は既存のSitesプロジェクトのホスティング設定です。
