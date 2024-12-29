"use strict";(self.webpackChunk_nyx_discord_docs=self.webpackChunk_nyx_discord_docs||[]).push([[480],{6148:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>r,toc:()=>l});const r=JSON.parse('{"id":"features/sessions/session-subscriber","title":"\ud83d\udc42 Session Subscriber","description":"The SessionSubscriber is the object responsible for listening to interactions that could belong to a session update.","source":"@site/docs/features/sessions/session-subscriber.mdx","sourceDirName":"features/sessions","slug":"/features/sessions/session-subscriber","permalink":"/nyx/docs/features/sessions/session-subscriber","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/features/sessions/session-subscriber.mdx","tags":[],"version":"current","frontMatter":{"title":"\ud83d\udc42 Session Subscriber"},"sidebar":"nyxSidebar","previous":{"title":"\ufe0f\ud83d\udcbc Session Manager","permalink":"/nyx/docs/features/sessions/session-manager"},"next":{"title":"\u231b Session Promise Repository","permalink":"/nyx/docs/features/sessions/session-promise-repository"}}');var n=s(3159),a=s(5912);s(5610),s(7598);const o={title:"\ud83d\udc42 Session Subscriber"},i=void 0,u={},l=[{value:"\ud83d\udc77 Creation",id:"-creation",level:2}];function c(e){const t={a:"a",code:"code",h2:"h2",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(t.code,{children:"SessionSubscriber"})," is the object responsible for listening to interactions that could belong to a session update.\nIt's stored by a ",(0,n.jsx)(t.code,{children:"SessionManager"}),", and you can get it via ",(0,n.jsx)(t.code,{children:"SessionManager#getUpdateSubscriber()"}),"."]}),"\n",(0,n.jsx)(t.h2,{id:"-creation",children:"\ud83d\udc77 Creation"}),"\n",(0,n.jsxs)(t.p,{children:["Check the ",(0,n.jsx)(t.a,{href:"../events/event-subscriber",children:"\ud83d\udce9 Event Subscribers"})," documentation for information on how to create a subscriber."]}),"\n",(0,n.jsxs)(t.p,{children:["After creating it, you can add it to the ",(0,n.jsx)(t.code,{children:"SessionManager"}),", either when building it or with\n",(0,n.jsx)(t.code,{children:"SessionManager#setUpdateSubscriber()"}),":"]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"const myBot = Bot.create((bot) => ({\n  sessions: DefaultSessionManager.create(bot, { subscriber: mySubscriber }),\n}));\n\n// Or:\nmybot.getSessionManager().setUpdateSubscriber(subscriber);\n"})})]})}function d(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},7598:(e,t,s)=>{s.d(t,{A:()=>o});s(1855);var r=s(1271);const n={tabItem:"tabItem_Jk6b"};var a=s(3159);function o(e){let{children:t,hidden:s,className:o}=e;return(0,a.jsx)("div",{role:"tabpanel",className:(0,r.A)(n.tabItem,o),hidden:s,children:t})}},5610:(e,t,s)=>{s.d(t,{A:()=>j});var r=s(1855),n=s(1271),a=s(4303),o=s(3178),i=s(3782),u=s(7520),l=s(9665),c=s(9575);function d(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function b(e){const{values:t,children:s}=e;return(0,r.useMemo)((()=>{const e=t??function(e){return d(e).map((e=>{let{props:{value:t,label:s,attributes:r,default:n}}=e;return{value:t,label:s,attributes:r,default:n}}))}(s);return function(e){const t=(0,l.XI)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,s])}function f(e){let{value:t,tabValues:s}=e;return s.some((e=>e.value===t))}function p(e){let{queryString:t=!1,groupId:s}=e;const n=(0,o.W6)(),a=function(e){let{queryString:t=!1,groupId:s}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!s)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return s??null}({queryString:t,groupId:s});return[(0,u.aZ)(a),(0,r.useCallback)((e=>{if(!a)return;const t=new URLSearchParams(n.location.search);t.set(a,e),n.replace({...n.location,search:t.toString()})}),[a,n])]}function h(e){const{defaultValue:t,queryString:s=!1,groupId:n}=e,a=b(e),[o,u]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:s}=e;if(0===s.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!f({value:t,tabValues:s}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${s.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const r=s.find((e=>e.default))??s[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:t,tabValues:a}))),[l,d]=p({queryString:s,groupId:n}),[h,m]=function(e){let{groupId:t}=e;const s=function(e){return e?`docusaurus.tab.${e}`:null}(t),[n,a]=(0,c.Dv)(s);return[n,(0,r.useCallback)((e=>{s&&a.set(e)}),[s,a])]}({groupId:n}),v=(()=>{const e=l??h;return f({value:e,tabValues:a})?e:null})();(0,i.A)((()=>{v&&u(v)}),[v]);return{selectedValue:o,selectValue:(0,r.useCallback)((e=>{if(!f({value:e,tabValues:a}))throw new Error(`Can't select invalid tab value=${e}`);u(e),d(e),m(e)}),[d,m,a]),tabValues:a}}var m=s(1342);const v={tabList:"tabList_Pkq_",tabItem:"tabItem_JbFz"};var g=s(3159);function x(e){let{className:t,block:s,selectedValue:r,selectValue:o,tabValues:i}=e;const u=[],{blockElementScrollPositionUntilNextRender:l}=(0,a.a_)(),c=e=>{const t=e.currentTarget,s=u.indexOf(t),n=i[s].value;n!==r&&(l(t),o(n))},d=e=>{let t=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const s=u.indexOf(e.currentTarget)+1;t=u[s]??u[0];break}case"ArrowLeft":{const s=u.indexOf(e.currentTarget)-1;t=u[s]??u[u.length-1];break}}t?.focus()};return(0,g.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,n.A)("tabs",{"tabs--block":s},t),children:i.map((e=>{let{value:t,label:s,attributes:a}=e;return(0,g.jsx)("li",{role:"tab",tabIndex:r===t?0:-1,"aria-selected":r===t,ref:e=>u.push(e),onKeyDown:d,onClick:c,...a,className:(0,n.A)("tabs__item",v.tabItem,a?.className,{"tabs__item--active":r===t}),children:s??t},t)}))})}function y(e){let{lazy:t,children:s,selectedValue:a}=e;const o=(Array.isArray(s)?s:[s]).filter(Boolean);if(t){const e=o.find((e=>e.props.value===a));return e?(0,r.cloneElement)(e,{className:(0,n.A)("margin-top--md",e.props.className)}):null}return(0,g.jsx)("div",{className:"margin-top--md",children:o.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==a})))})}function S(e){const t=h(e);return(0,g.jsxs)("div",{className:(0,n.A)("tabs-container",v.tabList),children:[(0,g.jsx)(x,{...t,...e}),(0,g.jsx)(y,{...t,...e})]})}function j(e){const t=(0,m.A)();return(0,g.jsx)(S,{...e,children:d(e.children)},String(t))}},5912:(e,t,s)=>{s.d(t,{R:()=>o,x:()=>i});var r=s(1855);const n={},a=r.createContext(n);function o(e){const t=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:o(e.components),r.createElement(a.Provider,{value:t},e.children)}}}]);