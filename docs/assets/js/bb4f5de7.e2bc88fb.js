"use strict";(self.webpackChunk_nyx_discord_docs=self.webpackChunk_nyx_discord_docs||[]).push([[5287],{9477:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>c,default:()=>p,frontMatter:()=>i,metadata:()=>l,toc:()=>u});var r=t(7458),o=t(6436),a=t(52),s=t(9262);const i={title:"\ud83d\udcd4 Command Repository"},c=void 0,l={id:"features/commands/command-repository",title:"\ud83d\udcd4 Command Repository",description:"The CommandRepository is the object responsible for storing commands and their Discord.js ApplicationCommand",source:"@site/docs/features/commands/command-repository.mdx",sourceDirName:"features/commands",slug:"/features/commands/command-repository",permalink:"/docs/features/commands/command-repository",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/features/commands/command-repository.mdx",tags:[],version:"current",frontMatter:{title:"\ud83d\udcd4 Command Repository"},sidebar:"nyxSidebar",previous:{title:"\u26a1 Command Executor",permalink:"/docs/features/commands/command-executor"},next:{title:"\ufe0f\ud83d\udd00 Command Resolver",permalink:"/docs/features/commands/command-resolver"}},d={},u=[{value:"\ud83d\udc77 Creation",id:"-creation",level:2}];function m(e){const n={admonition:"admonition",code:"code",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,o.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.code,{children:"CommandRepository"})," is the object responsible for storing commands and their Discord.js ",(0,r.jsx)(n.code,{children:"ApplicationCommand"}),"\nmappings, as well as adding commands at Discord using the ",(0,r.jsx)(n.code,{children:"Client"}),". It's stored by a ",(0,r.jsx)(n.code,{children:"CommandManager"}),", and you can get\nit via ",(0,r.jsx)(n.code,{children:"CommandManager#getRepository()"}),"."]}),"\n",(0,r.jsx)(n.admonition,{type:"danger",children:(0,r.jsxs)(n.p,{children:["It's a pending rewrite to make the ",(0,r.jsx)(n.code,{children:"CommandRepository"})," only store commands, and delegate the serialization and\nregistration of commands to a separate object."]})}),"\n",(0,r.jsxs)(n.p,{children:["You can't modify the repository directly since the ",(0,r.jsx)(n.code,{children:"CommandManager"})," returns a ",(0,r.jsx)(n.code,{children:"ReadonlyCommandRepository"})," type, but the\nhidden methods are available at the ",(0,r.jsx)(n.code,{children:"CommandManager"}),". This is because adding, removing and updating a command needs more\nlogic than just modifying the repository, and the manager is responsible for coordinating this."]}),"\n",(0,r.jsx)(n.h2,{id:"-creation",children:"\ud83d\udc77 Creation"}),"\n",(0,r.jsx)(n.p,{children:"You can create a command repository by either:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Extending ",(0,r.jsx)(n.code,{children:"DefaultCommandRepository"})," from ",(0,r.jsx)(n.code,{children:"@framework"})," (recommended)."]}),"\n",(0,r.jsxs)(n.li,{children:["Implementing the ",(0,r.jsx)(n.code,{children:"CommandRepository"})," interface from ",(0,r.jsx)(n.code,{children:"@core"}),"."]}),"\n"]}),"\n",(0,r.jsxs)(a.Z,{children:[(0,r.jsx)(s.Z,{value:"Extending DefaultCommandRepository",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { DefaultCommandRepository } from '@nyx-discord/framework';\n\nclass MyCommandRepository extends DefaultCommandRepository {\n  // ...\n}\n\nconst myRepository = new MyCommandRepository();\n\nconst myBot = Bot.create((bot) => ({\n  commands: DefaultCommandManager.create(bot, client, clientBus, { repository: myRepository }),\n}));\n"})})}),(0,r.jsx)(s.Z,{value:"Implementing CommandRepository",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { CommandRepository } from '@nyx-discord/core';\n\nclass MyCommandRepository implements CommandRepository {\n  // ...\n}\n\nconst myRepository = new MyCommandRepository();\n\nconst myBot = Bot.create((bot) => ({\n  commands: DefaultCommandManager.create(bot, client, clientBus, { repository: myRepository }),\n}));\n"})})})]})]})}function p(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(m,{...e})}):m(e)}},9262:(e,n,t)=>{t.d(n,{Z:()=>s});t(2983);var r=t(8934);const o={tabItem:"tabItem_rG4d"};var a=t(7458);function s(e){let{children:n,hidden:t,className:s}=e;return(0,a.jsx)("div",{role:"tabpanel",className:(0,r.Z)(o.tabItem,s),hidden:t,children:n})}},52:(e,n,t)=>{t.d(n,{Z:()=>C});var r=t(2983),o=t(8934),a=t(3743),s=t(3729),i=t(2461),c=t(8239),l=t(7333),d=t(6927);function u(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function m(e){const{values:n,children:t}=e;return(0,r.useMemo)((()=>{const e=n??function(e){return u(e).map((e=>{let{props:{value:n,label:t,attributes:r,default:o}}=e;return{value:n,label:t,attributes:r,default:o}}))}(t);return function(e){const n=(0,l.l)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function p(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function h(e){let{queryString:n=!1,groupId:t}=e;const o=(0,s.k6)(),a=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,c._X)(a),(0,r.useCallback)((e=>{if(!a)return;const n=new URLSearchParams(o.location.search);n.set(a,e),o.replace({...o.location,search:n.toString()})}),[a,o])]}function f(e){const{defaultValue:n,queryString:t=!1,groupId:o}=e,a=m(e),[s,c]=(0,r.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!p({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const r=t.find((e=>e.default))??t[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:n,tabValues:a}))),[l,u]=h({queryString:t,groupId:o}),[f,y]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[o,a]=(0,d.Nk)(t);return[o,(0,r.useCallback)((e=>{t&&a.set(e)}),[t,a])]}({groupId:o}),b=(()=>{const e=l??f;return p({value:e,tabValues:a})?e:null})();(0,i.Z)((()=>{b&&c(b)}),[b]);return{selectedValue:s,selectValue:(0,r.useCallback)((e=>{if(!p({value:e,tabValues:a}))throw new Error(`Can't select invalid tab value=${e}`);c(e),u(e),y(e)}),[u,y,a]),tabValues:a}}var y=t(2034);const b={tabList:"tabList_I6mw",tabItem:"tabItem_Qvbi"};var g=t(7458);function x(e){let{className:n,block:t,selectedValue:r,selectValue:s,tabValues:i}=e;const c=[],{blockElementScrollPositionUntilNextRender:l}=(0,a.o5)(),d=e=>{const n=e.currentTarget,t=c.indexOf(n),o=i[t].value;o!==r&&(l(n),s(o))},u=e=>{let n=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const t=c.indexOf(e.currentTarget)+1;n=c[t]??c[0];break}case"ArrowLeft":{const t=c.indexOf(e.currentTarget)-1;n=c[t]??c[c.length-1];break}}n?.focus()};return(0,g.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":t},n),children:i.map((e=>{let{value:n,label:t,attributes:a}=e;return(0,g.jsx)("li",{role:"tab",tabIndex:r===n?0:-1,"aria-selected":r===n,ref:e=>c.push(e),onKeyDown:u,onClick:d,...a,className:(0,o.Z)("tabs__item",b.tabItem,a?.className,{"tabs__item--active":r===n}),children:t??n},n)}))})}function v(e){let{lazy:n,children:t,selectedValue:o}=e;const a=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=a.find((e=>e.props.value===o));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return(0,g.jsx)("div",{className:"margin-top--md",children:a.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==o})))})}function j(e){const n=f(e);return(0,g.jsxs)("div",{className:(0,o.Z)("tabs-container",b.tabList),children:[(0,g.jsx)(x,{...e,...n}),(0,g.jsx)(v,{...e,...n})]})}function C(e){const n=(0,y.Z)();return(0,g.jsx)(j,{...e,children:u(e.children)},String(n))}},6436:(e,n,t)=>{t.d(n,{Z:()=>i,a:()=>s});var r=t(2983);const o={},a=r.createContext(o);function s(e){const n=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:s(e.components),r.createElement(a.Provider,{value:n},e.children)}}}]);