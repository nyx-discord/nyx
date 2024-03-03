"use strict";(self.webpackChunk_nyx_discord_docs=self.webpackChunk_nyx_discord_docs||[]).push([[2427],{2007:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>i,contentTitle:()=>c,default:()=>p,frontMatter:()=>l,metadata:()=>u,toc:()=>d});var n=r(7458),s=r(6436),o=r(52),a=r(9262);const l={title:"\ud83d\udcd4 Schedule Repository"},c=void 0,u={id:"features/schedules/schedule-repository",title:"\ud83d\udcd4 Schedule Repository",description:"The ScheduleRepository is the object responsible for storing schedules. It's stored by a ScheduleManager, and you can",source:"@site/docs/features/schedules/schedule-repository.mdx",sourceDirName:"features/schedules",slug:"/features/schedules/schedule-repository",permalink:"/nyx/docs/features/schedules/schedule-repository",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/features/schedules/schedule-repository.mdx",tags:[],version:"current",frontMatter:{title:"\ud83d\udcd4 Schedule Repository"},sidebar:"nyxSidebar",previous:{title:"\u26a1 Schedule Executor",permalink:"/nyx/docs/features/schedules/schedule-executor"},next:{title:"\ud83d\udce3 Schedule Event Bus",permalink:"/nyx/docs/features/schedules/schedule-bus"}},i={},d=[{value:"\ud83d\udc77 Creation",id:"-creation",level:2}];function h(e){const t={code:"code",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(t.code,{children:"ScheduleRepository"})," is the object responsible for storing schedules. It's stored by a ",(0,n.jsx)(t.code,{children:"ScheduleManager"}),", and you can\nget it via ",(0,n.jsx)(t.code,{children:"ScheduleManager#getRepository()"}),"."]}),"\n",(0,n.jsxs)(t.p,{children:["It only consists of a ",(0,n.jsx)(t.code,{children:"Collection"})," to store schedules, and methods to interact with it."]}),"\n",(0,n.jsxs)(t.p,{children:["You can't modify the repository directly since the ",(0,n.jsx)(t.code,{children:"ScheduleManager"})," returns a ",(0,n.jsx)(t.code,{children:"ReadonlyScheduleRepository"})," type, but\nthe hidden methods are available at the ",(0,n.jsx)(t.code,{children:"ScheduleManager"}),". This is because adding and removing a schedule needs more\nlogic than just modifying the repository, and the manager is responsible for coordinating this."]}),"\n",(0,n.jsx)(t.h2,{id:"-creation",children:"\ud83d\udc77 Creation"}),"\n",(0,n.jsx)(t.p,{children:"You can create a schedule repository by either:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["Extending ",(0,n.jsx)(t.code,{children:"DefaultScheduleRepository"})," from ",(0,n.jsx)(t.code,{children:"@framework"})," (recommended)."]}),"\n",(0,n.jsxs)(t.li,{children:["Implementing the ",(0,n.jsx)(t.code,{children:"ScheduleRepository"})," interface from ",(0,n.jsx)(t.code,{children:"@core"}),"."]}),"\n"]}),"\n",(0,n.jsxs)(o.Z,{children:[(0,n.jsx)(a.Z,{value:"Extending DefaultScheduleRepository",children:(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"import { DefaultScheduleRepository } from '@nyx-discord/framework';\n\nclass MyScheduleRepository extends DefaultScheduleRepository {\n  // ...\n}\n\nconst myRepository = MyScheduleRepository.create();\n\nconst myBot = Bot.create((bot) => ({\n  schedules: DefaultScheduleManager.create(bot, { repository: myRepository }),\n}));\n"})})}),(0,n.jsx)(a.Z,{value:"Implementing ScheduleRepository",children:(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"import { ScheduleRepository } from '@nyx-discord/core';\n\nclass MyScheduleRepository implements ScheduleRepository {\n  // ...\n}\n\nconst myRepository = new MyScheduleRepository();\n\nconst myBot = Bot.create((bot) => ({\n  schedules: DefaultScheduleManager.create(bot, { repository: myRepository }),\n}));\n"})})})]})]})}function p(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},9262:(e,t,r)=>{r.d(t,{Z:()=>a});r(2983);var n=r(8934);const s={tabItem:"tabItem_rG4d"};var o=r(7458);function a(e){let{children:t,hidden:r,className:a}=e;return(0,o.jsx)("div",{role:"tabpanel",className:(0,n.Z)(s.tabItem,a),hidden:r,children:t})}},52:(e,t,r)=>{r.d(t,{Z:()=>S});var n=r(2983),s=r(8934),o=r(3743),a=r(3729),l=r(2461),c=r(8239),u=r(7333),i=r(6927);function d(e){return n.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,n.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:t,children:r}=e;return(0,n.useMemo)((()=>{const e=t??function(e){return d(e).map((e=>{let{props:{value:t,label:r,attributes:n,default:s}}=e;return{value:t,label:r,attributes:n,default:s}}))}(r);return function(e){const t=(0,u.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,r])}function p(e){let{value:t,tabValues:r}=e;return r.some((e=>e.value===t))}function f(e){let{queryString:t=!1,groupId:r}=e;const s=(0,a.k6)(),o=function(e){let{queryString:t=!1,groupId:r}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!r)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return r??null}({queryString:t,groupId:r});return[(0,c._X)(o),(0,n.useCallback)((e=>{if(!o)return;const t=new URLSearchParams(s.location.search);t.set(o,e),s.replace({...s.location,search:t.toString()})}),[o,s])]}function m(e){const{defaultValue:t,queryString:r=!1,groupId:s}=e,o=h(e),[a,c]=(0,n.useState)((()=>function(e){let{defaultValue:t,tabValues:r}=e;if(0===r.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!p({value:t,tabValues:r}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${r.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const n=r.find((e=>e.default))??r[0];if(!n)throw new Error("Unexpected error: 0 tabValues");return n.value}({defaultValue:t,tabValues:o}))),[u,d]=f({queryString:r,groupId:s}),[m,y]=function(e){let{groupId:t}=e;const r=function(e){return e?`docusaurus.tab.${e}`:null}(t),[s,o]=(0,i.Nk)(r);return[s,(0,n.useCallback)((e=>{r&&o.set(e)}),[r,o])]}({groupId:s}),b=(()=>{const e=u??m;return p({value:e,tabValues:o})?e:null})();(0,l.Z)((()=>{b&&c(b)}),[b]);return{selectedValue:a,selectValue:(0,n.useCallback)((e=>{if(!p({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);c(e),d(e),y(e)}),[d,y,o]),tabValues:o}}var y=r(2034);const b={tabList:"tabList_I6mw",tabItem:"tabItem_Qvbi"};var x=r(7458);function g(e){let{className:t,block:r,selectedValue:n,selectValue:a,tabValues:l}=e;const c=[],{blockElementScrollPositionUntilNextRender:u}=(0,o.o5)(),i=e=>{const t=e.currentTarget,r=c.indexOf(t),s=l[r].value;s!==n&&(u(t),a(s))},d=e=>{let t=null;switch(e.key){case"Enter":i(e);break;case"ArrowRight":{const r=c.indexOf(e.currentTarget)+1;t=c[r]??c[0];break}case"ArrowLeft":{const r=c.indexOf(e.currentTarget)-1;t=c[r]??c[c.length-1];break}}t?.focus()};return(0,x.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":r},t),children:l.map((e=>{let{value:t,label:r,attributes:o}=e;return(0,x.jsx)("li",{role:"tab",tabIndex:n===t?0:-1,"aria-selected":n===t,ref:e=>c.push(e),onKeyDown:d,onClick:i,...o,className:(0,s.Z)("tabs__item",b.tabItem,o?.className,{"tabs__item--active":n===t}),children:r??t},t)}))})}function v(e){let{lazy:t,children:r,selectedValue:s}=e;const o=(Array.isArray(r)?r:[r]).filter(Boolean);if(t){const e=o.find((e=>e.props.value===s));return e?(0,n.cloneElement)(e,{className:"margin-top--md"}):null}return(0,x.jsx)("div",{className:"margin-top--md",children:o.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==s})))})}function j(e){const t=m(e);return(0,x.jsxs)("div",{className:(0,s.Z)("tabs-container",b.tabList),children:[(0,x.jsx)(g,{...e,...t}),(0,x.jsx)(v,{...e,...t})]})}function S(e){const t=(0,y.Z)();return(0,x.jsx)(j,{...e,children:d(e.children)},String(t))}},6436:(e,t,r)=>{r.d(t,{Z:()=>l,a:()=>a});var n=r(2983);const s={},o=n.createContext(s);function a(e){const t=n.useContext(o);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),n.createElement(o.Provider,{value:t},e.children)}}}]);