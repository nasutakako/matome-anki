/**
 * 学習進捗ストア（端末内の localStorage に保存）
 *
 * 将来のバックエンド移行・機能追加を想定し、画面からはこの API だけを使う。
 *   - checked:   用語ごとの「確認した」日時
 *   - themes:    テーマごとの完了日時・完了回数
 *   - last:      続きから学習するための位置
 *   - history:   学習イベントの記録（学習履歴・苦手分析の元データ）
 */
window.KaigoStore = (function () {
  var KEY = "kaigo-study.progress.v1";
  var HISTORY_LIMIT = 500;

  function empty() {
    return { version: 1, checked: {}, themes: {}, last: null, history: [] };
  }

  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return empty();
      var parsed = JSON.parse(raw);
      return Object.assign(empty(), parsed);
    } catch (e) {
      return empty();
    }
  }

  var state = read();

  function save() {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* 保存できない環境でもメモリ上で動作を続ける */
    }
  }

  function log(type, payload) {
    state.history.push(Object.assign({ type: type, at: Date.now() }, payload));
    if (state.history.length > HISTORY_LIMIT) {
      state.history.splice(0, state.history.length - HISTORY_LIMIT);
    }
  }

  return {
    /* ---------- バックアップ ---------- */
    /** 学習記録をまるごと文字列にする（ファイル保存・コピー用） */
    exportData: function () {
      return JSON.stringify({ app: "matome-anki", format: 1, exportedAt: new Date().toISOString(), data: state });
    },

    /** 書き出した文字列から学習記録を復元する。形式が違えば例外を投げる */
    importData: function (text) {
      var obj = JSON.parse(String(text).trim());
      if (!obj || obj.app !== "matome-anki" || !obj.data || typeof obj.data.checked !== "object") {
        throw new Error("format");
      }
      state = Object.assign(empty(), obj.data);
      save();
      return obj.exportedAt || null;
    },

    /* ---------- マイ教科書（ピックアップした用語） ---------- */
    isPicked: function (termId) {
      return Boolean(state.picks && state.picks[termId]);
    },

    setPicked: function (termId, value) {
      state.picks = state.picks || {};
      if (value) state.picks[termId] = Date.now();
      else delete state.picks[termId];
      log(value ? "term_picked" : "term_unpicked", { termId: termId });
      save();
    },

    countPicked: function (termIds) {
      var p = state.picks || {}, n = 0;
      for (var i = 0; i < termIds.length; i++) if (p[termIds[i]]) n++;
      return n;
    },

    isChecked: function (termId) {
      return Boolean(state.checked[termId]);
    },

    setChecked: function (termId, value) {
      if (value) state.checked[termId] = Date.now();
      else delete state.checked[termId];
      log(value ? "term_checked" : "term_unchecked", { termId: termId });
      save();
    },

    countChecked: function (termIds) {
      var n = 0;
      for (var i = 0; i < termIds.length; i++) if (state.checked[termIds[i]]) n++;
      return n;
    },

    completeTheme: function (themeId) {
      var t = state.themes[themeId] || { completedCount: 0 };
      t.completedAt = Date.now();
      t.completedCount = (t.completedCount || 0) + 1;
      state.themes[themeId] = t;
      log("theme_completed", { themeId: themeId });
      save();
    },

    isThemeCompleted: function (themeId) {
      return Boolean(state.themes[themeId] && state.themes[themeId].completedAt);
    },

    /** テーマの確認状態を消して最初から学習し直す（完了履歴は残す） */
    resetTheme: function (themeId, termIds) {
      termIds.forEach(function (id) {
        delete state.checked[id];
      });
      log("theme_reset", { themeId: themeId });
      save();
    },

    setLast: function (themeId, pageIndex) {
      state.last = { themeId: themeId, pageIndex: pageIndex, at: Date.now() };
      save();
    },

    getLast: function () {
      return state.last;
    },

    getCompletedCount: function (themeId) {
      return (state.themes[themeId] && state.themes[themeId].completedCount) || 0;
    },

    /* ---------- 基礎問題 ---------- */

    /** 1問ごとの解答を記録（苦手問題・正答率の元データ） */
    recordAnswer: function (termId, correct, dir) {
      state.answers = state.answers || {};
      var a = state.answers[termId] || { correct: 0, wrong: 0 };
      if (correct) a.correct++;
      else a.wrong++;
      a.last = correct;
      a.at = Date.now();
      if (dir) {
        a.dirs = a.dirs || {};
        var d = a.dirs[dir] || { c: 0, w: 0 };
        if (correct) d.c++;
        else d.w++;
        a.dirs[dir] = d;
      }
      state.answers[termId] = a;
      log("answer", { termId: termId, correct: correct, dir: dir });
      save();
    },

    /** 用語の集合について、解答済みの数と最後の解答が正解だった数 */
    answerStats: function (termIds) {
      var answers = state.answers || {};
      var answered = 0, correct = 0;
      termIds.forEach(function (id) {
        var a = answers[id];
        if (!a) return;
        answered++;
        if (a.last) correct++;
      });
      return { answered: answered, correct: correct };
    },

    /** 用語ID → { correct, wrong, last, at, dirs } */
    getAnswers: function () {
      return state.answers || {};
    },

    /* ---------- 年度別の本試験（マークシート） ---------- */
    getPast: function (yearId) {
      state.past = state.past || {};
      return state.past[yearId] || { answers: {}, graded: {} };
    },
    setPastAnswer: function (yearId, q, choice) {
      state.past = state.past || {};
      var p = state.past[yearId] || { answers: {}, graded: {} };
      p.answers[q] = choice;
      state.past[yearId] = p;
      save();
    },
    gradePast: function (yearId, subjectIndex) {
      state.past = state.past || {};
      var p = state.past[yearId] || { answers: {}, graded: {} };
      p.graded[subjectIndex] = Date.now();
      state.past[yearId] = p;
      log("past_graded", { year: yearId, subject: subjectIndex });
      save();
    },
    resetPast: function (yearId, subjectIndex, from, to) {
      state.past = state.past || {};
      var p = state.past[yearId];
      if (!p) return;
      for (var q = from; q <= to; q++) delete p.answers[q];
      delete p.graded[subjectIndex];
      save();
    },

    /* ---------- 過去問題 ---------- */
    recordExam: function (qid, correct) {
      state.exams = state.exams || {};
      var a = state.exams[qid] || { correct: 0, wrong: 0 };
      if (correct) a.correct++;
      else a.wrong++;
      a.last = correct;
      a.at = Date.now();
      if (correct) a.okAt = a.at; // 最後に正解した時刻（オリジナル問題の入れ替えに使う）
      state.exams[qid] = a;
      log("exam_answer", { qid: qid, correct: correct });
      save();
    },

    getExamAnswers: function () {
      return state.exams || {};
    },

    /** 問題の集合について、解いた数・最後の解答が正解だった数・延べの正誤 */
    examStats: function (qids) {
      var ex = state.exams || {};
      var answered = 0, correct = 0, c = 0, w = 0;
      qids.forEach(function (id) {
        var a = ex[id];
        if (!a) return;
        answered++;
        if (a.last) correct++;
        c += a.correct; w += a.wrong;
      });
      return { answered: answered, correct: correct, attempts: c + w, rate: c + w ? Math.round((c / (c + w)) * 100) : null };
    },

    saveQuizResult: function (themeId, score, total) {
      state.quiz = state.quiz || {};
      var q = state.quiz[themeId] || { count: 0, best: 0 };
      q.count++;
      q.last = score;
      q.total = total;
      q.best = Math.max(q.best || 0, Math.round((score / total) * 100));
      q.at = Date.now();
      state.quiz[themeId] = q;
      log("quiz_finished", { themeId: themeId, score: score, total: total });
      save();
    },

    getQuizResult: function (themeId) {
      return (state.quiz && state.quiz[themeId]) || null;
    },

    /** 表示モードなど、利用者ごとの設定 */
    getPref: function (key, fallback) {
      var prefs = state.prefs || {};
      return key in prefs ? prefs[key] : fallback;
    },

    setPref: function (key, value) {
      state.prefs = state.prefs || {};
      state.prefs[key] = value;
      save();
    },

    getHistory: function () {
      return state.history.slice();
    },
  };
})();
