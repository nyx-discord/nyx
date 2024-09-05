"use strict";(self.webpackChunk_nyx_discord_docs=self.webpackChunk_nyx_discord_docs||[]).push([[2787],{4953:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>u,default:()=>d,frontMatter:()=>r,metadata:()=>o,toc:()=>a});var s=t(7458),i=t(6436);const r={title:"\ud83e\udde9 Plugins"},u=void 0,o={id:"features/plugins/plugin-overview",title:"\ud83e\udde9 Plugins",description:"Hey there \ud83d\udc4b!  This guide is here to document what nyx plugins are, and how you can use them.",source:"@site/docs/features/plugins/plugin-overview.mdx",sourceDirName:"features/plugins",slug:"/features/plugins/plugin-overview",permalink:"/nyx/docs/features/plugins/plugin-overview",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/features/plugins/plugin-overview.mdx",tags:[],version:"current",frontMatter:{title:"\ud83e\udde9 Plugins"}},c={},a=[{value:"\ud83e\udde9 Plugins",id:"-plugins",level:2}];function l(e){const n={code:"code",h2:"h2",p:"p",pre:"pre",...(0,i.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"Hey there \ud83d\udc4b!  This guide is here to document what nyx plugins are, and how you can use them."}),"\n",(0,s.jsx)(n.h2,{id:"-plugins",children:"\ud83e\udde9 Plugins"}),"\n",(0,s.jsx)(n.p,{children:"Plugins are objects that can be used to pack nyx's functionality, such as commands, events, schedules and sessions."}),"\n",(0,s.jsxs)(n.p,{children:["You can create a plugin by implementing the ",(0,s.jsx)(n.code,{children:"NyxPlugin"})," interface."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"import { NyxPlugin } from '@nyx-discord/core';\n\nclass MyPlugin implements NyxPlugin {\n // ...\n}\n\nconst myPlugin = new MyPlugin();\n\nawait bot.getPluginManager().register(myPlugin);\n"})})]})}function d(e={}){const{wrapper:n}={...(0,i.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},6436:(e,n,t)=>{t.d(n,{Z:()=>o,a:()=>u});var s=t(2983);const i={},r=s.createContext(i);function u(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:u(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);