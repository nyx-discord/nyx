"use strict";(self.webpackChunk_nyx_discord_docs=self.webpackChunk_nyx_discord_docs||[]).push([[8992],{7030:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>u,contentTitle:()=>i,default:()=>p,frontMatter:()=>c,metadata:()=>t,toc:()=>d});const t=JSON.parse('{"id":"features/commands/command-deployer","title":"\ud83e\ude90 Command Deployer","description":"The CommandDeployer is the object responsible for deploying commands. It\'s stored by a CommandManager, and you can get","source":"@site/docs/features/commands/command-deployer.mdx","sourceDirName":"features/commands","slug":"/features/commands/command-deployer","permalink":"/nyx/docs/features/commands/command-deployer","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/features/commands/command-deployer.mdx","tags":[],"version":"current","frontMatter":{"title":"\ud83e\ude90 Command Deployer"},"sidebar":"nyxSidebar","previous":{"title":"\ud83d\udcd4 Command Repository","permalink":"/nyx/docs/features/commands/command-repository"},"next":{"title":"\ufe0f\ud83d\udd00 Command Resolver","permalink":"/nyx/docs/features/commands/command-resolver"}}');var a=r(3159),o=r(5912),s=r(5610),l=r(7598);const c={title:"\ud83e\ude90 Command Deployer"},i="\ud83e\ude90 Command Deployer",u={},d=[{value:"\ud83d\udc77 Creation",id:"-creation",level:2}];function m(e){const n={code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,o.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.header,{children:(0,a.jsx)(n.h1,{id:"-command-deployer",children:"\ud83e\ude90 Command Deployer"})}),"\n","\n",(0,a.jsxs)(n.p,{children:["The ",(0,a.jsx)(n.code,{children:"CommandDeployer"})," is the object responsible for deploying commands. It's stored by a ",(0,a.jsx)(n.code,{children:"CommandManager"}),", and you can get\nit via ",(0,a.jsx)(n.code,{children:"CommandManager#getDeployer()"}),"."]}),"\n",(0,a.jsxs)(n.p,{children:["You can't modify the repository directly since the ",(0,a.jsx)(n.code,{children:"CommandManager"})," returns a ",(0,a.jsx)(n.code,{children:"ReadonlyCommandDeployer"})," type, but the\nhidden methods are available at the ",(0,a.jsx)(n.code,{children:"CommandManager"}),". This is because adding, removing and updating a command needs more\nlogic than just modifying the repository, and the manager is responsible for coordinating this."]}),"\n",(0,a.jsx)(n.h2,{id:"-creation",children:"\ud83d\udc77 Creation"}),"\n",(0,a.jsx)(n.p,{children:"You can create a command deployer by either:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["Extending ",(0,a.jsx)(n.code,{children:"DefaultCommandDeployer"})," from ",(0,a.jsx)(n.code,{children:"@framework"})," (recommended)."]}),"\n",(0,a.jsxs)(n.li,{children:["Implementing the ",(0,a.jsx)(n.code,{children:"CommandDeployer"})," interface from ",(0,a.jsx)(n.code,{children:"@core"}),"."]}),"\n"]}),"\n",(0,a.jsxs)(s.A,{children:[(0,a.jsx)(l.A,{value:"Extending DefaultCommandDeployer",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-ts",children:"class MyCommandDeployer extends DefaultCommandDeployer {\n  // ...\n}\n\nconst myBot = Bot.create((bot) => ({\n  commands: DefaultCommandManager.create(bot, client, clientBus, { deployer: myDeployer }),\n}))\n"})})}),(0,a.jsx)(l.A,{value:"Implementing CommandDeployer",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-ts",children:"class MyCommandDeployer implements CommandDeployer {\n  // ...\n}\n\nconst myBot = Bot.create((bot) => ({\n  commands: DefaultCommandManager.create(bot, client, clientBus, { deployer: myDeployer }),\n}))\n"})})})]})]})}function p(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(m,{...e})}):m(e)}},7598:(e,n,r)=>{r.d(n,{A:()=>s});r(1855);var t=r(1271);const a={tabItem:"tabItem_Jk6b"};var o=r(3159);function s(e){let{children:n,hidden:r,className:s}=e;return(0,o.jsx)("div",{role:"tabpanel",className:(0,t.A)(a.tabItem,s),hidden:r,children:n})}},5610:(e,n,r)=>{r.d(n,{A:()=>C});var t=r(1855),a=r(1271),o=r(4303),s=r(3178),l=r(3782),c=r(7520),i=r(9665),u=r(9575);function d(e){return t.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,t.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function m(e){const{values:n,children:r}=e;return(0,t.useMemo)((()=>{const e=n??function(e){return d(e).map((e=>{let{props:{value:n,label:r,attributes:t,default:a}}=e;return{value:n,label:r,attributes:t,default:a}}))}(r);return function(e){const n=(0,i.XI)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,r])}function p(e){let{value:n,tabValues:r}=e;return r.some((e=>e.value===n))}function h(e){let{queryString:n=!1,groupId:r}=e;const a=(0,s.W6)(),o=function(e){let{queryString:n=!1,groupId:r}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!r)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return r??null}({queryString:n,groupId:r});return[(0,c.aZ)(o),(0,t.useCallback)((e=>{if(!o)return;const n=new URLSearchParams(a.location.search);n.set(o,e),a.replace({...a.location,search:n.toString()})}),[o,a])]}function f(e){const{defaultValue:n,queryString:r=!1,groupId:a}=e,o=m(e),[s,c]=(0,t.useState)((()=>function(e){let{defaultValue:n,tabValues:r}=e;if(0===r.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!p({value:n,tabValues:r}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${r.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const t=r.find((e=>e.default))??r[0];if(!t)throw new Error("Unexpected error: 0 tabValues");return t.value}({defaultValue:n,tabValues:o}))),[i,d]=h({queryString:r,groupId:a}),[f,b]=function(e){let{groupId:n}=e;const r=function(e){return e?`docusaurus.tab.${e}`:null}(n),[a,o]=(0,u.Dv)(r);return[a,(0,t.useCallback)((e=>{r&&o.set(e)}),[r,o])]}({groupId:a}),y=(()=>{const e=i??f;return p({value:e,tabValues:o})?e:null})();(0,l.A)((()=>{y&&c(y)}),[y]);return{selectedValue:s,selectValue:(0,t.useCallback)((e=>{if(!p({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);c(e),d(e),b(e)}),[d,b,o]),tabValues:o}}var b=r(1342);const y={tabList:"tabList_Pkq_",tabItem:"tabItem_JbFz"};var g=r(3159);function x(e){let{className:n,block:r,selectedValue:t,selectValue:s,tabValues:l}=e;const c=[],{blockElementScrollPositionUntilNextRender:i}=(0,o.a_)(),u=e=>{const n=e.currentTarget,r=c.indexOf(n),a=l[r].value;a!==t&&(i(n),s(a))},d=e=>{let n=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const r=c.indexOf(e.currentTarget)+1;n=c[r]??c[0];break}case"ArrowLeft":{const r=c.indexOf(e.currentTarget)-1;n=c[r]??c[c.length-1];break}}n?.focus()};return(0,g.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.A)("tabs",{"tabs--block":r},n),children:l.map((e=>{let{value:n,label:r,attributes:o}=e;return(0,g.jsx)("li",{role:"tab",tabIndex:t===n?0:-1,"aria-selected":t===n,ref:e=>c.push(e),onKeyDown:d,onClick:u,...o,className:(0,a.A)("tabs__item",y.tabItem,o?.className,{"tabs__item--active":t===n}),children:r??n},n)}))})}function v(e){let{lazy:n,children:r,selectedValue:o}=e;const s=(Array.isArray(r)?r:[r]).filter(Boolean);if(n){const e=s.find((e=>e.props.value===o));return e?(0,t.cloneElement)(e,{className:(0,a.A)("margin-top--md",e.props.className)}):null}return(0,g.jsx)("div",{className:"margin-top--md",children:s.map(((e,n)=>(0,t.cloneElement)(e,{key:n,hidden:e.props.value!==o})))})}function j(e){const n=f(e);return(0,g.jsxs)("div",{className:(0,a.A)("tabs-container",y.tabList),children:[(0,g.jsx)(x,{...n,...e}),(0,g.jsx)(v,{...n,...e})]})}function C(e){const n=(0,b.A)();return(0,g.jsx)(j,{...e,children:d(e.children)},String(n))}},5912:(e,n,r)=>{r.d(n,{R:()=>s,x:()=>l});var t=r(1855);const a={},o=t.createContext(a);function s(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:s(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);