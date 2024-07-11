"use strict";(self.webpackChunk_nyx_discord_docs=self.webpackChunk_nyx_discord_docs||[]).push([[1777],{3640:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>l,contentTitle:()=>i,default:()=>h,frontMatter:()=>c,metadata:()=>u,toc:()=>d});var n=t(7458),o=t(6436),r=t(9021),a=t(2543);const c={title:"\ud83d\udcac Session CustomId Codec"},i=void 0,u={id:"features/sessions/session-customid-codec",title:"\ud83d\udcac Session CustomId Codec",description:"The SessionCustomIdCodec is the object responsible for encoding and decoding sessions custom ids. That is, custom ids",source:"@site/docs/features/sessions/session-customid-codec.mdx",sourceDirName:"features/sessions",slug:"/features/sessions/session-customid-codec",permalink:"/nyx/docs/features/sessions/session-customid-codec",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/features/sessions/session-customid-codec.mdx",tags:[],version:"current",frontMatter:{title:"\ud83d\udcac Session CustomId Codec"},sidebar:"nyxSidebar",previous:{title:"\ud83d\udce3 Session Event Bus",permalink:"/nyx/docs/features/sessions/session-bus"},next:{title:"\u26a1 Session Executor",permalink:"/nyx/docs/features/sessions/session-executor"}},l={},d=[{value:"\ud83d\udc77 Creation",id:"-creation",level:2}];function m(e){const s={code:"code",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,o.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(s.p,{children:["The ",(0,n.jsx)(s.code,{children:"SessionCustomIdCodec"})," is the object responsible for encoding and decoding sessions custom ids. That is, custom ids\nthat refer to sessions. With this object you can easily create components that will update sessions when\nthey are used. It's stored by a ",(0,n.jsx)(s.code,{children:"SessionManager"}),", and you can get it via ",(0,n.jsx)(s.code,{children:"SessionManager#getCustomIdCodec()"}),"."]}),"\n",(0,n.jsx)(s.h2,{id:"-creation",children:"\ud83d\udc77 Creation"}),"\n",(0,n.jsx)(s.p,{children:"You can create a session custom ID codec by either:"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:["Extending ",(0,n.jsx)(s.code,{children:"DefaultSessionCustomIdCodec"})," from ",(0,n.jsx)(s.code,{children:"@framework"})," (recommended)."]}),"\n",(0,n.jsxs)(s.li,{children:["Implementing the ",(0,n.jsx)(s.code,{children:"SessionCustomIdCodec"})," interface from ",(0,n.jsx)(s.code,{children:"@core"}),"."]}),"\n"]}),"\n",(0,n.jsxs)(r.Z,{children:[(0,n.jsx)(a.Z,{value:"Extending DefaultSessionCustomIdCodec",children:(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-ts",children:"import { DefaultSessionCustomIdCodec } from '@nyx-discord/framework';\n\nclass MySessionCustomIdCodec extends DefaultSessionCustomIdCodec {\n  // ...\n}\n\nconst myCodec = new MySessionCustomIdCodec();\n\nconst myBot = Bot.create((bot) => ({\n  sessions: DefaultSessionManager.create(bot, { customIdCodec: myCodec }),\n}));\n"})})}),(0,n.jsx)(a.Z,{value:"Implementing SessionCustomIdCodec",children:(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-ts",children:"import { SessionCustomIdCodec } from '@nyx-discord/core';\n\nclass MySessionCustomIdCodec implements SessionCustomIdCodec {\n  // ...\n}\n\nconst myCodec = new MySessionCustomIdCodec();\n\nconst myBot = Bot.create((bot) => ({\n  sessions: DefaultSessionManager.create(bot, { customIdCodec: myCodec }),\n}));\n"})})})]})]})}function h(e={}){const{wrapper:s}={...(0,o.a)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(m,{...e})}):m(e)}},2543:(e,s,t)=>{t.d(s,{Z:()=>a});t(2983);var n=t(8934);const o={tabItem:"tabItem_FK4c"};var r=t(7458);function a(e){let{children:s,hidden:t,className:a}=e;return(0,r.jsx)("div",{role:"tabpanel",className:(0,n.Z)(o.tabItem,a),hidden:t,children:s})}},9021:(e,s,t)=>{t.d(s,{Z:()=>I});var n=t(2983),o=t(8934),r=t(6776),a=t(3729),c=t(3668),i=t(8866),u=t(5504),l=t(591);function d(e){return n.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,n.isValidElement)(e)&&function(e){const{props:s}=e;return!!s&&"object"==typeof s&&"value"in s}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function m(e){const{values:s,children:t}=e;return(0,n.useMemo)((()=>{const e=s??function(e){return d(e).map((e=>{let{props:{value:s,label:t,attributes:n,default:o}}=e;return{value:s,label:t,attributes:n,default:o}}))}(t);return function(e){const s=(0,u.l)(e,((e,s)=>e.value===s.value));if(s.length>0)throw new Error(`Docusaurus error: Duplicate values "${s.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[s,t])}function h(e){let{value:s,tabValues:t}=e;return t.some((e=>e.value===s))}function f(e){let{queryString:s=!1,groupId:t}=e;const o=(0,a.k6)(),r=function(e){let{queryString:s=!1,groupId:t}=e;if("string"==typeof s)return s;if(!1===s)return null;if(!0===s&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:s,groupId:t});return[(0,i._X)(r),(0,n.useCallback)((e=>{if(!r)return;const s=new URLSearchParams(o.location.search);s.set(r,e),o.replace({...o.location,search:s.toString()})}),[r,o])]}function p(e){const{defaultValue:s,queryString:t=!1,groupId:o}=e,r=m(e),[a,i]=(0,n.useState)((()=>function(e){let{defaultValue:s,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(s){if(!h({value:s,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${s}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return s}const n=t.find((e=>e.default))??t[0];if(!n)throw new Error("Unexpected error: 0 tabValues");return n.value}({defaultValue:s,tabValues:r}))),[u,d]=f({queryString:t,groupId:o}),[p,b]=function(e){let{groupId:s}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(s),[o,r]=(0,l.Nk)(t);return[o,(0,n.useCallback)((e=>{t&&r.set(e)}),[t,r])]}({groupId:o}),x=(()=>{const e=u??p;return h({value:e,tabValues:r})?e:null})();(0,c.Z)((()=>{x&&i(x)}),[x]);return{selectedValue:a,selectValue:(0,n.useCallback)((e=>{if(!h({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);i(e),d(e),b(e)}),[d,b,r]),tabValues:r}}var b=t(1678);const x={tabList:"tabList_dumu",tabItem:"tabItem_hRcV"};var C=t(7458);function v(e){let{className:s,block:t,selectedValue:n,selectValue:a,tabValues:c}=e;const i=[],{blockElementScrollPositionUntilNextRender:u}=(0,r.o5)(),l=e=>{const s=e.currentTarget,t=i.indexOf(s),o=c[t].value;o!==n&&(u(s),a(o))},d=e=>{let s=null;switch(e.key){case"Enter":l(e);break;case"ArrowRight":{const t=i.indexOf(e.currentTarget)+1;s=i[t]??i[0];break}case"ArrowLeft":{const t=i.indexOf(e.currentTarget)-1;s=i[t]??i[i.length-1];break}}s?.focus()};return(0,C.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":t},s),children:c.map((e=>{let{value:s,label:t,attributes:r}=e;return(0,C.jsx)("li",{role:"tab",tabIndex:n===s?0:-1,"aria-selected":n===s,ref:e=>i.push(e),onKeyDown:d,onClick:l,...r,className:(0,o.Z)("tabs__item",x.tabItem,r?.className,{"tabs__item--active":n===s}),children:t??s},s)}))})}function g(e){let{lazy:s,children:t,selectedValue:o}=e;const r=(Array.isArray(t)?t:[t]).filter(Boolean);if(s){const e=r.find((e=>e.props.value===o));return e?(0,n.cloneElement)(e,{className:"margin-top--md"}):null}return(0,C.jsx)("div",{className:"margin-top--md",children:r.map(((e,s)=>(0,n.cloneElement)(e,{key:s,hidden:e.props.value!==o})))})}function y(e){const s=p(e);return(0,C.jsxs)("div",{className:(0,o.Z)("tabs-container",x.tabList),children:[(0,C.jsx)(v,{...e,...s}),(0,C.jsx)(g,{...e,...s})]})}function I(e){const s=(0,b.Z)();return(0,C.jsx)(y,{...e,children:d(e.children)},String(s))}},6436:(e,s,t)=>{t.d(s,{Z:()=>c,a:()=>a});var n=t(2983);const o={},r=n.createContext(o);function a(e){const s=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function c(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:a(e.components),n.createElement(r.Provider,{value:s},e.children)}}}]);