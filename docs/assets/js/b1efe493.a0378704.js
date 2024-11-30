"use strict";(self.webpackChunk_nyx_discord_docs=self.webpackChunk_nyx_discord_docs||[]).push([[3630],{6247:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>c,default:()=>p,frontMatter:()=>l,metadata:()=>s,toc:()=>u});const s=JSON.parse('{"id":"features/sessions/types/pagination-session","title":"\ud83d\udd22 Pagination Session","description":"It\'s recommended that you first read the \ufe0f\ud83d\udc64 Session documentation, since this is an extension of it.","source":"@site/docs/features/sessions/types/pagination-session.mdx","sourceDirName":"features/sessions/types","slug":"/features/sessions/types/pagination-session","permalink":"/nyx/docs/features/sessions/types/pagination-session","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/features/sessions/types/pagination-session.mdx","tags":[],"version":"current","frontMatter":{"title":"\ud83d\udd22 Pagination Session"},"sidebar":"nyxSidebar","previous":{"title":"\ufe0f\ud83d\udc64 Session","permalink":"/nyx/docs/features/sessions/types/session"},"next":{"title":"\ud83d\udce6 List Pagination Session","permalink":"/nyx/docs/features/sessions/types/list-pagination-session"}}');var i=t(3159),o=t(5912),a=t(5610),r=t(7598);const l={title:"\ud83d\udd22 Pagination Session"},c=void 0,d={},u=[{value:"\ud83d\udc77 Creation",id:"-creation",level:2},{value:"\ud83d\udcac Pagination Custom Ids",id:"-pagination-custom-ids",level:2},{value:"\u2728 Component Examples",id:"-component-examples",level:3},{value:"\ud83e\udde9 Utility methods",id:"-utility-methods",level:2}];function h(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.admonition,{title:"Pre-knowledge",type:"tip",children:(0,i.jsxs)(n.p,{children:["It's recommended that you first read the ",(0,i.jsx)(n.a,{href:"./session",children:"\ufe0f\ud83d\udc64 Session"})," documentation, since this is an extension of it."]})}),"\n",(0,i.jsxs)(n.p,{children:["A ",(0,i.jsx)(n.code,{children:"PaginationSession"})," is a special type of session made to be paginated (have pages)."]}),"\n",(0,i.jsx)(n.p,{children:"From a manager's perspective, a pagination session is just a regular session. The pagination logic happens inside the session\nitself."}),"\n",(0,i.jsxs)(n.p,{children:["For the case of ",(0,i.jsx)(n.code,{children:"AbstractPaginationSession"}),", it does it by implementing ",(0,i.jsx)(n.code,{children:"#update()"}),", which does the following:"]}),"\n",(0,i.jsxs)("ol",{children:[(0,i.jsxs)("li",{children:["It attempts to extract a referred page, depending on the interaction type:",(0,i.jsxs)("ul",{children:[(0,i.jsxs)("li",{children:[(0,i.jsx)(n.code,{children:"Buttons"}),": Extracts from ",(0,i.jsx)(n.code,{children:"#customId"}),"."]}),(0,i.jsxs)("li",{children:[(0,i.jsx)(n.code,{children:"SelectMenu"}),": Extracts from ",(0,i.jsx)(n.code,{children:"#customId"}),". If no page is present there, it's a ",(0,i.jsx)(n.code,{children:"StringSelectMenu"})," and only one value was selected, it extracts from the selected value."]}),(0,i.jsxs)("li",{children:[(0,i.jsx)(n.code,{children:"Modal"}),": Extracts from ",(0,i.jsx)(n.code,{children:"#customId"}),". If no page is present there, it iterates through the modal's components, searching for a component whose ",(0,i.jsx)(n.code,{children:"customId"})," is the session's ",(0,i.jsx)(n.code,{children:"customId"}),". If there is one, the page is extracted from said component's value."]})]})]}),(0,i.jsxs)("li",{children:["If there's no referred page, it uses ",(0,i.jsx)(n.code,{children:"super.update()"}),", which will call ",(0,i.jsx)(n.code,{children:"#handleButton()"}),", ",(0,i.jsx)(n.code,{children:"#handleSelectMenu()"}),"\nor ",(0,i.jsx)(n.code,{children:"#handleModal()"})," (like a regular ",(0,i.jsx)(n.code,{children:"AbstractSession"}),")."]}),(0,i.jsxs)("li",{children:["If there's a referred page, it updates its ",(0,i.jsx)(n.code,{children:"currentPage"})," and calls ",(0,i.jsx)(n.code,{children:"#updatePage()"}),"."]})]}),"\n",(0,i.jsx)(n.admonition,{title:"Overriding page resolving",type:"tip",children:(0,i.jsxs)(n.p,{children:["You can change the page resolving behavior by overriding ",(0,i.jsx)(n.code,{children:"#update()"}),", ",(0,i.jsx)(n.code,{children:"#extractPageFromInteraction()"}),",\n",(0,i.jsx)(n.code,{children:"#extractPageFromButton()"}),", ",(0,i.jsx)(n.code,{children:"#extractPageFromSelectMenu()"})," or ",(0,i.jsx)(n.code,{children:"#extractPageFromModal()"}),"."]})}),"\n",(0,i.jsx)(n.h2,{id:"-creation",children:"\ud83d\udc77 Creation"}),"\n",(0,i.jsx)(n.p,{children:"You can create a paginated session by either:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Extending ",(0,i.jsx)(n.code,{children:"AbstractPaginationSession"})," from ",(0,i.jsx)(n.code,{children:"@framework"})," (recommended)."]}),"\n",(0,i.jsxs)(n.li,{children:["Implementing the ",(0,i.jsx)(n.code,{children:"PaginationSession"})," interface from ",(0,i.jsx)(n.code,{children:"@core"}),"."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["After creating it, start it via ",(0,i.jsx)(n.code,{children:"SessionManager#start()"}),"."]}),"\n",(0,i.jsxs)(a.A,{children:[(0,i.jsx)(r.A,{value:"Extending AbstractPaginationSession",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"import { AbstractPaginationSession, SessionUpdateInteraction } from '@nyx-discord/framework';\n\nclass MyPaginationSession extends AbstractPaginationSession {\n  public async handleStart() {\n    const page = this.createPage();\n\n    await this.startInteraction.reply(page);\n  }\n\n  protected async updatePage(interaction: SessionUpdateInteraction) {\n    const newPage = this.createPage();\n    await interaction.editReply(newPage);\n    return true;\n  }\n\n  protected createPage() {\n    const randomPage = Math.floor(Math.random() * 10);\n\n    const customIdBuilder = this.customId.clone();\n    const customId = customIdBuilder.setPage(randomPage).build();\n\n    const button = new ButtonBuilder()\n      .setCustomId(customId)\n      .setLabel('Go to a random page!')\n      .setStyle(ButtonStyle.Primary);\n    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(button);\n\n    const pageRow = this.buildDefaultPageRow();\n\n    return {\n      content: `You're on page ${this.currentPage}`,\n      components: [buttonRow, pageRow]\n    };\n  }\n}\n\n// Somewhere in your code, like inside a command...\n\nconst sessionId = 'mySessionId'; // Ideally randomly generated\nconst session = new MyPaginationSession(bot, sessionId, interaction);\nawait botgetSessionManager().start(session);\n"})})}),(0,i.jsx)(r.A,{value:"Implementing PaginationSession",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"import { PaginationSession } from '@nyx-discord/core';\n\nclass MyPaginationSession implements PaginationSession {\n  // ...\n}\n\nconst session = new MyPaginationSession(/** ... */);\nawait botgetSessionManager().start(session);\n"})})})]}),"\n",(0,i.jsx)(n.h2,{id:"-pagination-custom-ids",children:"\ud83d\udcac Pagination Custom Ids"}),"\n",(0,i.jsxs)(n.p,{children:["When using a pagination session the ",(0,i.jsx)(n.code,{children:"SessionCustomIdCodec"})," can generate a ",(0,i.jsx)(n.code,{children:"PaginationCustomIdBuilder"}),", an extension of\n",(0,i.jsx)(n.code,{children:"CustomIdBuilder"})," that supports adding a page reference to the customId being built."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const codec = botgetSessionManager().getCustomIdCodec();\n\nconst builder = codec.createPageCustomIdBuilder(session);\nbuilder.push('foo').push('bar').setPage(1);\n\nconst customId = builder.build();\n"})}),"\n",(0,i.jsxs)(n.p,{children:["For ",(0,i.jsx)(n.code,{children:"AbstractPaginationSession"}),":"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["A customId not referring to a page is handled by ",(0,i.jsx)(n.code,{children:"AbstractSession#update()"})," (see ",(0,i.jsx)(n.a,{href:"./session#-updating",children:"\ud83d\udc64 Session (\ud83d\udcdd Updating)"}),")."]}),"\n",(0,i.jsxs)(n.li,{children:["A customId referring to a page is handled by ",(0,i.jsx)(n.code,{children:"AbstractPaginationSession#updatePage()"}),"."]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"-component-examples",children:"\u2728 Component Examples"}),"\n",(0,i.jsxs)(a.A,{children:[(0,i.jsx)(r.A,{value:"Button",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const buttonId = builder.cloneSetPage(3).build();\n\nconst button = new ButtonBuilder()\n  // highlight-next-line\n  .setCustomId(buttonId)\n  .setLabel('Go to page 3')\n  .setStyle(ButtonStyle.Primary);\n"})})}),(0,i.jsxs)(r.A,{value:"Select Menu",children:[(0,i.jsx)(n.p,{children:"You can either:"}),(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Put the pagination custom id in the select menu itself, making it switch to that page regardless of selection (useful\nfor ",(0,i.jsx)(n.a,{href:"./stage-pagination-session",children:"\ud83d\udd00 Stage Pagination Sessions"}),")."]}),"\n"]}),(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const selectId = builder.cloneSetPage(3).build();\n\nconst select = new SelectMenuBuilder()\n  // highlight-next-line\n  .setCustomId(selectId)\n  .setPlaceholder('Switch to page 3')\n  .addOptions([\n    new StringSelectMenuOptionBuilder()\n      .setLabel('Option 1')\n      .setValue('option1'),\n    new StringSelectMenuOptionBuilder()\n      .setLabel('Option 2')\n      .setValue('option2'),\n  ]);\n"})}),(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Put the pagination custom id in the select menu's options, making it switch to that page only when the option is\nselected. Note that you still need to put the pagination custom id in the select menu itself."}),"\n"]}),(0,i.jsx)(n.admonition,{type:"warning",children:(0,i.jsxs)(n.p,{children:["If a received interaction has more than 1 value, the ",(0,i.jsx)(n.code,{children:"AbstractPaginationSession"})," won't try to parse its values as\npagination indexes."]})}),(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const selectId = builder.build();\n\nconst selectMenu = new StringSelectMenuBuilder()\n  // highlight-next-line\n  .setCustomId(selectId)\n  // highlight-next-line\n  .setMaxValues(1)\n  .setPlaceholder('Select a page');\n\n\nconst options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n  .map((page: number) => {\n    // highlight-next-line\n    const customId = this.customId.cloneSetPage(page);\n\n    return new StringSelectMenuOptionBuilder()\n      .setLabel(`Go to page ${page}`)\n      // highlight-next-line\n      .setValue(customId)\n  });\n\nselectMenu.addOptions(options);\n"})})]}),(0,i.jsxs)(r.A,{value:"Modal",children:[(0,i.jsx)(n.p,{children:"You can either:"}),(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Put the pagination custom id in the modal itself, making it switch to that page regardless of values (useful\nfor ",(0,i.jsx)(n.a,{href:"./stage-pagination-session",children:"\ud83d\udd00 Stage Pagination Sessions"}),")."]}),"\n"]}),(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const modalId = builder.cloneSetPage(3).build();\n\nconst textInput = new TextInputBuilder()\n  .setCustomId('textInput')\n  .setLabel('Text input')\n  .setStyle(TextInputStyle.Short);\n\nconst modalRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()\n  .addComponents(textInput);\n\nconst modal = new ModalBuilder()\n  // highlight-next-line\n  .setCustomId(modalId)\n  .setTitle('A session modal that switches to page 3')\n  .addComponents(modalRow);\n"})}),(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Put the pagination custom id in the modal's components, making it switch to that component's value (if it's a number).\nNote that you still need to put the pagination custom id in the modal itself."}),"\n"]}),(0,i.jsx)(n.admonition,{type:"warning",children:(0,i.jsxs)(n.p,{children:["If the component's value cannot be parsed to a number, it will be handled as a regular update (",(0,i.jsx)(n.code,{children:"#handleModal()"}),")."]})}),(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const modalId = builder.build();\n\nconst modal = new ModalBuilder()\n  .setTitle('Pagination')\n  // highlight-next-line\n  .setCustomId(modalId)\n\nconst textInput = new TextInputBuilder()\n  .setLabel('New page?')\n  // highlight-next-line\n  .setCustomId(modalId)\n  .setStyle(TextInputStyle.Short);\n\nconst modalRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()\n  .addComponents(textInput);\n\nmodal.addComponents(modalRow);\n"})})]})]}),"\n",(0,i.jsx)(n.h2,{id:"-utility-methods",children:"\ud83e\udde9 Utility methods"}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"AbstractPaginationSession"})," provides the following ",(0,i.jsx)(n.code,{children:"protected"})," utility methods:"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"#buildDefaultPageRow()"}),': Builds a component row with default "next"/"previous" buttons.']}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"#buildCustomIdForPage(page: number)"}),": Builds a customId for a specific page."]}),"\n"]})]})}function p(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},7598:(e,n,t)=>{t.d(n,{A:()=>a});t(1855);var s=t(1271);const i={tabItem:"tabItem_Jk6b"};var o=t(3159);function a(e){let{children:n,hidden:t,className:a}=e;return(0,o.jsx)("div",{role:"tabpanel",className:(0,s.A)(i.tabItem,a),hidden:t,children:n})}},5610:(e,n,t)=>{t.d(n,{A:()=>S});var s=t(1855),i=t(1271),o=t(4303),a=t(3178),r=t(3782),l=t(7520),c=t(9665),d=t(9575);function u(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:n,children:t}=e;return(0,s.useMemo)((()=>{const e=n??function(e){return u(e).map((e=>{let{props:{value:n,label:t,attributes:s,default:i}}=e;return{value:n,label:t,attributes:s,default:i}}))}(t);return function(e){const n=(0,c.XI)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function p(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function g(e){let{queryString:n=!1,groupId:t}=e;const i=(0,a.W6)(),o=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,l.aZ)(o),(0,s.useCallback)((e=>{if(!o)return;const n=new URLSearchParams(i.location.search);n.set(o,e),i.replace({...i.location,search:n.toString()})}),[o,i])]}function m(e){const{defaultValue:n,queryString:t=!1,groupId:i}=e,o=h(e),[a,l]=(0,s.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!p({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const s=t.find((e=>e.default))??t[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:n,tabValues:o}))),[c,u]=g({queryString:t,groupId:i}),[m,x]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[i,o]=(0,d.Dv)(t);return[i,(0,s.useCallback)((e=>{t&&o.set(e)}),[t,o])]}({groupId:i}),f=(()=>{const e=c??m;return p({value:e,tabValues:o})?e:null})();(0,r.A)((()=>{f&&l(f)}),[f]);return{selectedValue:a,selectValue:(0,s.useCallback)((e=>{if(!p({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);l(e),u(e),x(e)}),[u,x,o]),tabValues:o}}var x=t(1342);const f={tabList:"tabList_Pkq_",tabItem:"tabItem_JbFz"};var b=t(3159);function j(e){let{className:n,block:t,selectedValue:s,selectValue:a,tabValues:r}=e;const l=[],{blockElementScrollPositionUntilNextRender:c}=(0,o.a_)(),d=e=>{const n=e.currentTarget,t=l.indexOf(n),i=r[t].value;i!==s&&(c(n),a(i))},u=e=>{let n=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const t=l.indexOf(e.currentTarget)+1;n=l[t]??l[0];break}case"ArrowLeft":{const t=l.indexOf(e.currentTarget)-1;n=l[t]??l[l.length-1];break}}n?.focus()};return(0,b.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.A)("tabs",{"tabs--block":t},n),children:r.map((e=>{let{value:n,label:t,attributes:o}=e;return(0,b.jsx)("li",{role:"tab",tabIndex:s===n?0:-1,"aria-selected":s===n,ref:e=>l.push(e),onKeyDown:u,onClick:d,...o,className:(0,i.A)("tabs__item",f.tabItem,o?.className,{"tabs__item--active":s===n}),children:t??n},n)}))})}function I(e){let{lazy:n,children:t,selectedValue:o}=e;const a=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=a.find((e=>e.props.value===o));return e?(0,s.cloneElement)(e,{className:(0,i.A)("margin-top--md",e.props.className)}):null}return(0,b.jsx)("div",{className:"margin-top--md",children:a.map(((e,n)=>(0,s.cloneElement)(e,{key:n,hidden:e.props.value!==o})))})}function y(e){const n=m(e);return(0,b.jsxs)("div",{className:(0,i.A)("tabs-container",f.tabList),children:[(0,b.jsx)(j,{...n,...e}),(0,b.jsx)(I,{...n,...e})]})}function S(e){const n=(0,x.A)();return(0,b.jsx)(y,{...e,children:u(e.children)},String(n))}},5912:(e,n,t)=>{t.d(n,{R:()=>a,x:()=>r});var s=t(1855);const i={},o=s.createContext(i);function a(e){const n=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),s.createElement(o.Provider,{value:n},e.children)}}}]);