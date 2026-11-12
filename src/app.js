/**
 * 画面（ビュー）とナビゲーション
 * 教材は window.KAIGO_DATA、進捗は window.KaigoStore からのみ読み書きする。
 */
(function () {
  "use strict";

  if (window.finalizeData) window.finalizeData();
  var DATA = window.KAIGO_DATA;
  var Store = window.KaigoStore;
  var $app = document.getElementById("app");
  var $sheet = document.getElementById("sheet-root");

  /* ---------------- 学習メニュー（将来の機能はここに追加） ---------------- */
  var MENU = [
    { id: "study", title: "基礎学習", sub: "重要用語を1画面で覚える", icon: "grid", ready: true },
        { id: "quiz", title: "基礎問題", sub: "用語⇄説明の5択", icon: "quiz", ready: true },
    { id: "past-exams", title: "過去問題", sub: "本試験5年分＋練習問題", icon: "doc", ready: true, action: "open-exams" },
    { id: "review", title: "間違えた問題", sub: "科目・テーマごとに解き直す", icon: "redo", ready: true, action: "open-review" },
    { id: "mine", title: "マイ教科書", sub: "選んだ用語だけの教科書", icon: "pin", ready: true, action: "open-mine", group: "other" },
    { id: "analysis", title: "苦手傾向分析", sub: "重点ポイントがわかる", icon: "chart", ready: true, action: "open-analysis", group: "other" },
  ];
  var CTX_LABEL = { study: "基礎学習", quiz: "基礎問題", mine: "マイ教科書" };

  /* ---------------- アイコン ---------------- */
  var ICONS = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    quiz: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 014.8.9c0 1.7-2.4 2.2-2.4 3.6M12 17h.01"/>',
    layers: '<path d="M12 4l8 4-8 4-8-4 8-4z"/><path d="M4 12l8 4 8-4M4 16l8 4 8-4"/>',
    doc: '<path d="M7 3.5h7l4 4V20a.5.5 0 01-.5.5h-10A.5.5 0 017 20V3.5z"/><path d="M14 3.5V8h4M9.5 12.5h5M9.5 16h5"/>',
    flag: '<path d="M6 21V4M6 4h11l-2 4 2 4H6"/>',
    book: '<path d="M4 5.5A1.5 1.5 0 015.5 4H11v16H5.5A1.5 1.5 0 014 18.5v-13zM20 5.5A1.5 1.5 0 0018.5 4H13v16h5.5a1.5 1.5 0 001.5-1.5v-13z"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    redo: '<path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4.5h4.5"/>',
    chart: '<path d="M4 20h16M7 16v-5M12 16V7M17 16v-8"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    pin: '<path d="M9 3.5h6l-.8 5.2 3.3 3.3H6.5l3.3-3.3L9 3.5z"/><path d="M12 12v8"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
    save: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14"/>',
    bag: '<path d="M5 8h14l-1.2 11.2a1 1 0 01-1 .8H7.2a1 1 0 01-1-.8L5 8z"/><path d="M9 10V7a3 3 0 016 0v3"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z"/>',
    crown: '<path d="M4 18h16M5 16l-1-9 5 4 3-6 3 6 5-4-1 9H5z"/>',
  };
  /* ---------------- テーマカラー ---------------- */
  var THEMES = [
    { id: "light", name: "いつもの色", bg: "#e6effa", accent: "#2f74cc", bar: "#e6effa" },
    { id: "purple", name: "パープル", bg: "#ece4f8", accent: "#7b5cc4", bar: "#ece4f8" },
    { id: "pink", name: "ピンク", bg: "#fbe4ec", accent: "#d4567e", bar: "#fbe4ec" },
    { id: "green", name: "グリーン", bg: "#e2f0df", accent: "#3a8a5a", bar: "#e2f0df" },
    { id: "flower", name: "フラワー", bg: "#fde6ee", accent: "#cf5f8c", bar: "#fde6ee", cls: "theme-pick__sw--flower" },
  ];
  /** 選んだテーマ（未選択はいつもの色） */
  function currentTheme() {
    var t = Store.getPref("theme", "");
    return THEMES.some(function (x) { return x.id === t; }) ? t : "light";
  }
  function applyTheme() {
    // ダークは選べなくなったので、未選択・以前ダークを選んでいた人も「いつもの色」にする（端末のダークモードにも合わせない）
    var t = currentTheme();
    var root = document.documentElement;
    root.setAttribute("data-theme", t);
    root.style.colorScheme = "light";
    var th = THEMES.filter(function (x) { return x.id === t; })[0] || THEMES[0];
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) { metas[i].removeAttribute("media"); metas[i].setAttribute("content", th.bar); }
  }
  applyTheme();

  function icon(name, cls) {
    return (
      '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>"
    );
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- 教材インデックス ---------------- */
  var fieldById = {};
  var themeById = {};
  var fieldOfTheme = {};
  var termById = {};

  DATA.fields.forEach(function (f) {
    fieldById[f.id] = f;
    f.themes.forEach(function (t) {
      themeById[t.id] = t;
      fieldOfTheme[t.id] = f;
      t.pages.forEach(function (p, pi) {
        p.terms.forEach(function (term) {
          termById[term.id] = { term: term, theme: t, page: p, pageIndex: pi };
        });
      });
    });
  });

  /* 過去問題の索引（関連用語は同じ科目のカードから名前で探す） */
  var examById = {};
  var examsByField = {};
  var EXAMS = window.KAIGO_EXAMS || {};
  Object.keys(EXAMS).forEach(function (fid) {
    var field = fieldById[fid];
    if (!field) return;
    examsByField[fid] = EXAMS[fid].map(function (q, i) {
      var id = "exam." + fid + "." + (i + 1);
      q.id = id;
      q.field = fid;
      q.termIds = (q.terms || []).map(function (name) {
        var hit = null;
        field.themes.forEach(function (t) {
          t.pages.forEach(function (p) { p.terms.forEach(function (x) { if (!hit && x.term === name) hit = x.id; }); });
        });
        return hit;
      }).filter(Boolean);
      examById[id] = q;
      return id;
    });
  });

  function isReady(theme) { return theme.pages.length > 0; }
  function pageTermIds(page) { return page.terms.map(function (t) { return t.id; }); }
  function themeTermIds(theme) {
    return theme.pages.reduce(function (acc, p) { return acc.concat(pageTermIds(p)); }, []);
  }
  function fieldTermIds(field) {
    return field.themes.reduce(function (acc, t) { return acc.concat(themeTermIds(t)); }, []);
  }
  function allTermIds() {
    return DATA.fields.reduce(function (acc, f) { return acc.concat(fieldTermIds(f)); }, []);
  }
  function readyThemes() {
    var list = [];
    DATA.fields.forEach(function (f) { f.themes.forEach(function (t) { if (isReady(t)) list.push(t); }); });
    return list;
  }
  /** 未確認の用語が残っている最初のページ（全て確認済みなら 0） */
  function firstOpenPage(theme) {
    for (var i = 0; i < theme.pages.length; i++) {
      var ids = pageTermIds(theme.pages[i]);
      if (Store.countChecked(ids) < ids.length) return i;
    }
    return 0;
  }

  /** マイ教科書：テーマのページから、ピックアップした用語だけを残したページ（空のページは除く） */
  function minePages(theme) {
    return theme.pages.map(function (p) {
      return { title: p.title, lead: p.lead, terms: p.terms.filter(function (t) { return Store.isPicked(t.id); }) };
    }).filter(function (p) { return p.terms.length > 0; });
  }

  /* ---------------- 状態とナビゲーション ---------------- */
  var view = { name: "home" };
  var openTermId = null;
  var pickConfirmId = null;
  var lastTrigger = null;
  var justChecked = null;

  function go(next) {
    view = next;
    closeSheet(true);
    render();
    window.scrollTo(0, 0);
  }

  function fallbackCopy(text) {
    var t = document.createElement("textarea");
    t.value = text;
    t.setAttribute("readonly", "");
    t.style.position = "fixed";
    t.style.opacity = "0";
    document.body.appendChild(t);
    t.select();
    try { document.execCommand("copy"); } catch (e) { /* 何もしない */ }
    t.remove();
  }

  function startTheme(themeId, pageIndex) {
    var theme = themeById[themeId];
    var pi = typeof pageIndex === "number" ? pageIndex : firstOpenPage(theme);
    Store.setLast(themeId, pi);
    go({ name: "study", themeId: themeId, pageIndex: pi });
  }

  /* ---------------- ふりがな（試験版：辞書 KAIGO_FURI があるときだけ） ---------------- */
  var Furi = (function () {
    var D = window.KAIGO_FURI;
    if (!D) return null;
    var KJ = /[\u4e00-\u9fff々〆ヶ]/;
    var idx = {}, cnt = {};
    Object.keys(D).forEach(function (k) {
      var tgt = idx, key = k;
      if (k.charAt(0) === "#") { tgt = cnt; key = k.slice(1); }
      var c = key.charAt(0);
      (tgt[c] = tgt[c] || []).push(key);
    });
    [idx, cnt].forEach(function (m) {
      Object.keys(m).forEach(function (c) { m[c].sort(function (a, b) { return b.length - a.length; }); });
    });
    function ruby(enc) {
      return esc(enc).replace(/([\u4e00-\u9fff々〆ヶ]+)\{([^}]*)\}/g, "<ruby>$1<rt>$2</rt></ruby>");
    }
    function longestAt(text, i) {
      var list = idx[text.charAt(i)] || [];
      for (var k = 0; k < list.length; k++) if (text.startsWith(list[k], i)) return list[k].length;
      return 0;
    }
    function convert(text) {
      var out = "", i = 0, hit = false;
      while (i < text.length) {
        var c = text.charAt(i), found = null, enc = null;
        var afterNum = i > 0 && /[0-9０-９〜~]/.test(text.charAt(i - 1));
        if (afterNum && cnt[c]) {
          for (var a = 0; a < cnt[c].length; a++) if (text.startsWith(cnt[c][a], i)) { found = cnt[c][a]; enc = D["#" + found]; break; }
        }
        if (!found && idx[c]) {
          for (var b = 0; b < idx[c].length; b++) if (text.startsWith(idx[c][b], i)) { found = idx[c][b]; enc = D[found]; break; }
          // 「の中」など、かな・数字で始まる語は、次の漢字から始まるもっと長い語（「の中心」の「中心」）を優先する
          if (found && !KJ.test(c) && longestAt(text, i + 1) > found.length - 1) { found = null; }
        }
        if (found) { out += ruby(enc); hit = true; i += found.length; }
        else { out += esc(c); i++; }
      }
      return hit ? out : null;
    }
    var SKIP = { RUBY: 1, RT: 1, SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, TITLE: 1 };
    function apply(root) {
      if (!root) return;
      var nodes = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n;
      while ((n = w.nextNode())) {
        if (!KJ.test(n.nodeValue)) continue;
        var p = n.parentNode, ok = true;
        // SVG の中の文字（図の中のラベルなど）には付けない。付けると文字が消える
        if (n.parentNode && (n.parentNode.ownerSVGElement || n.parentNode.namespaceURI === "http://www.w3.org/2000/svg")) continue;
        while (p && p !== root) { if (SKIP[p.nodeName] || (p.classList && p.classList.contains("no-furi"))) { ok = false; break; } p = p.parentNode; }
        if (ok) nodes.push(n);
      }
      nodes.forEach(function (t) {
        var html = convert(t.nodeValue);
        if (!html) return;
        // ひとまとまりの span で包む（ボタンなど flex の中で、ふりがなの前後に隙間ができないように）
        var wrap = document.createElement("span");
        wrap.className = "fr";
        wrap.innerHTML = html;
        t.parentNode.replaceChild(wrap, t);
      });
    }
    function strip(root) {
      if (!root) return;
      Array.prototype.slice.call(root.querySelectorAll("ruby")).forEach(function (r) {
        Array.prototype.slice.call(r.querySelectorAll("rt")).forEach(function (rt) { rt.remove(); });
        r.replaceWith(document.createTextNode(r.textContent));
      });
      Array.prototype.slice.call(root.querySelectorAll("span.fr")).forEach(function (sp) {
        sp.replaceWith(document.createTextNode(sp.textContent));
      });
      root.normalize();
    }
    // 文字列の読みがな（ひらがな）。検索で「みとり」「じょくそう」などのかな入力に当てるために使う
    function reading(text) {
      var out = "", i = 0;
      text = String(text || "");
      while (i < text.length) {
        var c = text.charAt(i), found = null;
        if (idx[c]) for (var b = 0; b < idx[c].length; b++) if (text.startsWith(idx[c][b], i)) { found = idx[c][b]; break; }
        if (found) { out += D[found].replace(/[\u4e00-\u9fff々〆ヶ]+\{([^}]*)\}/g, "$1"); i += found.length; }
        else { out += c; i++; }
      }
      return out;
    }
    return { apply: apply, strip: strip, reading: reading };
  })();
  function furiOn() { return Boolean(Furi) && Store.getPref("furigana", false); }
  function furiButton() {
    if (!Furi) return "";
    var on = furiOn();
    return '<button class="furi-btn' + (on ? " is-on" : "") + '" data-action="toggle-furi" aria-pressed="' + on + '" aria-label="ふりがな">' +
      '<span class="furi-btn__rt">ふりがな</span><span class="furi-btn__base">' + (on ? "ON" : "OFF") + "</span></button>";
  }
  if (Furi) {
    // コピーしたときは、ふりがなを外して漢字だけにする（翻訳アプリに貼りやすくする）
    document.addEventListener("copy", function (e) {
      var sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || !e.clipboardData) return;
      var box = document.createElement("div");
      for (var i = 0; i < sel.rangeCount; i++) box.appendChild(sel.getRangeAt(i).cloneContents());
      if (!box.querySelector("rt")) return;
      Array.prototype.slice.call(box.querySelectorAll("rt, rp")).forEach(function (n) { n.remove(); });
      e.clipboardData.setData("text/plain", box.textContent);
      e.preventDefault();
    });
    new MutationObserver(function () { if (furiOn()) Furi.apply($sheet); }).observe($sheet, { childList: true, subtree: true });
  }

  /* ---------------- 共通パーツ ---------------- */
  function topbar(eyebrow, title, backAction, extra) {
    return (
      '<header class="topbar">' +
      (backAction
        ? '<button class="icon-btn" data-action="' + backAction + '" aria-label="戻る">' + icon("back") + "</button>"
        : '<span style="width:8px"></span>') +
      '<div class="topbar__titles">' +
      (eyebrow ? '<p class="topbar__eyebrow">' + esc(eyebrow) + "</p>" : "") +
      '<h1 class="topbar__title">' + esc(title) + "</h1>" +
      "</div>" + (extra || "") + furiButton() + "</header>"
    );
  }

  function bar(done, total) {
    var pct = total ? Math.round((done / total) * 100) : 0;
    return (
      '<div class="bar' + (total && done === total ? " bar--done" : "") + '" role="progressbar" aria-valuemin="0" aria-valuemax="' +
      total + '" aria-valuenow="' + done + '"><div class="bar__fill" style="width:' + pct + '%"></div></div>'
    );
  }

  function themeStatusChip(theme) {
    if (!isReady(theme)) return '<span class="chip">準備中</span>';
    var ids = themeTermIds(theme);
    var n = Store.countChecked(ids);
    if (n === ids.length) return '<span class="chip chip--done">' + icon("check") + "完了</span>";
    if (n > 0) return '<span class="chip chip--progress">' + n + " / " + ids.length + "</span>";
    if (Store.isThemeCompleted(theme.id)) return '<span class="chip chip--done">' + icon("check") + "完了済み</span>";
    return '<span class="chip">未学習</span>';
  }

  /* ---------------- 1. ホーム ---------------- */
  function renderHome() {
    var ids = allTermIds();
    var checked = Store.countChecked(ids);
    var themes = readyThemes();
    var doneThemes = themes.filter(function (t) { return Store.isThemeCompleted(t.id); }).length;
    var last = Store.getLast();
    var lastTheme = last && themeById[last.themeId];

    var resume = "";
    if (lastTheme && isReady(lastTheme)) {
      var lIds = themeTermIds(lastTheme);
      var lDone = Store.countChecked(lIds);
      var finished = lDone === lIds.length;
      resume =
        '<section class="section"><h2 class="section__label">' + (finished ? "前回の学習" : "続きから") + "</h2>" +
        '<div class="panel resume resume--compact">' +
        '<div class="resume__main"><p class="resume__meta">' + esc(fieldOfTheme[lastTheme.id].name) + " ・ 確認済み " + lDone + " / " + lIds.length + "</p>" +
        '<p class="resume__title">' + esc(lastTheme.name) + "</p>" + bar(lDone, lIds.length) + "</div>" +
        '<button class="btn btn--primary resume__btn" data-action="resume">' +
        (finished ? "もう一度" : "続きから") + icon("arrow") + "</button>" +
        "</div></section>";
    }

    var quizStats = Store.answerStats(ids);
    var menuRow = function (m) {
      return (
        '<button class="tile" ' + (m.ready ? 'data-action="' + (m.action || "open-fields") + '" data-ctx="' + m.id + '"' : "disabled") + ">" +
        '<span class="tile__icon">' + icon(m.icon) + "</span>" +
        '<span class="tile__title">' + esc(m.title) + "</span>" +
        '<span class="tile__sub">' + esc(m.sub) + "</span>" +
        "</button>"
      );
    };
    var menu = MENU.filter(function (m) { return !m.group; }).map(menuRow).join("");
    var other = MENU.filter(function (m) { return m.group === "other"; }).map(menuRow).join("");

    return (
      topbar("介護福祉士 国家試験対策", "キソマナ", null, shopButton()) +
      '<main class="content content--home">' +
      '<button class="home-search" data-action="open-search">' + icon("search") + '<span class="home-search__ph">用語をさがす（例：看取り・褥瘡）</span></button>' +
      '<section class="section"><h2 class="section__label">学習の進み具合</h2>' +
      '<div class="panel stats">' +
      '<div><p class="stat__label">確認した用語</p><p class="stat__value">' + checked + "<small>/ " + ids.length + "語</small></p></div>" +
      '<div><p class="stat__label">完了したテーマ</p><p class="stat__value">' + doneThemes + "<small>/ " + themes.length + "</small></p></div>" +
      '<div><p class="stat__label">問題の正答率</p><p class="stat__value">' +
      (quizStats.answered ? Math.round((quizStats.correct / quizStats.answered) * 100) + "<small>%</small>" : "−") + "</p></div>" +
      bar(checked, ids.length) +
      "</div></section>" +
      resume +
      '<section class="section"><h2 class="section__label">学習メニュー</h2><div class="tiles">' + menu + "</div></section>" +
      '<section class="section"><h2 class="section__label">その他</h2><div class="tiles">' + other + "</div></section>" +
      '<button class="home-link" data-action="open-settings">' + icon("gear") + "<span>設定・バックアップ・このアプリについて</span>" + icon("chev") + "</button>" +
      '<button class="home-link home-link--method" data-action="open-method">' + icon("bulb") + "<span>オススメの勉強法</span>" + icon("chev") + "</button>" +
      "</main>"
    );
  }

  /* ---------------- 2. 分野一覧 ---------------- */
  function rateChip(stats) {
    if (!stats.answered) return '<span class="chip">未挑戦</span>';
    var pct = Math.round((stats.correct / stats.answered) * 100);
    return '<span class="chip ' + (pct >= 80 ? "chip--done" : "chip--progress") + '">' + pct + "%</span>";
  }

  function renderFields() {
    var ctx = view.ctx;
    if (ctx === "mine") return renderMineFields();
    var groups = DATA.areas.map(function (area) {
      var rows = area.fields.map(function (id) {
        var f = fieldById[id];
        if (!f) return "";
        var ids = fieldTermIds(f);
        var aside, extra = "";
        if (ctx === "quiz") {
          var st = Store.answerStats(ids);
          aside = rateChip(st);
          extra = bar(st.answered, ids.length);
        } else {
          var n = Store.countChecked(ids);
          aside = '<span class="chip' + (n ? " chip--progress" : "") + '">' + n + " / " + ids.length + "</span>";
          extra = bar(n, ids.length);
        }
        return (
          '<button class="row" data-action="open-field" data-id="' + f.id + '">' +
          '<span class="row__body"><span class="row__title">' + esc(f.name) + "</span>" +
          '<span class="row__sub">' + esc(f.description) + " ・ " + ids.length + "語</span>" + extra + "</span>" +
          '<span class="row__aside">' + aside + icon("chev", "row__chev") + "</span>" +
          "</button>"
        );
      }).join("");
      return '<section class="section"><h2 class="section__label">' + esc(area.name) + '</h2><div class="rows">' + rows + "</div></section>";
    }).join("");

    return (
      topbar(CTX_LABEL[ctx], "分野を選ぶ", "home") +
      '<main class="content">' +
      (ctx === "quiz" ? '<p class="hint">' + icon("info") + "<span>正答率は、各用語の最後の解答で計算しています。バーは解いたことのある用語の割合です。</span></p>" : "") +
      groups + "</main>"
    );
  }

  /* ---------------- マイ教科書（分野一覧） ---------------- */
  function renderMineFields() {
    var total = Store.countPicked(allTermIds());
    var groups = DATA.areas.map(function (area) {
      var rows = area.fields.map(function (id) {
        var f = fieldById[id];
        if (!f) return "";
        var n = Store.countPicked(fieldTermIds(f));
        if (!n) return "";
        return (
          '<button class="row" data-action="open-field" data-id="' + f.id + '">' +
          '<span class="row__body"><span class="row__title">' + esc(f.name) + "</span>" +
          '<span class="row__sub">' + esc(f.description) + "</span></span>" +
          '<span class="row__aside"><span class="chip chip--pin">' + icon("pin") + n + "語</span>" + icon("chev", "row__chev") + "</span>" +
          "</button>"
        );
      }).join("");
      return rows ? '<section class="section"><h2 class="section__label">' + esc(area.name) + '</h2><div class="rows">' + rows + "</div></section>" : "";
    }).join("");
    var empty =
      '<div class="panel mine-empty">' +
      '<p class="mine-empty__icon">' + icon("pin") + "</p>" +
      "<p><b>まだピックアップした用語がありません</b></p>" +
      "<p>基礎学習で、覚えたい用語を追加すると、ここに基礎学習と同じ科目・テーマ・ページの形でまとまります。</p>" +
      '<ul class="mine-empty__how"><li>カードで覚える：カードを開いて「マイ教科書に追加」</li><li>説明つきで読む：用語を右にスライドして、ピンをタップ</li></ul>' +
      '<button class="btn btn--primary" data-action="open-fields" data-ctx="study">' + icon("grid") + "基礎学習へ</button></div>";
    return (
      topbar("自分専用の教科書", "マイ教科書", "home") +
      '<main class="content">' +
      (total ? '<p class="hint">' + icon("pin") + "<span>ピックアップした " + total + " 語を、基礎学習と同じ形でまとめています。" +
        (mineUnlimited() ? "" : "（無料で" + MINE_FREE + "語まで・あと" + Math.max(0, MINE_FREE - total) + "語）") + "</span></p>" +
        (!mineUnlimited() && total >= MINE_FREE ? '<button class="btn btn--ghost mine-more" data-action="open-mine-shop">' + icon("crown") + "プレミアムで無制限にする</button>" : "") +
        groups : empty) +
      "</main>"
    );
  }

  /* ---------------- 3. テーマ一覧 ---------------- */
  function renderThemes() {
    var f = fieldById[view.fieldId];
    var ctx = view.ctx;
    if (ctx === "mine") {
      var mrows = f.themes.map(function (t) {
        var n = Store.countPicked(themeTermIds(t));
        if (!n) return "";
        var pages = minePages(t).length;
        return (
          '<button class="row" data-action="open-mine-theme" data-id="' + t.id + '">' +
          '<span class="row__body"><span class="row__title">' + esc(t.name) + "</span>" +
          '<span class="row__sub">' + n + "語" + (pages > 1 ? " ・ " + pages + "ページ" : "") + "</span></span>" +
          '<span class="row__aside"><span class="chip chip--pin">' + icon("pin") + n + "</span>" + icon("chev", "row__chev") + "</span></button>"
        );
      }).join("");
      return topbar("マイ教科書", f.name, "fields") + '<main class="content"><div class="rows">' + mrows + "</div></main>";
    }
    var rows = f.themes.map(function (t) {
      var ready = isReady(t);
      var count = themeTermIds(t).length;
      var sub, chip, action;
      if (ctx === "quiz") {
        var q = Store.getQuizResult(t.id);
        sub = (t.summary ? esc(t.summary) + "<br>" : "") + count + "問" + (q ? " ・ 最高 " + q.best + "% ・ " + q.count + "回" : "");
        chip = q ? '<span class="chip ' + (q.best >= 80 ? "chip--done" : "chip--progress") + '">前回 ' + q.last + "/" + q.total + "</span>" : '<span class="chip">未挑戦</span>';
        action = "open-quiz";
      } else {
        var laps = Store.getCompletedCount(t.id);
        sub = (t.summary ? esc(t.summary) + "<br>" : "") + count + "語" + (t.pages.length > 1 ? " ・ " + t.pages.length + "ページ" : "") +
          (laps ? " ・ " + laps + "周完了" : "");
        chip = themeStatusChip(t);
        action = "open-theme";
      }
      if (!ready) { sub = "教材を準備しています"; chip = '<span class="chip">準備中</span>'; }
      return (
        '<button class="row" ' + (ready ? 'data-action="' + action + '" data-id="' + t.id + '"' : "disabled") + ">" +
        '<span class="row__body"><span class="row__title">' + esc(t.name) + "</span>" +
        '<span class="row__sub">' + sub + "</span></span>" +
        '<span class="row__aside">' + chip + (ready ? icon("chev", "row__chev") : "") + "</span>" +
        "</button>"
      );
    }).join("");

    return (
      topbar(CTX_LABEL[ctx], f.name, "fields") +
      '<main class="content"><div class="rows">' + rows + "</div></main>"
    );
  }

  /* ---------------- 4. 基礎学習 ---------------- */
  function renderStudy() {
    var theme = themeById[view.themeId];
    var field = fieldOfTheme[theme.id];
    var mine = !!view.mine;
    var pages = mine ? minePages(theme) : theme.pages;
    var page = pages[view.pageIndex];
    var ids = pageTermIds(page);
    var done = Store.countChecked(ids);
    var total = ids.length;
    var allDone = done === total;
    var multi = pages.length > 1;
    var isLastPage = view.pageIndex === pages.length - 1;

    var mode = "list"; // 基礎学習は一覧（説明つきで読む）だけにした

    // 説明つきで読む：用語・説明・ポイントを1画面に収めた「まとめシート」
    // 右にスライドすると左側にピンが出る（マイ教科書への追加・削除）
    var list = page.terms.map(function (t) {
      var on = Store.isChecked(t.id);
      var picked = Store.isPicked(t.id);
      return (
        '<div class="rs-item' + (on ? " is-checked" : "") + (picked ? " is-picked" : "") + '" data-id="' + t.id + '">' +
        '<button class="rs-item__pin" data-action="ask-pick" data-id="' + t.id + '" tabindex="-1" aria-label="' +
        esc(t.term) + (picked ? "をマイ教科書から外す" : "をマイ教科書に追加") + '">' + icon("pin") + "<span>" + (picked ? "外す" : "追加") + "</span></button>" +
        '<div class="rs-item__slide">' +
        '<button class="rs-item__body" data-action="open-term" data-id="' + t.id + '">' +
        '<span class="rs-item__text"><b class="rs-item__term">' + (picked ? '<span class="pin-mark">' + icon("pin") + "</span>" : "") + esc(t.term) + "</b>" + hl(t.definition) + "</span>" +
        (t.point ? '<span class="rs-item__point">' + hl(t.point) + "</span>" : "") +
        "</button>" +
        '<button class="rs-item__check" data-action="toggle-check" data-id="' + t.id + '" aria-pressed="' + on + '" aria-label="' +
        esc(t.term) + (on ? "の確認を外す" : "を確認済みにする") + '">' + icon("check") + "</button>" +
        "</div></div>"
      );
    }).join("");

    var dock = mine
      ? (isLastPage
          ? '<button class="btn btn--ghost" data-action="back-themes">テーマ一覧へ</button>'
          : '<button class="btn btn--primary" data-action="next-page">次のページへ' + icon("arrow") + "</button>")
      : allDone
      ? '<button class="btn btn--primary" data-action="next-page">' +
        (isLastPage ? "学習を完了する" : "次のページへ") + icon("arrow") + "</button>"
      : '<p class="dock__status">すべて確認すると次へ進めます（あと ' + (total - done) + " 語）</p>";

    return (
      topbar(mine ? "マイ教科書 ・ " + field.name : field.name, theme.name, view.fromSearch ? "back-search" : "back-themes") +
      '<main class="content content--with-dock' + (mode === "list" ? " content--read" : "") + '">' +
      '<div class="study-head">' +
      '<div class="study-head__row">' +
      (multi
        ? '<div class="page-tabs" role="tablist" aria-label="ページ">' + pages.map(function (p, i) {
            var pIds = pageTermIds(p);
            var pDone = Store.countChecked(pIds) === pIds.length;
            return '<button class="page-tab' + (i === view.pageIndex ? " is-current" : "") + (pDone ? " is-done" : "") +
              '" role="tab" aria-selected="' + (i === view.pageIndex) + '" data-action="goto-page" data-page="' + i + '">' +
              (pDone ? icon("check") : "") + "<span>" + (i + 1) + ". " + esc(p.title) + "</span></button>";
          }).join("") + "</div>"
        : '<h2 class="page-tag__title">' + esc(page.title) + "</h2>") +
      '<span class="progress__count" aria-live="polite">確認済み <b>' + done + "</b> / " + total + "</span></div>" +
      bar(done, total) +
      (page.lead && mode !== "list" ? '<p class="page-tag__lead">' + esc(page.lead) + "</p>" : "") +
      "</div>" +
      '<div class="read-sheet">' + list + "</div>" +
      '<p class="hint">' + icon("info") + "<span>覚えたら右の丸で確認済みに。用語をタップすると詳しい説明、右にスライドするとマイ教科書に追加できます。</span></p>" +
      '<p class="notice">' + esc(DATA.disclaimer) + "</p>" +
      "</main>" +
      '<div class="dock"><div class="dock__inner">' + dock + "</div></div>"
    );
  }

  /* ---------------- 説明シート ---------------- */
  function openSheet(termId, trigger) {
    openTermId = termId;
    lastTrigger = trigger || null;
    renderSheet();
    document.body.classList.add("is-locked");
    var btn = $sheet.querySelector("[data-autofocus]");
    if (btn) btn.focus({ preventScroll: true });
  }

  function closeSheet(silent) {
    if (pickConfirmId) { pickConfirmId = null; $sheet.innerHTML = ""; document.body.classList.remove("is-locked"); }
    if (!openTermId) return;
    var id = openTermId;
    openTermId = null;
    $sheet.innerHTML = "";
    document.body.classList.remove("is-locked");
    if (!silent) {
      var card = $app.querySelector('[data-action="open-term"][data-id="' + id + '"]');
      if (card) card.focus({ preventScroll: true });
    }
  }

  function renderSheet() {
    var entry = termById[openTermId];
    if (!entry) return;
    var t = entry.term;
    var on = Store.isChecked(t.id);
    var picked = Store.isPicked(t.id);
    var pinBtn = '<button class="btn btn--pin' + (picked ? " is-picked" : "") + '" data-action="toggle-pick">' + icon("pin") +
      (picked ? "マイ教科書に追加済み（外す）" : "マイ教科書に追加") + "</button>";
    var foot = view.name === "search"
      ? '<button class="btn btn--primary" data-action="search-open-study" data-autofocus>' + icon("book") + "基礎学習のこのページを開く</button>" + pinBtn +
        '<button class="btn btn--ghost" data-action="close-sheet">検索結果に戻る</button>'
      : on
      ? '<p class="sheet__done">' + icon("check") + "確認済み</p>" + pinBtn +
        '<button class="btn btn--ghost" data-action="close-sheet" data-autofocus>一覧に戻る</button>' +
        '<button class="btn btn--text" data-action="uncheck">未確認に戻す</button>'
      : '<button class="btn btn--ok" data-action="check" data-autofocus>' + icon("check") + "確認した</button>" + pinBtn;

    $sheet.innerHTML =
      '<div class="sheet-scrim" data-action="close-sheet"></div>' +
      '<section class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-term">' +
      '<div class="sheet__grip"></div>' +
      '<div class="sheet__head"><div class="sheet__titles">' +
      '<p class="sheet__meta">' + esc(entry.theme.name) + " ・ " + esc(entry.page.title) + "</p>" +
      '<h2 class="sheet__term" id="sheet-term">' + esc(t.term) + "</h2>" +
      (t.reading ? '<p class="sheet__reading">' + esc(t.reading) + "</p>" : "") +
      "</div>" +
      '<button class="icon-btn" data-action="close-sheet" aria-label="閉じる">' + icon("close") + "</button></div>" +
      '<div class="sheet__body">' +
      (t.profile ? '<p class="sheet__person"><span>人物</span>' + esc(t.profile) + "</p>" : "") +
      (t.person ? '<p class="sheet__person"><span>提唱・開発</span>' + esc(t.person) + "</p>" : "") +
      '<div><p class="sheet__label">説明</p><p class="sheet__def">' + hl(t.definition) + "</p></div>" +
      (t.point ? '<div class="sheet__point"><p class="sheet__label">覚えるポイント</p><p>' + hl(t.point) + "</p></div>" : "") +
      (t.example ? '<div class="sheet__example"><p class="sheet__label">例</p><p>' + esc(t.example) + "</p></div>" : "") +
      "</div>" +
      '<div class="sheet__foot">' + foot + "</div>" +
      "</section>";
  }

  /* ---------------- マイ教科書：追加・削除の確認 ---------------- */
  function openPickConfirm(termId) {
    var t = termById[termId].term;
    var picked = Store.isPicked(termId);
    pickConfirmId = termId;
    $sheet.innerHTML =
      '<div class="sheet-scrim" data-action="pick-cancel"></div>' +
      '<section class="sheet sheet--confirm" role="dialog" aria-modal="true" aria-labelledby="pick-title">' +
      '<div class="sheet__grip"></div>' +
      '<div class="confirm">' +
      '<p class="confirm__icon">' + icon("pin") + "</p>" +
      '<h2 class="confirm__title" id="pick-title">' + (picked ? "マイ教科書から外しますか？" : "マイ教科書に追加しますか？") + "</h2>" +
      '<p class="confirm__term">' + esc(t.term) + "</p>" +
      '<p class="confirm__sub">' + (picked ? "基礎学習のカードはそのまま残ります。" : "ホームの「マイ教科書」で、基礎学習と同じ形で見返せます。" +
        (mineUnlimited() ? "" : "<br>無料で入れられるのは、あと" + Math.max(0, MINE_FREE - Store.countPicked(allTermIds())) + "語です。")) + "</p>" +
      "</div>" +
      '<div class="sheet__foot">' +
      '<button class="btn btn--primary" data-action="pick-confirm" data-autofocus>' + (picked ? "外す" : "追加する") + "</button>" +
      '<button class="btn btn--text" data-action="pick-cancel">やめる</button></div>' +
      "</section>";
    document.body.classList.add("is-locked");
    var b = $sheet.querySelector("[data-autofocus]");
    if (b) b.focus({ preventScroll: true });
  }

  /** マイ教科書の画面で用語を外したとき、表示するページ・画面を整える */
  function normalizeMineView() {
    if (view.name !== "study" || !view.mine) return;
    var theme = themeById[view.themeId];
    var pages = minePages(theme);
    if (!pages.length) {
      var f = fieldOfTheme[theme.id];
      if (Store.countPicked(fieldTermIds(f))) view = { name: "themes", fieldId: f.id, ctx: "mine" };
      else view = { name: "fields", ctx: "mine" };
    } else if (view.pageIndex >= pages.length) {
      view.pageIndex = pages.length - 1;
    }
  }

  /* ---------------- 5. 学習完了 ---------------- */
  function renderComplete() {
    var theme = themeById[view.themeId];
    var field = fieldOfTheme[theme.id];
    var total = themeTermIds(theme).length;
    var themes = readyThemes();
    var idx = themes.indexOf(theme);
    var next = null;
    for (var i = 1; i < themes.length; i++) {
      var cand = themes[(idx + i) % themes.length];
      if (!Store.isThemeCompleted(cand.id)) { next = cand; break; }
    }

    var groups = theme.pages.map(function (p) {
      return (
        '<div class="review__group"><p class="review__title">' + esc(p.title) + "</p>" +
        '<div class="review__terms">' +
        p.terms.map(function (t) { return '<span class="review__term">' + esc(t.term) + "</span>"; }).join("") +
        "</div></div>"
      );
    }).join("");

    return (
      topbar(field.name, theme.name, "back-themes") +
      '<main class="content">' +
      '<section class="done-hero"><div class="done-hero__mark">' + icon("check") + "</div>" +
      '<h2 class="done-hero__title">' + Store.getCompletedCount(theme.id) + "周目 完了</h2>" +
      '<p class="done-hero__sub">' + total + "語すべて確認しました" + (theme.pages.length > 1 ? "（" + theme.pages.length + "ページ）" : "") + "</p>" +
      '<p class="done-hero__tip">覚えたら、すぐに基礎問題で思い出す練習をしましょう。思い出すほど記憶に残ります。</p></section>' +
      '<section class="section"><h2 class="section__label">このテーマで覚えた用語</h2>' +
      '<div class="panel review">' + groups + "</div></section>" +
      '<div class="btn-stack">' +
      '<button class="btn btn--primary" data-action="open-quiz" data-id="' + theme.id + '">' + icon("quiz") + "このテーマの基礎問題に挑戦</button>" +
      (next
        ? '<button class="btn btn--ghost" data-action="open-theme" data-id="' + next.id + '">次のテーマ：' + esc(next.name) + icon("arrow") + "</button>"
        : "") +
      '<button class="btn btn--ghost" data-action="restart">' + icon("redo") + "もう一度学習する</button>" +
      '<button class="btn btn--ghost" data-action="back-themes">テーマ一覧へ</button>' +
      '<button class="btn btn--text" data-action="home">ホームに戻る</button>' +
      "</div></main>"
    );
  }

  /* ---------------- 6. 基礎問題・過去問題（5択） ---------------- */
  var quiz = null;
  var CHOICES = 5;

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  /* ----- 紛らわしい選択肢づくり ----- */

  /** 2文字ずつの重なりで、用語名がどれくらい似ているか（0〜1） */
  function bigrams(s) {
    var set = {};
    for (var i = 0; i < s.length - 1; i++) set[s.substr(i, 2)] = true;
    return set;
  }
  function similarity(a, b) {
    var A = bigrams(a), B = bigrams(b), inter = 0, union = 0, k;
    for (k in A) { union++; if (B[k]) inter++; }
    for (k in B) if (!A[k]) union++;
    return union ? inter / union : 0;
  }

  /**
   * 正解に近い順に誤答の用語を選ぶ。
   * 用語名が似ているもの（例：腹圧性尿失禁と切迫性尿失禁）、同じページ・同じテーマのものを優先する。
   */
  function pickDistractors(termId, dir, count) {
    var entry = termById[termId];
    var field = fieldOfTheme[entry.theme.id];
    var key = dir === "t2d" ? "definition" : "term";
    var seen = {};
    seen[entry.term[key]] = true;
    var scored = fieldTermIds(field).filter(function (id) { return id !== termId; }).map(function (id) {
      var e = termById[id];
      var s = similarity(entry.term.term, e.term.term) * 2;
      if (e.page === entry.page) s += 0.6;
      else if (e.theme === entry.theme) s += 0.35;
      return { id: id, s: s + Math.random() * 0.25 };
    }).sort(function (a, b) { return b.s - a.s; });
    var picked = [];
    scored.forEach(function (x) {
      if (picked.length >= count) return;
      var v = termById[x.id].term[key];
      if (seen[v]) return;
      seen[v] = true;
      picked.push(x.id);
    });
    return picked;
  }

  /**
   * 正しい説明の一部だけを入れ替えた「ひっかけ」の説明をつくる（2択で迷わせる選択肢）。
   * 入れ替えられる語がなければ null。
   */
  var SWAP_PAIRS = [
    ["健側", "患側"], ["上顎", "下顎", /顎呼吸/], ["末梢", "中枢", /(呼吸|咳|体温調節)の中枢/], ["目頭", "目尻"], ["時計回り", "反時計回り"],
    ["副交感神経", "交感神経"], ["小腸", "大腸"], ["左側臥位", "右側臥位"], ["仰臥位", "側臥位", /[左右]側臥位|を下にした側臥位|側臥位から/],
    ["増加", "減少"], ["高い", "低い"], ["浅い", "深い"], ["多い", "少ない"],
    ["以上", "以下", /[0-9０-９]つ以上|これ以上/], ["早朝", "夕方", /早朝覚醒/], ["前傾", "後傾"], ["内側", "外側"], ["下から", "上から"],
    ["急に", "徐々に"], ["市町村", "都道府県", /知事|都道府県長|市町村長|12\.5/], ["貸与", "購入"], ["名称独占", "業務独占"],
    ["共助", "公助"], ["陽性症状", "陰性症状"], ["流動性知能", "結晶性知能"], ["引き戸", "開き戸"],
    ["前から後ろ", "後ろから前"], ["近時記憶", "遠隔記憶"], ["保たれる", "失われる"],
  ];
  var NUM_UNITS = "歳|℃|万円|日間|日|回|時間|割|年|分|秒|%|％|cm|ml|か月|段階|項目|点|人";
  // 一部を変えても正しいままになりうる・あいまいになる文は、ひっかけを作らない
  var NO_FAKE_RE = /意欲的に働いていた人が|生後3か月で出生時|食前＝食事の約30分前/;
  function makeFake(text) {
    if (NO_FAKE_RE.test(text)) return null;
    var pairs = shuffle(SWAP_PAIRS);
    for (var i = 0; i < pairs.length; i++) {
      var a = pairs[i][0], b = pairs[i][1], skip = pairs[i][2];
      if (skip && skip.test(text)) continue;
      var alt = a.length >= b.length ? a + "|" + b : b + "|" + a;
      var first = text.match(new RegExp(alt));
      if (!first) continue;
      // 「市町村や都道府県」のように並べて書かれている場合は、入れ替えても意味が同じになるので使わない
      if (new RegExp("(" + alt + ")[や・、と]|及び|および").test(text) &&
          text.indexOf(a) !== -1 && text.indexOf(b) !== -1 &&
          new RegExp("(" + a + "[や・、と]" + b + ")|(" + b + "[や・、と]" + a + ")").test(text)) continue;
      // 両方の語をまとめて入れ替える（例：外すときは下顎、入れるときは上顎 → 逆にする）
      var swapped = text.replace(new RegExp(alt, "g"), function (m) { return m === a ? b : a; });
      if (swapped === text) continue;
      var to = first[0] === a ? b : a;
      return { text: swapped, from: first[0], to: to };
    }
    // 数字を変える（範囲「〜」の一部や「1960年代」「1回の」は変えない）
    var numRe = new RegExp("(^|[^0-9〜.,])([0-9]+)(" + NUM_UNITS + ")(?!〜|代|の|量|目)");
    var nm = text.match(numRe);
    // 「1歳〜1歳3か月」のような範囲の中の数は変えない
    if (nm && text.slice(Math.max(0, nm.index - 5), nm.index + 1).indexOf("〜") !== -1) nm = null;
    if (nm) {
      var n = parseInt(nm[2], 10);
      var alt2 = n >= 1900 ? n - 2 : n >= 100 ? n + Math.round(n * 0.2) : n >= 10 ? n + (n % 10 === 0 ? 10 : 5) : n + 1;
      if (nm[3] === "時間" && n === 24) alt2 = 12; // 「29時間」のような、ありえない数にしない
      var at = nm.index + nm[1].length;
      if (text.indexOf(alt2 + nm[3]) !== -1) return null; // 「2割・3割」→「3割・3割」のように同じ数が並ぶ文にしない
      return { text: text.slice(0, at) + alt2 + text.slice(at + nm[2].length), from: nm[2] + nm[3], to: alt2 + nm[3] };
    }
    return null;
  }

  /**
   * カードから国家試験形式の問題（「正しいものを1つ選びなさい」）を自動でつくり、
   * オリジナル問題に加える。ID は gen.d.<用語ID>（説明から）と gen.p.<用語ID>（覚えるポイントから）。
   * 誤りの選択肢は、一部を入れ替えた「ひっかけ」と、別の用語の説明を組み合わせたもの。
   */
  // 組み合わせると正しくも読めてしまう「用語←別の用語の説明」
  var MISMATCH_BLOCK = {
    "半側空間無視←高次脳機能障害": 1, "介護記録←SOAP": 1, "アセスメント←情報収集": 1,
    "障害者総合支援法←介護給付と訓練等給付": 1, "障害者総合支援法←同行援護": 1, "障害者総合支援法←行動援護": 1,
    "自立支援←自己決定": 1, "エンパワメント←ストレングス": 1, "ラポール←共感": 1,
    "情報収集←アセスメント": 1, "自立支援←リハビリテーション": 1,
  };
  // 法律の名前や「基本」のように広い用語は、ほかの用語の説明を組み合わせても正しく読めてしまうので使わない
  var MISMATCH_NO_TARGET = { "障害者総合支援法": 1, "コミュニケーションの基本": 1 };
  (function generateExams() {
    // 毎回同じ問題になるよう、作成中だけ乱数を固定する（問題数や選択肢が起動ごとに変わらない）
    var realRandom = Math.random, seed = 20260125;
    Math.random = function () { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
    function stmt(t, text) { return t.term + "：" + text; }
    DATA.fields.forEach(function (field) {
      var list = examsByField[field.id] || (examsByField[field.id] = []);
      ["definition", "point"].forEach(function (key) {
        fieldTermIds(field).forEach(function (termId) {
          var x = termById[termId];
          var t = x.term;
          var text = t[key];
          if (!text || text.length < 8) return;
          if (key === "point" && !makeFake(text)) return; // ポイントは、ひっかけが作れるものだけ
          var choices = [{ text: stmt(t, text), ok: true }];
          var notes = [];
          var usedText = {}; // 選択肢に使った説明（同じ説明を2度使わない）
          usedText[t.term] = true;
          var trap = makeFake(text);
          if (trap) {
            choices.push({ text: stmt(t, trap.text) });
            notes.push("「" + t.term + "」は「" + trap.to + "」ではなく「" + trap.from + "」");
          }
          // 誤りの選択肢は、まず「一語だけ違う」ひっかけ（本試験に近い）で作る。
          // 同じ科目の近い用語について、同じ欄（説明／ポイント）→ もう一方の欄の順に試す
          var others = pickDistractors(termId, "t2d", 14).filter(function (id) { return termById[id].term.term !== t.term; });
          var other = key === "definition" ? "point" : "definition";
          [key, other].forEach(function (k) {
            others.forEach(function (id) {
              if (choices.length >= CHOICES) return;
              var y = termById[id].term;
              if (usedText[y.term] || !y[k] || y[k].length < 8) return;
              var fy = makeFake(y[k]);
              if (!fy) return;
              usedText[y.term] = true;
              choices.push({ text: stmt(y, fy.text) });
              notes.push("「" + y.term + "」は「" + fy.to + "」ではなく「" + fy.from + "」");
            });
          });
          // それでも足りないときだけ、別の用語の説明と組み合わせる（説明の問題のみ）。
          // 似た用語どうし（例：法定後見と成年後見制度）は、入れ替えても正しくなりうるので使わない
          var sharesWord = function (a, b) {
            for (var i = 0; i < a.length - 1; i++) if (b.indexOf(a.substr(i, 2)) !== -1) return true;
            return false;
          };
          if (key === "definition") {
            others.forEach(function (id, i) {
              if (choices.length >= CHOICES) return;
              var y = termById[id].term;
              if (usedText[y.term] || !y.definition || MISMATCH_NO_TARGET[y.term]) return;
              for (var j = 1; j < others.length; j++) {
                var z = termById[others[(i + j) % others.length]].term;
                if (z.term === y.term || usedText[z.term] || !z.definition || z.definition === y.definition) continue;
                // 「医師の指示に従う」のような短い説明は、どの用語に付けても正しく読めてしまうので使わない
                if (z.definition.length < 20) continue;
                // 用語の説明・ポイントに、組み合わせる用語の名前が出てくる（関係が深い）ものは使わない
                if (((y.definition || "") + (y.point || "")).indexOf(z.term) !== -1) continue;
                if (MISMATCH_BLOCK[y.term + "←" + z.term]) continue;
                if (sharesWord(z.term, y.term) || similarity(z.definition, y.definition) >= 0.3) continue;
                if (z.definition.indexOf(y.term) !== -1 || y.definition.indexOf(z.term) !== -1) continue;
                usedText[y.term] = usedText[z.term] = true;
                choices.push({ text: stmt(y, z.definition) });
                notes.push("「" + y.term + "」の記述は、「" + z.term + "」のもの");
                return;
              }
            });
          }
          if (choices.length < CHOICES) return;
          var id = "gen." + (key === "definition" ? "d." : "p.") + termId;
          examById[id] = {
            id: id, field: field.id, gen: true,
            q: "【" + x.theme.name + "】次の記述のうち、正しいものを1つ選びなさい。",
            c: choices.map(function (c) { return c.text; }),
            a: 1,
            exp: "誤りの選択肢：" + notes.join("。") + "。",
            termIds: [termId],
          };
          list.push(id);
        });
      });
    });
    Math.random = realRandom;
  })();
  // 確認・テスト用（問題データの点検に使う）
  window.KaigoDebug = { exams: function () { return examById; } };

  /**
   * 説明文・覚えるポイントの重要語を赤字にする（基礎学習・解説の表示用）。
   * 対象：試験で問われやすい制度・給付・機関・職種の名前、ひっかけになりやすい語（健側⇄患側など）、
   * 数値（歳・℃・回など）、「医療職に任せる」のような行動、「」でくくった語、してはいけないこと。
   */
  var KEYWORDS = [
    "現物給付", "金銭給付", "介護給付", "訓練等給付", "予防給付", "自立支援給付", "地域生活支援事業",
    "医療保険", "年金保険", "介護保険", "雇用保険", "労災保険", "後期高齢者医療制度", "社会保険", "公的扶助", "公費", "保険料",
    "生存権", "措置", "契約", "応能負担", "応益負担", "保険者", "第1号被保険者", "第2号被保険者", "特定疾病",
    "一次判定", "二次判定", "介護認定審査会", "主治医意見書", "要介護", "要支援",
    "家庭裁判所", "社会福祉協議会", "地域包括支援センター", "福祉事務所", "保健所", "児童相談所", "厚生労働大臣",
    "介護支援専門員", "ケアマネジャー", "サービス提供責任者", "相談支援専門員", "サービス管理責任者", "民生委員",
    "医師", "看護師", "看護職", "医療職", "理学療法士", "作業療法士", "言語聴覚士", "管理栄養士", "薬剤師",
    "麻痺側", "誤嚥", "窒息", "脱水", "転倒", "感染", "入浴後", "禁止", "努力義務", "義務", "原則", "罰則",
    "秘密保持義務", "信用失墜行為", "誠実義務", "同意", "本人の意思", "自己決定", "通報", "届出",
    "次亜塩素酸ナトリウム", "塩素系", "酸素系", "アルコール", "流水", "使い捨て", "手袋", "マスク",
    "使わない", "入れない", "近づけない", "測らない", "持たない", "しない", "行わない", "避ける", "控える",
  ];
  var KW_RE = (function () {
    var words = KEYWORDS.slice();
    SWAP_PAIRS.forEach(function (p) { words.push(p[0], p[1]); });
    words = words.filter(function (w, i) { return words.indexOf(w) === i; })
      .sort(function (a, b) { return b.length - a.length; })
      .map(function (w) { return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); });
    var action = "(?:医療職|医師|看護師|看護職|サービス提供責任者|上司|介護支援専門員|専門職|医療機関|管理栄養士|言語聴覚士)(?:に|へ|が)(?:相談|報告|連絡|連携|任せ|伝え|つな|行)[ぁ-ん]*";
    var quote = "「[^」]{1,20}」";
    var num = "[0-9０-９][0-9０-９.,〜~]*(?:" + NUM_UNITS + "|m|mmHg|kg|g|L)";
    var notThis = "[一-龥ァ-ヶー]{1,6}ではない";
    return new RegExp(action + "|" + quote + "|" + num + "|" + notThis + "|" + words.join("|"), "g");
  })();
  function hl(text) {
    if (!text) return "";
    var marked = String(text).replace(KW_RE, function (m) { return "\u0001" + m + "\u0002"; });
    return esc(marked).replace(/\u0001/g, '<em class="kw">').replace(/\u0002/g, "</em>");
  }

  /** 用語の5択（基礎問題） */
  function buildTermItem(termId, dir) {
    var t = termById[termId].term;
    var options = [{ text: dir === "t2d" ? t.definition : t.term, correct: true, termId: termId }];
    var fake = dir === "t2d" ? makeFake(t.definition) : null;
    if (fake) options.push({ text: fake.text, correct: false, fake: fake });
    pickDistractors(termId, dir, CHOICES - options.length).forEach(function (id) {
      var o = termById[id].term;
      options.push({ text: dir === "t2d" ? o.definition : o.term, correct: false, termId: id });
    });
    return { kind: "term", termId: termId, dir: dir, options: shuffle(options), chosen: null };
  }

  function buildItems(termIds, dir) {
    return shuffle(termIds).map(function (id, i) {
      // ミックスは、用語→説明・説明→用語を1問ごとにランダムに決める（出題順もランダム）
      return buildTermItem(id, dir === "mix" ? (Math.random() < 0.5 ? "d2t" : "t2d") : dir);
    });
  }

  /** 過去問題の5択 */
  function buildExamItems(qids, ordered) {
    return (ordered ? qids.slice() : shuffle(qids)).map(function (qid) {
      var q = examById[qid];
      var options = q.c.map(function (text, i) { return { text: text, correct: i === q.a - 1 }; });
      return { kind: "exam", qid: qid, options: shuffle(options), chosen: null };
    });
  }

  function itemCorrect(item) {
    return item.chosen !== null && item.options[item.chosen].correct;
  }

  /**
   * quiz の種類
   *   theme  : テーマの全問（基礎問題）。結果をテーマの成績として保存する
   *   review : 過去に間違えた用語など、任意の用語の集合
   *   exam   : 過去問題（科目ごと・まとめて・間違えた問題）
   */
  function startQuiz(themeId) {
    var theme = themeById[themeId];
    quiz = {
      kind: "theme", themeId: themeId, termIds: themeTermIds(theme),
      title: theme.name, eyebrow: fieldOfTheme[themeId].name,
      dir: "mix", items: buildItems(themeTermIds(theme), "mix"), index: 0, saved: false, full: true,
    };
    go({ name: "quiz", themeId: themeId, ctx: "quiz" });
  }

  function startReviewQuiz(termIds, title, eyebrow) {
    quiz = {
      kind: "review", termIds: termIds, title: title, eyebrow: eyebrow,
      dir: "mix", items: buildItems(termIds, "mix"), index: 0, saved: false, full: false,
    };
    go({ name: "quiz", ctx: "review" });
  }

  function startExam(qids, title, eyebrow, back, ordered) {
    quiz = {
      kind: "exam", qids: qids, title: title, eyebrow: eyebrow, back: back || "exams",
      items: buildExamItems(qids, ordered), index: 0, saved: false, full: false,
    };
    go({ name: "quiz", ctx: "exam" });
  }

  function quizBackAction() {
    if (quiz.kind === "theme") return "back-themes";
    if (quiz.kind === "exam") return quiz.back === "review" ? "back-review" : "back-exams";
    return "back-review";
  }



  function renderQuizQuestion() {
    var item = quiz.items[quiz.index];
    var answered = item.chosen !== null;
    var correct = itemCorrect(item);
    var n = quiz.items.length;
    var last = quiz.index === n - 1;
    var prompt, feedbackBody, sub = "";

    if (item.kind === "exam") {
      var q = examById[item.qid];
      sub = " ・ " + esc(fieldById[q.field].name) + (q.case ? " ・ 事例" : "");
      prompt = '<div class="q-prompt q-prompt--def">' + esc(q.q) + "</div>";
      var related = (q.termIds || []).map(function (id) { return termById[id].term.term; });
      feedbackBody =
        '<p class="q-feedback__term">正解：' + esc(q.c[q.a - 1]) + "</p>" +
        '<p class="q-feedback__def">' + esc(q.exp) + "</p>" +
        (related.length ? '<p class="q-feedback__point">関連する用語：' + related.map(esc).join("・") + "</p>" : "");
    } else {
      var entry = termById[item.termId];
      var t = entry.term;
      if (quiz.kind === "review") sub = " ・ " + esc(entry.theme.name);
      prompt = item.dir === "t2d"
        ? '<p class="q-label">この用語の説明として正しいものは？</p><div class="q-prompt q-prompt--term">' + esc(t.term) +
          (t.reading ? '<span class="q-prompt__reading">' + esc(t.reading) + "</span>" : "") + "</div>"
        : '<p class="q-label">この説明に当てはまる用語は？</p><div class="q-prompt q-prompt--def">' + esc(t.definition) + "</div>";
      var chosen = answered ? item.options[item.chosen] : null;
      feedbackBody =
        (chosen && chosen.fake
          ? '<p class="q-feedback__trap">ひっかけ：「' + esc(chosen.fake.to) + "」ではなく「" + esc(chosen.fake.from) + "」</p>"
          : "") +
        '<p class="q-feedback__term">' + esc(t.term) + "</p>" +
        (item.dir === "d2t" ? "" : '<p class="q-feedback__def">' + hl(t.definition) + "</p>") +
        (t.point ? '<p class="q-feedback__point">' + hl(t.point) + "</p>" : "");
    }

    var longText = item.kind === "exam" || item.dir === "t2d";
    var options = item.options.map(function (o, i) {
      var cls = "q-opt" + (longText ? " q-opt--def" : "");
      if (answered) {
        if (o.correct) cls += " is-correct";
        else if (i === item.chosen) cls += " is-wrong";
        else cls += " is-dim";
      }
      return (
        '<button class="' + cls + '" data-action="quiz-answer" data-index="' + i + '"' + (answered ? " disabled" : "") + ">" +
        '<span class="q-opt__num">' + (i + 1) + "</span>" +
        '<span class="q-opt__text">' + esc(o.text) + "</span>" +
        (answered && o.correct ? '<span class="q-opt__mark">' + icon("check") + "</span>" : "") +
        (answered && i === item.chosen && !correct ? '<span class="q-opt__mark">' + icon("close") + "</span>" : "") +
        "</button>"
      );
    }).join("");

    var feedback = answered
      ? '<div class="q-feedback ' + (correct ? "is-correct" : "is-wrong") + '" aria-live="polite">' +
        '<p class="q-feedback__verdict">' + (correct ? "正解" : "不正解") + "</p>" + feedbackBody + "</div>"
      : "";

    var dock = answered
      ? '<button class="btn btn--primary" data-action="quiz-next">' + (last ? "結果を見る" : "次の問題") + icon("arrow") + "</button>"
      : '<p class="dock__status">5つの選択肢から1つ選んでください</p>';

    return (
      topbar(quiz.eyebrow, quiz.title, "quiz-quit") +
      '<main class="content content--with-dock">' +
      '<div class="progress"><div class="progress__text"><span>第' + (quiz.index + 1) + "問" + sub + "</span>" +
      '<span class="progress__count"><b>' + (quiz.index + 1) + "</b> / " + n + "</span></div>" + bar(quiz.index + (answered ? 1 : 0), n) + "</div>" +
      prompt +
      '<div class="q-opts">' + options + "</div>" +
      feedback +
      "</main>" +
      '<div class="dock"><div class="dock__inner">' + dock + "</div></div>"
    );
  }

  function renderQuizResult() {
    var n = quiz.items.length;
    var wrong = quiz.items.filter(function (it) { return !itemCorrect(it); });
    var score = n - wrong.length;
    var pct = Math.round((score / n) * 100);
    if (!quiz.saved && quiz.full && quiz.kind === "theme") Store.saveQuizResult(quiz.themeId, score, n);
    quiz.saved = true;

    var list = wrong.map(function (it) {
      if (it.kind === "exam") {
        var q = examById[it.qid];
        return (
          '<div class="read-item read-item--static"><span class="read-item__def">' + esc(q.q) + "</span>" +
          '<span class="read-item__term">正解：' + esc(q.c[q.a - 1]) + "</span>" +
          '<span class="read-item__point">' + esc(q.exp) + "</span></div>"
        );
      }
      var t = termById[it.termId].term;
      return (
        '<div class="read-item read-item--static"><span class="read-item__term">' + esc(t.term) + "</span>" +
        '<span class="read-item__def">' + hl(t.definition) + "</span>" +
        (t.point ? '<span class="read-item__point">' + hl(t.point) + "</span>" : "") + "</div>"
      );
    }).join("");

    var sub = quiz.kind === "theme"
      ? (quiz.full ? "全問に挑戦しました" : "間違えた問題の解き直し")
      : quiz.practice ? "正解した問題は、新しい問題に入れ替わります"
      : wrong.length ? "正解した問題は「まだ正解していない」から外れます" : "すべて正解しました";

    var buttons, pastHtml = "";
    if (quiz.kind === "theme") {
      // この科目の本試験（年度別）に進めるように、各年度の同じ科目を並べる
      var fid = fieldOfTheme[quiz.themeId].id;
      var pastRows = [];
      PAST.years.forEach(function (y) {
        y.subjects.forEach(function (sj, si) {
          if (sj.field !== fid) return;
          var rec = Store.getPast(y.id), chip;
          if (rec.graded[si]) {
            var r = 0, nn = sj.to - sj.from + 1;
            for (var q = sj.from; q <= sj.to; q++) if (rec.answers[q] && isRight(y, q, rec.answers[q])) r++;
            chip = '<span class="chip ' + (r / nn >= 0.6 ? "chip--done" : "chip--ng") + '">' + r + " / " + nn + "</span>";
          } else chip = '<span class="chip">未挑戦</span>';
          pastRows.push(
            '<button class="row" data-action="open-past-sheet-at" data-year="' + y.id + '" data-index="' + si + '">' +
            '<span class="row__body"><span class="row__title">' + esc(y.name) + "（" + esc(y.nendo) + "）</span>" +
            '<span class="row__sub">' + esc(sj.name) + " ・ 問題" + sj.from + "〜" + sj.to + "（" + (sj.to - sj.from + 1) + "問）</span></span>" +
            '<span class="row__aside">' + chip + icon("chev", "row__chev") + "</span></button>"
          );
        });
      });
      if (pastRows.length) {
        pastHtml = '<section class="section"><h2 class="section__label">過去問に挑戦（' + esc(fieldOfTheme[quiz.themeId].name) + "）</h2>" +
          '<p class="hint">' + icon("info") + "<span>本試験で、この科目がどう出題されたかを確かめましょう。年度を選んでください。</span></p>" +
          '<div class="rows">' + pastRows.join("") + "</div></section>";
      }
      buttons =
        '<button class="btn btn--ghost" data-action="quiz-again">もう一度全問解く</button>' +
        '<button class="btn btn--ghost" data-action="open-theme" data-id="' + quiz.themeId + '">' + icon("grid") + "基礎学習で見直す</button>" +
        '<button class="btn btn--text" data-action="back-themes">テーマ一覧へ</button>';
    } else if (quiz.kind === "exam" && quiz.practice) {
      var locked = quiz.trial && !owns("originals") && trialLeft() === 0;
      buttons =
        (locked
          ? '<p class="hint">' + icon("info") + "<span>無料のお試し（" + FREE_TRIAL + "問）が終わりました。続きは購入で解放できます。</span></p>" +
            '<button class="btn btn--primary" data-action="open-paywall">すべての問題を解放する</button>'
          : '<button class="btn btn--primary" data-action="practice-next">' + icon("quiz") + "次の問題を解く</button>") +
        '<button class="btn btn--text" data-action="back-exams">オリジナル問題の一覧へ</button>';
    } else if (quiz.kind === "exam") {
      buttons =
        '<button class="btn btn--ghost" data-action="quiz-again">同じ問題をもう一度解く</button>' +
        '<button class="btn btn--text" data-action="' + quizBackAction() + '">' + (quiz.back === "review" ? "過去に間違えた問題へ戻る" : "過去問題の一覧へ") + "</button>";
    } else {
      buttons =
        '<button class="btn btn--ghost" data-action="back-review">過去に間違えた問題へ戻る</button>' +
        '<button class="btn btn--text" data-action="home">ホームに戻る</button>';
    }

    return (
      topbar(quiz.eyebrow, quiz.title, quizBackAction()) +
      '<main class="content">' +
      '<section class="done-hero">' +
      '<div class="score"><b>' + score + "</b><span>/ " + n + "</span></div>" +
      '<h2 class="done-hero__title">' + (pct === 100 ? "全問正解" : "正答率 " + pct + "%") + "</h2>" +
      '<p class="done-hero__sub">' + sub + "</p>" +
      bar(score, n) + "</section>" +
      (wrong.length
        ? '<section class="section"><h2 class="section__label">間違えた問題（' + wrong.length + "）</h2>" +
          '<div class="read-list">' + list + "</div></section>"
        : "") +
      '<div class="btn-stack">' +
      (wrong.length ? '<button class="btn btn--primary" data-action="quiz-retry-wrong">' + icon("redo") + "間違えた問題を解き直す</button>" : "") +
      buttons +
      "</div>" + pastHtml + "</main>"
    );
  }

  function renderQuiz() {
    if (!quiz) return renderHome();
    if (!quiz.items) { quiz.dir = "mix"; quiz.items = buildItems(quiz.termIds, "mix"); }
    if (quiz.index >= quiz.items.length) return renderQuizResult();
    return renderQuizQuestion();
  }

  /* ---------------- 年度別の本試験（マークシート採点） ---------------- */
  var PAST = window.KAIGO_PAST_EXAMS || { years: [], groups: [] };
  var EXPLAIN = window.KAIGO_PAST_EXPLAIN || {};
  var pastById = {};
  PAST.years.forEach(function (y) { pastById[y.id] = y; });

  function isRight(year, q, choice) {
    var a = year.answers[q - 1];
    return Array.isArray(a) ? a.indexOf(choice) !== -1 : a === choice;
  }
  function answerLabel(a) { return Array.isArray(a) ? a.join("・") : String(a); }

  /** 年度ごとの集計：採点済みの科目だけを数える */
  function pastSummary(year) {
    var rec = Store.getPast(year.id);
    var total = 0, answered = 0, gradedQ = 0, bySubject = [], byField = {};
    year.subjects.forEach(function (s, si) {
      var graded = !!rec.graded[si];
      var right = 0, done = 0;
      for (var q = s.from; q <= s.to; q++) {
        var c = rec.answers[q];
        if (c) done++;
        if (graded && c && isRight(year, q, c)) right++;
      }
      answered += done;
      if (graded) { total += right; gradedQ += s.to - s.from + 1; }
      bySubject.push({ graded: graded, right: right, done: done, count: s.to - s.from + 1 });
      byField[s.field] = { graded: graded, right: right };
    });
    var allGraded = bySubject.every(function (b) { return b.graded; });
    var groupsOk = PAST.groups.every(function (g) {
      return g.some(function (f) { return byField[f] && byField[f].right > 0; });
    });
    return { total: total, answered: answered, gradedQ: gradedQ, bySubject: bySubject, allGraded: allGraded, groupsOk: groupsOk };
  }

  /** 採点済みの本試験の、科目ごとの正誤（総合問題を除く） */
  function pastFieldStats() {
    var st = {};
    PAST.years.forEach(function (y) {
      var rec = Store.getPast(y.id);
      y.subjects.forEach(function (s, si) {
        if (!rec.graded[si] || s.field === "general") return;
        var r = st[s.field] || { right: 0, total: 0 };
        for (var q = s.from; q <= s.to; q++) {
          r.total++;
          if (rec.answers[q] && isRight(y, q, rec.answers[q])) r.right++;
        }
        st[s.field] = r;
      });
    });
    return st;
  }

  /** 採点済みで間違えた問題の一覧（年度・科目ごと） */
  function pastWrongList() {
    var list = [];
    PAST.years.forEach(function (y) {
      var rec = Store.getPast(y.id);
      y.subjects.forEach(function (s, si) {
        if (!rec.graded[si]) return;
        var qs = [];
        for (var q = s.from; q <= s.to; q++) if (!(rec.answers[q] && isRight(y, q, rec.answers[q]))) qs.push(q);
        if (qs.length) list.push({ year: y, subject: s, index: si, qs: qs });
      });
    });
    return list;
  }

  function renderPastYears() {
    return PAST.years.map(function (y) {
      var sm = pastSummary(y);
      var chip = sm.gradedQ
        ? '<span class="chip ' + (sm.allGraded ? (sm.total >= y.passing && sm.groupsOk ? "chip--done" : "chip--ng") : "chip--progress") + '">' +
          sm.total + "点</span>"
        : '<span class="chip">未挑戦</span>';
      return (
        '<button class="row" data-action="open-past-year" data-id="' + y.id + '">' +
        '<span class="row__body"><span class="row__title">' + esc(y.name) + "（" + esc(y.nendo) + "）</span>" +
        '<span class="row__sub">' + esc(y.date) + "実施 ・ 125問 ・ 合格点 " + y.passing + "点" +
        (sm.gradedQ ? " ・ 採点済み " + sm.gradedQ + "問" : "") + "</span>" +
        bar(sm.gradedQ, 125) + "</span>" +
        '<span class="row__aside">' + chip + icon("chev", "row__chev") + "</span></button>"
      );
    }).join("");
  }

  function renderPastYear() {
    var y = pastById[view.yearId];
    var sm = pastSummary(y);
    var verdict = sm.allGraded
      ? (sm.total >= y.passing && sm.groupsOk
          ? '<p class="verdict verdict--ok">合格基準に達しています</p>'
          : '<p class="verdict verdict--ng">' + (sm.total < y.passing ? "合格点まであと " + (y.passing - sm.total) + "点" : "得点のない科目群があります") + "</p>")
      : '<p class="verdict">全科目を採点すると、合格基準で判定します</p>';
    var rows = y.subjects.map(function (s, si) {
      var b = sm.bySubject[si];
      var chip = b.graded
        ? '<span class="chip ' + (b.right / b.count >= 0.6 ? "chip--done" : "chip--ng") + '">' + b.right + " / " + b.count + "</span>"
        : b.done ? '<span class="chip chip--progress">解答中 ' + b.done + "/" + b.count + "</span>" : '<span class="chip">未解答</span>';
      return (
        '<button class="row" data-action="open-past-sheet" data-index="' + si + '">' +
        '<span class="row__body"><span class="row__title">' + esc(s.name) + "</span>" +
        '<span class="row__sub">問題' + s.from + "〜" + s.to + "（" + b.count + "問）</span></span>" +
        '<span class="row__aside">' + chip + icon("chev", "row__chev") + "</span></button>"
      );
    }).join("");
    return (
      topbar("過去問題（本試験）", y.name + "（" + y.nendo + "）", "back-exams") +
      '<main class="content">' +
      '<div class="panel stats">' +
      '<div><p class="stat__label">得点</p><p class="stat__value">' + sm.total + "<small>/ 125</small></p></div>" +
      '<div><p class="stat__label">合格点</p><p class="stat__value">' + y.passing + "<small>点</small></p></div>" +
      '<div><p class="stat__label">採点済み</p><p class="stat__value">' + sm.gradedQ + "<small>問</small></p></div>" +
      bar(sm.total, 125) + "</div>" +
      verdict +
      '<p class="hint">' + icon("info") + "<span>" + (y.read
        ? "公式サイトでの公開が終わった回です。問題は" + esc(y.read.label) + "の掲載ページで読み、答えの番号をアプリで選んで採点します。"
        : "問題は試験センター公式サイトのPDFで読み、答えの番号をアプリで選んで採点します。") +
        "合格には、合格点に加えて11の科目群すべてで得点があることが必要です。</span></p>" +
      '<div class="rows">' + rows + "</div>" +
      '<p class="notice">正答は社会福祉振興・試験センター／厚生労働省が公表した正答によります。試験問題の著作権は社会福祉振興・試験センターに帰属します。</p>' +
      "</main>"
    );
  }

  function renderPastSheet() {
    var y = pastById[view.yearId];
    var s = y.subjects[view.subjectIndex];
    var rec = Store.getPast(y.id);
    var graded = !!rec.graded[view.subjectIndex];
    var right = 0, done = 0, n = s.to - s.from + 1;
    var rows = "";
    for (var q = s.from; q <= s.to; q++) {
      var c = rec.answers[q];
      if (c) done++;
      var ok = graded && c && isRight(y, q, c);
      if (ok) right++;
      var btns = "";
      for (var k = 1; k <= 5; k++) {
        var cls = "ms-btn";
        if (c === k) cls += " is-chosen";
        if (graded) {
          var correctK = isRight(y, q, k);
          if (correctK) cls += " is-answer";
          if (c === k && !correctK) cls += " is-wrong";
        }
        btns += '<button class="' + cls + '" data-action="past-mark" data-q="' + q + '" data-k="' + k + '"' + (graded ? " disabled" : "") +
          ' aria-label="問題' + q + "の" + k + '">' + k + "</button>";
      }
      rows +=
        '<div class="ms-row' + (graded ? (ok ? " is-ok" : " is-ng") : "") + '">' +
        '<span class="ms-q">問' + q + "</span>" +
        '<span class="ms-btns">' + btns + "</span>" +
        '<span class="ms-mark">' + (graded ? (ok ? "○" : "×") : "") + "</span></div>";
    }
    var dock = graded
      ? '<button class="btn btn--ghost" data-action="past-reset">' + icon("redo") + "解き直す</button>"
      : '<button class="btn btn--primary" data-action="past-grade"' + (done ? "" : " disabled") + ">" + icon("check") +
        "採点する（" + done + " / " + n + "問 解答）</button>";
    return (
      topbar(y.name + "（" + y.nendo + "）", s.name, view.from === "review" ? "open-review" : "back-past-year") +
      '<main class="content content--with-dock">' +
      '<div class="btn-row">' +
      (s.pdf
        ? '<a class="btn btn--ghost" href="' + esc(s.pdf) + '" target="_blank" rel="noopener">' + icon("doc") + "問題（公式PDF）</a>"
        : '<a class="btn btn--ghost" href="' + esc(y.read.url) + '" target="_blank" rel="noopener">' + icon("doc") + "問題（" + esc(y.read.label) + "）</a>") +
      (EXPLAIN[y.id] ? '<button class="btn btn--ghost" data-action="open-past-explain">' + icon("info") + "解説を見る</button>" : "") +
      "</div>" +
      (graded
        ? '<div class="panel ms-score"><b>' + right + "</b> / " + n + "問 正解" +
          '<span class="chip ' + (right / n >= 0.6 ? "chip--done" : "chip--ng") + '">' + Math.round((right / n) * 100) + "%</span></div>"
        : '<p class="hint">' + icon("info") + "<span>問題" + s.from + "〜" + s.to + "の答えを選んで「採点する」を押してください。</span></p>") +
      '<div class="ms-sheet">' + rows + "</div>" +
      "</main>" +
      '<div class="dock"><div class="dock__inner">' + dock + "</div></div>"
    );
  }

  function renderPastExplain() {
    var y = pastById[view.yearId];
    var s = y.subjects[view.subjectIndex];
    var rec = Store.getPast(y.id);
    var graded = !!rec.graded[view.subjectIndex];
    var ex = EXPLAIN[y.id] || {};
    var items = "";
    for (var q = s.from; q <= s.to; q++) {
      var e = ex[q];
      if (!e) continue;
      var ans = y.answers[q - 1];
      var ansText = Array.isArray(ans) ? ans.join("・") : String(ans);
      var c = rec.answers[q];
      var mine = "";
      if (c) {
        var ok = isRight(y, q, c);
        mine = graded
          ? '<span class="chip ' + (ok ? "chip--done" : "chip--ng") + '">あなた ' + c + (ok ? " ○" : " ×") + "</span>"
          : '<span class="chip">あなた ' + c + "</span>";
      }
      items +=
        '<article class="ex-item">' +
        '<div class="ex-head"><span class="ex-q">問' + q + '</span><span class="ex-ans">正解 ' + ansText + "</span>" + mine + "</div>" +
        '<p class="ex-main">' + hl(e[0]) + "</p>" +
        '<p class="ex-note">' + (e[1] ? '<b>' + e[1] + " は誤り：</b>" : "<b>ポイント：</b>") + esc(e[2]) + "</p>" +
        "</article>";
    }
    return (
      topbar(y.name + "　" + s.name, "解説（問" + s.from + "〜" + s.to + "）", "back-past-sheet") +
      '<main class="content">' +
      '<div class="ex-list">' + items + "</div>" +
      '<p class="notice">解説は、正答（厚生労働省の公表値）の要旨とポイントを独自にまとめたものです。問題文は解答画面の「問題」ボタンから確認してください。</p>' +
      "</main>"
    );
  }

  /* ---------------- 過去問題 ---------------- */
  function examIdsOf(fieldId) { return examsByField[fieldId] || []; }
  /**
   * オリジナル問題の練習（本試験と同じ13科目・125問の構成）
   * 科目ごとに本試験の問題数ぶん（尊厳と自立2問…総合問題12問）を「いまの問題」として出す。
   * 正解した問題は次から新しい問題に入れ替わり、まちがえた問題は正解するまで残る。
   * 科目の問題をすべて正解したら、その科目は最初の問題に戻る（終わりがない）。
   * 総合問題は、各科目のいまの問題に入らなかった問題から、事例問題を優先して出す。
   */
  function practiceLayout() {
    var y = PAST.years[0];
    return y ? y.subjects.map(function (s) { return { field: s.field, name: s.name, n: s.to - s.from + 1 }; }) : [];
  }
  function strHash(str) {
    var h = 5381;
    for (var i = 0; i < str.length; i++) h = ((h * 33) ^ str.charCodeAt(i)) >>> 0;
    return h;
  }
  function practiceQueue(fieldId) {
    var ex = Store.getExamAnswers();
    var round = Store.getPref("practiceRound", {});
    var ids = examIdsOf(fieldId);
    var solved = function (id) {
      var a = ex[id];
      var okAt = a ? (a.okAt || (a.correct > 0 ? 1 : 0)) : 0;
      return okAt > (round[fieldId] || 0);
    };
    var left = ids.filter(function (id) { return !solved(id); });
    if (!left.length && ids.length) {
      // すべて正解したら最初に戻る
      round[fieldId] = Date.now();
      Store.setPref("practiceRound", round);
      left = ids.slice();
    }
    return left.sort(function (a, b) {
      return (examById[a].gen ? 1 : 0) - (examById[b].gen ? 1 : 0) || strHash(a) - strHash(b);
    });
  }
  function practiceSet() {
    var set = {}, rest = [];
    var layout = practiceLayout();
    layout.forEach(function (s) {
      if (s.field === "general") return;
      var q = practiceQueue(s.field);
      set[s.field] = q.slice(0, s.n);
      rest = rest.concat(q.slice(s.n));
    });
    layout.forEach(function (s) {
      if (s.field !== "general") return;
      rest.sort(function (a, b) {
        return (examById[b].case ? 1 : 0) - (examById[a].case ? 1 : 0) ||
          (examById[a].gen ? 1 : 0) - (examById[b].gen ? 1 : 0) || strHash(a) - strHash(b);
      });
      set.general = rest.slice(0, s.n);
    });
    return set;
  }
  /**
   * 有料機能（ストアのアプリ版で買い切り購入）
   *   originals：オリジナル問題のすべて（未購入でも FREE_TRIAL 問まで試せる）
   *   adFree   ：広告の非表示
   * 購入・復元・価格の取得はアプリ側（window.KaigoNative）が行う。
   *   purchase(productId) → Promise<boolean>、restorePurchases() → Promise<string[]>、price(productId) → 表示用の価格（任意）
   */
  // ショップで売るのはプレミアムと広告なしの2つ。originals・mine は以前の単品（購入の復元にだけ使う）
  var PRODUCTS = { premium: "premium_unlock", originals: "originals_unlock", mine: "mine_unlimited", adFree: "remove_ads" };
  var OWN_PREF = { premium: "ownPremium", originals: "ownOriginals", mine: "ownMine", adFree: "adFree" };
  var FREE_TRIAL = 20;
  var MINE_FREE = 50; // マイ教科書に無料で入れられる用語の数（プレミアムで無制限）
  /** 購入済みか。プレミアムは、オリジナル問題・広告なしを含む */
  function owns(key) {
    if (Store.getPref(OWN_PREF[key], false)) return true;
    return key !== "premium" && !!Store.getPref(OWN_PREF.premium, false);
  }
  function mineUnlimited() { return owns("mine"); }
  /** マイ教科書に、この用語を新しく追加できるか（外すのはいつでもできる） */
  function canPick(termId) {
    return Store.isPicked(termId) || mineUnlimited() || Store.countPicked(allTermIds()) < MINE_FREE;
  }
  function canBuy() { var N = window.KaigoNative; return !!(N && (N.purchase || N.purchaseAdFree)); }
  // 表示用の価格（ストアから価格を取れないときに使う。実際の価格は App Store・Google Play の管理画面で設定する）
  var PRICE_DEFAULT = { premium: "980円", adFree: "380円" };
  function priceOf(key) {
    var N = window.KaigoNative, v = "";
    try { v = N && N.price ? N.price(PRODUCTS[key]) || "" : ""; } catch (e) { v = ""; }
    return v || PRICE_DEFAULT[key] || "";
  }
  function buy(key) {
    var N = window.KaigoNative;
    if (!N) return Promise.resolve(false);
    var p = N.purchase ? N.purchase(PRODUCTS[key]) : key === "adFree" && N.purchaseAdFree ? N.purchaseAdFree() : false;
    return Promise.resolve(p).then(function (ok) { if (ok) Store.setPref(OWN_PREF[key], true); return !!ok; });
  }
  function restorePurchases() {
    var N = window.KaigoNative;
    if (!N || !N.restorePurchases) return Promise.resolve([]);
    return Promise.resolve(N.restorePurchases()).then(function (res) {
      var ids = Array.isArray(res) ? res : res ? [PRODUCTS.adFree] : [];
      var got = [];
      Object.keys(PRODUCTS).forEach(function (k) {
        if (ids.indexOf(PRODUCTS[k]) !== -1) { Store.setPref(OWN_PREF[k], true); got.push(k); }
      });
      return got;
    });
  }
  /**
   * お試しで使える問題（未購入の人は、この一覧に入った最大 FREE_TRIAL 問だけを解ける）。
   * 有料化の前に解いた記録があっても、お試しの枠はこの一覧で数える
   */
  function trialIds() { return Store.getPref("trialIds", []); }
  function trialUsed() { return trialIds().length; }
  function trialLeft() { return Math.max(0, FREE_TRIAL - trialUsed()); }

  function startPractice(scope) {
    var set = practiceSet();
    var layout = practiceLayout();
    var qids, title, ordered = false;
    if (scope === "all") {
      qids = layout.reduce(function (acc, s) { return acc.concat(set[s.field] || []); }, []);
      title = "125問を通して解く";
      ordered = true;
    } else {
      var sub = layout.filter(function (s) { return s.field === scope; })[0];
      qids = set[scope] || [];
      title = sub ? sub.name : "";
    }
    var trial = !owns("originals");
    if (trial) {
      // 未購入：お試しの枠に入っている問題と、枠の残り数までの新しい問題だけ
      var ids = trialIds().slice();
      qids = qids.filter(function (id) {
        if (ids.indexOf(id) !== -1) return true;
        if (ids.length < FREE_TRIAL) { ids.push(id); return true; }
        return false;
      });
      Store.setPref("trialIds", ids);
      if (!qids.length) { openShop("originals"); return; }
    }
    startExam(qids, title, "オリジナル問題", null, ordered);
    quiz.practice = scope;
    quiz.trial = trial;
  }
  function allExamIds() {
    return DATA.fields.reduce(function (acc, f) { return acc.concat(examIdsOf(f.id)); }, []);
  }

  function renderExams() {
    var ex = Store.getExamAnswers();
    var set = practiceSet();
    var layout = practiceLayout();
    var everSolved = allExamIds().filter(function (id) { return ex[id] && ex[id].correct > 0; }).length;
    var rows = layout.map(function (sub) {
      var qids = set[sub.field] || [];
      var review = qids.filter(function (id) { return ex[id] && ex[id].last === false; }).length;
      return (
        '<button class="row" data-action="exam-field" data-id="' + sub.field + '">' +
        '<span class="row__body"><span class="row__title">' + esc(sub.name) + "</span>" +
        '<span class="row__sub">' + sub.n + "問</span></span>" +
        '<span class="row__aside">' + (review ? '<span class="chip chip--ng">復習 ' + review + "</span>" : '<span class="chip">新しい問題</span>') +
        icon("chev", "row__chev") + "</span></button>"
      );
    }).join("");
    var groups = '<section class="section"><h2 class="section__label">科目ごとに解く</h2><div class="rows">' + rows + "</div></section>";

    var tab = Store.getPref("examTab", "past");
    var seg =
      '<div class="seg" role="group" aria-label="過去問題の種類">' +
      '<button class="seg__btn" data-action="exam-tab" data-tab="past" aria-pressed="' + (tab === "past") + '">年度別（本試験）</button>' +
      '<button class="seg__btn" data-action="exam-tab" data-tab="original" aria-pressed="' + (tab === "original") + '">オリジナル問題</button>' +
      "</div>";
    if (tab === "past") {
      return (
        topbar("国家試験", "過去問題", "home") +
        '<main class="content">' + seg +
        '<div class="rows">' + renderPastYears() + "</div>" +
        '<p class="hint">' + icon("info") + "<span>第34〜38回の5回分です。問題は公式PDF（第36回以降）または掲載ページ（第34・35回）で読み、答えをアプリで選ぶと採点・合否判定ができます。</span></p>" +
        '<p class="notice">出典：<a href="' + esc(PAST.source) + '" target="_blank" rel="noopener">社会福祉振興・試験センター 過去の試験問題</a></p>' +
        "</main>"
      );
    }
    return (
      topbar("国家試験形式", "過去問題", "home") +
      '<main class="content">' + seg +
      (owns("originals") ? "" :
        '<div class="panel trial">' +
        '<p class="trial__title">オリジナル問題は有料です</p>' +
        '<p class="trial__sub">無料で' + FREE_TRIAL + "問まで試せます（残り <b>" + trialLeft() + "</b> 問）</p>" +
        '<button class="btn btn--primary" data-action="open-paywall">すべての問題を解放する</button></div>') +
      '<div class="panel review-sum"><div><p class="stat__label">本試験と同じ13科目</p>' +
      '<p class="stat__value">全125<small>問</small></p></div>' +
      '<button class="btn btn--primary" data-action="exam-next">' + icon("quiz") + "125問を解く</button></div>" +
      '<p class="hint">' + icon("info") + "<span>正解した問題は、次から新しい問題に入れ替わります。まちがえた問題は正解するまで残ります。" +
      (everSolved ? "これまでに正解した問題：" + everSolved + "問" : "") + "</span></p>" +
      groups +
      "</main>"
    );
  }

  /* ---------------- 7. 過去に間違えた問題 ---------------- */
  var REVIEW_MODES = {
    open: { label: "まだ正解していない", test: function (a) { return a && a.last === false; } },
    ever: { label: "一度でも間違えた", test: function (a) { return a && a.wrong > 0; } },
  };

  function wrongExamIds(qids) {
    var mode = REVIEW_MODES[Store.getPref("reviewMode", "open")];
    var ex = Store.getExamAnswers();
    return qids.filter(function (id) { return mode.test(ex[id]); });
  }

  function wrongTermIds(termIds) {
    var mode = REVIEW_MODES[Store.getPref("reviewMode", "open")];
    var answers = Store.getAnswers();
    return termIds.filter(function (id) { return mode.test(answers[id]); });
  }

  function renderReview() {
    var modeKey = Store.getPref("reviewMode", "open");
    var all = wrongTermIds(allTermIds());
    var allExam = wrongExamIds(allExamIds());

    var seg =
      '<div class="seg" role="group" aria-label="対象の切り替え">' +
      Object.keys(REVIEW_MODES).map(function (k) {
        return '<button class="seg__btn" data-action="review-mode" data-mode="' + k + '" aria-pressed="' + (k === modeKey) + '">' + REVIEW_MODES[k].label + "</button>";
      }).join("") + "</div>";

    var pastWrong = pastWrongList();
    if (!all.length && !allExam.length && !pastWrong.length) {
      return (
        topbar("復習", "過去に間違えた問題", "home") +
        '<main class="content">' + seg +
        '<div class="panel empty"><p class="empty__title">' +
        (Store.answerStats(allTermIds()).answered || Store.examStats(allExamIds()).answered ? "対象の問題はありません" : "まだ問題を解いていません") + "</p>" +
        '<p class="empty__text">基礎問題と過去問題で間違えた問題が、科目ごとにここへ自動で集まります。正解すると「まだ正解していない」から外れます。</p>' +
        '<button class="btn btn--primary" data-action="open-fields" data-ctx="quiz">' + icon("quiz") + "基礎問題を解く</button></div>" +
        "</main>"
      );
    }

    var sections = DATA.fields.map(function (f) {
      var fWrong = wrongTermIds(fieldTermIds(f));
      if (!fWrong.length) return "";
      var rows = f.themes.map(function (t) {
        var ids = wrongTermIds(themeTermIds(t));
        if (!ids.length) return "";
        var names = ids.slice(0, 3).map(function (id) { return termById[id].term.term; }).join("・") + (ids.length > 3 ? " ほか" : "");
        return (
          '<button class="row" data-action="review-theme" data-id="' + t.id + '">' +
          '<span class="row__body"><span class="row__title">' + esc(t.name) + "</span>" +
          '<span class="row__sub">' + esc(names) + "</span></span>" +
          '<span class="row__aside"><span class="chip chip--ng">' + ids.length + "問</span>" + icon("chev", "row__chev") + "</span></button>"
        );
      }).join("");
      return (
        '<section class="section"><div class="section__head"><h2 class="section__label">' + esc(f.name) + "（" + fWrong.length + "）</h2>" +
        '<button class="link-btn" data-action="review-field" data-id="' + f.id + '">まとめて解く</button></div>' +
        '<div class="rows">' + rows + "</div></section>"
      );
    }).join("");

    var examRows = DATA.fields.map(function (f) {
      var qids = wrongExamIds(examIdsOf(f.id));
      if (!qids.length) return "";
      return (
        '<button class="row" data-action="review-exam-field" data-id="' + f.id + '">' +
        '<span class="row__body"><span class="row__title">' + esc(f.name) + "</span></span>" +
        '<span class="row__aside"><span class="chip chip--ng">' + qids.length + "問</span>" + icon("chev", "row__chev") + "</span></button>"
      );
    }).join("");

    var pastRows = pastWrong.map(function (w) {
      return (
        '<button class="row" data-action="open-past-wrong" data-year="' + w.year.id + '" data-index="' + w.index + '">' +
        '<span class="row__body"><span class="row__title">' + esc(w.year.name) + " ・ " + esc(w.subject.name) + "</span>" +
        '<span class="row__sub">問' + w.qs.slice(0, 8).join("・問") + (w.qs.length > 8 ? " ほか" : "") + "</span></span>" +
        '<span class="row__aside"><span class="chip chip--ng">' + w.qs.length + "問</span>" + icon("chev", "row__chev") + "</span></button>"
      );
    }).join("");

    return (
      topbar("復習", "過去に間違えた問題", "home") +
      '<main class="content">' + seg +
      (pastRows
        ? '<section class="section"><h2 class="section__label">本試験（年度別）</h2><div class="rows">' + pastRows + "</div></section>"
        : "") +
      (examRows
        ? '<section class="section"><h2 class="section__label">過去問題（' + allExam.length + "）</h2>" +
          '<div class="rows">' + examRows + "</div></section>"
        : "") +
      (all.length
        ? '<section class="section"><div class="section__head"><h2 class="section__label">基礎問題（' + all.length + "）</h2>" +
          '<button class="link-btn" data-action="review-all">すべて解く</button></div></section>'
        : "") +
      sections +
      "</main>"
    );
  }

  /* ---------------- 8. 苦手傾向分析 ---------------- */
  var ANALYSIS_MIN = 10;

  /** 用語の集合の、延べ解答数・正解数 */
  function attemptStats(termIds, dir) {
    var answers = Store.getAnswers();
    var c = 0, w = 0, answered = 0;
    termIds.forEach(function (id) {
      var a = answers[id];
      if (!a) return;
      if (dir) {
        var d = a.dirs && a.dirs[dir];
        if (!d) return;
        c += d.c; w += d.w;
      } else {
        c += a.correct; w += a.wrong;
      }
      answered++;
    });
    return { correct: c, wrong: w, total: c + w, answered: answered, rate: c + w ? Math.round((c / (c + w)) * 100) : null };
  }

  function meter(label, sub, rate) {
    var cls = rate >= 80 ? " bar--done" : rate < 60 ? " bar--ng" : "";
    return (
      '<div class="meter"><div class="meter__head"><span class="meter__label">' + label + "</span>" +
      '<span class="meter__value">' + rate + "%</span></div>" +
      '<div class="bar' + cls + '"><div class="bar__fill" style="width:' + rate + '%"></div></div>' +
      (sub ? '<p class="meter__sub">' + sub + "</p>" : "") + "</div>"
    );
  }

  /** 苦手傾向分析：基礎問題・過去問題（年度別）・オリジナル問題を切り替えて分析する */
  // 「総合」は3つの記録をまとめて分析する（オリジナル問題はプレミアム購入者のみ）
  function analysisSources() {
    var list = [["all", "総合"], ["basic", "基礎問題"], ["past", "過去問題"]];
    if (owns("originals")) list.push(["original", "オリジナル"]);
    return list;
  }
  function renderAnalysis() {
    var ANALYSIS_SRC = analysisSources();
    var src = Store.getPref("analysisSrc", "all");
    if (!ANALYSIS_SRC.some(function (x) { return x[0] === src; })) src = "all";
    var tabs = '<div class="seg seg--analysis seg--n' + ANALYSIS_SRC.length + '" role="group" aria-label="分析する問題">' +
      ANALYSIS_SRC.map(function (x) {
        return '<button class="seg__btn" data-action="analysis-src" data-src="' + x[0] + '" aria-pressed="' + (src === x[0]) + '">' + x[1] + "</button>";
      }).join("") + "</div>";
    var body = src === "all" ? analysisAll() : src === "past" ? analysisPast() : src === "original" ? analysisOriginal() : analysisBasic();
    return topbar("分析", "苦手傾向分析", "home") + '<main class="content">' + tabs + body + "</main>";
  }

  /** 過去問題（年度別）の科目ごとの正解数・問題数（総合問題は general） */
  function pastStatsByField() {
    var st = {};
    PAST.years.forEach(function (y) {
      var rec = Store.getPast(y.id);
      y.subjects.forEach(function (s, si) {
        if (!rec.graded[si]) return;
        var r = st[s.field] || (st[s.field] = { c: 0, w: 0 });
        for (var q = s.from; q <= s.to; q++) {
          if (rec.answers[q] && isRight(y, q, rec.answers[q])) r.c++; else r.w++;
        }
      });
    });
    return st;
  }
  /** オリジナル問題の正誤（延べ） */
  function originalCW(ids) {
    var ex = Store.getExamAnswers(), c = 0, w = 0;
    ids.forEach(function (id) { var a = ex[id]; if (a) { c += a.correct; w += a.wrong; } });
    return { c: c, w: w };
  }
  /** オリジナル問題を、関連する用語のテーマごとに集計 */
  function originalThemeStats() {
    var ex = Store.getExamAnswers(), byTheme = {};
    DATA.fields.forEach(function (f) {
      examIdsOf(f.id).forEach(function (id) {
        var a = ex[id], q = examById[id];
        if (!a || !q) return;
        var seen = {};
        (q.termIds || []).forEach(function (tid) {
          var e = termById[tid];
          if (!e || seen[e.theme.id]) return;
          seen[e.theme.id] = 1;
          var t = byTheme[e.theme.id] || (byTheme[e.theme.id] = { c: 0, w: 0, terms: {} });
          t.c += a.correct; t.w += a.wrong;
          if (a.wrong) t.terms[tid] = (t.terms[tid] || 0) + a.wrong;
        });
      });
    });
    return byTheme;
  }
  function pct(c, w) { return c + w ? Math.round((c / (c + w)) * 100) : null; }

  /** 総合：基礎問題・過去問題・オリジナル問題（購入者のみ）の記録をまとめて分析する */
  function analysisAll() {
    var useOrig = owns("originals");
    var answers = Store.getAnswers();
    var past = pastStatsByField();
    var oTheme = useOrig ? originalThemeStats() : {};
    var srcNames = useOrig ? "基礎問題・過去問題・オリジナル問題" : "基礎問題・過去問題";
    // 全体
    var tot = { b: { c: 0, w: 0 }, p: { c: 0, w: 0 }, o: { c: 0, w: 0 } };
    var fields = DATA.fields.map(function (f) {
      var b = attemptStats(fieldTermIds(f));
      var pr = past[f.id] || { c: 0, w: 0 };
      var o = useOrig ? originalCW(examIdsOf(f.id)) : { c: 0, w: 0 };
      tot.b.c += b.correct; tot.b.w += b.wrong; tot.p.c += pr.c; tot.p.w += pr.w; tot.o.c += o.c; tot.o.w += o.w;
      var c = b.correct + pr.c + o.c, w = b.wrong + pr.w + o.w;
      return { field: f, b: { c: b.correct, w: b.wrong }, p: pr, o: o, c: c, w: w, rate: pct(c, w) };
    });
    if (past.general) { tot.p.c += past.general.c; tot.p.w += past.general.w; }
    var allC = tot.b.c + tot.p.c + tot.o.c, allW = tot.b.w + tot.p.w + tot.o.w;
    if (allC + allW < ANALYSIS_MIN) {
      return analysisEmpty("あと " + (ANALYSIS_MIN - allC - allW) + " 問解くと分析できます",
        srcNames + "の記録をまとめて、苦手な科目・テーマと、重点的に勉強するポイントを示します。",
        bar(allC + allW, ANALYSIS_MIN) +
        '<button class="btn btn--primary" data-action="open-fields" data-ctx="quiz">' + icon("quiz") + "基礎問題を解く</button>" +
        '<button class="btn btn--ghost" data-action="analysis-open-exams" data-tab="past">' + icon("doc") + "過去問題を解く</button>");
    }
    var tried = fields.filter(function (r) { return r.c + r.w; }).sort(function (a, b) { return a.rate - b.rate; });
    var untried = fields.filter(function (r) { return !(r.c + r.w); }).map(function (r) { return r.field.name; });
    var srcRate = function (x) { var v = pct(x.c, x.w); return v === null ? "－" : v + "%"; };
    var breakdown = function (r) {
      var parts = [];
      if (r.b.c + r.b.w) parts.push("基礎 " + srcRate(r.b));
      if (r.p.c + r.p.w) parts.push("過去問 " + srcRate(r.p));
      if (useOrig && r.o.c + r.o.w) parts.push("オリジナル " + srcRate(r.o));
      return parts.join("・") + "（" + (r.c + r.w) + "回）";
    };
    // テーマ別：基礎問題＋オリジナル問題（過去問題はテーマが分からないため科目単位のみ）
    var themes = readyThemes().map(function (t) {
      var ids = themeTermIds(t);
      var b = attemptStats(ids);
      var o = oTheme[t.id] || { c: 0, w: 0, terms: {} };
      var c = b.correct + o.c, w = b.wrong + o.w;
      var weak = {};
      ids.forEach(function (id) { if (answers[id] && answers[id].wrong) weak[id] = answers[id].wrong; });
      Object.keys(o.terms).forEach(function (id) { weak[id] = (weak[id] || 0) + o.terms[id]; });
      return { theme: t, c: c, w: w, total: c + w, rate: pct(c, w), weak: weak };
    }).filter(function (x) { return x.total >= 3 && x.rate < 80; })
      .sort(function (a, b) { return a.rate - b.rate || b.w - a.w; }).slice(0, 3);
    // アドバイス
    var advice = [];
    var rate = pct(allC, allW);
    advice.push(srcNames + "の記録をまとめた正答率は " + rate + "% です。" + (rate >= 60 ? "合格の目安（6割程度）を上回っています。" : "合格の目安（6割程度）に向けて、苦手な科目から取り組みましょう。"));
    if (tried.length && tried[0].rate < 70) advice.push("いちばん苦手な科目は「" + tried[0].field.name + "」（" + tried[0].rate + "%）です。");
    // 基礎はできているのに本番形式で落としている科目
    var gap = fields.filter(function (r) {
      var bp = pct(r.b.c, r.b.w), pp = pct(r.p.c + r.o.c, r.p.w + r.o.w);
      return r.b.c + r.b.w >= 5 && r.p.c + r.p.w + r.o.c + r.o.w >= 5 && bp - pp >= 20;
    }).sort(function (a, b) { return pct(a.p.c + a.o.c, a.p.w + a.o.w) - pct(b.p.c + b.o.c, b.p.w + b.o.w); })[0];
    if (gap) advice.push("「" + gap.field.name + "」は、用語は覚えている（基礎問題 " + srcRate(gap.b) + "）のに、試験形式の問題で点が取れていません。解説を読み、事例の中で用語がどう問われるかを確認しましょう。");
    // 基礎が弱い科目
    var weakBasic = fields.filter(function (r) { return r.b.c + r.b.w >= 5 && pct(r.b.c, r.b.w) < 60; })
      .sort(function (a, b) { return pct(a.b.c, a.b.w) - pct(b.b.c, b.b.w); })[0];
    if (weakBasic) advice.push("「" + weakBasic.field.name + "」は基礎問題の正答率も低め（" + srcRate(weakBasic.b) + "）です。問題を解く前に、基礎学習のカードで用語を固めましょう。");
    if (!(tot.p.c + tot.p.w)) advice.push("過去問題（年度別）をまだ採点していません。本番の問題で実力を確かめると、分析がより正確になります。");
    if (!(tot.b.c + tot.b.w)) advice.push("基礎問題をまだ解いていません。用語の覚え具合がわかると、苦手の原因がはっきりします。");
    if (untried.length) advice.push("まだ問題を解いていない科目が " + untried.length + " あります。");
    var themeHtml = themes.length ? themes.map(function (x, i) {
      var t = x.theme;
      var names = Object.keys(x.weak).sort(function (a, b) { return x.weak[b] - x.weak[a]; }).slice(0, 4).map(function (id) { return termById[id].term.term; });
      return (
        '<div class="focus">' +
        '<div class="focus__head"><span class="focus__rank">' + (i + 1) + "</span>" +
        '<div class="focus__titles"><p class="focus__meta">' + esc(fieldOfTheme[t.id].name) + "</p>" +
        '<p class="focus__title">' + esc(t.name) + "</p></div>" +
        '<span class="chip ' + (x.rate < 60 ? "chip--ng" : "chip--progress") + '">' + x.rate + "%</span></div>" +
        (names.length ? '<p class="focus__terms"><span>間違えやすい用語</span>' + names.map(esc).join("・") + "</p>" : "") +
        '<p class="focus__why">' + x.total + "回解いて " + x.w + "回不正解。" +
        (Store.isThemeCompleted(t.id) ? "「説明つきで読む」で説明とポイントを読み直しましょう。" : "基礎学習がまだ完了していません。まずカードで一通り見ましょう。") + "</p>" +
        '<div class="focus__actions">' +
        '<button class="btn btn--ghost btn--sm" data-action="open-theme" data-id="' + t.id + '">' + icon("grid") + "カードで見直す</button>" +
        '<button class="btn btn--primary btn--sm" data-action="open-review">' + icon("redo") + "間違えた問題へ</button>" +
        "</div></div>"
      );
    }).join("") : '<p class="empty__text">正答率80%未満のテーマはありません。</p>';
    return (
      '<div class="panel stats">' +
      '<div><p class="stat__label">延べ解答数</p><p class="stat__value">' + (allC + allW) + "<small>回</small></p></div>" +
      '<div><p class="stat__label">正解</p><p class="stat__value">' + allC + "<small>回</small></p></div>" +
      '<div><p class="stat__label">正答率</p><p class="stat__value">' + rate + "<small>%</small></p></div>" +
      "</div>" +
      '<section class="section"><h2 class="section__label">あなたの傾向</h2><ul class="advice">' + advice.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul></section>" +
      '<section class="section"><h2 class="section__label">重点的に勉強する科目</h2>' +
      weakFieldFocus(tried, function (r) { return r.rate; }, function (r) { return breakdown(r); }) + "</section>" +
      '<section class="section"><h2 class="section__label">重点的に勉強するテーマ</h2>' + themeHtml + "</section>" +
      '<section class="section"><h2 class="section__label">科目別の正答率（低い順）</h2><div class="panel meters">' +
      tried.map(function (r) { return meter(esc(r.field.name), esc(breakdown(r)), r.rate); }).join("") +
      (untried.length ? '<p class="meter__sub">未挑戦：' + untried.map(esc).join("、") + "</p>" : "") +
      "</div></section>" +
      '<section class="section"><h2 class="section__label">問題の種類別の正答率</h2><div class="panel meters">' +
      (tot.b.c + tot.b.w ? meter("基礎問題", (tot.b.c + tot.b.w) + "回", pct(tot.b.c, tot.b.w)) : "") +
      (tot.p.c + tot.p.w ? meter("過去問題（年度別）", (tot.p.c + tot.p.w) + "問", pct(tot.p.c, tot.p.w)) : "") +
      (useOrig && tot.o.c + tot.o.w ? meter("オリジナル問題", (tot.o.c + tot.o.w) + "回", pct(tot.o.c, tot.o.w)) : "") +
      "</div></section>" +
      '<p class="notice">' + srcNames + "の解答記録をまとめて集計しています（過去問題は採点した科目のみ）。" +
      (useOrig ? "" : "オリジナル問題はプレミアムで解けるようになり、分析にも加わります。") + "上のボタンで、問題の種類ごとの分析も見られます。</p>"
    );
  }

  function analysisEmpty(title, text, action, label, ic) {
    return '<div class="panel empty"><p class="empty__title">' + esc(title) + "</p>" +
      '<p class="empty__text">' + esc(text) + "</p>" + (action || "") + "</div>";
  }
  function weakFieldFocus(rows, rateOf, metaOf) {
    // 正答率70%未満の科目を、低い順に3つまで（基礎学習へ戻る導線つき）
    var weak = rows.filter(function (r) { return rateOf(r) < 70; }).slice(0, 3);
    if (!weak.length) return '<p class="empty__text">正答率70%未満の科目はありません。</p>';
    return weak.map(function (r, i) {
      var f = r.field, rate = rateOf(r);
      return (
        '<div class="focus">' +
        '<div class="focus__head"><span class="focus__rank">' + (i + 1) + "</span>" +
        '<div class="focus__titles"><p class="focus__meta">' + esc(metaOf(r)) + "</p>" +
        '<p class="focus__title">' + esc(f.name) + "</p></div>" +
        '<span class="chip ' + (rate < 60 ? "chip--ng" : "chip--progress") + '">' + rate + "%</span></div>" +
        '<div class="focus__actions">' +
        '<button class="btn btn--ghost btn--sm" data-action="analysis-study-field" data-id="' + f.id + '">' + icon("grid") + "基礎学習で見直す</button>" +
        '<button class="btn btn--primary btn--sm" data-action="open-review">' + icon("redo") + "間違えた問題へ</button>" +
        "</div></div>"
      );
    }).join("");
  }

  /** 過去問題（年度別の本試験）の分析 */
  function analysisPast() {
    var rows = [], yearRows = [], total = 0, right = 0;
    var st = {};
    PAST.years.forEach(function (y) {
      var rec = Store.getPast(y.id);
      var yt = 0, yr = 0, graded = 0;
      y.subjects.forEach(function (s, si) {
        if (!rec.graded[si]) return;
        graded++;
        var key = s.field;
        var r = st[key] || { right: 0, total: 0, name: s.name };
        for (var q = s.from; q <= s.to; q++) {
          r.total++; yt++;
          if (rec.answers[q] && isRight(y, q, rec.answers[q])) { r.right++; yr++; }
        }
        st[key] = r;
      });
      if (graded) yearRows.push({ y: y, total: yt, right: yr, graded: graded, all: y.subjects.length });
      total += yt; right += yr;
    });
    if (!total) {
      return analysisEmpty("過去問題を採点すると分析できます",
        "年度別の本試験を科目ごとに採点すると、正答率の低い科目と、見直すポイントをまとめます。",
        '<button class="btn btn--primary" data-action="analysis-open-exams" data-tab="past">' + icon("doc") + "過去問題を解く</button>");
    }
    Object.keys(st).forEach(function (fid) {
      var r = st[fid];
      rows.push({ field: fieldById[fid] || { id: fid, name: r.name }, r: r, rate: Math.round((r.right / r.total) * 100) });
    });
    rows.sort(function (a, b) { return a.rate - b.rate; });
    var rate = Math.round((right / total) * 100);
    var wrongCount = pastWrongList().reduce(function (n, x) { return n + x.qs.length; }, 0);
    var advice = [];
    if (rate < 60) advice.push("採点した問題の正答率は " + rate + "% です。合格の目安は6割程度なので、正答率の低い科目の基礎学習から見直しましょう。");
    else advice.push("採点した問題の正答率は " + rate + "% です。合格の目安（6割程度）を上回っています。間違えた問題を解き直して、取りこぼしを減らしましょう。");
    if (rows.length && rows[0].rate < 60) advice.push("「" + rows[0].field.name + "」の正答率が " + rows[0].rate + "% と最も低くなっています。解説を読んだうえで、基礎学習のカードで用語を確認しましょう。");
    var untried = PAST.years[0] ? PAST.years[0].subjects.filter(function (s) { return !st[s.field]; }).map(function (s) { return s.name; }) : [];
    if (untried.length) advice.push("まだ採点していない科目が " + untried.length + " あります。全科目を一度ずつ解くと、苦手がはっきりします。");
    if (wrongCount) advice.push("間違えた問題は " + wrongCount + " 問あります。「間違えた問題」から、科目ごとに解き直せます。");
    var focusRows = rows.filter(function (r) { return fieldById[r.field.id]; });
    return (
      '<div class="panel stats">' +
      '<div><p class="stat__label">採点した問題</p><p class="stat__value">' + total + "<small>問</small></p></div>" +
      '<div><p class="stat__label">正解</p><p class="stat__value">' + right + "<small>問</small></p></div>" +
      '<div><p class="stat__label">正答率</p><p class="stat__value">' + rate + "<small>%</small></p></div>" +
      "</div>" +
      '<section class="section"><h2 class="section__label">あなたの傾向</h2><ul class="advice">' + advice.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul></section>" +
      '<section class="section"><h2 class="section__label">重点的に勉強する科目</h2>' +
      weakFieldFocus(focusRows, function (r) { return r.rate; }, function (r) { return r.r.right + " / " + r.r.total + "問 正解"; }) + "</section>" +
      '<section class="section"><h2 class="section__label">科目別の正答率（低い順）</h2><div class="panel meters">' +
      rows.map(function (x) { return meter(esc(x.field.name), x.r.right + " / " + x.r.total + "問", x.rate); }).join("") +
      (untried.length ? '<p class="meter__sub">未採点：' + untried.map(esc).join("、") + "</p>" : "") +
      "</div></section>" +
      '<section class="section"><h2 class="section__label">年度別の結果</h2><div class="panel meters">' +
      yearRows.map(function (x) {
        return meter(esc(x.y.name + "（" + x.y.nendo + "）"), x.right + " / " + x.total + "問（" + x.graded + " / " + x.all + "科目を採点）", Math.round((x.right / x.total) * 100));
      }).join("") + "</div></section>" +
      '<p class="notice">年度別の本試験で、採点した科目の解答から集計しています。</p>'
    );
  }

  /** オリジナル問題の分析 */
  function analysisOriginal() {
    var ex = Store.getExamAnswers();
    var all = [];
    DATA.fields.forEach(function (f) { all = all.concat(examIdsOf(f.id)); });
    var overall = Store.examStats(all);
    if (overall.answered < ANALYSIS_MIN) {
      return analysisEmpty("あと " + (ANALYSIS_MIN - overall.answered) + " 問解くと分析できます",
        "オリジナル問題の解答記録から、正答率の低い科目・テーマや、繰り返し間違えている問題をまとめます。",
        bar(overall.answered, ANALYSIS_MIN) +
        '<button class="btn btn--primary" data-action="analysis-open-exams" data-tab="original">' + icon("quiz") + "オリジナル問題を解く</button>");
    }
    var rows = DATA.fields.map(function (f) { return { field: f, st: Store.examStats(examIdsOf(f.id)) }; })
      .filter(function (r) { return r.st.attempts; }).sort(function (a, b) { return a.st.rate - b.st.rate; });
    var untried = DATA.fields.filter(function (f) { return !Store.examStats(examIdsOf(f.id)).attempts; }).map(function (f) { return f.name; });
    // テーマ別：問題に結びついた用語のテーマごとに集計
    var byTheme = {};
    all.forEach(function (id) {
      var a = ex[id], q = examById[id];
      if (!a || !q) return;
      var seen = {};
      (q.termIds || []).forEach(function (tid) {
        var e = termById[tid];
        if (!e || seen[e.theme.id]) return;
        seen[e.theme.id] = 1;
        var t = byTheme[e.theme.id] || (byTheme[e.theme.id] = { theme: e.theme, c: 0, w: 0, terms: {} });
        t.c += a.correct; t.w += a.wrong;
        if (a.wrong) t.terms[tid] = (t.terms[tid] || 0) + a.wrong;
      });
    });
    var themes = Object.keys(byTheme).map(function (k) { var t = byTheme[k]; t.total = t.c + t.w; t.rate = Math.round((t.c / t.total) * 100); return t; })
      .filter(function (t) { return t.total >= 3 && t.rate < 80; })
      .sort(function (a, b) { return a.rate - b.rate || b.w - a.w; }).slice(0, 3);
    // 形式別（事例問題・知識問題）
    var caseIds = all.filter(function (id) { return examById[id].case; });
    var knowIds = all.filter(function (id) { return !examById[id].case; });
    var cs = Store.examStats(caseIds), ks = Store.examStats(knowIds);
    // 繰り返し間違えている問題
    var repeat = all.filter(function (id) { return ex[id] && ex[id].wrong >= 2; })
      .sort(function (a, b) { return ex[b].wrong - ex[a].wrong; }).slice(0, 6);
    var advice = [];
    if (rows.length && rows[0].st.rate < 80) advice.push("最も正答率が低い科目は「" + rows[0].field.name + "」（" + rows[0].st.rate + "%）です。");
    if (cs.attempts >= 5 && ks.attempts >= 5 && ks.rate - cs.rate >= 10) advice.push("事例問題の正答率（" + cs.rate + "%）が、知識を問う問題より低めです。利用者の状態や希望を整理してから選択肢を読む練習をしましょう。");
    if (repeat.length) advice.push(repeat.length + " 問を2回以上間違えています。解説を読み、関連する基礎学習のカードで確認しましょう。");
    if (untried.length) advice.push("まだ解いていない科目が " + untried.length + " あります。");
    if (!advice.length) advice.push("全体的によく解けています。正答率の低い科目から、続けて解き進めましょう。");
    var themeHtml = themes.length ? themes.map(function (t, i) {
      var names = Object.keys(t.terms).sort(function (a, b) { return t.terms[b] - t.terms[a]; }).slice(0, 4).map(function (id) { return termById[id].term.term; });
      return (
        '<div class="focus">' +
        '<div class="focus__head"><span class="focus__rank">' + (i + 1) + "</span>" +
        '<div class="focus__titles"><p class="focus__meta">' + esc(fieldOfTheme[t.theme.id].name) + "</p>" +
        '<p class="focus__title">' + esc(t.theme.name) + "</p></div>" +
        '<span class="chip ' + (t.rate < 60 ? "chip--ng" : "chip--progress") + '">' + t.rate + "%</span></div>" +
        (names.length ? '<p class="focus__terms"><span>関連する用語</span>' + names.map(esc).join("・") + "</p>" : "") +
        '<p class="focus__why">' + t.total + "回解いて " + t.w + "回不正解。</p>" +
        '<div class="focus__actions"><button class="btn btn--ghost btn--sm" data-action="open-theme" data-id="' + t.theme.id + '">' + icon("grid") + "カードで見直す</button>" +
        '<button class="btn btn--primary btn--sm" data-action="open-review">' + icon("redo") + "間違えた問題へ</button></div></div>"
      );
    }).join("") : '<p class="empty__text">正答率80%未満のテーマはありません。</p>';
    var repeatHtml = repeat.map(function (id) {
      var q = examById[id];
      var stem = q.q.replace(/^【総合】/, "").replace(/\n/g, " ");
      if (stem.length > 70) stem = stem.slice(0, 70) + "…";
      return (
        '<div class="read-item read-item--static"><span class="read-item__head"><span class="read-item__term">' + esc((fieldById[q.field] || {}).name || "") + "</span>" +
        '<span class="chip chip--ng">' + ex[id].wrong + "回</span></span>" +
        '<span class="read-item__def">' + esc(stem) + "</span>" +
        '<span class="read-item__point">正解：' + hl(q.c[q.a - 1]) + "</span></div>"
      );
    }).join("");
    return (
      '<div class="panel stats">' +
      '<div><p class="stat__label">解いた問題</p><p class="stat__value">' + overall.answered + "<small>問</small></p></div>" +
      '<div><p class="stat__label">延べ解答数</p><p class="stat__value">' + overall.attempts + "<small>回</small></p></div>" +
      '<div><p class="stat__label">正答率</p><p class="stat__value">' + overall.rate + "<small>%</small></p></div>" +
      "</div>" +
      '<section class="section"><h2 class="section__label">あなたの傾向</h2><ul class="advice">' + advice.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul></section>" +
      '<section class="section"><h2 class="section__label">重点的に勉強するポイント</h2>' + themeHtml + "</section>" +
      '<section class="section"><h2 class="section__label">科目別の正答率（低い順）</h2><div class="panel meters">' +
      rows.map(function (r) { return meter(esc(r.field.name), r.st.answered + "問・" + r.st.attempts + "回", r.st.rate); }).join("") +
      (untried.length ? '<p class="meter__sub">未挑戦：' + untried.map(esc).join("、") + "</p>" : "") +
      "</div></section>" +
      ((cs.attempts || ks.attempts)
        ? '<section class="section"><h2 class="section__label">問題の形式別の正答率</h2><div class="panel meters">' +
          (ks.attempts ? meter("知識を問う問題", ks.attempts + "回", ks.rate) : "") +
          (cs.attempts ? meter("事例問題", cs.attempts + "回", cs.rate) : "") +
          "</div></section>"
        : "") +
      (repeat.length ? '<section class="section"><h2 class="section__label">繰り返し間違えている問題</h2><div class="read-list">' + repeatHtml + "</div></section>" : "") +
      '<p class="notice">オリジナル問題の解答記録から自動で集計しています。正答率は延べの解答回数で計算しています。</p>'
    );
  }

  function analysisBasic() {
    var ids = allTermIds();
    var answers = Store.getAnswers();
    var overall = attemptStats(ids);

    if (overall.answered < ANALYSIS_MIN) {
      var rest = ANALYSIS_MIN - overall.answered;
      return (
        '<div class="panel empty">' +
        '<p class="empty__title">あと ' + rest + " 問解くと分析できます</p>" +
        '<p class="empty__text">基礎問題の解答記録から、間違えやすい科目・テーマ・用語と、重点的に勉強するポイントを自動でまとめます。</p>' +
        bar(overall.answered, ANALYSIS_MIN) +
        '<button class="btn btn--primary" data-action="open-fields" data-ctx="quiz">' + icon("quiz") + "基礎問題を解く</button>" +
        "</div>"
      );
    }

    // 科目別
    var fieldRows = [], untried = [];
    DATA.fields.forEach(function (f) {
      var st = attemptStats(fieldTermIds(f));
      if (!st.total) untried.push(f.name);
      else fieldRows.push({ field: f, st: st });
    });
    fieldRows.sort(function (a, b) { return a.st.rate - b.st.rate; });

    // テーマ別：3語以上解いていて正答率80%未満を、正答率の低い順に
    var themeRows = [];
    readyThemes().forEach(function (t) {
      var tIds = themeTermIds(t);
      var st = attemptStats(tIds);
      if (st.answered < 3 || st.rate >= 80) return;
      var weakTerms = tIds.filter(function (id) { return answers[id] && answers[id].wrong > 0; })
        .sort(function (a, b) { return answers[b].wrong - answers[a].wrong; });
      themeRows.push({ theme: t, st: st, weakTerms: weakTerms });
    });
    themeRows.sort(function (a, b) { return a.st.rate - b.st.rate || b.st.wrong - a.st.wrong; });
    var focus = themeRows.slice(0, 3);

    // 形式別
    var t2d = attemptStats(ids, "t2d");
    var d2t = attemptStats(ids, "d2t");

    // 繰り返し間違えている用語
    var repeat = ids.filter(function (id) { return answers[id] && answers[id].wrong >= 2; })
      .sort(function (a, b) { return answers[b].wrong - answers[a].wrong; }).slice(0, 8);

    // アドバイス
    var advice = [];
    if (fieldRows.length && fieldRows[0].st.rate < 80) {
      advice.push("最も正答率が低い科目は「" + fieldRows[0].field.name + "」（" + fieldRows[0].st.rate + "%）です。下の重点ポイントから取り組みましょう。");
    }
    if (t2d.total >= 5 && d2t.total >= 5 && t2d.rate - d2t.rate >= 10) {
      advice.push("説明から用語を思い出す問題の正答率が低めです（" + d2t.rate + "%）。国家試験はこの形式が中心なので、基礎学習の「説明つきで読む」で説明と用語を結びつけましょう。");
    } else if (t2d.total >= 5 && d2t.total >= 5 && d2t.rate - t2d.rate >= 10) {
      advice.push("用語の意味を選ぶ問題の正答率が低めです（" + t2d.rate + "%）。カードを見て、説明を自分の言葉で言えるか確かめましょう。");
    }
    var notStudied = focus.filter(function (r) { return !Store.isThemeCompleted(r.theme.id); });
    if (notStudied.length) {
      advice.push("重点ポイントのうち " + notStudied.length + " テーマは、基礎学習がまだ完了していません。問題を解く前に、カードで一通り見ておくと効果的です。");
    }
    if (repeat.length) {
      advice.push(repeat.length + " 語を2回以上間違えています。覚え違いをしている可能性があるので、説明とポイントを読み直しましょう。");
    }
    if (untried.length) {
      advice.push("まだ基礎問題を解いていない科目が " + untried.length + " あります。苦手の判定には、全科目を一度ずつ解くのがおすすめです。");
    }
    if (!advice.length) advice.push("全体的によく覚えられています。時間をおいて、正答率の低い順に解き直しましょう。");

    var focusHtml = focus.length
      ? focus.map(function (r, i) {
          var t = r.theme;
          var studied = Store.isThemeCompleted(t.id);
          var names = r.weakTerms.slice(0, 4).map(function (id) { return termById[id].term.term; });
          return (
            '<div class="focus">' +
            '<div class="focus__head"><span class="focus__rank">' + (i + 1) + "</span>" +
            '<div class="focus__titles"><p class="focus__meta">' + esc(fieldOfTheme[t.id].name) + "</p>" +
            '<p class="focus__title">' + esc(t.name) + "</p></div>" +
            '<span class="chip ' + (r.st.rate < 60 ? "chip--ng" : "chip--progress") + '">' + r.st.rate + "%</span></div>" +
            (names.length ? '<p class="focus__terms"><span>間違えやすい用語</span>' + names.map(esc).join("・") + "</p>" : "") +
            '<p class="focus__why">' + r.st.total + "回解いて " + r.st.wrong + "回不正解。" +
            (studied ? "基礎学習は完了済みです。「説明つきで読む」で説明とポイントを読み直しましょう。" : "基礎学習がまだ完了していません。まずカードで一通り見ましょう。") + "</p>" +
            '<div class="focus__actions">' +
            '<button class="btn btn--ghost btn--sm" data-action="open-theme" data-id="' + t.id + '">' + icon("grid") + "カードで見直す</button>" +
            (r.weakTerms.length ? '<button class="btn btn--primary btn--sm" data-action="review-theme-ever" data-id="' + t.id + '">' + icon("redo") + "解き直す</button>" : "") +
            "</div></div>"
          );
        }).join("")
      : '<p class="empty__text">正答率80%未満のテーマはありません。</p>';

    var repeatHtml = repeat.map(function (id) {
      var e = termById[id];
      return (
        '<div class="read-item read-item--static"><span class="read-item__head"><span class="read-item__term">' + esc(e.term.term) + "</span>" +
        '<span class="chip chip--ng">' + answers[id].wrong + "回</span></span>" +
        '<span class="read-item__reading">' + esc(fieldOfTheme[e.theme.id].name + " ・ " + e.theme.name) + "</span>" +
        '<span class="read-item__def">' + hl(e.term.definition) + "</span>" +
        (e.term.point ? '<span class="read-item__point">' + hl(e.term.point) + "</span>" : "") + "</div>"
      );
    }).join("");

    return (
      '<div class="panel stats">' +
      '<div><p class="stat__label">解いた用語</p><p class="stat__value">' + overall.answered + "<small>/ " + ids.length + "</small></p></div>" +
      '<div><p class="stat__label">延べ解答数</p><p class="stat__value">' + overall.total + "<small>回</small></p></div>" +
      '<div><p class="stat__label">正答率</p><p class="stat__value">' + overall.rate + "<small>%</small></p></div>" +
      "</div>" +
      '<section class="section"><h2 class="section__label">あなたの傾向</h2>' +
      '<ul class="advice">' + advice.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul></section>" +
      '<section class="section"><h2 class="section__label">重点的に勉強するポイント</h2>' + focusHtml + "</section>" +
      '<section class="section"><h2 class="section__label">科目別の正答率（低い順）</h2><div class="panel meters">' +
      fieldRows.map(function (r) { return meter(esc(r.field.name), r.st.answered + "語・" + r.st.total + "回", r.st.rate); }).join("") +
      (untried.length ? '<p class="meter__sub">未挑戦：' + untried.map(esc).join("、") + "</p>" : "") +
      "</div></section>" +
      ((t2d.total || d2t.total)
        ? '<section class="section"><h2 class="section__label">出題形式別の正答率</h2><div class="panel meters">' +
          (t2d.total ? meter("用語を見て説明を選ぶ", t2d.total + "回", t2d.rate) : "") +
          (d2t.total ? meter("説明を見て用語を選ぶ", d2t.total + "回", d2t.rate) : "") +
          "</div></section>"
        : "") +
      (repeat.length
        ? '<section class="section"><h2 class="section__label">繰り返し間違えている用語</h2><div class="read-list">' + repeatHtml + "</div></section>"
        : "") +
      '<p class="notice">基礎問題の解答記録から自動で集計しています。正答率は延べの解答回数で計算しています。</p>'
    );
  }

  /* ---------------- カードの文字サイズ自動調整 ---------------- */
  /**
   * 用語が数文字だけ次の行に落ちるのを防ぐ。
   * 文字を小さくすると行数が減る場合、その行数になる最大のサイズを使う（下限 FIT_MIN）。
   */
  var FIT_MIN = 13;
  function fitTermNames() {
    var els = $app.querySelectorAll(".term__name");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      el.style.fontSize = "";
      var base = parseFloat(getComputedStyle(el).fontSize);
      var lines = function (size) {
        el.style.fontSize = size + "px";
        return Math.round(el.getBoundingClientRect().height / (size * 1.3));
      };
      var best = base;
      var bestLines = lines(base);
      for (var size = base - 0.5; bestLines > 1 && size >= FIT_MIN; size -= 0.5) {
        var n = lines(size);
        if (n < bestLines) { bestLines = n; best = size; }
      }
      el.style.fontSize = best + "px";
    }
  }
  /**
   * 説明つきで読む：まとめシート全体が、下のボタンの上までスクロールなしで収まる
   * 最大の文字サイズを選ぶ（READ_MAX〜READ_MIN）。最小でも収まらなければ最小で表示する。
   */
  var READ_MAX = 14, READ_MIN = 10;
  function fitReadSheet() {
    var sheet = $app.querySelector(".read-sheet");
    if (!sheet) return;
    var dock = $app.querySelector(".dock");
    var bottom = dock ? dock.getBoundingClientRect().top : window.innerHeight;
    var top = sheet.getBoundingClientRect().top + window.scrollY;
    var room = bottom - top;
    if (furiOn()) { sheet.style.fontSize = ""; return; } // ふりがなONのときは1画面に詰めず、読みやすさを優先する
    var size = READ_MAX, min = READ_MIN;
    for (; size > min; size -= 0.5) {
      sheet.style.fontSize = size + "px";
      if (sheet.offsetHeight <= room) break;
    }
    sheet.style.fontSize = size + "px";
  }
  function fitAll() { fitTermNames(); fitReadSheet(); }
  var fitTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(fitTimer);
    fitTimer = setTimeout(fitAll, 120);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);

  /* ---------------- 設定・このアプリについて ---------------- */
  var SITE = "https://nasutakako.github.io/matome-anki/";
  var settingsMsg = "";
  function renderSettings() {
    var N = window.KaigoNative || null;
    var ads = '<section class="section"><h2 class="section__label">購入</h2><div class="panel set-panel">' +
      "<p>" + purchaseSummary() + "</p>" +
      '<button class="btn btn--ghost" data-action="open-shop">' + icon("bag") + "ショップを開く</button></div></section>";
    var link = function (path, label) {
      return '<a class="row" href="' + SITE + path + '" target="_blank" rel="noopener"><span class="row__body"><span class="row__title">' +
        label + "</span></span>" + icon("chev", "row__chev") + "</a>";
    };
    return (
      topbar("キソマナ", "設定・このアプリについて", "home") +
      '<main class="content">' +
      '<section class="section"><h2 class="section__label">テーマカラー</h2><div class="theme-pick" role="group" aria-label="テーマカラー">' +
      THEMES.map(function (t) {
        return '<button class="theme-pick__btn" data-action="set-theme" data-id="' + t.id + '" aria-pressed="' + (currentTheme() === t.id) + '">' +
          '<span class="theme-pick__sw' + (t.cls ? " " + t.cls : "") + '" style="background:' + t.bg + ";--sw-accent:" + t.accent + '"></span>' + esc(t.name) + "</button>";
      }).join("") + "</div></section>" +
      '<section class="section"><h2 class="section__label">学習記録のバックアップ</h2><div class="panel set-panel">' +
      "<p>学習記録はこの端末の中だけに保存されています。機種変更やアプリの削除の前に書き出しておくと、新しい端末で読み込んで続きから使えます。</p>" +
      '<div class="btn-row"><button class="btn btn--primary" data-action="backup-download">' + icon("save") + "ファイルに保存</button>" +
      '<button class="btn btn--ghost" data-action="backup-copy">コピー</button></div>' +
      '<p class="set-sub">読み込む（いまの記録は置き換わります）</p>' +
      '<label class="btn btn--ghost set-file">ファイルから読み込む<input type="file" id="restore-file" accept=".json,application/json,text/plain" hidden></label>' +
      '<textarea id="restore-text" class="set-text" rows="3" placeholder="コピーした記録をここに貼り付け"></textarea>' +
      '<button class="btn btn--ghost" data-action="backup-paste">貼り付けた内容で読み込む</button>' +
      (settingsMsg ? '<p class="set-msg" role="status">' + esc(settingsMsg) + "</p>" : "") +
      "</div></section>" +
      ads +
      '<section class="section"><h2 class="section__label">使い方</h2><div class="rows">' +
      '<button class="row" data-action="show-intro"><span class="row__body"><span class="row__title">オープニングと使い方をもう一度見る</span></span>' + icon("chev", "row__chev") + "</button>" +
      '<button class="row" data-action="open-method"><span class="row__body"><span class="row__title">オススメの勉強法</span></span>' + icon("chev", "row__chev") + "</button>" +
      "</div></section>" +
      '<section class="section"><h2 class="section__label">このアプリについて</h2><div class="rows">' +
      link("privacy.html", "プライバシーポリシー") + link("terms.html", "利用規約・免責事項") + link("contact.html", "お問い合わせ") +
      "</div></section>" +
      '<p class="notice">' + esc(DATA.disclaimer) + "</p>" +
      '<p class="notice">介護福祉士 キソマナ 国家試験対策アプリ ・ 教材データ 第' + esc(String(DATA.version)) + "版 ・ 収録 " + allTermIds().length + "語。" +
      "国家試験の問題の著作権は社会福祉振興・試験センターに帰属します。本アプリは公的機関とは関係のない個人が提供するものです。</p>" +
      "</main>"
    );
  }
  function setMsg(text) {
    settingsMsg = text;
    var y = window.scrollY;
    render();
    window.scrollTo(0, y);
  }
  function restoreFrom(text) {
    try {
      var at = Store.importData(text);
      setMsg("読み込みました" + (at ? "（" + at.slice(0, 10) + " に書き出した記録）" : "") + "。");
    } catch (e) {
      setMsg("読み込めませんでした。このアプリで書き出した記録か確認してください。");
    }
  }

  /**
   * 広告（ストアのアプリ版だけ）。
   * 学習の途中では出さず、区切りの画面（問題の結果・テーマの完了・過去問の採点）でだけ、
   * 前回の広告から一定時間たっていれば表示する。起動直後も出さない。
   * 広告の表示そのものはアプリ側（window.KaigoNative.showInterstitial）が行う。
   */
  var AD_INTERVAL = 5 * 60 * 1000;
  var AD_GRACE = 5 * 60 * 1000;
  var appStartedAt = Date.now();
  function maybeShowAd() {
    var N = window.KaigoNative;
    if (!N || !N.showInterstitial || owns("adFree")) return;
    var now = Date.now();
    if (now - appStartedAt < AD_GRACE) return;
    if (now - Store.getPref("adLastAt", 0) < AD_INTERVAL) return;
    Store.setPref("adLastAt", now);
    try { N.showInterstitial(); } catch (e) { /* 広告が出せなくても学習は続ける */ }
  }

  /* ---------------- オープニングと最初の操作説明 ---------------- */
  var INTRO_TAGLINE = "見やすく学び、問題を解いて思い出す。";
  var INTRO_CONCEPT = "知識を着実に身につける介護福祉士試験対策アプリ。";
  function introLogo(step) {
    // 5段の階段（積み木）と、上っていく人。CSS アニメーションで順に積み上がる
    var s = 64, g = 8, x0 = 20, base = 360, o = "", k = 0;
    for (var col = 0; col < 5; col++) {
      for (var row = 0; row <= col; row++) {
        var top = col === 4 && row === 4;
        // step を指定すると、1個ずつ順番に（最後にてっぺんの赤いブロック）積み上がる
        var delay = step ? k * step : (top ? 1.75 : k * 0.05);
        o += '<rect class="ilogo__b' + (top ? " ilogo__b--top" : "") + '" style="animation-delay:' + delay.toFixed(2) + 's" x="' + (x0 + col * (s + g)) +
          '" y="' + (base - (row + 1) * s - row * g) + '" width="' + s + '" height="' + s + '" rx="14"/>';
        k++;
      }
    }
    // 人はアプリのアイコンと同じ位置・大きさ（1段目の上に立ち、2段目に足をかける）
    var st = 'fill="none" stroke="currentColor" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"';
    var man = '<g class="ilogo__man"><g transform="scale(0.964)"><circle cx="40" cy="-150" r="25" fill="currentColor"/>' +
      '<path d="M36,-116 L24,-60" ' + st + '/><path d="M24,-60 L14,-28 L2,0" ' + st + '/><path d="M24,-60 L62,-52 L64,-18" ' + st + '/>' +
      '<path d="M34,-104 L58,-82 L72,-90" ' + st + '/><path d="M34,-104 L12,-84 L4,-66" ' + st + "/></g></g>";
    return '<svg class="ilogo" viewBox="0 0 400 380" aria-hidden="true">' + o + man + "</svg>";
  }
  function introSlides() {
    var mockRead = '<div class="mm mm--read"><p><b>介護保険の保険者</b> <em>市町村</em>および特別区。</p><p><b>第1号被保険者</b> <em>65歳以上</em>の人。</p><p><b>第2号被保険者</b> <em>40歳以上65歳未満</em>の医療保険加入者。</p></div>';
    var mockKw = '<div class="mm mm--read"><p><b>脱健着患</b> 衣服を脱ぐときは<em>健側</em>から、着るときは<em>患側</em>から。</p><p><b>爪切り</b> 異常があるときは<em>医療職に相談</em>する。</p></div>';
    var mockQuiz = '<div class="mm mm--quiz"><p class="mm__q">「65歳以上の人」にあてはまる用語は？</p>' +
      ["第2号被保険者", "第1号被保険者", "特定疾病"].map(function (t, i) {
        return '<span class="mm__opt' + (i === 1 ? " is-ok" : "") + '">' + t + (i === 1 ? icon("check") : "") + "</span>";
      }).join("") + "</div>";
    var mockHome = '<div class="mm mm--menu">' + [["grid", "基礎学習"], ["quiz", "基礎問題"], ["doc", "過去問題"], ["pin", "マイ教科書"]].map(function (x) {
      return '<span class="mm__tile">' + icon(x[0]) + "<b>" + x[1] + "</b></span>";
    }).join("") + "</div>";
    var free = '<ul class="intro__free">' + ["基礎学習（約500語）", "基礎問題", "過去問題5年分・解説つき", "苦手傾向分析"].map(function (t) {
      return "<li>" + icon("check") + t + "</li>";
    }).join("") + "</ul>";
    return [
      { title: "キソマナへようこそ", text: [INTRO_TAGLINE + INTRO_CONCEPT], body: '<div class="intro__mark">' + introLogo() + "</div>" },
      { title: "1画面で全体を見渡せる基礎学習", text: ["用語を一覧で確認できます。スクロールしても、学習内容の全体像をつかみやすい作りです。"], body: mockRead },
      { title: "重要なところがひと目で分かる", text: ["用語だけでなく、説明文の大事な部分も赤字で強調。どこを覚えればいいかが分かります。"], body: mockKw },
      { title: "基礎問題で、思い出す練習", text: ["基礎学習で理解した内容を、問題を通して自分の記憶から引き出します。読み返すだけでなく、思い出す練習をくり返せます。"], body: mockQuiz },
      { title: "仕上げは、過去問で腕試し", text: ["基礎問題を解き終えたら、同じ科目の過去問を年度ごとに選べます。本番の問題で、覚えた知識が使えるか確かめましょう。"], body: '<div class="mm mm--past">' + [["第38回", "8 / 12", "is-ok"], ["第37回", "未挑戦", ""], ["第36回", "未挑戦", ""]].map(function (x) {
        return '<span class="mm__year"><b>' + x[0] + '</b><span class="mm__yearsub">社会の理解</span><i class="' + x[2] + '">' + x[1] + "</i></span>";
      }).join("") + "</div>" },
      { title: "シンプルで迷わない", text: ["ホームから学びたいものを選ぶだけ。余計なボタンや画面を減らして、すぐに学習に入れます。", "覚えたい用語は、右にスライドしてピン留めすると「マイ教科書」に集まります。右上の「ふりがな」で読みがなも表示できます。"], body: mockHome },
      { title: "主な機能は無料で使えます", text: ["課金のストレスが少ないように、基礎学習などの主要な機能は無料です。"], body: free, last: true },
    ];
  }
  /** 毎回の起動時に出すオープニング（ロゴ）。タップで閉じる */
  function showSplash(then) {
    var el = document.createElement("div");
    el.className = "splash";
    el.setAttribute("aria-hidden", "true");
    // ブロックが1個ずつ積み上がる → 人が出てくる → 文字が入る
    el.innerHTML = '<div class="splash__mark">' + introLogo(0.1) + "</div>" +
      '<p class="splash__word">' + "キソマナ".split("").map(function (c, i) { return '<span style="animation-delay:' + (2.0 + i * 0.1).toFixed(2) + 's">' + c + "</span>"; }).join("") + "</p>" +
      '<p class="splash__sub">介護福祉士 国家試験対策</p>';
    document.body.appendChild(el);
    var done = false;
    var close = function () {
      if (done) return; done = true;
      el.classList.add("is-leaving");
      setTimeout(function () { el.remove(); if (then) then(); }, 420);
    };
    el.addEventListener("click", close);
    setTimeout(close, 3600);
  }
  var introEl = null;
  function closeIntro() {
    Store.setPref("introSeen", true);
    if (introEl) { introEl.classList.add("is-leaving"); var el = introEl; introEl = null; setTimeout(function () { el.remove(); }, 260); }
    document.body.classList.remove("is-locked");
  }
  function showIntro(skipMovie) {
    if (introEl) introEl.remove();
    var slides = introSlides();
    introEl = document.createElement("div");
    introEl.className = "intro" + (skipMovie ? " is-guide" : "");
    introEl.setAttribute("role", "dialog");
    introEl.setAttribute("aria-label", "キソマナの使い方");
    introEl.innerHTML =
      '<div class="intro__movie" data-intro="to-guide">' +
      '<div class="intro__mark">' + introLogo(0.1) + "</div>" +
      '<p class="intro__name">キソマナ</p>' +
      '<p class="intro__sub">介護福祉士 国家試験対策</p>' +
      '<p class="intro__tag">' + esc(INTRO_TAGLINE) + "</p>" +
      '<button class="intro__skip" data-intro="to-guide">スキップ</button></div>' +
      '<div class="intro__guide">' +
      '<button class="intro__close" data-intro="close">スキップ</button>' +
      '<div class="intro__track">' + slides.map(function (sl, i) {
        return '<section class="intro__slide">' + sl.body +
          '<h2 class="intro__title">' + esc(sl.title) + "</h2>" +
          sl.text.map(function (t) { return '<p class="intro__text">' + esc(t) + "</p>"; }).join("") + "</section>";
      }).join("") + "</div>" +
      '<div class="intro__foot"><div class="intro__dots">' + slides.map(function (_, i) { return '<span class="intro__dot' + (i ? "" : " is-on") + '"></span>'; }).join("") + "</div>" +
      '<button class="btn btn--primary intro__next" data-intro="next">次へ' + icon("arrow") + "</button></div></div>";
    document.body.appendChild(introEl);
    document.body.classList.add("is-locked");
    if (furiOn() && Furi) Furi.apply(introEl);
    var track = introEl.querySelector(".intro__track");
    var dots = introEl.querySelectorAll(".intro__dot");
    var next = introEl.querySelector(".intro__next");
    var idx = 0;
    var setIdx = function (i) {
      idx = i;
      for (var d = 0; d < dots.length; d++) dots[d].classList.toggle("is-on", d === i);
      next.innerHTML = i === slides.length - 1 ? "はじめる" : "次へ" + icon("arrow");
    };
    track.addEventListener("scroll", function () { var i = Math.round(track.scrollLeft / track.clientWidth); if (i !== idx) setIdx(i); });
    var toGuide = function () { if (introEl) introEl.classList.add("is-guide"); };
    var timer = skipMovie ? null : setTimeout(toGuide, 4800);
    introEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-intro]");
      if (!b) return;
      var a = b.dataset.intro;
      if (a === "to-guide") { clearTimeout(timer); toGuide(); }
      else if (a === "close") closeIntro();
      else if (a === "next") {
        if (idx >= slides.length - 1) closeIntro();
        else { track.scrollTo({ left: track.clientWidth * (idx + 1), behavior: "smooth" }); setIdx(idx + 1); }
      }
    });
  }

  /* ---------------- オススメの勉強法 ---------------- */
  function renderMethod() {
    // 小さな画面の見本（実際の画面をイメージしたイラスト）
    var mockCards = '<div class="mm mm--read"><p><b>脱健着患</b> 脱ぐときは<em>健側</em>から、着るときは<em>患側</em>から。</p><p><b>端座位</b> ベッドの端に腰かけ、足を床につけた姿勢。</p><p><b>誤嚥</b> 食べ物などが<em>気管</em>に入ること。</p></div>';
    var mockQuiz = '<div class="mm mm--quiz"><p class="mm__q">「体の健康な側から脱ぎ、麻痺のある側から着る」原則は？</p>' +
      ["半側空間無視", "脱健着患", "ボディメカニクス"].map(function (t, i) {
        return '<span class="mm__opt' + (i === 1 ? " is-ok" : "") + '">' + t + (i === 1 ? icon("check") : "") + "</span>";
      }).join("") + "</div>";
    var mockRead = '<div class="mm mm--read"><p><b>誤嚥</b> 食べ物などが<em>気管</em>に入ること。</p><p class="is-focus"><b>褥瘡</b> 圧迫で皮膚が傷つく。<em>仙骨部</em>に多い。</p></div>';
    var mockAgain = '<div class="mm mm--score"><span class="mm__ring"><b>15</b>/16</span><span class="mm__up">前回より<br><b>+4問</b></span></div>';
    var mockPast = '<div class="mm mm--past">' + [["第38回", "8 / 12", "is-ok"], ["第37回", "未挑戦", ""], ["第36回", "未挑戦", ""]].map(function (x) {
      return '<span class="mm__year"><b>' + x[0] + '</b><span class="mm__yearsub">社会の理解</span><i class="' + x[2] + '">' + x[1] + "</i></span>";
    }).join("") + "</div>";
    var step = function (n, title, text, mock) {
      return '<li class="mstep"><div class="mstep__num">' + n + "</div><div class=\"mstep__body\"><h3 class=\"mstep__title\">" + esc(title) + "</h3>" +
        text.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + mock + "</div></li>";
    };
    return (
      topbar("キソマナ", "オススメの勉強法", "home") +
      '<main class="content">' +
      '<section class="method-hero">' +
      '<p class="method-hero__eyebrow">キソマナを使った</p>' +
      '<h2 class="method-hero__title">効果的な学習サイクル</h2>' +
      '<svg class="method-cycle" viewBox="0 0 300 150" aria-hidden="true">' +
      '<path d="M95 40 A60 60 0 0 1 205 40" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="6 6" marker-end="url(#ah)"/>' +
      '<path d="M205 110 A60 60 0 0 1 95 110" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="6 6" marker-end="url(#ah)"/>' +
      '<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="currentColor"/></marker></defs>' +
      '<g class="method-cycle__node"><circle cx="62" cy="75" r="46"/><text x="62" y="70">基礎学習</text><text x="62" y="92" class="sub">で覚える</text></g>' +
      '<g class="method-cycle__node is-b"><circle cx="238" cy="75" r="46"/><text x="238" y="70">基礎問題</text><text x="238" y="92" class="sub">で思い出す</text></g>' +
      "</svg></section>" +
      '<ol class="msteps">' +
      step(1, "基礎学習をサクッと1周", ["まずは用語と意味を確認。最初から完璧に覚える必要はありません。"], mockCards) +
      step(2, "基礎問題に挑戦", ["学んだ内容をすぐに思い出す練習をします。", "基礎問題は、過去問のように難しく考え込むのではなく、学んだ用語や説明をスムーズに思い出せるように作られています。"], mockQuiz) +
      step(3, "基礎学習をもう1周", ["問題で思い出せなかった用語や、あいまいだった部分を確認します。"], mockRead) +
      step(4, "もう一度、基礎問題に挑戦", ["繰り返し思い出すことで、知識を定着させていきます。"], mockAgain) +
      step(5, "過去問で腕試し！", ["基礎問題を終えたら、結果の画面から同じ科目の過去問（第34〜38回）を選んで、本番の問題で力を確かめましょう。", "解けなかった問題は解説を読み、基礎学習に戻って確認します。"], mockPast) +
      "</ol>" +
      '<section class="panel method-point"><p class="method-point__title">基礎学習で覚える。基礎問題で思い出す。</p>' +
      "<p>知識は、ただ読むだけでなく、自分で思い出す練習を繰り返すことが大切です。慣れてきたら、翌日や数日後にも復習してみましょう。</p></section>" +
      '<section class="panel method-stat">' +
      '<p class="method-stat__lead">思い出す練習で、記憶に差がつく！</p>' +
      '<p class="method-stat__big">約<b>2.4</b>倍<span aria-hidden="true">💪</span></p>' +
      '<p class="method-stat__cap">1週間後に思い出せた割合</p>' +
      '<div class="method-bars">' +
      '<div class="method-bars__row"><span class="method-bars__label">繰り返し思い出す練習</span><span class="method-bars__bar is-a" style="width:80%"></span><b>80%</b></div>' +
      '<div class="method-bars__row"><span class="method-bars__label">1回思い出せたら終わり</span><span class="method-bars__bar" style="width:33%"></span><b>33%</b></div>' +
      "</div>" +
      "<p>33%に対して80%。くり返し思い出す練習をしたほうが、約2.4倍の正答率でした。</p>" +
      '<p class="method-stat__src">出典：Karpicke & Roediger (2008), The Critical Importance of Retrieval for Learning.（Science）大学生が外国語の単語を覚えた、特定の実験条件での結果です。</p>' +
      "</section>" +
      '<div class="btn-row method-actions">' +
      '<button class="btn btn--primary" data-action="open-fields" data-ctx="study">' + icon("grid") + "基礎学習へ</button>" +
      '<button class="btn btn--ghost" data-action="open-fields" data-ctx="quiz">' + icon("quiz") + "基礎問題へ</button></div>" +
      "</main>"
    );
  }

  /* ---------------- ショップ（買い切りの購入をまとめた画面） ---------------- */
  var shopMsg = "";
  function shopButton() {
    if (owns("premium")) return "";
    return '<button class="shop-btn" data-action="open-shop" aria-label="ショップ">' + icon("bag") + '<span class="shop-btn__label">ショップ</span></button>';
  }
  function purchaseSummary() {
    if (owns("premium")) return "プレミアム：購入済み（すべての機能が使えます）";
    var parts = [];
    parts.push("オリジナル問題：" + (owns("originals") ? "購入済み" : "お試し 残り" + trialLeft() + "問"));
    parts.push("マイ教科書：" + (owns("mine") ? "無制限（購入済み）" : Store.countPicked(allTermIds()) + " / " + MINE_FREE + "語（無料）"));
    parts.push("広告：" + (owns("adFree") ? "非表示（購入済み）" : "表示あり"));
    return parts.join("<br>");
  }
  /** ショップを開く。reason はどこから来たか（originals・mine・ads） */
  function openShop(reason) {
    var back = view;
    if (!back || back.name === "quiz" || back.name === "shop") back = back && back.name === "shop" ? back.back : { name: "exams" };
    quiz = null;
    shopMsg = "";
    closeSheet(true);
    go({ name: "shop", reason: reason || "", back: back });
  }
  function renderShop() {
    var reason = {
      originals: trialLeft() > 0
        ? "オリジナル問題は無料で" + FREE_TRIAL + "問まで試せます（残り" + trialLeft() + "問）。"
        : "オリジナル問題の無料お試し（" + FREE_TRIAL + "問）を使い切りました。",
      mine: "マイ教科書に無料で入れられるのは" + MINE_FREE + "語までです。",
    }[view.reason] || "";
    var item = function (key, title, lead, points, primary) {
      var owned = owns(key);
      var price = priceOf(key);
      var btn = owned
        ? '<p class="shop__owned">' + icon("check") + "購入済み</p>"
        : canBuy()
        ? '<button class="btn ' + (primary ? "btn--primary" : "btn--ghost") + '" data-action="shop-buy" data-key="' + key + '">' +
          (price ? price + "で" : "") + "購入する（買い切り）</button>"
        : "";
      return '<section class="panel shop__item' + (primary ? " shop__item--main" : "") + '">' +
        (primary ? '<p class="shop__badge">' + icon("crown") + "おすすめ</p>" : "") +
        '<h2 class="shop__title">' + esc(title) + "</h2>" +
        '<p class="shop__lead">' + esc(lead) + "</p>" +
        '<ul class="paywall__list">' + points.map(function (p) {
          return '<li><span class="paywall__check">' + icon("check") + "</span><span><b>" + esc(p[0]) + "</b>" + esc(p[1]) + "</span></li>";
        }).join("") + "</ul>" + btn + "</section>";
    };
    return (
      topbar("キソマナ", "ショップ", "shop-back") +
      '<main class="content">' +
      (reason ? '<p class="shop__reason">' + icon("info") + "<span>" + esc(reason) + "</span></p>" : "") +
      item("premium", "プレミアム", "オリジナル問題・マイ教科書・広告なしが、すべてそろうセット。", [
        ["オリジナル問題がすべて解ける", "本試験と同じ125問構成。事例問題も収録し、正解した問題は新しい問題に入れ替わる"],
        ["マイ教科書が無制限", "無料は" + MINE_FREE + "語まで。好きなだけ用語を集めて、自分だけの1冊に"],
        ["広告なし", "学習の区切りに出る広告が表示されなくなる"],
      ], true) +
      item("adFree", "広告なし", "広告だけを非表示にします。", [
        ["広告が出なくなる", "問題の結果画面などに出る広告が表示されなくなる"],
      ], false) +
      (canBuy()
        ? '<button class="btn btn--text shop__restore" data-action="restore-purchases">購入を復元</button>'
        : '<p class="hint">' + icon("info") + "<span>購入は、ストア版のアプリ（App Store・Google Play）でできます。</span></p>") +
      (shopMsg ? '<p class="set-msg" role="status">' + esc(shopMsg) + "</p>" : "") +
      '<p class="notice">どれも買い切りで、追加料金はかかりません。広告なしを購入済みの方も、プレミアムを購入すると残りの機能が使えるようになります。' +
      "基礎学習・基礎問題・過去問題（年度別・解説つき）・苦手傾向分析は、購入しなくてもすべて使えます。</p>" +
      "</main>"
    );
  }

  /* ---------------- 用語の検索 ---------------- */
  // 言い換え・関連する言葉。キーワード（keys）のどれかで探したら、terms の用語もあわせて出す
  var SEARCH_GROUPS = [
    { label: "看取り・終末期", keys: ["看取り", "みとり", "終末期", "ターミナル", "エンドオブライフ", "人生会議", "ACP", "エンゼルケア", "緩和ケア", "臨終", "最期"],
      terms: ["ターミナルケア", "アドバンス・ケア・プランニング", "死の受容の5段階", "死が近づいたときの変化", "グリーフケア", "デスカンファレンス", "死後の介護", "死の三徴候", "尊厳死", "モルヒネの副作用"] },
    { label: "床ずれ", keys: ["床ずれ", "とこずれ", "褥瘡", "じょくそう", "除圧"], terms: ["褥瘡", "体位変換", "皮膚の構造"] },
    { label: "認知症の行動・心理症状（BPSD）", keys: ["BPSD", "行動心理症状", "周辺症状"],
      terms: ["徘徊", "物盗られ妄想", "幻覚", "夕暮れ症候群", "暴言・暴力", "介護への抵抗", "抑うつ", "異食", "アパシー", "帰宅願望への対応", "物盗られ妄想への対応"] },
    { label: "認知症の中核症状", keys: ["中核症状"], terms: ["記憶障害", "見当識障害", "理解・判断力の障害", "実行機能障害", "注意障害", "失語", "失行", "失認"] },
    { label: "誤嚥・むせ", keys: ["誤嚥", "ごえん", "むせ", "嚥下", "えんげ", "飲み込み", "誤嚥性肺炎", "窒息"],
      terms: ["誤嚥", "嚥下障害のある人の食事", "摂食・嚥下の5分類", "食事の姿勢", "高齢者の肺炎", "口腔ケア", "窒息のサイン"] },
    { label: "感染対策", keys: ["感染", "標準予防策", "スタンダードプリコーション", "消毒", "食中毒"],
      terms: ["スタンダードプリコーション", "手洗い", "ノロウイルス", "インフルエンザ", "結核", "疥癬", "MRSA", "レジオネラ菌", "清潔と滅菌", "食中毒予防の3原則"] },
    { label: "虐待・身体拘束", keys: ["虐待", "身体拘束", "拘束", "抑制"],
      terms: ["高齢者虐待防止法", "虐待の通報", "養護者による虐待の傾向", "障害者虐待防止法", "DV防止法", "身体拘束の禁止", "身体拘束の具体例"] },
    { label: "ケアマネジャー", keys: ["ケアマネ", "ケアマネジャー", "ケアマネージャー"], terms: ["介護支援専門員", "ケアプラン", "サービス担当者会議"] },
    { label: "排泄・失禁", keys: ["排泄", "はいせつ", "失禁", "トイレ", "おむつ", "便秘", "尿"],
      terms: ["機能性尿失禁", "腹圧性尿失禁", "切迫性尿失禁", "溢流性尿失禁", "排泄の姿勢", "ポータブルトイレ", "おむつ交換", "便秘の予防", "便秘の種類", "排尿のしくみ"] },
    { label: "入浴", keys: ["入浴", "お風呂", "おふろ", "風呂"], terms: ["入浴の注意", "ヒートショック", "片麻痺のある人の入浴", "シャワー浴", "入浴の作用", "入浴用の福祉用具", "足浴", "洗髪", "清拭"] },
    { label: "睡眠", keys: ["睡眠", "眠れない", "不眠", "眠り"], terms: ["安眠への支援", "概日リズム", "睡眠薬を飲んでいる人への注意", "高齢者の睡眠の特徴", "レム睡眠・ノンレム睡眠", "睡眠障害の種類"] },
    { label: "災害への備え", keys: ["災害", "防災", "避難", "地震", "BCP"], terms: ["BCP", "福祉避難所", "警戒レベル", "要配慮者への情報伝達"] },
    { label: "たんの吸引", keys: ["吸引", "たん", "痰", "喀痰"], terms: ["喀痰吸引等を行う介護福祉士", "喀痰吸引の範囲", "吸引の時間", "吸引圧", "吸引前後の観察", "痰の性状", "吸引中の異常", "気管カニューレ内の吸引"] },
    { label: "胃ろう・経管栄養", keys: ["胃ろう", "胃瘻", "いろう", "経管栄養", "PEG"], terms: ["経管栄養の種類", "胃ろうのスキンケア", "胃ろう・ストーマのある人の入浴", "半固形栄養剤", "経管栄養の姿勢", "注入速度"] },
    { label: "記録", keys: ["記録", "きろく", "日誌"], terms: ["介護記録", "SOAP", "記録の訂正", "記録の管理", "主観的情報・客観的情報"] },
    { label: "報連相", keys: ["報連相", "ほうれんそう", "報告"], terms: ["報告・連絡・相談", "報告のしかた"] },
    { label: "急変時の対応", keys: ["急変", "救急", "救命", "心停止", "意識がない"], terms: ["心肺蘇生", "AED", "気道確保", "窒息のサイン", "バイタルサイン"] },
    { label: "脳卒中", keys: ["脳卒中", "脳梗塞", "脳出血", "片麻痺"], terms: ["脳血管障害", "血管性認知症", "片麻痺のある人の食事介助", "片麻痺のある人の入浴", "脱健着患", "半側空間無視", "高次脳機能障害"] },
    { label: "ハラスメント", keys: ["ハラスメント", "カスハラ", "セクハラ"], terms: ["利用者・家族からのハラスメント"] },
    { label: "燃え尽き・ストレス", keys: ["燃え尽き", "ストレス"], terms: ["バーンアウト", "ストレスチェック制度", "ストレスへの対処", "ストレッサー"] },
    { label: "権利擁護", keys: ["権利擁護", "代弁"], terms: ["アドボカシー", "成年後見制度", "日常生活自立支援事業"] },
    { label: "家族・介護者の支援", keys: ["家族支援", "介護者支援", "介護疲れ", "家族"], terms: ["レスパイトケア", "家族の心理的ステップ", "ヤングケアラー", "老老介護", "介護休業"] },
    { label: "転倒・骨折", keys: ["転倒", "骨折", "転ぶ"], terms: ["大腿骨頸部骨折", "骨粗鬆症", "杖歩行", "歩行器の種類", "フレイル", "サルコペニア"] },
    { label: "口と歯", keys: ["口腔", "こうくう", "歯", "入れ歯", "義歯"], terms: ["口腔ケア", "口腔ケアの方法", "義歯の扱い", "歯周病", "経管栄養の人の口腔ケア"] },
    { label: "会議", keys: ["会議", "カンファレンス"], terms: ["サービス担当者会議", "地域ケア会議", "カンファレンス", "デスカンファレンス"] },
    { label: "薬", keys: ["薬", "くすり", "服薬", "副作用"], terms: ["服薬の介助", "高齢者と薬", "睡眠薬を飲んでいる人への注意", "抗精神病薬の副作用", "坐薬の挿入", "モルヒネの副作用"] },
    { label: "移乗・移動", keys: ["移乗", "トランスファー", "移動", "車いす", "車椅子"], terms: ["車いすへの移乗", "ボディメカニクス", "ノーリフティングケア", "立ち上がりの介助", "車いすの操作", "車いすの安全"] },
  ];
  var SEARCH_SUGGEST = ["看取り", "褥瘡", "誤嚥", "感染対策", "BPSD", "身体拘束", "記録", "急変"];

  /** 検索用に文字をそろえる（全角・半角、カタカナ→ひらがな、大文字・小文字、記号の違いを吸収） */
  function normSearch(text) {
    return String(text || "").normalize("NFKC").toLowerCase()
      .replace(/[ァ-ヶ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0x60); })
      .replace(/[\s・･\-‐－―、。，．,.()（）「」『』]/g, "");
  }
  var searchIndex = null;
  function buildSearchIndex() {
    if (searchIndex) return searchIndex;
    var byName = {};
    searchIndex = [];
    DATA.fields.forEach(function (f) {
      f.themes.forEach(function (th) {
        th.pages.forEach(function (pg) {
          pg.terms.forEach(function (t) {
            var body = [t.definition, t.point, t.example, t.person, t.profile].filter(Boolean).join(" ");
            var e = {
              id: t.id, t: t, field: f, theme: th,
              name: normSearch(t.term),
              read: normSearch((t.reading || "") + " " + (Furi ? Furi.reading(t.term) : "")),
              where: normSearch(th.name + " " + pg.title),
              body: normSearch(body),
              bodyRead: Furi ? normSearch(Furi.reading(body)) : "",
            };
            searchIndex.push(e);
            (byName[t.term] = byName[t.term] || []).push(e);
          });
        });
      });
    });
    searchIndex.byName = byName;
    return searchIndex;
  }
  function searchTerms(q) {
    var idx = buildSearchIndex();
    var tokens = String(q || "").split(/[\s　]+/).map(normSearch).filter(Boolean);
    if (!tokens.length) return { hits: [], groups: [] };
    var related = {}, groups = [];
    SEARCH_GROUPS.forEach(function (g) {
      var hit = tokens.some(function (tk) {
        return g.keys.some(function (k) { var nk = normSearch(k); return nk === tk || (tk.length >= 2 && nk.indexOf(tk) === 0) || (nk.length >= 2 && tk.indexOf(nk) !== -1); });
      });
      if (!hit) return;
      groups.push(g.label);
      g.terms.forEach(function (name) { (idx.byName[name] || []).forEach(function (e) { related[e.id] = true; }); });
    });
    var hits = [];
    idx.forEach(function (e) {
      var score = 0;
      for (var i = 0; i < tokens.length; i++) {
        var tk = tokens[i], s = 0;
        if (e.name === tk) s = 100;
        else if (e.name.indexOf(tk) === 0) s = 85;
        else if (e.name.indexOf(tk) !== -1) s = 70;
        else if (e.read.indexOf(tk) !== -1) s = 60;
        else if (e.where.indexOf(tk) !== -1) s = 35;
        else if (e.body.indexOf(tk) !== -1) s = 25;
        else if (tk.length >= 2 && e.bodyRead.indexOf(tk) !== -1) s = 20;
        if (!s && !related[e.id]) { score = 0; break; }
        score += s;
      }
      if (related[e.id]) score = Math.max(score, 45);
      if (score) hits.push({ e: e, score: score });
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    return { hits: hits, groups: groups };
  }
  /** 入力した言葉を、表示する文の中で目立たせる */
  function markSearch(text, q) {
    var html = esc(text);
    String(q || "").split(/[\s　]+/).filter(function (w) { return w.length >= 1; }).forEach(function (w) {
      var ew = esc(w).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      html = html.replace(new RegExp(ew, "gi"), function (m) { return "<mark>" + m + "</mark>"; });
    });
    return html;
  }
  function searchResultsHtml() {
    var q = view.q || "";
    if (!normSearch(q)) {
      return '<p class="search__hint">用語の名前だけでなく、説明の中の言葉や、ひらがなでも探せます。</p>' +
        '<p class="search__label">よく調べられる言葉</p><div class="search__chips">' +
        SEARCH_SUGGEST.map(function (w) { return '<button class="search__chip" data-action="search-set" data-q="' + esc(w) + '">' + esc(w) + "</button>"; }).join("") + "</div>";
    }
    var r = searchTerms(q);
    if (!r.hits.length) {
      return '<p class="search__empty">「' + esc(q) + "」に当てはまる用語は見つかりませんでした。<br>言い方を変えるか、短い言葉で探してみてください。</p>";
    }
    var list = r.hits.slice(0, 80).map(function (h) {
      var t = h.e.t;
      return '<button class="sres" data-action="search-open" data-id="' + esc(t.id) + '">' +
        '<span class="sres__where">' + esc(h.e.field.name) + " ・ " + esc(h.e.theme.name) + "</span>" +
        '<span class="sres__term">' + markSearch(t.term, q) + (t.reading ? '<small class="no-furi">' + esc(t.reading) + "</small>" : "") + "</span>" +
        '<span class="sres__def">' + markSearch(t.definition, q) + "</span>" +
        "</button>";
    }).join("");
    return '<p class="search__count">' + r.hits.length + "件" +
      (r.groups.length ? '<span class="search__rel">関連する言葉も表示しています（' + esc(r.groups.join("、")) + "）</span>" : "") + "</p>" +
      '<div class="sres-list">' + list + "</div>";
  }
  function renderSearch() {
    return (
      topbar("キソマナ", "用語をさがす", "home") +
      '<main class="content content--search">' +
      '<div class="search__box">' + icon("search") +
      '<input class="search__input" type="search" enterkeyhint="search" autocomplete="off" placeholder="例：看取り、じょくそう、ケアマネ" aria-label="用語をさがす" value="' + esc(view.q || "") + '">' +
      '<button class="search__clear" data-action="search-clear" aria-label="入力を消す"' + (view.q ? "" : " hidden") + ">" + icon("close") + "</button></div>" +
      '<div class="search__results" aria-live="polite">' + searchResultsHtml() + "</div>" +
      '<p class="search__note">試験対策用の要点です。実務では、最新の公式資料や職場の手順もあわせて確認してください。</p>' +
      "</main>"
    );
  }
  function updateSearchResults() {
    var box = $app.querySelector(".search__results");
    if (!box) return;
    box.innerHTML = searchResultsHtml();
    if (furiOn()) Furi.apply(box);
    var clr = $app.querySelector(".search__clear");
    if (clr) clr.hidden = !view.q;
  }
  function focusSearch() {
    var inp = $app.querySelector(".search__input");
    if (inp) { inp.focus({ preventScroll: true }); var n = inp.value.length; try { inp.setSelectionRange(n, n); } catch (e) { /* type=search で使えない環境 */ } }
  }
  $app.addEventListener("input", function (e) {
    if (!e.target.classList || !e.target.classList.contains("search__input")) return;
    view.q = e.target.value;
    updateSearchResults();
  });
  $app.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.classList && e.target.classList.contains("search__input") && !e.isComposing) e.target.blur();
  });

  /* ---------------- 描画 ---------------- */
  function render() {
    openSwipeEl = null;
    var html;
    switch (view.name) {
      case "fields": html = renderFields(); break;
      case "themes": html = renderThemes(); break;
      case "study": html = renderStudy(); break;
      case "complete": html = renderComplete(); break;
      case "quiz": html = renderQuiz(); break;
      case "review": html = renderReview(); break;
      case "exams": html = renderExams(); break;
      case "pastYear": html = renderPastYear(); break;
      case "pastSheet": html = renderPastSheet(); break;
      case "pastExplain": html = renderPastExplain(); break;
      case "analysis": html = renderAnalysis(); break;
      case "settings": html = renderSettings(); break;
      case "paywall": view = { name: "shop", reason: "originals", back: { name: "exams" } }; html = renderShop(); break;
      case "shop": html = renderShop(); break;
      case "method": html = renderMethod(); break;
      case "search": html = renderSearch(); break;
      default: html = renderHome();
    }
    $app.innerHTML = html;
    document.body.classList.toggle("is-furi", furiOn());
    if (furiOn()) Furi.apply($app);
    fitAll();
    justChecked = null;
  }

  /* ---------------- 操作 ---------------- */
  var actions = {
    "toggle-furi": function () {
      Store.setPref("furigana", !furiOn());
      if (!furiOn()) Furi.strip($sheet); else Furi.apply($sheet);
      var y = window.scrollY;
      render();
      window.scrollTo(0, y);
    },
    home: function () { go({ name: "home" }); },
    "open-search": function () { go({ name: "search", q: "" }); focusSearch(); },
    "back-search": function () { go({ name: "search", q: (view.fromSearch || "").trim() }); },
    "search-set": function (el) { view.q = el.dataset.q; var inp = $app.querySelector(".search__input"); if (inp) inp.value = view.q; updateSearchResults(); },
    "search-clear": function () { view.q = ""; var inp = $app.querySelector(".search__input"); if (inp) inp.value = ""; updateSearchResults(); focusSearch(); },
    "search-open": function (el) { var inp = $app.querySelector(".search__input"); if (inp) inp.blur(); openSheet(el.dataset.id, el); },
    "search-open-study": function () {
      var id = openTermId, entry = termById[id];
      if (!entry) return;
      var q = view.q || "";
      Store.setLast(entry.theme.id, entry.pageIndex);
      go({ name: "study", themeId: entry.theme.id, pageIndex: entry.pageIndex, fromSearch: q || " " });
      setTimeout(function () {
        var item = $app.querySelector('.rs-item[data-id="' + id.replace(/"/g, '\\"') + '"]');
        if (!item) return;
        item.scrollIntoView({ block: "center" });
        item.classList.add("is-found");
      }, 30);
    },
    "open-fields": function (el) { go({ name: "fields", ctx: el.dataset.ctx }); },
    fields: function () { go({ name: "fields", ctx: view.ctx || "study" }); },
    "open-field": function (el) { go({ name: "themes", fieldId: el.dataset.id, ctx: view.ctx }); },
    "open-quiz": function (el) { startQuiz(el.dataset.id); },
    "quiz-dir": function (el) {
      quiz.dir = el.dataset.dir;
      quiz.items = buildItems(quiz.termIds, quiz.dir);
      render();
      window.scrollTo(0, 0);
    },
    "quiz-answer": function (el) {
      var item = quiz.items[quiz.index];
      if (item.chosen !== null) return;
      item.chosen = parseInt(el.dataset.index, 10);
      if (item.kind === "exam") Store.recordExam(item.qid, itemCorrect(item));
      else Store.recordAnswer(item.termId, itemCorrect(item), item.dir);
      render();
      // 解説が下部のボタンに隠れないよう、見える位置までスクロール
      var fb = $app.querySelector(".q-feedback");
      var dock = $app.querySelector(".dock");
      if (fb) {
        var limit = window.innerHeight - (dock ? dock.offsetHeight : 0) - 12;
        var over = fb.getBoundingClientRect().bottom - limit;
        if (over > 0) window.scrollBy(0, over);
      }
    },
    "quiz-next": function () {
      quiz.index++;
      if (quiz.index >= quiz.items.length) maybeShowAd();
      render();
      window.scrollTo(0, 0);
    },
    "quiz-quit": function () {
      var q = quiz;
      quiz = null;
      if (q.kind === "theme") go({ name: "themes", fieldId: fieldOfTheme[q.themeId].id, ctx: "quiz" });
      else if (q.kind === "exam" && q.back !== "review") go({ name: "exams" });
      else go({ name: "review" });
    },
    "quiz-retry-wrong": function () {
      var wrong = quiz.items.filter(function (it) { return !itemCorrect(it); });
      if (quiz.kind === "exam") {
        var qids = wrong.map(function (it) { return it.qid; });
        quiz = Object.assign({}, quiz, { qids: qids, index: 0, items: buildExamItems(qids) });
      } else {
        var ids = wrong.map(function (it) { return it.termId; });
        quiz = Object.assign({}, quiz, { termIds: ids, index: 0, saved: false, full: false, items: buildItems(ids, quiz.dir) });
      }
      render();
      window.scrollTo(0, 0);
    },
    "quiz-again": function () {
      if (quiz.kind === "exam") {
        quiz = Object.assign({}, quiz, { index: 0, items: buildExamItems(quiz.qids) });
        render();
        window.scrollTo(0, 0);
        return;
      }
      var ids = themeTermIds(themeById[quiz.themeId]);
      quiz = Object.assign({}, quiz, { termIds: ids, index: 0, saved: false, full: true, items: buildItems(ids, quiz.dir) });
      render();
      window.scrollTo(0, 0);
    },
    "open-theme": function (el) { startTheme(el.dataset.id); },
    resume: function () {
      var last = Store.getLast();
      if (!last || !themeById[last.themeId]) return;
      var t = themeById[last.themeId];
      var ids = themeTermIds(t);
      // 全て確認済みなら最初のページから見直す
      startTheme(t.id, Store.countChecked(ids) === ids.length ? 0 : last.pageIndex);
    },
    "back-themes": function () {
      var ctx = view.name === "quiz" ? "quiz" : view.mine ? "mine" : "study";
      var themeId = view.name === "quiz" && quiz ? quiz.themeId : view.themeId;
      if (ctx === "quiz") quiz = null;
      go({ name: "themes", fieldId: fieldOfTheme[themeId].id, ctx: ctx });
    },
    "back-review": function () { quiz = null; go({ name: "review" }); },
    "open-settings": function () { settingsMsg = ""; go({ name: "settings" }); },
    "show-intro": function () { showIntro(false); },
    "backup-download": function () {
      var text = Store.exportData();
      var name = "matome-anki-backup-" + new Date().toISOString().slice(0, 10) + ".json";
      var N = window.KaigoNative;
      if (N && N.saveFile) { N.saveFile(name, text); setMsg("保存しました。"); return; }
      try {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
        a.download = name;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
        setMsg("ファイル（" + name + "）を保存しました。保存できない場合は「コピー」を使ってください。");
      } catch (e) {
        setMsg("ファイルに保存できませんでした。「コピー」を使ってください。");
      }
    },
    "backup-copy": function () {
      var text = Store.exportData();
      var done = function () { setMsg("記録をコピーしました。メモアプリなどに貼り付けて保管してください。"); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else { fallbackCopy(text); done(); }
    },
    "backup-paste": function () {
      var el = document.getElementById("restore-text");
      if (!el || !el.value.trim()) { setMsg("貼り付け欄が空です。"); return; }
      restoreFrom(el.value);
    },
    "ad-purchase": function () {
      buy("adFree").then(function (ok) { if (ok) setMsg("購入が完了しました。広告は表示されません。"); });
    },
    "ad-restore": function () {
      restorePurchases().then(function (got) {
        setMsg(got.length ? "購入を復元しました。" : "復元できる購入が見つかりませんでした。");
      });
    },
    "open-paywall": function () { openShop("originals"); },
    "open-shop": function () { openShop(""); },
    "open-method": function () { go({ name: "method" }); window.scrollTo(0, 0); },
    "set-theme": function (el) { Store.setPref("theme", el.dataset.id); applyTheme(); var y = window.scrollY; render(); window.scrollTo(0, y); },
    "analysis-src": function (el) { Store.setPref("analysisSrc", el.dataset.src); render(); window.scrollTo(0, 0); },
    "analysis-open-exams": function (el) { Store.setPref("examTab", el.dataset.tab); go({ name: "exams" }); },
    "analysis-study-field": function (el) { go({ name: "themes", fieldId: el.dataset.id, ctx: "study" }); },
    "open-mine-shop": function () { openShop("mine"); },
    "shop-back": function () { var b = view.back || { name: "home" }; go(b); },
    "shop-buy": function (el) {
      var key = el.dataset.key;
      buy(key).then(function (ok) {
        shopMsg = ok ? "購入が完了しました。ありがとうございます。" : "";
        render();
      });
    },
    "restore-purchases": function () {
      restorePurchases().then(function (got) {
        shopMsg = got.length ? "購入を復元しました。" : "復元できる購入が見つかりませんでした。";
        render();
      });
    },
    "back-exams": function () { quiz = null; go({ name: "exams" }); },
    "open-exams": function () { go({ name: "exams" }); },
    "exam-tab": function (el) { Store.setPref("examTab", el.dataset.tab); render(); },
    "open-past-wrong": function (el) {
      go({ name: "pastSheet", yearId: el.dataset.year, subjectIndex: parseInt(el.dataset.index, 10), from: "review" });
    },
    "open-past-year": function (el) { go({ name: "pastYear", yearId: el.dataset.id }); },
    "back-past-year": function () { go({ name: "pastYear", yearId: view.yearId }); },
    "open-past-sheet-at": function (el) {
      quiz = null;
      go({ name: "pastSheet", yearId: el.dataset.year, subjectIndex: parseInt(el.dataset.index, 10) });
      window.scrollTo(0, 0);
    },
    "open-past-sheet": function (el) {
      go({ name: "pastSheet", yearId: view.yearId, subjectIndex: parseInt(el.dataset.index, 10) });
    },
    "open-past-explain": function () {
      go({ name: "pastExplain", yearId: view.yearId, subjectIndex: view.subjectIndex, from: view.from });
    },
    "back-past-sheet": function () {
      go({ name: "pastSheet", yearId: view.yearId, subjectIndex: view.subjectIndex, from: view.from });
    },
    "past-mark": function (el) {
      Store.setPastAnswer(view.yearId, parseInt(el.dataset.q, 10), parseInt(el.dataset.k, 10));
      var y = window.scrollY;
      render();
      window.scrollTo(0, y);
    },
    "past-grade": function () {
      Store.gradePast(view.yearId, view.subjectIndex);
      maybeShowAd();
      render();
      window.scrollTo(0, 0);
    },
    "past-reset": function () {
      var s = pastById[view.yearId].subjects[view.subjectIndex];
      Store.resetPast(view.yearId, view.subjectIndex, s.from, s.to);
      render();
      window.scrollTo(0, 0);
    },
    "exam-field": function (el) { startPractice(el.dataset.id); },
    "exam-next": function () { startPractice("all"); },
    "practice-next": function () { startPractice(quiz && quiz.practice ? quiz.practice : "all"); },
    "review-exam-field": function (el) {
      var f = fieldById[el.dataset.id];
      startExam(wrongExamIds(examIdsOf(f.id)), f.name, "過去に間違えた問題", "review");
    },
    "goto-page": function (el) {
      var pi = parseInt(el.dataset.page, 10);
      if (view.mine) { go({ name: "study", themeId: view.themeId, pageIndex: pi, mine: true }); return; }
      Store.setLast(view.themeId, pi);
      go({ name: "study", themeId: view.themeId, pageIndex: pi });
    },
    "open-mine": function () { go({ name: "fields", ctx: "mine" }); },
    "open-mine-theme": function (el) { go({ name: "study", themeId: el.dataset.id, pageIndex: 0, mine: true }); },
    "toggle-pick": function () {
      var id = openTermId;
      if (!canPick(id)) { openShop("mine"); return; }
      Store.setPicked(id, !Store.isPicked(id));
      if (view.mine && !Store.isPicked(id)) {
        closeSheet(true);
        normalizeMineView();
        render();
        return;
      }
      renderSheet();
      var y = window.scrollY;
      render();
      window.scrollTo(0, y);
    },
    "ask-pick": function (el) { closeSwipe(); openPickConfirm(el.dataset.id); },
    "pick-cancel": function () { closeSheet(true); },
    "pick-confirm": function () {
      var id = pickConfirmId;
      if (!canPick(id)) { openShop("mine"); return; }
      Store.setPicked(id, !Store.isPicked(id));
      closeSheet(true);
      normalizeMineView();
      var y = window.scrollY;
      render();
      window.scrollTo(0, y);
    },
    "toggle-check": function (el) {
      var id = el.dataset.id;
      Store.setChecked(id, !Store.isChecked(id));
      var y = window.scrollY;
      render();
      window.scrollTo(0, y);
    },
    "open-review": function () { go({ name: "review" }); },
    "open-analysis": function () { go({ name: "analysis" }); },
    "review-mode": function (el) { Store.setPref("reviewMode", el.dataset.mode); render(); },
    "review-theme": function (el) {
      var t = themeById[el.dataset.id];
      startReviewQuiz(wrongTermIds(themeTermIds(t)), t.name, "過去に間違えた問題");
    },
    "review-theme-ever": function (el) {
      var t = themeById[el.dataset.id];
      var answers = Store.getAnswers();
      var ids = themeTermIds(t).filter(function (id) { return answers[id] && answers[id].wrong > 0; });
      startReviewQuiz(ids, t.name, "苦手傾向分析");
    },
    "review-field": function (el) {
      var f = fieldById[el.dataset.id];
      startReviewQuiz(wrongTermIds(fieldTermIds(f)), f.name, "過去に間違えた問題");
    },
    "review-all": function () {
      startReviewQuiz(wrongTermIds(allTermIds()), "すべての間違えた問題", "過去に間違えた問題");
    },
    "open-term": function (el) { openSheet(el.dataset.id, el); },
    mode: function (el) {
      Store.setPref("studyMode", el.dataset.mode);
      render();
    },
    "close-sheet": function () { closeSheet(); },
    check: function () {
      var id = openTermId;
      Store.setChecked(id, true);
      justChecked = id;
      closeSheet(true);
      render();
      var card = $app.querySelector('[data-action="open-term"][data-id="' + id + '"]');
      if (card) card.focus({ preventScroll: true });
    },
    uncheck: function () {
      var id = openTermId;
      Store.setChecked(id, false);
      closeSheet(true);
      render();
      var card = $app.querySelector('[data-action="open-term"][data-id="' + id + '"]');
      if (card) card.focus({ preventScroll: true });
    },
    "next-page": function () {
      var theme = themeById[view.themeId];
      if (view.mine) { go({ name: "study", themeId: theme.id, pageIndex: view.pageIndex + 1, mine: true }); return; }
      if (view.pageIndex < theme.pages.length - 1) {
        var pi = view.pageIndex + 1;
        Store.setLast(theme.id, pi);
        go({ name: "study", themeId: theme.id, pageIndex: pi });
      } else {
        Store.completeTheme(theme.id);
        maybeShowAd();
        go({ name: "complete", themeId: theme.id });
      }
    },
    restart: function () {
      var theme = themeById[view.themeId];
      Store.resetTheme(theme.id, themeTermIds(theme));
      startTheme(theme.id, 0);
    },
  };

  /* 説明つきで読む：用語を右にスライドしてピンを出す */
  var SWIPE_W = 72;
  var swipe = null, openSwipeEl = null, suppressClickUntil = 0;
  function setSlide(item, x, animate) {
    var slide = item.querySelector(".rs-item__slide");
    if (!slide) return;
    slide.style.transition = animate ? "transform .18s ease" : "none";
    slide.style.transform = x ? "translateX(" + x + "px)" : "";
  }
  function closeSwipe() {
    if (openSwipeEl) { setSlide(openSwipeEl, 0, true); openSwipeEl.classList.remove("is-swiped"); openSwipeEl = null; }
  }
  $app.addEventListener("pointerdown", function (e) {
    var item = e.target.closest(".rs-item");
    if (openSwipeEl && openSwipeEl !== item) closeSwipe();
    if (!item || e.target.closest(".rs-item__pin")) { swipe = null; return; }
    swipe = { item: item, x: e.clientX, y: e.clientY, base: item === openSwipeEl ? SWIPE_W : 0, active: false };
  });
  $app.addEventListener("pointermove", function (e) {
    if (!swipe) return;
    var dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
    if (!swipe.active) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { swipe = null; return; }
      if (Math.abs(dx) < 10) return;
      swipe.active = true;
    }
    setSlide(swipe.item, Math.max(0, Math.min(SWIPE_W + 16, swipe.base + dx)), false);
  });
  function endSwipe(e) {
    if (!swipe) return;
    if (swipe.active) {
      var x = Math.max(0, swipe.base + (e.clientX - swipe.x));
      suppressClickUntil = Date.now() + 80; // スライドを離した直後のクリックだけ無視する
      if (x > SWIPE_W / 2) {
        setSlide(swipe.item, SWIPE_W, true);
        swipe.item.classList.add("is-swiped");
        openSwipeEl = swipe.item;
      } else {
        setSlide(swipe.item, 0, true);
        swipe.item.classList.remove("is-swiped");
        if (openSwipeEl === swipe.item) openSwipeEl = null;
      }
    }
    swipe = null;
  }
  $app.addEventListener("pointerup", endSwipe);
  $app.addEventListener("pointercancel", function () { if (swipe) { setSlide(swipe.item, swipe.base, true); swipe = null; } });

  function onClick(e) {
    if (Date.now() < suppressClickUntil && e.currentTarget === $app) { e.preventDefault(); return; }
    var el = e.target.closest("[data-action]");
    if (openSwipeEl && (!el || el.dataset.action !== "ask-pick")) { closeSwipe(); if (el && el.closest(".rs-item")) return; }
    if (!el || el.disabled) return;
    var fn = actions[el.dataset.action];
    if (fn) fn(el);
  }
  $app.addEventListener("click", onClick);
  $app.addEventListener("change", function (e) {
    if (e.target && e.target.id === "restore-file" && e.target.files && e.target.files[0]) {
      var reader = new FileReader();
      reader.onload = function () { restoreFrom(reader.result); };
      reader.readAsText(e.target.files[0]);
    }
  });
  $sheet.addEventListener("click", onClick);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && openTermId) closeSheet();
  });

  render();
  // はじめて開いたときだけ、オープニングと使い方を表示する（自動テストのブラウザでは出さない。?intro=1 で確認用に表示）
  // 起動のたびにロゴのオープニングを出し、はじめての人にはそのあと使い方を表示する
  // （自動テストのブラウザでは出さない。?intro=1 で確認用に表示）
  var forceIntro = /[?&]intro=1/.test(location.search);
  if (forceIntro || !navigator.webdriver) {
    showSplash(function () { if (forceIntro || !Store.getPref("introSeen", false)) showIntro(true); });
  }
})();
