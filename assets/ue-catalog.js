/* 언리미티드 에디션 2026 — 상품 목록
 * 가격·상품이 바뀌면 이 파일만 고치면 됩니다.
 *
 * parts: 세트 상품이 어떤 단품으로 이루어졌는지. 재고 차감에 쓰입니다.
 * stock: 총 재고 기본값. 앱의 재고 패널에서 고치면 그 값이 우선합니다. */

window.UE_SINGLES = [
  { id:'g1',  nm:'글자취미 1',       pr:37000, size:'136×200mm', big:true },
  { id:'g2',  nm:'글자취미 2',       pr:42000, size:'136×200mm', big:true },
  { id:'g1p', nm:'글자취미 1 PDF',   pr:30000, size:'136×200mm' },
  { id:'g2p', nm:'글자취미 2 PDF',   pr:29000, size:'136×200mm' },
  { id:'gn',  nm:'글리프노트',       pr:12900 },
  { id:'or',  nm:'얼마나 오렌지',    pr:23000, size:'148×162mm' },
  { id:'ca',  nm:'카라바조',         pr:18000, size:'130×180mm' },
  { id:'lx',  nm:'레터링 정밀검사',  pr:15000, size:'90×110mm'  },
  { id:'lp',  nm:'사랑해 펀치',      pr:10000 },
  { id:'g1b', nm:'글자취미 1 파본',  pr:25900, size:'136×200mm' }
];

window.UE_SETS = [
  { id:'s1', nm:'글자취미 1 + PDF 세트', pr:45000, parts:['g1','g1p'] },
  { id:'s2', nm:'글자취미 2 + PDF 세트', pr:60000, parts:['g2','g2p'] },
  { id:'s3', nm:'글자취미 2 + 글리프노트 세트', pr:53000, parts:['g2','gn'] }
];

/* 판매 종료 상품 — 버튼에는 안 보이지만 과거 기록의 이름·단가는 남습니다. */
window.UE_RETIRED = [];

window.UE_GROUPS = [
  { key:'single', name:'단품', accent:'t1', items: window.UE_SINGLES },
  { key:'set',    name:'세트', accent:'t2', items: window.UE_SETS }
];

window.CATALOG = {};
window.UE_GROUPS.forEach(g => g.items.forEach(i => {
  window.CATALOG[i.id] = Object.assign({ group:g.key, parts:null, retired:false }, i);
}));
window.UE_RETIRED.forEach(i => {
  window.CATALOG[i.id] = Object.assign({ retired:true, parts:null }, i);
});

/* 상품 하나가 실제로 소모하는 단품 수량 — { 단품id: 개수 } */
window.partsOf = function(id, qty){
  const it = window.CATALOG[id];
  const out = {};
  if (!it) return out;
  if (it.parts && it.parts.length) {
    it.parts.forEach(p => { out[p] = (out[p] || 0) + (qty || 1); });
  } else {
    out[id] = qty || 1;
  }
  return out;
};

window.won = n => (n || 0).toLocaleString('ko-KR');
