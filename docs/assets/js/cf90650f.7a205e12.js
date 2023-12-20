"use strict";(self.webpackChunk_nyx_discord_docs=self.webpackChunk_nyx_discord_docs||[]).push([[6353],{2940:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>u,frontMatter:()=>r,metadata:()=>d,toc:()=>i});var t=s(7458),c=s(6436);const r={title:"\ufe0f\ud83d\udcbc Schedule Manager"},o=void 0,d={id:"features/schedules/schedule-manager",title:"\ufe0f\ud83d\udcbc Schedule Manager",description:"The ScheduleManager is the object that holds together the nyx schedule system.",source:"@site/docs/features/schedules/schedule-manager.mdx",sourceDirName:"features/schedules",slug:"/features/schedules/schedule-manager",permalink:"/nyx/docs/features/schedules/schedule-manager",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/features/schedules/schedule-manager.mdx",tags:[],version:"current",frontMatter:{title:"\ufe0f\ud83d\udcbc Schedule Manager"},sidebar:"nyxSidebar",previous:{title:"\ufe0f\ud83d\udee1\ufe0f Schedule Interception",permalink:"/nyx/docs/features/schedules/schedule-interception"},next:{title:"\ud83d\udd0d Schedule Execution Scheduler",permalink:"/nyx/docs/features/schedules/schedule-scheduler"}},l={},i=[{value:"\ud83d\udc77 Creation",id:"-creation",level:2}];function h(e){const n={code:"code",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,c.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.code,{children:"ScheduleManager"})," is the object that holds together the nyx schedule system."]}),"\n",(0,t.jsx)(n.p,{children:"It consists of:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"ScheduleExecutionScheduler"})," for tracking the execution of schedules."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"ScheduleRepository"})," for storing schedules."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"ScheduleExecutor"})," for executing schedules."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"EventBus"})," for emitting schedule related events."]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"As well as methods to interact with them."}),"\n",(0,t.jsx)(n.h2,{id:"-creation",children:"\ud83d\udc77 Creation"}),"\n",(0,t.jsx)(n.p,{children:"You can create a custom schedule manager by either:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["Extending ",(0,t.jsx)(n.code,{children:"DefaultScheduleManager"})," from ",(0,t.jsx)(n.code,{children:"@nyx-discord/framework"})," (recommended)."]}),"\n",(0,t.jsxs)(n.li,{children:["Implementing ",(0,t.jsx)(n.code,{children:"ScheduleManager"})," from ",(0,t.jsx)(n.code,{children:"@nyx-discord/core"}),"."]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"Then you can pass it to your bot:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"class MyScheduleManager extends DefaultScheduleManager {\n  // highlight-next-line\n  public myCustomPublicMethod() {}\n}\n\nconst myBot = Bot.create((bot: NyxBot) => ({\n  // ...\n\n  // highlight-next-line\n  schedules: new MyScheduleManager(/** ... */),\n}));\n\n// highlight-next-line\nmyBot.schedules.myCustomPublicMethod() // works!\n"})}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.code,{children:"Bot"})," class is able to infer the type of your custom manager via generics, so accessing any custom public method or\nproperty will work without errors."]})]})}function u(e={}){const{wrapper:n}={...(0,c.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(h,{...e})}):h(e)}},6436:(e,n,s)=>{s.d(n,{Z:()=>d,a:()=>o});var t=s(2983);const c={},r=t.createContext(c);function o(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:o(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);