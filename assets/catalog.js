/* 상품 목록 — 가격이나 상품이 바뀌면 이 파일만 고치면 됩니다.
 *
 * 상품을 뺄 때는 지우지 말고 아래 RETIRED 로 옮기세요.
 * 지워버리면 그 상품이 들어간 과거 판매 기록의 이름이 사라집니다. */
window.TEAMS = [
  { key:'t1', name:'글자취미팀', items:[
    { id:'g1', nm:'글자취미 1권',        pr:37000, main:true },
    { id:'g2', nm:'글자취미 디지털 USB', pr:30000 },
    { id:'g3', nm:'얼마나 오렌지',       pr:25000 },
    { id:'g5', nm:'글자취미+USB 세트',   pr:45000 }
  ]},
  { key:'t2', name:'한주한자팀', items:[
    { id:'h1', nm:'한주한자 아카이빙북', pr:30000, main:true },
    { id:'h2', nm:'노트북 스티커',       pr:3000  },
    { id:'h3', nm:'용어 정리집',         pr:15000 },
    { id:'h6', nm:'엽서 2장',            pr:1000  },
    { id:'h5', nm:'책갈피',              pr:6000  }
  ]}
];

/* 판매 종료된 상품 — 버튼으로는 안 보이지만 과거 기록의 이름·단가는 그대로 남습니다. */
window.RETIRED = [
  { id:'g4', team:'t1', nm:'오렌지 엽서 3종세트', pr:3000 },
  { id:'h4', team:'t2', nm:'로고 스티커',         pr:2000 }
];

window.CATALOG = {};
window.TEAMS.forEach(t => t.items.forEach(i => {
  window.CATALOG[i.id] = Object.assign({ team:t.key, teamName:t.name, retired:false }, i);
}));
window.RETIRED.forEach(i => {
  window.CATALOG[i.id] = Object.assign({ retired:true }, i);
});

window.TEAM_NAME = { t1:'글자취미', t2:'한주한자' };

window.won = n => (n || 0).toLocaleString('ko-KR');
