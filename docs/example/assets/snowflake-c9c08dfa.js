import{D as t,p as c,cR as A,cS as P,x as S,cT as I,cU as M,J as T,R as h,A as V,H as W,l as u,X as q,cV as E,cW as F,bW as O,v as _,_ as x,cX as U,cY as X,cZ as z,c_ as H,I as y,U as B,c$ as p,d0 as J,d1 as Y,a7 as Z,g as i,i as l,d2 as $,d3 as j,E as G,h as d,a8 as K,k as e,a6 as f,cn as Q,d4 as aa,d5 as k,y as sa,e as na,m as w,d6 as oa,C as ta,N as C,d7 as ea,n as v,q as ra}from"./Shape-522689f4.js";import{R as b,t as D,a as ca}from"./utils-0f6dc467.js";function ia(a){return t(la(a),c(I),P(S(16)),c(A))}function la(a){return M(a,{while:s=>s<=a,step:s=>s+1,body:s=>T.pipe(h(({width:n,height:o})=>V(0,0,n,o)),W(({width:n,height:o})=>pa(s,5,n,o)),u(n=>q(E(n))),h(([n])=>F(`snowflake(${s}) took ${n}ms`)),O(t(x,_("1 seconds"))))})}function pa(a,s,n,o){const r=t(N(a,s),B(n/3.75,o/3.75),y(n/2,o/2),U(X.combine(z(K),H(10))));return p([da(n,o),r])}const R=[e(60,.6,.5,1),e(55,.65,.55,1),e(30,1,.55,1),e(345,.62,.45,1),e(305,.7,.28,1),e(268,1,.18,1),e(240,1,.01,1)];function N(a,s){const n=J(s),o=R[a%R.length],r=.375;return a<=0?Y.empty:t(N(a-1,s),B(r,r),y(0,Math.cos(Math.PI/s)*(1+r)),m=>t($(0,s-1),j(L=>t(m,G(Math.PI/(s/2)*(L+.5)))),p),m=>Z(i(n,l(o)),m))}function da(a,s){return i(d(0,0,a,s),l(e(0,0,100,0)))}const ma=t(M([0,f(300,300,100)],{while:([a])=>a<2,step:ua,body:([,a])=>sa(na([i(d(0,0,600,600),l(ta)),wa(a)])).pipe(w(_(x,S(16))))}).pipe(c(I),c(A),Q));function ua([a,s]){return[a%2==0?s.r>=300?a+1:a:s.r<=100?a+1:a,a%2==0?f(s.x,s.y,s.r+1):f(s.x,s.y,Math.max(s.r-1,0))]}const fa=t(k(3,a=>k(3,s=>i(d(s*200,a*200,150,150),l(C(0,1,.5))))),aa(a=>a));function wa(a){return t(p([i(d(0,0,600,600),l(C(240,1,.5))),y(25,25)(p(fa))]),oa(a))}const ga="canvas1",ya="canvas2",ha=b.pipe(a=>u(a,D(g)),w(ea([v(ya)(ma),v(ga)(ia(6))])),w(b.pipe(u(D(g)))),c(ca));function g(){ra(ha)}g();
