"use strict";(self.webpackChunk_nyx_discord_docs=self.webpackChunk_nyx_discord_docs||[]).push([[1547],{632:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>s,default:()=>h,frontMatter:()=>d,metadata:()=>l,toc:()=>m});var r=t(7458),a=t(6436),i=t(52),o=t(9262);const d={title:"\ufe0f\ud83d\udee1\ufe0f Command Interception"},s=void 0,l={id:"features/commands/command-interception",title:"\ufe0f\ud83d\udee1\ufe0f Command Interception",description:"Command interception refers to blocking a command from being executed. In nyx, there are two ways to do this:",source:"@site/docs/features/commands/command-interception.mdx",sourceDirName:"features/commands",slug:"/features/commands/command-interception",permalink:"/docs/features/commands/command-interception",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/features/commands/command-interception.mdx",tags:[],version:"current",frontMatter:{title:"\ufe0f\ud83d\udee1\ufe0f Command Interception"},sidebar:"nyxSidebar",previous:{title:"\ud83d\uddc2\ufe0f SubCommand Group",permalink:"/docs/features/commands/commands/subcommand-group"},next:{title:"\ufe0f\ud83d\udcbc Command Manager",permalink:"/docs/features/commands/command-manager"}},c={},m=[{value:"\ud83d\udea6 Command Middlewares",id:"-command-middlewares",level:2},{value:"\u2753 When to use a middleware?",id:"-when-to-use-a-middleware",level:3},{value:"\ud83d\udc77\u200d Middleware Creation",id:"-middleware-creation",level:3},{value:"\ud83d\udea7 Command Filters",id:"-command-filters",level:2},{value:"\u2753 When to use a filter?",id:"-when-to-use-a-filter",level:3},{value:"\ud83d\udc77\u200d Filter Creation",id:"-filter-creation",level:3}];function u(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,a.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.p,{children:"Command interception refers to blocking a command from being executed. In nyx, there are two ways to do this:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["Add a ",(0,r.jsx)(n.code,{children:"CommandMiddleware"})," to the ",(0,r.jsx)(n.code,{children:"CommandMiddlewareLinkedList"})," in the ",(0,r.jsx)(n.code,{children:"CommandExecutor"})," that handles\nthe command execution."]}),"\n",(0,r.jsxs)(n.li,{children:["Provide a ",(0,r.jsx)(n.code,{children:"CommandFilter"})," in the ",(0,r.jsx)(n.code,{children:"ExecutableCommand"}),"."]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"Let's explore when and how to use each of these methods."}),"\n",(0,r.jsx)(n.h2,{id:"-command-middlewares",children:"\ud83d\udea6 Command Middlewares"}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"CommandMiddlewares"})," are objects stored on a ",(0,r.jsx)(n.code,{children:"CommandMiddlewareLinkedList"}),", which is held and called by\nthe command executor when a command is about to be executed."]}),"\n",(0,r.jsx)(n.p,{children:"It consists of:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["A ",(0,r.jsx)(n.code,{children:"check()"})," method, which takes a command and its arguments. Returns a ",(0,r.jsx)(n.code,{children:"MiddlewareResponse"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["A ",(0,r.jsx)(n.code,{children:"Priority"}),", that determines its priority inside the list."]}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["When being checked, a middleware is passed the command that is being checked and the arguments that would be\nused to call it. The middleware then replies with a ",(0,r.jsx)(n.code,{children:"MiddlewareResponse"}),", which can either:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Allow the execution (",(0,r.jsx)(n.code,{children:"{ allowed: true }"}),"), with either:"]}),"\n",(0,r.jsxs)(n.li,{children:["Making the linked list check the next middleware (",(0,r.jsx)(n.code,{children:"{ allowed: true, checkNext: true }"}),")."]}),"\n",(0,r.jsxs)(n.li,{children:["Forcing the chain to end (",(0,r.jsx)(n.code,{children:"{ allowed: true, checkNext: false }"}),")."]}),"\n",(0,r.jsxs)(n.li,{children:["Deny the execution (",(0,r.jsx)(n.code,{children:"{ allowed: false, checkNext: false }"}),")."]}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.code,{children:"AbstractMiddleware"}),", has ",(0,r.jsx)(n.code,{children:"protected"})," utility methods to generate these responses. Specifically, ",(0,r.jsx)(n.code,{children:"this.true()"}),",\n",(0,r.jsx)(n.code,{children:"this.false()"})," and ",(0,r.jsx)(n.code,{children:"this.forceTrue()"}),"."]}),"\n",(0,r.jsx)(n.admonition,{type:"info",children:(0,r.jsx)(n.p,{children:"Middlewares are not bot aware, meaning that you can reuse the same instance for many bots."})}),"\n",(0,r.jsx)(n.h3,{id:"-when-to-use-a-middleware",children:"\u2753 When to use a middleware?"}),"\n",(0,r.jsxs)(n.p,{children:["Middlewares are best for executing something or intercepting for all commands. For example, the filtering\n(",(0,r.jsx)(n.code,{children:"CommandFilter"}),") logic is done by a middleware."]}),"\n",(0,r.jsxs)(n.p,{children:["They're very good when intercepting ",(0,r.jsx)(n.code,{children:"ExecutableCommands"})," in general, but not really for one in particular, since it\nwould be very inefficient to check all the commands searching for only one of them."]}),"\n",(0,r.jsx)(n.h3,{id:"-middleware-creation",children:"\ud83d\udc77\u200d Middleware Creation"}),"\n",(0,r.jsx)(n.p,{children:"You can create your own middleware by either:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Extending ",(0,r.jsx)(n.code,{children:"AbstractCommandMiddleware"})," from ",(0,r.jsx)(n.code,{children:"@framework"})," (recommended)."]}),"\n",(0,r.jsxs)(n.li,{children:["Implementing the ",(0,r.jsx)(n.code,{children:"CommandMiddleware"})," interface from ",(0,r.jsx)(n.code,{children:"@core"}),"."]}),"\n"]}),"\n",(0,r.jsxs)(i.Z,{children:[(0,r.jsx)(o.Z,{value:"Extending AbstractCommandMiddleware",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { AbstractCommandMiddleware } from '@nyx-discord/framework';\n\nclass MyCommandMiddleware extends AbstractCommandMiddleware {\n  public check(command: ExecutableCommand<CommandData>, args: CommandExecutionArgs): MiddlewareResponse {\n    return this.true();\n  }\n}\n\nconst middleware = new MyCommandMiddleware();\n\nbot.commands.getExecutor().getMiddleware().add(middleware);\n"})})}),(0,r.jsx)(o.Z,{value:"Implementing CommandMiddleware",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { CommandMiddleware } from '@nyx-discord/core';\n\nclass MyCommandMiddleware implements CommandMiddleware {\n  // ...\n}\n\nconst middleware = new MyCommandMiddleware();\n\nbot.commands.getExecutor().getMiddleware().add(middleware);\n"})})})]}),"\n",(0,r.jsx)(n.p,{children:"By default, the following middleware chain is used:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"CommandFilterCheckMiddleware"})," - See ",(0,r.jsx)(n.a,{href:"#-command-filters",children:"\ud83d\udea7 Command Filters"}),"."]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"-command-filters",children:"\ud83d\udea7 Command Filters"}),"\n",(0,r.jsxs)(n.p,{children:["An ",(0,r.jsx)(n.code,{children:"CommandFilter"})," is a nullable object provided by an ",(0,r.jsx)(n.code,{children:"ExecutableCommand"}),", checked by the ",(0,r.jsx)(n.code,{children:"CommandFilterCheckMiddleware"}),"."]}),"\n",(0,r.jsx)(n.admonition,{type:"info",children:(0,r.jsx)(n.p,{children:"Filters are not bot aware nor command aware, meaning that you can reuse the same instance for many commands."})}),"\n",(0,r.jsx)(n.admonition,{type:"tip",children:(0,r.jsxs)(n.p,{children:["Think of a filter like adding an ",(0,r.jsx)(n.code,{children:"if"})," at the beginning of your command's execution, except it gets checked before the\ncommand is executed and, since it's an object, you can reuse it for multiple commands or save state on it."]})}),"\n",(0,r.jsxs)(n.p,{children:["Though commands can only provide one filter, ",(0,r.jsx)(n.code,{children:"@framework"})," provides utility filter aggregators that implement the\nbasic ",(0,r.jsx)(n.code,{children:"AND"}),", ",(0,r.jsx)(n.code,{children:"OR"}),", ",(0,r.jsx)(n.code,{children:"NOT"}),' gates, that can help you "combine" multiple filters into one.']}),"\n",(0,r.jsx)(n.h3,{id:"-when-to-use-a-filter",children:"\u2753 When to use a filter?"}),"\n",(0,r.jsx)(n.p,{children:"Filters are best suited for sharing common conditions that multiple commands should share before executing."}),"\n",(0,r.jsxs)(n.p,{children:["Also, since they have access to the command that is being filtered and the ",(0,r.jsx)(n.code,{children:"CommandExecutionMeta"}),' object, filters can\nshare information to the command, effectively working as a "pre-processor".']}),"\n",(0,r.jsx)(n.h3,{id:"-filter-creation",children:"\ud83d\udc77\u200d Filter Creation"}),"\n",(0,r.jsx)(n.p,{children:"You can create your own filter by either:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Extending ",(0,r.jsx)(n.code,{children:"AbstractCommandFilter"})," from ",(0,r.jsx)(n.code,{children:"@framework"})," (recommended)."]}),"\n",(0,r.jsxs)(n.li,{children:["Implementing the ",(0,r.jsx)(n.code,{children:"CommandFilter"})," interface from ",(0,r.jsx)(n.code,{children:"@core"}),"."]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(u,{...e})}):u(e)}},9262:(e,n,t)=>{t.d(n,{Z:()=>o});t(2983);var r=t(8934);const a={tabItem:"tabItem_rG4d"};var i=t(7458);function o(e){let{children:n,hidden:t,className:o}=e;return(0,i.jsx)("div",{role:"tabpanel",className:(0,r.Z)(a.tabItem,o),hidden:t,children:n})}},52:(e,n,t)=>{t.d(n,{Z:()=>y});var r=t(2983),a=t(8934),i=t(3743),o=t(3729),d=t(2461),s=t(8239),l=t(7333),c=t(6927);function m(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function u(e){const{values:n,children:t}=e;return(0,r.useMemo)((()=>{const e=n??function(e){return m(e).map((e=>{let{props:{value:n,label:t,attributes:r,default:a}}=e;return{value:n,label:t,attributes:r,default:a}}))}(t);return function(e){const n=(0,l.l)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function h(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function x(e){let{queryString:n=!1,groupId:t}=e;const a=(0,o.k6)(),i=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,s._X)(i),(0,r.useCallback)((e=>{if(!i)return;const n=new URLSearchParams(a.location.search);n.set(i,e),a.replace({...a.location,search:n.toString()})}),[i,a])]}function f(e){const{defaultValue:n,queryString:t=!1,groupId:a}=e,i=u(e),[o,s]=(0,r.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!h({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const r=t.find((e=>e.default))??t[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:n,tabValues:i}))),[l,m]=x({queryString:t,groupId:a}),[f,p]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[a,i]=(0,c.Nk)(t);return[a,(0,r.useCallback)((e=>{t&&i.set(e)}),[t,i])]}({groupId:a}),b=(()=>{const e=l??f;return h({value:e,tabValues:i})?e:null})();(0,d.Z)((()=>{b&&s(b)}),[b]);return{selectedValue:o,selectValue:(0,r.useCallback)((e=>{if(!h({value:e,tabValues:i}))throw new Error(`Can't select invalid tab value=${e}`);s(e),m(e),p(e)}),[m,p,i]),tabValues:i}}var p=t(2034);const b={tabList:"tabList_I6mw",tabItem:"tabItem_Qvbi"};var j=t(7458);function w(e){let{className:n,block:t,selectedValue:r,selectValue:o,tabValues:d}=e;const s=[],{blockElementScrollPositionUntilNextRender:l}=(0,i.o5)(),c=e=>{const n=e.currentTarget,t=s.indexOf(n),a=d[t].value;a!==r&&(l(n),o(a))},m=e=>{let n=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const t=s.indexOf(e.currentTarget)+1;n=s[t]??s[0];break}case"ArrowLeft":{const t=s.indexOf(e.currentTarget)-1;n=s[t]??s[s.length-1];break}}n?.focus()};return(0,j.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.Z)("tabs",{"tabs--block":t},n),children:d.map((e=>{let{value:n,label:t,attributes:i}=e;return(0,j.jsx)("li",{role:"tab",tabIndex:r===n?0:-1,"aria-selected":r===n,ref:e=>s.push(e),onKeyDown:m,onClick:c,...i,className:(0,a.Z)("tabs__item",b.tabItem,i?.className,{"tabs__item--active":r===n}),children:t??n},n)}))})}function g(e){let{lazy:n,children:t,selectedValue:a}=e;const i=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=i.find((e=>e.props.value===a));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return(0,j.jsx)("div",{className:"margin-top--md",children:i.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==a})))})}function v(e){const n=f(e);return(0,j.jsxs)("div",{className:(0,a.Z)("tabs-container",b.tabList),children:[(0,j.jsx)(w,{...e,...n}),(0,j.jsx)(g,{...e,...n})]})}function y(e){const n=(0,p.Z)();return(0,j.jsx)(v,{...e,children:m(e.children)},String(n))}},6436:(e,n,t)=>{t.d(n,{Z:()=>d,a:()=>o});var r=t(2983);const a={},i=r.createContext(a);function o(e){const n=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),r.createElement(i.Provider,{value:n},e.children)}}}]);