"use strict";(self.webpackChunk_nyx_discord_docs=self.webpackChunk_nyx_discord_docs||[]).push([[5013],{4856:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>a,default:()=>l,frontMatter:()=>r,metadata:()=>c,toc:()=>i});var s=t(7458),o=t(6436);const r={title:"\ufe0f\ud83d\udcbc Command Manager"},a=void 0,c={id:"features/commands/command-manager",title:"\ufe0f\ud83d\udcbc Command Manager",description:"The CommandManager is the object that holds together the nyx event system.",source:"@site/docs/features/commands/command-manager.mdx",sourceDirName:"features/commands",slug:"/features/commands/command-manager",permalink:"/nyx/docs/features/commands/command-manager",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/features/commands/command-manager.mdx",tags:[],version:"current",frontMatter:{title:"\ufe0f\ud83d\udcbc Command Manager"},sidebar:"nyxSidebar",previous:{title:"\ufe0f\ud83d\udee1\ufe0f Command Interception",permalink:"/nyx/docs/features/commands/command-interception"},next:{title:"\ud83d\udcac Command CustomId Codec",permalink:"/nyx/docs/features/commands/command-customid-codec"}},d={},i=[{value:"\ud83d\udc77 Creation",id:"-creation",level:2}];function m(e){const n={a:"a",code:"code",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,o.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"CommandManager"})," is the object that holds together the nyx event system."]}),"\n",(0,s.jsx)(n.p,{children:"It consists of:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"CommandCustomIdCodec"}),": De/serializes commands names to/from customId strings, useful for creating message components that will trigger commands."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"CommandResolver"}),": Resolves the command data that a given command interaction refers to."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"CommandExecutor"}),": Executes command objects, checking its ",(0,s.jsx)(n.code,{children:"CommandMiddlewareList"})," and passing any errors to its ",(0,s.jsx)(n.code,{children:"ErrorHandler"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"CommandRepository"}),": Stores all the currently registered commands and their command application mappings. It's also responsible for registering commands at Discord."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"CommandSubscriptionsContainer"}),": Stores the ",(0,s.jsx)(n.a,{href:"../events/event-subscriber",children:"\ud83d\udce9 Event Subscribers"})," that are subscribed to the ",(0,s.jsx)(n.a,{href:"/nyx/docs/features/events/event-manager#-client-event-bus",children:"\ud83d\udc42 Client event bus"})," to listen for command interactions."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"EventBus"}),": An ",(0,s.jsx)(n.a,{href:"../events/event-bus",children:"\ud83d\udce3 Event Bus"})," that emits command related events."]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"As well as methods to interact with them."}),"\n",(0,s.jsx)(n.h2,{id:"-creation",children:"\ud83d\udc77 Creation"}),"\n",(0,s.jsx)(n.p,{children:"You can create a custom command manager by either:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["Extending ",(0,s.jsx)(n.code,{children:"DefaultCommandManager"})," from ",(0,s.jsx)(n.code,{children:"@nyx-discord/framework"})," (recommended)."]}),"\n",(0,s.jsxs)(n.li,{children:["Implementing ",(0,s.jsx)(n.code,{children:"CommandManager"})," from ",(0,s.jsx)(n.code,{children:"@nyx-discord/core"}),"."]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Then you can pass it to your bot:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"class MyCommandManager extends DefaultCommandManager {\n  // highlight-next-line\n  public myCustomPublicMethod() {}\n}\n\nconst myBot = Bot.create((bot: NyxBot) => ({\n  // ...\n\n  // highlight-next-line\n  events: new MyCommandManager(/** ... */),\n}));\n\n// highlight-next-line\nmyBot.getCommandManager().myCustomPublicMethod() // works!\n"})}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"Bot"})," class is able to infer the type of your custom manager via generics, so accessing any custom public method or\nproperty will work without errors."]})]})}function l(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(m,{...e})}):m(e)}},6436:(e,n,t)=>{t.d(n,{Z:()=>c,a:()=>a});var s=t(2983);const o={},r=s.createContext(o);function a(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:a(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);