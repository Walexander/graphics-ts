import{a9 as m,aa as f,ab as P,H as v,ac as k,ad as I,ae as T,af as K,ag as U,ah as Y,a as F,ai as Z,aj as O,ak as aa,al as ta,D as i,l as o,am as sa,R as p,an as ea,ao as ra,J as b,ap as na,aq as oa,ar as $,as as ia,m as r,at as la,_ as c,A as C,d as L,a5 as ca,au as A,av as pa,aw as ua,$ as ma,q as fa,Q as va,ax as da,n as Ta,p as u,v as y,x as w,T as ga,V as ya,X as wa,w as B,ay as Sa,az as E,y as R,g as Ia,a6 as ha,i as xa,B as Ma,aA as Pa,aB as ka,s as Fa,t as h,k as g,aC as ba,b as $a}from"./Shape-522689f4.js";import{l as Ca,R as q,t as D,a as La}from"./utils-0f6dc467.js";import{d as N,e as Aa,r as Ba,f as Ea,h as Ra,i as qa,j as Da,m as Na,t as x}from"./Stream-2144a788.js";const _=m(),_a=f(_,P.pipe(v(t=>za(t))));function za(t){const a=k(P,t);return{moveTo:I(Z,a),lineTo:I(O,a),beginPath:a(T(K,void 0)),stroke:a(T(U(),void 0))}}const z=m(),ja=Y(_a,f(z,_.pipe(v(t=>Ga(t)))));function Ga(t){return([[a,s],[e,n]])=>F([t.beginPath,t.moveTo(a,s),t.lineTo(e,n),t.stroke],{discard:!0})}const j=m();function Xa(t){return f(j,aa(function*(a){const s=yield*a(ta(t)),e=yield*a(z);return new Ja(s,e)}))}const Ha=Xa({theta:0,position:[0,0]});class Ja{constructor(a,s){this.state=a,this.draw=s}drawForward(a){return i(ea(this.state),v(s=>[s,Qa(s,a)]),p(([s,e])=>this.draw([s.position,e])),v(([{theta:s},e])=>({theta:s,position:e})),o(s=>T(sa(this.state,s),s)))}turn(a){return ra(this.state,({theta:s,position:e})=>({theta:s+a,position:e}))}}function Qa({position:[t,a],theta:s},e){return[t+e*Math.cos(s),a+e*Math.sin(s)]}function S(){return fa(et(771))}const Va=b.pipe(o(({width:t,height:a})=>na(0,0,t,a).pipe(o(s=>oa(()=>createImageBitmap(s))),$,v(s=>ia(s,va(t/-2,a/-2))),p(s=>Ca(e=>B(i(C(0,0,t,a),r(L(t/2,a/2)),r(Ma(-e/4)),r(R(s)),r(y(c,w(16)))))))))),Wa=i(c,r(b),p(({width:t,height:a})=>i(c,r(C(0,0,t,a)),r(L(t/2,a/2)))),r(la(3.5,3.5)),r(q.pipe(o(D(S)))),T(null));function Ka(t){return i(tt,N(3,(a,[s,e])=>[s==a**2?a+2:a,{nextSquare:a**2,isPrime:e,num:s}]),x(({isPrime:a})=>a?y(c,w(16)):c),x(at(t)),Na(Ua),Da(a=>j.pipe(o(a))),qa(t))}function Ua({num:t,isPrime:a,nextSquare:s}){return n=>i(F([ba(a?3:1),$a(a?"transparent":h(g(0,0,0,.25)))],{discard:!0}),r(n.drawForward(3)),p(({position:[l,d]})=>a?Fa(h(g(Math.atan2(d,l)*180/Math.PI,.5,.5,1))):c),r(n.turn(e(t,Math.sqrt(s)))),p(({position:l})=>a?Pa(ka(l[0],l[1],2,0,Math.PI*2)):c),r(n.drawForward(3)));function e(n,l){const d=l-2,Q=l**2,V=l-1,W=n-d**2;return n==2||d**2+1==n||n!=Q&&W%V==0?Math.PI/2:0}}const G=m(),Ya=f(G,J("prime")),X=m(),Za=f(X,J("latest")),H=m(),Oa=f(H,ca(new Intl.NumberFormat));function at(t){return({num:a,isPrime:s})=>H.pipe(o(e=>s?G.pipe(o(M(e.format(a)))):a>1e3&&a%100==0||a<=1e3&&a%10==0||a==t?X.pipe(o(M(e.format(a)))):c))}function J(t){return i(A(()=>E(document.getElementById(t))),o(a=>a),$)}function M(t){return a=>A(()=>{a.innerText=t})}const tt=i(Aa(2,Number.MAX_SAFE_INTEGER),N(pa(),st));function st(t,a){const s=a>1&&ua(t,n=>a%n!==0),e=[a,s];return[s?ma(t,a):t,e]}const et=t=>i(Ra(Wa),Ea(Ka(t)),Ba,o(a=>i(a,Sa(s=>E(s)),p(s=>R(rt(s))))),B,wa,p(([a])=>ga(`duration: ${ya(a).toFixed(3)}s`)),r(y(Va,w(3e3))),r(q.pipe(o(D(S)))),u(Ha),u(ja),u(Ya),u(Za),u(Oa),u(La),Ta("canvas4"),k(da,{willReadFrequently:!0}));function rt({position:[t,a]}){return Ia(ha(t,a,4),xa(g(0,.5,0,.5)))}S();
