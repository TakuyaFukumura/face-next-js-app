# Changelog

このプロジェクトのすべての変更はこのファイルに記録されます。

フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/) に基づいており、
このプロジェクトは [Semantic Versioning](https://semver.org/lang/ja/) に従っています。

## [Unreleased]

### 変更

- ここに書く

## [0.2.0] - 2026-06-19

### 追加

- リアルタイム顔検出・属性推定Webアプリ機能を実装 (#10)
  - `face-api.js` を採用し、ブラウザ完結で顔検出・表情・年齢・性別推定を実現
  - TinyFaceDetector + 表情推定モデル + 年齢/性別推定モデルを `public/models/face-api/` に配置
  - コンポーネント: `FaceRecognitionPage`, `CameraView`, `OverlayCanvas`, `StatusPanel`, `PrivacyNotice`
  - カスタムフック: `useCamera`, `useFaceApiModels`, `useFaceDetection`
  - ユーティリティ: `drawDetections`, `faceApiLoader`, `normalizeDetections`
  - 映像・推論結果はサーバーへ送信せず、ブラウザ上で完結
  - プライバシー注意書きを画面下部に表示

### 削除

- `docs/real-time-face-recognition-spec.md`（実装完了に伴い削除）

## [0.1.0] - 2026-06-19

### 追加

- 初回リリース
