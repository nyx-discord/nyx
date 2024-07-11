"use strict";(self.webpackChunk_nyx_discord_docs=self.webpackChunk_nyx_discord_docs||[]).push([[5850],{9020:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>m,contentTitle:()=>c,default:()=>l,frontMatter:()=>o,metadata:()=>a,toc:()=>r});var d=s(7458),t=s(6436);const o={title:"\ud83d\udce3 Command Event Bus"},c=void 0,a={id:"features/commands/command-bus",title:"\ud83d\udce3 Command Event Bus",description:"The ScheduleEventBus emits command related events. It's stored by a CommandManager, and you can get it via",source:"@site/docs/features/commands/command-bus.mdx",sourceDirName:"features/commands",slug:"/features/commands/command-bus",permalink:"/nyx/docs/features/commands/command-bus",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/features/commands/command-bus.mdx",tags:[],version:"current",frontMatter:{title:"\ud83d\udce3 Command Event Bus"},sidebar:"nyxSidebar",previous:{title:"\ud83d\udc42 Command Subscriptions",permalink:"/nyx/docs/features/commands/command-subscribers"},next:{title:"\ufe0f\u23f0 Schedules",permalink:"/nyx/docs/features/schedules/schedule-overview"}},m={},r=[];function i(e){const n={code:"code",li:"li",p:"p",ul:"ul",...(0,t.a)(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsxs)(n.p,{children:["The ",(0,d.jsx)(n.code,{children:"ScheduleEventBus"})," emits command related events. It's stored by a ",(0,d.jsx)(n.code,{children:"CommandManager"}),", and you can get it via\n",(0,d.jsx)(n.code,{children:"CommandManager#getEventBus()"}),"."]}),"\n",(0,d.jsx)(n.p,{children:"Currently, these events are:"}),"\n",(0,d.jsxs)(n.ul,{children:["\n",(0,d.jsxs)(n.li,{children:[(0,d.jsx)(n.code,{children:"CommandAdd"})," - A top level command was added. Passes the added ",(0,d.jsx)(n.code,{children:"TopLevelCommand"}),"."]}),"\n",(0,d.jsxs)(n.li,{children:[(0,d.jsx)(n.code,{children:"CommandRemove"})," - A top level command was removed. Passes the removed ",(0,d.jsx)(n.code,{children:"TopLevelCommand"}),"."]}),"\n",(0,d.jsxs)(n.li,{children:[(0,d.jsx)(n.code,{children:"CommandUpdate"})," - A top level command was updated. Passes the updated ",(0,d.jsx)(n.code,{children:"TopLevelCommand"}),"."]}),"\n",(0,d.jsxs)(n.li,{children:[(0,d.jsx)(n.code,{children:"CommandRun"})," - An executable command was run. Passes the ",(0,d.jsx)(n.code,{children:"ExecutableCommand"}),", the ",(0,d.jsx)(n.code,{children:"CommandExecutableInteraction"})," and the ",(0,d.jsx)(n.code,{children:"CommandExecutionMeta"}),"."]}),"\n",(0,d.jsxs)(n.li,{children:[(0,d.jsx)(n.code,{children:"CommandAutocomplete"})," - An executable command's autocompletion was called. Passes the ",(0,d.jsx)(n.code,{children:"ExecutableCommand"}),", the ",(0,d.jsx)(n.code,{children:"CommandAutocompleteInteraction"}),", the ",(0,d.jsx)(n.code,{children:"CommandExecutionMeta"})," and the answered ",(0,d.jsx)(n.code,{children:"ApplicationCommandOptionChoiceData[]"}),"."]}),"\n"]}),"\n",(0,d.jsxs)(n.p,{children:["You can get these events from the ",(0,d.jsx)(n.code,{children:"CommandEventEnum"})," enum on ",(0,d.jsx)(n.code,{children:"@core"}),"."]})]})}function l(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,d.jsx)(n,{...e,children:(0,d.jsx)(i,{...e})}):i(e)}},6436:(e,n,s)=>{s.d(n,{Z:()=>a,a:()=>c});var d=s(2983);const t={},o=d.createContext(t);function c(e){const n=d.useContext(o);return d.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:c(e.components),d.createElement(o.Provider,{value:n},e.children)}}}]);