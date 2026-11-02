/**
 * 教材データの土台（画面のコードとは独立）
 *
 * 分野ごとの教材は src/data/fields/ に1ファイルずつ置き、defineField() で登録する。
 * 構造: field → themes[] → pages[] → terms[]
 *   - 1ページ = 基礎学習画面の1画面。スマホ1画面に収まる8語まで
 *   - term.id は進捗・正答率の記録キー。省略すると「テーマID.用語」で自動生成される
 *     （公開後に用語名を変えると記録が引き継がれない点に注意）
 *   - pages が空のテーマは「準備中」として表示される
 *
 * 収録方針: 介護福祉士国家試験に出る・出やすい内容だけを入れる。
 *   出ない／ほぼ出ない内容は、教科書に載っていても入れない。
 *   人物は出題が多い人に絞り、その他の人名は手法の「提唱者（person）」欄で扱う。
 *
 * term は次のどちらの書き方でもよい
 *   オブジェクト: { term, reading, definition, point, person, profile, example, id }
 *   配列（短縮形）: ["用語", "よみ", "説明", "覚えるポイント", { person: "提唱者" など任意 }]
 */
window.KAIGO_DATA = {
  version: 3,
  updated: "2026-11",
  disclaimer: "掲載内容は受験用テキスト・厚生労働省の資料・最新の法令と照合してご利用ください。",

  /** 試験科目の順（領域ごと） */
  areas: [
    { name: "人間と社会", fields: ["dignity", "relations", "society"] },
    { name: "介護", fields: ["care-basics", "comm-skills", "life-support", "care-process"] },
    { name: "こころとからだのしくみ", fields: ["development", "dementia", "disability", "body"] },
    { name: "医療的ケア", fields: ["medical"] },
  ],

  fields: [],
};

window.defineField = function (spec) {
  var area = window.KAIGO_DATA.areas.filter(function (a) {
    return a.fields.indexOf(spec.id) !== -1;
  })[0];
  spec.area = area ? area.name : "";

  spec.themes.forEach(function (theme) {
    theme.summary = theme.summary || "";
    theme.pages = (theme.pages || []).map(function (page, pi) {
      page.id = page.id || "p" + (pi + 1);
      page.terms = page.terms.map(function (t) {
        if (Array.isArray(t)) {
          var extra = t[4] || {};
          t = {
            term: t[0],
            reading: t[1] || "",
            definition: t[2],
            point: t[3] || "",
            person: extra.person,
            profile: extra.profile,
            example: extra.example,
          };
        }
        t.id = t.id || theme.id + "." + t.term;
        return t;
      });
      return page;
    });
  });

  window.KAIGO_DATA.fields.push(spec);
};

/** 全ファイル読み込み後に呼び、試験科目の順に並べる */
window.finalizeData = function () {
  var order = [];
  window.KAIGO_DATA.areas.forEach(function (a) { order = order.concat(a.fields); });
  window.KAIGO_DATA.fields.sort(function (a, b) {
    return order.indexOf(a.id) - order.indexOf(b.id);
  });
};
