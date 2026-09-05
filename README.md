# Chinachu — Node.js 24 compatibility fork

[![Node.js 24 CI](https://github.com/yamakenjp/Chinachu/actions/workflows/test.yml/badge.svg)](https://github.com/yamakenjp/Chinachu/actions/workflows/test.yml)

これは、開発終了済みの [Chinachu/Chinachu](https://github.com/Chinachu/Chinachu) `gamma` ブランチを、Node.js 24 LTS で動かすための互換フォークです。Chinachu Project による公式な開発再開版ではありません。

## 対応環境

| 項目 | 対応内容 |
| --- | --- |
| Node.js | 24.x（内蔵インストーラーは 24.20.0） |
| npm | Node.js 24 同梱版、lockfile v3 |
| Mirakurun | 4.1.3 |
| OS | Linux（Chinachu 本来の録画環境） |

Node.js 26 は、現在の Mirakurun 4.1.3 が Node.js 22 / 24 のみをサポートしているため対象外です。

## このフォークでの主な変更

- Node.js 14 から Node.js 24 LTS へ更新
- Mirakurun、Socket.IO、Nodemailer などの依存パッケージを更新
- ネイティブ依存だった `diskusage` を Node.js 標準の `fs.statfs` に置換
- 廃止済み API（`util.log`、`url.parse`、`new Buffer`、`request.abort`）を置換
- Basic 認証、TLS、Twitter 通知を現行パッケージの API に対応
- FFmpeg 静的ビルドの取得先を現行リリースへ更新
- Node.js 標準テストランナーと GitHub Actions を追加

## インストール

```bash
git clone --recurse-submodules https://github.com/yamakenjp/Chinachu.git
cd Chinachu
echo 1 | ./chinachu installer
```

続いて設定ファイルを作成し、環境に合わせて `uid`、`gid`、`mirakurunPath`、`recordedDir` などを編集します。

```bash
cp config.sample.json config.json
cp rules.sample.json rules.json
```

番組表の更新と各サービスの起動例:

```bash
./chinachu update
./chinachu service operator execute
./chinachu service wui execute
```

`operator` と `wui` は常駐プロセスなので、実運用では systemd などのプロセス管理下で起動してください。

## 開発時の確認

```bash
npm ci
npm test
```

テストでは構文、共通モジュール、Mirakurun 接続設定を確認します。チューナー、Mirakurun、FFmpeg を含む録画処理は利用環境ごとの実機確認が必要です。

## 注意事項

- 本家は開発終了済みです。このフォークは Node.js 24 互換化を目的としており、将来の継続保守を保証するものではありません。
- 既存環境を更新する場合は、`config.json`、`rules.json`、`data/`、録画ファイルを先にバックアップしてください。
- 不具合報告は、このフォークの [Issues](https://github.com/yamakenjp/Chinachu/issues) へお願いします。

## Original project

- Website: <https://chinachu.moe/>
- Discord: <https://discord.gg/X7KU5W9>
- License: [MIT](LICENSE)
