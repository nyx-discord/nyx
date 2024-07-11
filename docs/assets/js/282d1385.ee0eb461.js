"use strict";(self.webpackChunk_nyx_discord_docs=self.webpackChunk_nyx_discord_docs||[]).push([[3872],{4805:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>a,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>c,toc:()=>d});var i=s(7458),t=s(6436);const r={slug:"/",hide_title:!0,title:"\ud83c\udfe0 Welcome"},o=void 0,c={id:"welcome",title:"\ud83c\udfe0 Welcome",description:"---",source:"@site/docs/welcome.mdx",sourceDirName:".",slug:"/",permalink:"/nyx/docs/",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/welcome.mdx",tags:[],version:"current",frontMatter:{slug:"/",hide_title:!0,title:"\ud83c\udfe0 Welcome"},sidebar:"nyxSidebar",next:{title:"\ud83d\ude80 Start",permalink:"/nyx/docs/start"}},a={},d=[{value:"\ud83c\udf20 Introduction",id:"-introduction",level:2},{value:"\ud83d\udccb Packages",id:"-packages",level:2},{value:"\ud83d\udca0 Core",id:"-core",level:3},{value:"\ud83e\uddf1 Framework",id:"-framework",level:3},{value:"\u2753 Which package to install",id:"-which-package-to-install",level:3},{value:"\ud83d\udd1c Next...",id:"-next",level:2}];function l(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",strong:"strong",ul:"ul",...(0,t.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("div",{class:"text--center",children:(0,i.jsx)("img",{alt:"Nyx",src:"./img/nyx_docs.png"})}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.p,{children:"Hello there \ud83d\udc4b! Welcome to the Docusaurus documentation for nyx, a Discord.js Typescript bot framework."}),"\n",(0,i.jsx)(n.p,{children:"Here, you'll discover how to create your own bot using nyx, how to customize the framework and add new components to it."}),"\n",(0,i.jsx)(n.admonition,{type:"danger",children:(0,i.jsx)(n.p,{children:"nyx is not the best fit for beginners or simple bots. We assume you have some level of understanding of Typescript and\nDiscord.js."})}),"\n",(0,i.jsx)(n.h2,{id:"-introduction",children:"\ud83c\udf20 Introduction"}),"\n",(0,i.jsx)(n.p,{children:"nyx is a framework to build Discord.js bots in Typescript. The main ideas behind nyx are:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\u267b ",(0,i.jsx)(n.strong,{children:"Fully replaceable and extendable"}),". Every working component can be replaced by your own given it fits the required interface."]}),"\n",(0,i.jsxs)(n.li,{children:["\ud83e\uddf1 ",(0,i.jsx)(n.strong,{children:"Bare-bones"}),". ",(0,i.jsx)(n.code,{children:"@core"})," has no runtime dependencies, and ",(0,i.jsx)(n.code,{children:"@framework"})," has as little as possible, which you can replace either way."]}),"\n",(0,i.jsxs)(n.li,{children:["\ud83d\ude00 ",(0,i.jsx)(n.strong,{children:"Easy to understand and setup"}),". Hacky or unnecessarily messy internal code is avoided, and documentation like this guide or ",(0,i.jsx)(n.a,{href:"https://nyx-discord.github.io/nyx/typedoc/",children:"Typedoc"})," is provided."]}),"\n",(0,i.jsxs)(n.li,{children:["\ud83c\udf10 ",(0,i.jsx)(n.strong,{children:"DJS Native"}),". Nyx tries to reuse or pass DJS objects as much as possible to avoid falling behind on latest features or needing big rewrites when DJS changes."]}),"\n",(0,i.jsxs)(n.li,{children:["\ud83d\udcbb ",(0,i.jsx)(n.strong,{children:"Developer friendly"}),". Type safety, predictability, error handling and extensibility are some features that make nyx easy to work with."]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Currently, nyx has five main features, each with its own dedicated section. These are:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.a,{href:"/nyx/docs/features/commands/command-overview",children:"\ud83d\udcbb Commands"}),", for Discord application commands."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.a,{href:"/nyx/docs/features/events/event-overview",children:"\ud83d\udcf8 Events"}),", for subscribing to events, either from Discord.js or your own."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.a,{href:"/nyx/docs/features/schedules/schedule-overview",children:"\ufe0f\u23f0 Schedules"}),", for timed tasks."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.a,{href:"/nyx/docs/features/sessions/session-overview",children:"\ud83d\udc64 Sessions"}),", for user interaction sessions."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.a,{href:"./features/plugins/plugin-overview",children:"\ufe0f\ud83e\udde9 Plugins"}),", for plugins that extend nyx."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"-packages",children:"\ud83d\udccb Packages"}),"\n",(0,i.jsxs)(n.p,{children:["The framework is built with two packages: ",(0,i.jsx)(n.code,{children:"@nyx-discord/core"})," and ",(0,i.jsx)(n.code,{children:"@nyx-discord/framework"}),", abbreviated in the guide as ",(0,i.jsx)(n.code,{children:"@core"})," and ",(0,i.jsx)(n.code,{children:"@framework"}),"."]}),"\n",(0,i.jsx)(n.h3,{id:"-core",children:"\ud83d\udca0 Core"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Defines all the object templates (interfaces) and their relations for nyx, acting as the blueprint."}),"\n",(0,i.jsxs)(n.li,{children:["No runtime dependencies (since it doesn't have any actual code), only type dependencies which are ",(0,i.jsx)(n.code,{children:"discord.js"})," and ",(0,i.jsx)(n.code,{children:"@discordjs/collection"}),"."]}),"\n",(0,i.jsx)(n.li,{children:"It doesn't have any actual implementations, so it's not really usable by itself."}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"-framework",children:"\ud83e\uddf1 Framework"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Provides default, minimal implementations for ",(0,i.jsx)(n.code,{children:"@core"}),", making it directly usable."]}),"\n",(0,i.jsxs)(n.li,{children:["Its implementations are designed to depend on interfaces from ",(0,i.jsx)(n.code,{children:"@core"}),", rather than each other, making those dependencies fully replaceable by your own."]}),"\n",(0,i.jsx)(n.li,{children:'Minimal runtime dependencies due to its "bare bones" ideology.'}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"-which-package-to-install",children:"\u2753 Which package to install"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Most of the time, you'll want to use ",(0,i.jsx)(n.code,{children:"@framework"}),". Even if you want to include your own components, this library makes it easy to replace them via constructor injection."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["If you want to develop something for nyx, such as a plugin, you can depend only on ",(0,i.jsx)(n.code,{children:"@core"}),". This way, you can depend on the interfaces and not any actual implementations, ensuring that your component will work across all nyx implementations."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.admonition,{type:"danger",children:(0,i.jsxs)(n.p,{children:["These docs as a whole heavily assumes that you're using ",(0,i.jsx)(n.code,{children:"@framework"}),'\'s implementations. The terms "by\ndefault", "the base implementation", etc., all refer to these, as ',(0,i.jsx)(n.code,{children:"@core"})," doesn't have any."]})}),"\n",(0,i.jsx)(n.h2,{id:"-next",children:"\ud83d\udd1c Next..."}),"\n",(0,i.jsxs)(n.p,{children:["Check out the ",(0,i.jsx)(n.a,{href:"/nyx/docs/start",children:"\ud83d\ude80 Start"})," guide to get started on your first nyx bot!"]})]})}function h(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},6436:(e,n,s)=>{s.d(n,{Z:()=>c,a:()=>o});var i=s(2983);const t={},r=i.createContext(t);function o(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);