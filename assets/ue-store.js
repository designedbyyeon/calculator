/* 언리미티드 에디션 — 판매 기록 + 재고 저장소 (브라우저 localStorage) */
window.Store = (function(){
  const REC_KEY   = 'ue-records-v1';
  const STOCK_KEY = 'ue-stock-v1';

  /* ── 판매 기록 ───────────────────────── */
  function read(){
    try {
      const raw = localStorage.getItem(REC_KEY);
      if (!raw) return { v:1, records:[] };
      const s = JSON.parse(raw);
      if (!s || !Array.isArray(s.records)) return { v:1, records:[] };
      return s;
    } catch(e){ return { v:1, records:[] }; }
  }
  function write(state){
    try { localStorage.setItem(REC_KEY, JSON.stringify(state)); return true; }
    catch(e){ return false; }
  }

  function dateKey(d){
    const p = n => String(n).padStart(2,'0');
    return d.getFullYear() + '-' + p(d.getMonth()+1) + '-' + p(d.getDate());
  }
  function timeKey(d){
    const p = n => String(n).padStart(2,'0');
    return p(d.getHours()) + ':' + p(d.getMinutes());
  }

  const PAY_LABEL = { cash:'현금', transfer:'계좌' };
  function payLabel(v){ return PAY_LABEL[v] || '미지정'; }

  function newId(){
    return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  }

  /* lines: [{id, qty}] — 판매 시점 단가를 함께 저장해 가격이 바뀌어도 과거 기록이 흔들리지 않게 합니다. */
  function add(lines, pay){
    const now = new Date();
    const rec = {
      id: newId(),
      date: dateKey(now),
      time: timeKey(now),
      ts: now.getTime(),
      pay: pay || '',
      lines: lines.map(l => ({
        id: l.id,
        qty: l.qty,
        pr: l.pr != null ? l.pr : ((window.CATALOG[l.id] || {}).pr || 0)
      }))
    };
    const s = read();
    s.records.push(rec);
    return write(s) ? rec : null;
  }

  function all(){ return read().records.slice().sort((a,b) => b.ts - a.ts); }

  function remove(id){
    const s = read();
    s.records = s.records.filter(r => r.id !== id);
    return write(s);
  }

  function clearAll(){ write({ v:1, records:[] }); }

  function recTotal(rec){ return rec.lines.reduce((n, l) => n + l.pr * l.qty, 0); }
  function recCount(rec){ return rec.lines.reduce((n, l) => n + l.qty, 0); }

  function summarize(records){
    const perItem = {}, perPay = { cash:0, transfer:0, none:0 };
    let total = 0, count = 0;
    records.forEach(r => {
      perPay[r.pay === 'cash' ? 'cash' : r.pay === 'transfer' ? 'transfer' : 'none'] += recTotal(r);
      r.lines.forEach(l => {
        if (!perItem[l.id]) perItem[l.id] = { id:l.id, qty:0, amt:0 };
        perItem[l.id].qty += l.qty;
        perItem[l.id].amt += l.pr * l.qty;
        total += l.pr * l.qty;
        count += l.qty;
      });
    });
    return { total, count, sales: records.length, perPay, perItem };
  }

  function todaySummary(){
    const today = dateKey(new Date());
    return summarize(all().filter(r => r.date === today));
  }
  function allSummary(){ return summarize(all()); }

  /* ── 재고 ────────────────────────────
   * stock[단품id] = { total: 총재고(숫자) | null, adj: 판매수 보정(숫자) }
   * 팔린 개수는 판매 기록에서 자동 집계하고, adj 로 손으로 보정합니다.
   * 세트는 구성 단품의 재고를 각각 차감합니다. */
  function readStock(){
    try {
      const raw = localStorage.getItem(STOCK_KEY);
      const s = raw ? JSON.parse(raw) : null;
      return (s && typeof s === 'object') ? s : {};
    } catch(e){ return {}; }
  }
  function writeStock(s){
    try { localStorage.setItem(STOCK_KEY, JSON.stringify(s)); return true; }
    catch(e){ return false; }
  }
  function setStock(id, patch){
    const s = readStock();
    s[id] = Object.assign({ total:null, adj:0 }, s[id], patch);
    return writeStock(s);
  }

  /* 판매 기록에서 단품 단위로 팔린 개수를 집계합니다. */
  function soldByPart(){
    const out = {};
    read().records.forEach(r => {
      r.lines.forEach(l => {
        const parts = window.partsOf(l.id, l.qty);
        Object.keys(parts).forEach(p => { out[p] = (out[p] || 0) + parts[p]; });
      });
    });
    return out;
  }

  /* 재고 표: [{ id, nm, total, auto, adj, sold, left }] */
  function stockRows(){
    const st = readStock(), auto = soldByPart();
    return window.UE_SINGLES.map(it => {
      const s = st[it.id] || {};
      const total = (s.total === null || s.total === undefined || s.total === '') ? null : Number(s.total);
      const adj = Number(s.adj || 0);
      const a = auto[it.id] || 0;
      const sold = a + adj;
      return {
        id: it.id, nm: it.nm, pr: it.pr,
        total: total, auto: a, adj: adj, sold: sold,
        left: total === null ? null : total - sold
      };
    });
  }

  return {
    add, all, remove, clearAll,
    summarize, todaySummary, allSummary,
    recTotal, recCount,
    dateKey, timeKey, payLabel,
    readStock, setStock, soldByPart, stockRows
  };
})();
