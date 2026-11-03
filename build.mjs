// src/ のファイルをまとめて、2種類の成果物を作る
// 使い方: node build.mjs
//   dist/kaigo-study.html … 1ファイル版（Claude のアーティファクト・確認用）
//   dist/app/             … ホーム画面に追加できるアプリ版（PWA）。フォルダごと Web に置いて使う
//   docs/                 … GitHub Pages 用（中身は dist/app と同じ）
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync } from "node:fs";

const url = (p) => new URL(p, import.meta.url);
const read = (p) => readFileSync(url(p), "utf8");
const css = read("./src/styles.css");
const fieldFiles = readdirSync(url("./src/data/fields/")).filter((f) => f.endsWith(".js")).sort();
const scripts = [
  "./src/data/materials.js",
  ...fieldFiles.map((f) => "./src/data/fields/" + f),
  "./src/data/exams.js",
  "./src/data/pastExams.js",
  "./src/data/pastExplain.js",
  "./src/store.js",
  "./src/app.js",
].map(read);

const TITLE = "介護福祉士 キソマナ 国家試験対策アプリ";
const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=BIZ+UDPGothic:wght@400;700&family=Zen+Maru+Gothic:wght@700&display=swap">`;
const mkBody = (list) => `<div id="app" class="app" lang="ja"></div>
<div id="sheet-root" lang="ja"></div>
${list.map((s) => `<script>\n${s}\n</script>`).join("\n")}`;
// ふりがな辞書（src/data/furigana.js）も一緒に入れる
const body = mkBody([read("./src/data/furigana.js"), ...scripts]);
const bodyArt = body;

/* ---------- 1ファイル版（アーティファクト用。外枠はアーティファクト側が付ける） ---------- */
const artifact = `<meta charset="utf-8">
<title>${TITLE}</title>
<meta name="claude:viewport-fit-sides" content="cover">
${fonts}
<style>
${css}
</style>
${bodyArt}
`;
mkdirSync(url("./dist/"), { recursive: true });
writeFileSync(url("./dist/kaigo-study.html"), artifact);
console.log("built dist/kaigo-study.html", artifact.length, "bytes");

/* ---------- アプリ版（PWA） ---------- */
const app = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${TITLE}</title>
<meta name="description" content="介護福祉士国家試験の重要用語を1画面のカードで見て覚える学習アプリ。過去問5年分（解説つき）と練習問題つき">
<meta name="theme-color" content="#e6effa" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#163a6b" media="(prefers-color-scheme: dark)">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon-192.png" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="キソマナ">
${fonts}
<style>
html { color-scheme: light; }
:root { padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }
[hidden] { display: none !important; }
img { max-width: 100%; }
${css}
</style>
</head>
<body>
${body}
<script>
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  });
}
</script>
</body>
</html>
`;
mkdirSync(url("./dist/app/"), { recursive: true });
writeFileSync(url("./dist/app/index.html"), app);
for (const f of readdirSync(url("./pwa/"))) copyFileSync(url("./pwa/" + f), url("./dist/app/" + f));
console.log("built dist/app/ (PWA)");

/* ---------- GitHub Pages 用（docs/ にアプリ版をそのまま置く） ---------- */
mkdirSync(url("./docs/"), { recursive: true });
for (const f of readdirSync(url("./dist/app/"))) copyFileSync(url("./dist/app/" + f), url("./docs/" + f));
writeFileSync(url("./docs/.nojekyll"), "");
console.log("built docs/ (GitHub Pages)");
