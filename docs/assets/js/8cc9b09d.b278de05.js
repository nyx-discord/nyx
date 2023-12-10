"use strict";(self.webpackChunk_nyx_discord_docs=self.webpackChunk_nyx_discord_docs||[]).push([[8462],{4619:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>i,contentTitle:()=>o,default:()=>x,frontMatter:()=>a,metadata:()=>u,toc:()=>d});var n=t(7458),s=t(6436),l=t(52),c=t(9262);const a={title:"\u26a1 Schedule Executor"},o=void 0,u={id:"features/schedules/schedule-executor",title:"\u26a1 Schedule Executor",description:"The ScheduleExecutor is the object responsible for executing schedules. It's stored by a ScheduleManager, and you",source:"@site/docs/features/schedules/schedule-executor.mdx",sourceDirName:"features/schedules",slug:"/features/schedules/schedule-executor",permalink:"/docs/features/schedules/schedule-executor",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/features/schedules/schedule-executor.mdx",tags:[],version:"current",frontMatter:{title:"\u26a1 Schedule Executor"},sidebar:"nyxSidebar",previous:{title:"\ud83d\udd0d Schedule Execution Scheduler",permalink:"/docs/features/schedules/schedule-scheduler"},next:{title:"\ud83d\udcd4 Schedule Repository",permalink:"/docs/features/schedules/schedule-repository"}},i={},d=[{value:"\ud83d\udc77 Creation",id:"-creation",level:2},{value:"\ud83d\udea6 Middleware",id:"-middleware",level:2},{value:"\ud83d\udcab Error Handling",id:"-error-handling",level:2}];function h(e){const r={a:"a",code:"code",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(r.p,{children:["The ",(0,n.jsx)(r.code,{children:"ScheduleExecutor"})," is the object responsible for executing schedules. It's stored by a ",(0,n.jsx)(r.code,{children:"ScheduleManager"}),", and you\ncan get it via ",(0,n.jsx)(r.code,{children:"ScheduleManager#getExecutor()"}),"."]}),"\n",(0,n.jsxs)(r.p,{children:["It's used by the ",(0,n.jsx)(r.code,{children:"ScheduleManager"}),", which passes to the executor the schedule to execute and the schedule tick\nmetadata."]}),"\n",(0,n.jsx)(r.p,{children:"The executor is then responsible that:"}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsxs)(r.li,{children:["The ",(0,n.jsx)(r.code,{children:"ScheduleMiddlewareLinkedList"})," passes the execution."]}),"\n",(0,n.jsx)(r.li,{children:"The schedule is executed, passing the tick metadata."}),"\n",(0,n.jsxs)(r.li,{children:["Any errors thrown by the schedule or middleware are caught, wrapped if needed, and redirected to the ",(0,n.jsx)(r.code,{children:"ErrorHandler"}),"."]}),"\n"]}),"\n",(0,n.jsx)(r.p,{children:"It consists of:"}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsxs)(r.li,{children:["A ",(0,n.jsx)(r.code,{children:"tick()"})," method to execute a schedule."]}),"\n",(0,n.jsxs)(r.li,{children:["A ",(0,n.jsx)(r.code,{children:"ScheduleMiddlewareLinkedList"})," to allow or deny the execution of schedules."]}),"\n",(0,n.jsxs)(r.li,{children:["An ",(0,n.jsx)(r.code,{children:"ErrorHandler"})," to handle errors thrown by schedules or the middleware list."]}),"\n"]}),"\n",(0,n.jsx)(r.h2,{id:"-creation",children:"\ud83d\udc77 Creation"}),"\n",(0,n.jsx)(r.p,{children:"You can create a schedule executor by either:"}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsxs)(r.li,{children:["Extending ",(0,n.jsx)(r.code,{children:"DefaultScheduleExecutor"})," from ",(0,n.jsx)(r.code,{children:"@framework"})," (recommended)."]}),"\n",(0,n.jsxs)(r.li,{children:["Implementing the ",(0,n.jsx)(r.code,{children:"ScheduleExecutor"})," interface from ",(0,n.jsx)(r.code,{children:"@core"}),"."]}),"\n"]}),"\n",(0,n.jsxs)(l.Z,{children:[(0,n.jsx)(c.Z,{value:"Extending DefaultScheduleExecutor",children:(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-ts",children:"import { DefaultScheduleExecutor } from '@nyx-discord/framework';\n\nclass MyScheduleExecutor extends DefaultScheduleExecutor {\n  // ...\n}\n\nconst myExecutor = new MyScheduleExecutor();\n\nconst myBot = Bot.create((bot) => ({\n  schedules: DefaultScheduleManager.create(bot, { executor: myExecutor }),\n}));\n"})})}),(0,n.jsx)(c.Z,{value:"Implementing ScheduleExecutor",children:(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-ts",children:"import { ScheduleExecutor } from '@nyx-discord/core';\n\nclass MyScheduleExecutor implements ScheduleExecutor {\n  // ...\n}\n\nconst myExecutor = new MyScheduleExecutor();\n\nconst myBot = Bot.create((bot) => ({\n  schedules: DefaultScheduleManager.create(bot, { executor: myExecutor }),\n}));\n"})})})]}),"\n",(0,n.jsx)(r.h2,{id:"-middleware",children:"\ud83d\udea6 Middleware"}),"\n",(0,n.jsxs)(r.p,{children:["The executor stores a ",(0,n.jsx)(r.code,{children:"ScheduleMiddlewareLinkedList"})," that will either allow or deny the execution of a given schedule.\nThis list can be obtained via ",(0,n.jsx)(r.code,{children:"ScheduleExecutor#getMiddleware()"}),"."]}),"\n",(0,n.jsxs)(r.p,{children:["For information about how to use it, check the ",(0,n.jsx)(r.a,{href:"./schedule-interception",children:"\ufe0f\ud83d\udee1\ufe0f Schedule Interception"})," documentation."]}),"\n",(0,n.jsx)(r.h2,{id:"-error-handling",children:"\ud83d\udcab Error Handling"}),"\n",(0,n.jsxs)(r.p,{children:["The executor stores an ",(0,n.jsx)(r.code,{children:"ErrorHandler"}),", which is redirected errors thrown by any schedule. For information about how\nto use it, check the ",(0,n.jsx)(r.a,{href:"../../error/error-handling",children:"\ud83d\udcab Error Handling"})," documentation."]}),"\n",(0,n.jsx)(r.p,{children:"There are special errors that are redirected there however, specifically when checking the middleware. These are:"}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.code,{children:"ScheduleMiddlewareError"})," - Caused when a middleware throws an error, the list catches it and wraps it in this error. It's known which middleware caused the error."]}),"\n",(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.code,{children:"UncaughtScheduleMiddlewareError"})," - Caused when the list throws an error, and it's not the one above. In theory, it should never happen, but it still exists just in case. It's not known which middleware caused the error."]}),"\n"]}),"\n",(0,n.jsx)(r.p,{children:"These errors hold information useful to handle them, like the middleware that caused the error, or the entire list if the\nmiddleware is not known."})]})}function x(e={}){const{wrapper:r}={...(0,s.a)(),...e.components};return r?(0,n.jsx)(r,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},9262:(e,r,t)=>{t.d(r,{Z:()=>c});t(2983);var n=t(8934);const s={tabItem:"tabItem_rG4d"};var l=t(7458);function c(e){let{children:r,hidden:t,className:c}=e;return(0,l.jsx)("div",{role:"tabpanel",className:(0,n.Z)(s.tabItem,c),hidden:t,children:r})}},52:(e,r,t)=>{t.d(r,{Z:()=>y});var n=t(2983),s=t(8934),l=t(3743),c=t(3729),a=t(2461),o=t(8239),u=t(7333),i=t(6927);function d(e){return n.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,n.isValidElement)(e)&&function(e){const{props:r}=e;return!!r&&"object"==typeof r&&"value"in r}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:r,children:t}=e;return(0,n.useMemo)((()=>{const e=r??function(e){return d(e).map((e=>{let{props:{value:r,label:t,attributes:n,default:s}}=e;return{value:r,label:t,attributes:n,default:s}}))}(t);return function(e){const r=(0,u.l)(e,((e,r)=>e.value===r.value));if(r.length>0)throw new Error(`Docusaurus error: Duplicate values "${r.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[r,t])}function x(e){let{value:r,tabValues:t}=e;return t.some((e=>e.value===r))}function m(e){let{queryString:r=!1,groupId:t}=e;const s=(0,c.k6)(),l=function(e){let{queryString:r=!1,groupId:t}=e;if("string"==typeof r)return r;if(!1===r)return null;if(!0===r&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:r,groupId:t});return[(0,o._X)(l),(0,n.useCallback)((e=>{if(!l)return;const r=new URLSearchParams(s.location.search);r.set(l,e),s.replace({...s.location,search:r.toString()})}),[l,s])]}function f(e){const{defaultValue:r,queryString:t=!1,groupId:s}=e,l=h(e),[c,o]=(0,n.useState)((()=>function(e){let{defaultValue:r,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(r){if(!x({value:r,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${r}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return r}const n=t.find((e=>e.default))??t[0];if(!n)throw new Error("Unexpected error: 0 tabValues");return n.value}({defaultValue:r,tabValues:l}))),[u,d]=m({queryString:t,groupId:s}),[f,p]=function(e){let{groupId:r}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(r),[s,l]=(0,i.Nk)(t);return[s,(0,n.useCallback)((e=>{t&&l.set(e)}),[t,l])]}({groupId:s}),b=(()=>{const e=u??f;return x({value:e,tabValues:l})?e:null})();(0,a.Z)((()=>{b&&o(b)}),[b]);return{selectedValue:c,selectValue:(0,n.useCallback)((e=>{if(!x({value:e,tabValues:l}))throw new Error(`Can't select invalid tab value=${e}`);o(e),d(e),p(e)}),[d,p,l]),tabValues:l}}var p=t(2034);const b={tabList:"tabList_I6mw",tabItem:"tabItem_Qvbi"};var j=t(7458);function w(e){let{className:r,block:t,selectedValue:n,selectValue:c,tabValues:a}=e;const o=[],{blockElementScrollPositionUntilNextRender:u}=(0,l.o5)(),i=e=>{const r=e.currentTarget,t=o.indexOf(r),s=a[t].value;s!==n&&(u(r),c(s))},d=e=>{let r=null;switch(e.key){case"Enter":i(e);break;case"ArrowRight":{const t=o.indexOf(e.currentTarget)+1;r=o[t]??o[0];break}case"ArrowLeft":{const t=o.indexOf(e.currentTarget)-1;r=o[t]??o[o.length-1];break}}r?.focus()};return(0,j.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":t},r),children:a.map((e=>{let{value:r,label:t,attributes:l}=e;return(0,j.jsx)("li",{role:"tab",tabIndex:n===r?0:-1,"aria-selected":n===r,ref:e=>o.push(e),onKeyDown:d,onClick:i,...l,className:(0,s.Z)("tabs__item",b.tabItem,l?.className,{"tabs__item--active":n===r}),children:t??r},r)}))})}function g(e){let{lazy:r,children:t,selectedValue:s}=e;const l=(Array.isArray(t)?t:[t]).filter(Boolean);if(r){const e=l.find((e=>e.props.value===s));return e?(0,n.cloneElement)(e,{className:"margin-top--md"}):null}return(0,j.jsx)("div",{className:"margin-top--md",children:l.map(((e,r)=>(0,n.cloneElement)(e,{key:r,hidden:e.props.value!==s})))})}function v(e){const r=f(e);return(0,j.jsxs)("div",{className:(0,s.Z)("tabs-container",b.tabList),children:[(0,j.jsx)(w,{...e,...r}),(0,j.jsx)(g,{...e,...r})]})}function y(e){const r=(0,p.Z)();return(0,j.jsx)(v,{...e,children:d(e.children)},String(r))}},6436:(e,r,t)=>{t.d(r,{Z:()=>a,a:()=>c});var n=t(2983);const s={},l=n.createContext(s);function c(e){const r=n.useContext(l);return n.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function a(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:c(e.components),n.createElement(l.Provider,{value:r},e.children)}}}]);