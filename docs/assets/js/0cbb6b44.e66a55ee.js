"use strict";(self.webpackChunk_nyx_discord_docs=self.webpackChunk_nyx_discord_docs||[]).push([[6424],{5921:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>i,contentTitle:()=>c,default:()=>h,frontMatter:()=>l,metadata:()=>t,toc:()=>u});const t=JSON.parse('{"id":"features/commands/commands/subcommand","title":"\ufe0f\ud83e\udde9 SubCommand","description":"Subcommands are executable commands that are stored inside a \ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d\udc66 Parent Command or a \ud83d\uddc2\ufe0f SubCommand Group.","source":"@site/docs/features/commands/commands/subcommand.mdx","sourceDirName":"features/commands/commands","slug":"/features/commands/commands/subcommand","permalink":"/nyx/docs/features/commands/commands/subcommand","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/features/commands/commands/subcommand.mdx","tags":[],"version":"current","frontMatter":{"title":"\ufe0f\ud83e\udde9 SubCommand"},"sidebar":"nyxSidebar","previous":{"title":"\ufe0f\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d\udc66 Parent Command","permalink":"/nyx/docs/features/commands/commands/parent-command"},"next":{"title":"\ud83d\uddc2\ufe0f SubCommand Group","permalink":"/nyx/docs/features/commands/commands/subcommand-group"}}');var r=a(3159),o=a(5912),s=a(5610),d=a(7598);const l={title:"\ufe0f\ud83e\udde9 SubCommand"},c="\ufe0f\ud83e\udde9 SubCommand",i={},u=[{value:"\ud83d\udc77 Creation",id:"-creation",level:2}];function m(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"\ufe0f-subcommand",children:"\ufe0f\ud83e\udde9 SubCommand"})}),"\n","\n",(0,r.jsxs)(n.p,{children:["Subcommands are executable commands that are stored inside a ",(0,r.jsx)(n.a,{href:"./parent-command",children:(0,r.jsx)(n.code,{children:"\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d\udc66 Parent Command"})})," or a ",(0,r.jsx)(n.a,{href:"./subcommand-group",children:(0,r.jsx)(n.code,{children:"\ud83d\uddc2\ufe0f SubCommand Group"})}),"."]}),"\n",(0,r.jsx)(n.admonition,{type:"note",children:(0,r.jsxs)(n.p,{children:["While SubCommands don't depend on a specific bot, they do depend on their parent (",(0,r.jsx)(n.code,{children:"ParentCommand"})," or ",(0,r.jsx)(n.code,{children:"SubCommandGroup"}),")."]})}),"\n",(0,r.jsx)(n.h2,{id:"-creation",children:"\ud83d\udc77 Creation"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"Create a subcommand class by either:"}),"\n"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Extending ",(0,r.jsx)(n.code,{children:"AbstractSubCommand"})," from ",(0,r.jsx)(n.code,{children:"@framework"})," (recommended)."]}),"\n",(0,r.jsxs)(n.li,{children:["Implementing the ",(0,r.jsx)(n.code,{children:"SubCommand"})," interface from ",(0,r.jsx)(n.code,{children:"@core"}),"."]}),"\n"]}),"\n",(0,r.jsxs)(n.ol,{start:"2",children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["Implement ",(0,r.jsx)(n.code,{children:"createData()"})," that returns the DJS ",(0,r.jsx)(n.code,{children:"SlashCommandSubcommandBuilder"})," that stores the subcommand's data, and ",(0,r.jsx)(n.code,{children:"execute()"})," that executes the subcommand."]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["Add it to a ",(0,r.jsx)(n.code,{children:"ParentCommand"})," or ",(0,r.jsx)(n.code,{children:"SubCommandGroup"})," with ",(0,r.jsx)(n.code,{children:"#addChildren()"}),", or by overriding ",(0,r.jsx)(n.code,{children:"children"})," on its fields."]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(s.A,{children:[(0,r.jsx)(d.A,{value:"Extending AbstractSubCommand",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"class MySubCommand extends AbstractSubCommand {\n  protected createData() {\n    return new SlashCommandSubcommandBuilder()\n      .setName('hello')\n      .setDescription('Hello world!');\n  }\n\n  public async execute(\n    interaction: ChatInputCommandInteraction,\n    meta: CommandExecutionMeta\n  ) {\n    const bot = meta.getBot();\n    const botId = bot.getId();\n\n    await interaction.reply(`Hello from Bot ${String(botId)} from MySubCommand!`);\n  }\n}\n\n// highlight-start\n// The subCommandParent variable is the parent that will contain this subcommand,\n// whether a ParentCommand or a SubCommandGroup\nconst subCommand = new MySubCommand(subCommandParent);\n// highlight-end\n\n// warn-start\n// Throws IllegalDuplicateError if a child with that name already exists\n// Throws RangeError if no more children can be added to this command (25)\n// Throws AssertionError if this child's parent is not subCommandParent\nsubCommandParent.addChildren(subCommand);\n// warn-end\n"})})}),(0,r.jsx)(d.A,{value:"Implementing SubCommand",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"class MySubCommand implements SubCommand {\n  // ...\n}\n\n// highlight-start\n// The subCommandParent variable is the parent that will contain this subcommand,\n// whether a ParentCommand or a SubCommandGroup\nconst subCommand = new MySubCommand(subCommandParent);\n// highlight-end\n\n// warn-start\n// Throws IllegalDuplicateError if a child with that name already exists\n// Throws RangeError if no more children can be added to this command (25)\n// Throws AssertionError if this child's parent is not subCommandParent\nsubCommandParent.addChildren(subCommand);\n// warn-end\n"})})})]})]})}function h(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(m,{...e})}):m(e)}},7598:(e,n,a)=>{a.d(n,{A:()=>s});a(1855);var t=a(1271);const r={tabItem:"tabItem_Jk6b"};var o=a(3159);function s(e){let{children:n,hidden:a,className:s}=e;return(0,o.jsx)("div",{role:"tabpanel",className:(0,t.A)(r.tabItem,s),hidden:a,children:n})}},5610:(e,n,a)=>{a.d(n,{A:()=>w});var t=a(1855),r=a(1271),o=a(4303),s=a(3178),d=a(3782),l=a(7520),c=a(9665),i=a(9575);function u(e){return t.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,t.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function m(e){const{values:n,children:a}=e;return(0,t.useMemo)((()=>{const e=n??function(e){return u(e).map((e=>{let{props:{value:n,label:a,attributes:t,default:r}}=e;return{value:n,label:a,attributes:t,default:r}}))}(a);return function(e){const n=(0,c.XI)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,a])}function h(e){let{value:n,tabValues:a}=e;return a.some((e=>e.value===n))}function b(e){let{queryString:n=!1,groupId:a}=e;const r=(0,s.W6)(),o=function(e){let{queryString:n=!1,groupId:a}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:n,groupId:a});return[(0,l.aZ)(o),(0,t.useCallback)((e=>{if(!o)return;const n=new URLSearchParams(r.location.search);n.set(o,e),r.replace({...r.location,search:n.toString()})}),[o,r])]}function p(e){const{defaultValue:n,queryString:a=!1,groupId:r}=e,o=m(e),[s,l]=(0,t.useState)((()=>function(e){let{defaultValue:n,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!h({value:n,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const t=a.find((e=>e.default))??a[0];if(!t)throw new Error("Unexpected error: 0 tabValues");return t.value}({defaultValue:n,tabValues:o}))),[c,u]=b({queryString:a,groupId:r}),[p,f]=function(e){let{groupId:n}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(n),[r,o]=(0,i.Dv)(a);return[r,(0,t.useCallback)((e=>{a&&o.set(e)}),[a,o])]}({groupId:r}),x=(()=>{const e=c??p;return h({value:e,tabValues:o})?e:null})();(0,d.A)((()=>{x&&l(x)}),[x]);return{selectedValue:s,selectValue:(0,t.useCallback)((e=>{if(!h({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);l(e),u(e),f(e)}),[u,f,o]),tabValues:o}}var f=a(1342);const x={tabList:"tabList_Pkq_",tabItem:"tabItem_JbFz"};var C=a(3159);function g(e){let{className:n,block:a,selectedValue:t,selectValue:s,tabValues:d}=e;const l=[],{blockElementScrollPositionUntilNextRender:c}=(0,o.a_)(),i=e=>{const n=e.currentTarget,a=l.indexOf(n),r=d[a].value;r!==t&&(c(n),s(r))},u=e=>{let n=null;switch(e.key){case"Enter":i(e);break;case"ArrowRight":{const a=l.indexOf(e.currentTarget)+1;n=l[a]??l[0];break}case"ArrowLeft":{const a=l.indexOf(e.currentTarget)-1;n=l[a]??l[l.length-1];break}}n?.focus()};return(0,C.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.A)("tabs",{"tabs--block":a},n),children:d.map((e=>{let{value:n,label:a,attributes:o}=e;return(0,C.jsx)("li",{role:"tab",tabIndex:t===n?0:-1,"aria-selected":t===n,ref:e=>l.push(e),onKeyDown:u,onClick:i,...o,className:(0,r.A)("tabs__item",x.tabItem,o?.className,{"tabs__item--active":t===n}),children:a??n},n)}))})}function v(e){let{lazy:n,children:a,selectedValue:o}=e;const s=(Array.isArray(a)?a:[a]).filter(Boolean);if(n){const e=s.find((e=>e.props.value===o));return e?(0,t.cloneElement)(e,{className:(0,r.A)("margin-top--md",e.props.className)}):null}return(0,C.jsx)("div",{className:"margin-top--md",children:s.map(((e,n)=>(0,t.cloneElement)(e,{key:n,hidden:e.props.value!==o})))})}function j(e){const n=p(e);return(0,C.jsxs)("div",{className:(0,r.A)("tabs-container",x.tabList),children:[(0,C.jsx)(g,{...n,...e}),(0,C.jsx)(v,{...n,...e})]})}function w(e){const n=(0,f.A)();return(0,C.jsx)(j,{...e,children:u(e.children)},String(n))}},5912:(e,n,a)=>{a.d(n,{R:()=>s,x:()=>d});var t=a(1855);const r={},o=t.createContext(r);function s(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);