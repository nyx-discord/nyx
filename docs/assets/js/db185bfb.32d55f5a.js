"use strict";(self.webpackChunk_nyx_discord_docs=self.webpackChunk_nyx_discord_docs||[]).push([[1935],{2323:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>a,default:()=>b,frontMatter:()=>c,metadata:()=>l,toc:()=>u});var r=t(7458),s=t(6436),i=t(9021),o=t(2543);const c={title:"\ud83d\udce9 Event Subscribers"},a=void 0,l={id:"features/events/event-subscriber",title:"\ud83d\udce9 Event Subscribers",description:"EventSubscribers are objects that are notified by an EventBus once a given event happens, and certain conditions",source:"@site/docs/features/events/event-subscriber.mdx",sourceDirName:"features/events",slug:"/features/events/event-subscriber",permalink:"/nyx/docs/features/events/event-subscriber",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/features/events/event-subscriber.mdx",tags:[],version:"current",frontMatter:{title:"\ud83d\udce9 Event Subscribers"},sidebar:"nyxSidebar",previous:{title:"\ud83d\udce3 Event Buses",permalink:"/nyx/docs/features/events/event-bus"},next:{title:"\u26a1 Event Dispatcher",permalink:"/nyx/docs/features/events/event-dispatcher"}},d={},u=[{value:"\ud83d\udc77 Creation",id:"-creation",level:2},{value:"\ud83d\udc42 Subscription",id:"-subscription",level:2},{value:"\ud83e\uddf1 Event Dispatch Meta",id:"-event-dispatch-meta",level:2},{value:"\u2705 Event handling marking",id:"-event-handling-marking",level:3},{value:"\ud83d\udc9f Lifetime",id:"-lifetime",level:2},{value:"\ud83d\udd03 Priority",id:"-priority",level:2},{value:"\ud83d\uded1 Filtering",id:"-filtering",level:2},{value:"\ud83d\udcdd Metadata",id:"-metadata",level:2}];function h(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.a)(),...e.components},{Details:t}=n;return t||function(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"EventSubscribers"})," are objects that are notified by an ",(0,r.jsx)(n.code,{children:"EventBus"})," once a given event happens, and certain conditions\nspecified by the subscriber happen."]}),"\n",(0,r.jsxs)(n.admonition,{type:"note",children:[(0,r.jsx)(n.p,{children:"Subscribers don't depend on a specific bot or bus, and you can reuse the same instance for many."}),(0,r.jsxs)(n.p,{children:["To get the bot that is calling an event, use the ",(0,r.jsx)(n.code,{children:"EventDispatchMeta#getBot()"})," method on the meta passed for the event."]}),(0,r.jsxs)(n.p,{children:["Note it can be ",(0,r.jsx)(n.code,{children:"null"})," if the bus doesn't have a bot. You can pass ",(0,r.jsx)(n.code,{children:"true"})," to this method to throw an error if it's not present.\nIn practice, all built-in event buses have a bot, it will only be ",(0,r.jsx)(n.code,{children:"null"})," for your custom ones where you didn't pass a bot."]}),(0,r.jsxs)(n.p,{children:["The subscriber is also notified once it's subscribed to a bus (which contains the bot), on\n",(0,r.jsx)(n.code,{children:"EventSubscriber#onSubscribe()"})," , same when unsubscribed, on ",(0,r.jsx)(n.code,{children:"#onUnsubscribe()"}),".\nOverride these methods to perform setup or cleanup logic on the bus/bot."]})]}),"\n",(0,r.jsx)(n.h2,{id:"-creation",children:"\ud83d\udc77 Creation"}),"\n",(0,r.jsx)(n.p,{children:"You can create an event subscriber by either:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Extending ",(0,r.jsx)(n.code,{children:"AbstractEventSubscriber"})," from ",(0,r.jsx)(n.code,{children:"@framework"})," (recommended)."]}),"\n",(0,r.jsxs)(n.li,{children:["Instantiating a ",(0,r.jsx)(n.code,{children:"SubscriberCallbackWrapper"})," from ",(0,r.jsx)(n.code,{children:"@framework"}),", passing a callback function."]}),"\n",(0,r.jsxs)(n.li,{children:["Implementing the ",(0,r.jsx)(n.code,{children:"EventSubscriber"})," interface from ",(0,r.jsx)(n.code,{children:"@core"}),"."]}),"\n"]}),"\n",(0,r.jsxs)(i.Z,{children:[(0,r.jsx)(o.Z,{value:"Extending AbstractEventSubscriber",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { AbstractEventSubscriber } from '@nyx-discord/framework';\nimport type { EventDispatchMeta } from '@nyx-discord/core';\n\nclass MyEventSubscriber extends AbstractEventSubscriber<MyEventsArgs, 'someEvent'> {\n  protected readonly event = 'someEvent';\n\n  public handleEvent(meta: EventDispatchMeta, ...args: MyEventsArgs['someEvent']) {\n    // Null if you didn't pass a bot while creating your bus\n    const bot = meta.getBot();\n    if (!bot) {\n      console.log('Hello world');\n      return;\n    }\n\n    bot.logger.log('Hello world');\n  }\n}\n\nconst frameworkSubscriber = new MyEventSubscriber();\n\nawait myBus.subscribe(frameworkSubscriber);\n"})})}),(0,r.jsx)(o.Z,{value:"Instantiating SubscriberCallbackWrapper",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { SubscriberCallbackWrapper } from '@nyx-discord/framework';\n\nconst callbackSubscriber = new SubscriberCallbackWrapper < MyEventsArgs, 'someEvent'>(\n  'someEvent',\n  (meta: EventDispatchMeta, ...args: MyEventsArgs['someEvent']) => {\n    // Null if you didn't pass a bot while creating your bus\n    const bot = meta.getBot();\n    if (!bot) {\n      console.log('Hello world');\n      return;\n    }\n\n    bot.logger.log('Hello world');\n  }\n);\n\nawait myBus.subscribe(callbackSubscriber);\n"})})}),(0,r.jsx)(o.Z,{value:"Implementing EventSubscriber",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { EventSubscriber } from '@nyx-discord/core';\n\nclass MyInterfaceEventSubscriber implements EventSubscriber {\n  protected readonly event = 'someEvent';\n\n  public handleEvent(meta: EventDispatchMeta, ...args: unknown[]): void {\n    // Null if you didn't pass a bot while creating your bus\n    const bot = meta.getBot();\n    if (!bot) {\n      console.log('Hello world');\n      return;\n    }\n\n    bot.logger.log('Hello world');\n  }\n  // ...\n}\n\nconst interfaceSubscriber = new MyInterfaceEventSubscriber();\n\nawait myBus.subscribe(interfaceSubscriber);\n"})})})]}),"\n",(0,r.jsx)(n.h2,{id:"-subscription",children:"\ud83d\udc42 Subscription"}),"\n",(0,r.jsx)(n.p,{children:"To subscribe to a bus, you'll either need a reference to it or its ID."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"// Using the EventManager\nawait bot.getEventManager().subscribe(subscriber, myBusId); // Can also pass the bus reference\n\n// Using an existing reference to the bus\nawait myBus.subscribe(subscriber);\n"})}),"\n",(0,r.jsxs)(n.p,{children:["The difference with using the ",(0,r.jsx)(n.code,{children:"EventManager"})," versus using a direct reference is that the ",(0,r.jsx)(n.code,{children:"EventManager"})," will make sure\nthat the bus is currently registered on the bot. Otherwise, it will throw an ",(0,r.jsx)(n.code,{children:"ObjectNotFoundError"}),"."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"const newBus = BasicEventBus.createSync(bot, Symbol('myBus'));\n// error-next-line\nawait bot.getEventManager().subscribe(subscriber, newBus); // Throws ObjectNotFoundError\n"})}),"\n",(0,r.jsx)(n.h2,{id:"-event-dispatch-meta",children:"\ud83e\uddf1 Event Dispatch Meta"}),"\n",(0,r.jsxs)(n.p,{children:["The first argument of the ",(0,r.jsx)(n.code,{children:"EventSubscriber#handleEvent()"})," handler is an ",(0,r.jsx)(n.code,{children:"EventDispatchMeta"})," object, which is a\n",(0,r.jsx)(n.code,{children:"Collection"})," that stores metadata about the event call."]}),"\n",(0,r.jsxs)(n.admonition,{type:"tip",children:[(0,r.jsxs)(n.p,{children:["This metadata can be created by the caller on the ",(0,r.jsx)(n.code,{children:"EventBus#emit()"})," method, specifying extra arguments to be read by the\nsubscribers (apart from the event arguments)."]}),(0,r.jsxs)(n.p,{children:["It's also passed to the ",(0,r.jsx)(n.code,{children:"EventMiddleware"}),", and can be used as a way to share data from the middleware to subscribers."]})]}),"\n",(0,r.jsx)(n.p,{children:"Apart from the keys saved by the caller or the middleware, the dispatch meta contains:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["The bot that called the event, via ",(0,r.jsx)(n.code,{children:"#getBot()"}),"."]}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["Note it can be ",(0,r.jsx)(n.code,{children:"null"})," if the bus doesn't have a bot. You can pass ",(0,r.jsx)(n.code,{children:"true"})," to this method to throw an error if it's not present.\nIn practice, all built-in event buses have a bot, it will only be ",(0,r.jsx)(n.code,{children:"null"})," for your custom ones where you didn't pass a bot."]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["The bus where the event was emitted, via ",(0,r.jsx)(n.code,{children:"#getBus()"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["Whether the event has been marked as handled by another subscriber, via ",(0,r.jsx)(n.code,{children:"#isHandled()"}),"."]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"-event-handling-marking",children:"\u2705 Event handling marking"}),"\n",(0,r.jsxs)(n.p,{children:['By default, when a subscriber marks an event as "handled" with the ',(0,r.jsx)(n.code,{children:"EventDispatchMeta#setHandled()"}),' method, it won\'t be\nreceived by the rest of the subscribers. This is useful for events that only need to be "executed once", for example,\nreplying to an ',(0,r.jsx)(n.code,{children:"Interaction"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:["However, you can make your subscriber to be always called, even when the event is handled, overriding\nthe ",(0,r.jsx)(n.code,{children:"ignoreHandled"})," property on ",(0,r.jsx)(n.code,{children:"AbstractEventSubscriber"}),"."]}),"\n",(0,r.jsxs)(t,{children:[(0,r.jsx)("summary",{children:"Example of event handling marking functionality"}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { AbstractEventSubscriber } from '@nyx-discord/framework';\n\n// A subscriber with priority Highest marks the event as handled\nclass HighestEventSubscriber extends AbstractEventSubscriber {\n  protected readonly event = 'someEvent';\n\n  // highlight-next-line\n  protected readonly priority = PriorityEnum.Highest;\n\n  public handleEvent(meta: EventDispatchMeta): void {\n    // some logic\n\n    const bot = meta.getBot(true);\n\n    bot.logger.log('Called HighestEventSubscriber!');\n    meta.setHandled();\n  }\n}\n\n// A subscriber with priority Lowest doesn't receive the event\nclass LowestEventSubscriber extends AbstractEventSubscriber {\n  protected readonly event = 'someEvent';\n\n// highlight-next-line\n  protected readonly priority = PriorityEnum.Lowest;\n\n  public handleEvent(meta: EventDispatchMeta): void {\n    const bot = meta.getBot(true);\n\n    bot.logger.log('Called LowestEventSubscriber!');\n  }\n}\n\n// A subscriber with priority Lowest but `ignoreHandled = false` receives the event\nclass LowestNotIgnoredEventSubscriber extends AbstractEventSubscriber {\n  protected readonly event = 'someEvent';\n\n// highlight-next-line\n  protected readonly priority = PriorityEnum.Lowest;\n\n// highlight-next-line\n  protected readonly ignoreHandled = false;\n\n  public handleEvent(meta: EventDispatchMeta): void {\n    const bot = meta.getBot(true);\n\n    bot.logger.log('Called LowestNotIgnoredEventSubscriber!');\n  }\n}\n\nawait myBus\n  .subscribe(new LowestEventSubscriber())\n  .subscribe(new HighestEventSubscriber());\n\nawait myBus.emit('someEvent', []);\n/**\n * Logger output:\n * - Called HighestEventSubscriber!\n * - Called LowestNotIgnoredEventSubscriber!\n * Notice how LowestEventSubscriber wasn't called.\n */\n"})})]}),"\n",(0,r.jsx)(n.admonition,{type:"warning",children:(0,r.jsxs)(n.p,{children:["The handling marking logic is done by the ",(0,r.jsx)(n.code,{children:"HandleCheckEventMiddleware"})," on ",(0,r.jsx)(n.code,{children:"@framework"}),". If you make your entirely\ncustom middleware, include it (or an equivalent). Otherwise, this feature won't work at all."]})}),"\n",(0,r.jsx)(n.h2,{id:"-lifetime",children:"\ud83d\udc9f Lifetime"}),"\n",(0,r.jsxs)(n.p,{children:['Subscribers can specify its "lifetime", which determines how much it lasts registered on the bus. This is similar to\nusing Node\'s ',(0,r.jsx)(n.code,{children:"EventEmitter#on()"})," vs ",(0,r.jsx)(n.code,{children:"EventEmitter#once()"}),". This can be done overriding the ",(0,r.jsx)(n.code,{children:"lifetime"})," property on\n",(0,r.jsx)(n.code,{children:"AbstractEventSubscriber"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:["Available lifetimes can be gotten from ",(0,r.jsx)(n.code,{children:"EventSubscriberLifetimeEnum"})," on ",(0,r.jsx)(n.code,{children:"@core"}),", which are:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"On"}),' to "permanently" subscribe to the bus until manually unsubscribed.']}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"Once"})," to subscribe for a single call (The ",(0,r.jsx)(n.code,{children:"EventSubscriberMiddleware"})," must allow the execution)."]}),"\n"]}),"\n",(0,r.jsxs)(t,{children:[(0,r.jsxs)("summary",{children:["Subscriber lifetime example on ",(0,r.jsx)("code",{children:"AbstractEventSubscriber"})]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { EventSubscriberLifetimeEnum } from '@nyx-discord/core';\nimport { AbstractEventSubscriber } from '@nyx-discord/framework';\n\nclass OnEventSubscriber extends AbstractEventSubscriber {\n  protected readonly event = 'someEvent';\n\n// highlight-next-line\n  protected readonly lifetime = EventSubscriberLifetimeEnum.On;\n\n  public handleEvent(meta: EventDispatchMeta): void {\n    const bot = meta.getBot(true);\n\n    bot.logger.log('Hello from On subscriber!');\n  }\n}\n\nclass OnceEventSubscriber extends AbstractEventSubscriber {\n  protected readonly event = 'someEvent';\n\n  // highlight-next-line\n  protected readonly lifetime = EventSubscriberLifetimeEnum.Once;\n\n  public override onUnsubscribe(bus: EventBus): void {\n    // highlight-next-line\n    bus.bot.logger.log('Unsubscribed OnceEventSubscriber.');\n  }\n\n  public handleEvent(meta: EventDispatchMeta): void {\n    const bot = meta.getBot(true);\n\n    bot.logger.log('Hello from On subscriber!');\n  }\n}\n\nawait myBus\n  .subscribe(new OnEventSubscriber())\n  .subscribe(new OnceEventSubscriber());\n\nawait myBus.emit('someEvent', []);\n/**\n * Logger output:\n * - Hello from On subscriber!\n * - Hello from Once subscriber!\n * - Unsubscribed OnceEventSubscriber.\n */\n\nawait myBus.emit('someEvent', []);\n/**\n * Logger output:\n * - Hello from On subscriber!\n */\n"})})]}),"\n",(0,r.jsx)(n.admonition,{type:"warning",children:(0,r.jsxs)(n.p,{children:["The lifetime logic is done by the ",(0,r.jsx)(n.code,{children:"LifetimeCheckEventMiddleware"})," on ",(0,r.jsx)(n.code,{children:"@framework"}),". If you make your entirely custom\nmiddleware, include it (or an equivalent). Otherwise, this feature won't work at all."]})}),"\n",(0,r.jsx)(n.h2,{id:"-priority",children:"\ud83d\udd03 Priority"}),"\n",(0,r.jsxs)(n.p,{children:["Subscribers with higher ",(0,r.jsx)(n.code,{children:"Priority"})," will be called early, and get the opportunity to mark the event as handled first.\nThis can be done overriding the ",(0,r.jsx)(n.code,{children:"priority"})," property on ",(0,r.jsx)(n.code,{children:"AbstractEventSubscriber"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:["Available priorities can be gotten from ",(0,r.jsx)(n.code,{children:"PriorityEnum"})," on ",(0,r.jsx)(n.code,{children:"@core"}),", which are, sorted from executed first to last:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"LowMonitor"})," - Meant to be used for monitoring (like analytics) and not actual execution logic."]}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"Lowest"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"Low"})}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"Normal"})," - Default value."]}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"High"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"Highest"})}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"HighMonitor"})," - Meant to be used for monitoring (like analytics) and not actual execution logic."]}),"\n"]}),"\n",(0,r.jsxs)(t,{children:[(0,r.jsxs)("summary",{children:["Subscriber priority example on ",(0,r.jsx)("code",{children:"AbstractEventSubscriber"})]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { PriorityEnum } from '@nyx-discord/core';\nimport { AbstractEventSubscriber } from '@nyx-discord/framework';\n\nclass HighestEventSubscriber extends AbstractEventSubscriber {\n  protected readonly event = 'someEvent';\n\n  // highlight-next-line\n  protected readonly priority = PriorityEnum.Highest;\n\n  public handleEvent(meta: EventDispatchMeta): void {\n    const bot = meta.getBot(true);\n\n    bot.logger.log('First!');\n  }\n}\n\nclass LowestEventSubscriber extends AbstractEventSubscriber {\n  protected readonly event = 'someEvent';\n\n  // highlight-next-line\n  protected readonly priority = PriorityEnum.Lowest;\n\n  public handleEvent(meta: EventDispatchMeta): void {\n    const bot = meta.getBot(true);\n\n    bot.logger.log('Last!');\n  }\n}\n\nawait myBus\n  .subscribe(new LowestEventSubscriber())\n  .subscribe(new HighestEventSubscriber());\n\nawait myBus.emit('someEvent', []);\n/**\n* Logger output:\n* - First!\n* - Last!\n*/\n"})})]}),"\n",(0,r.jsx)(n.admonition,{type:"warning",children:(0,r.jsxs)(n.p,{children:["The priority sorting logic is done by the ",(0,r.jsx)(n.code,{children:"BasicEventBus#DefaultSorter"})," static property. If you override your sorter,\nmake sure to keep the priority in mind. Otherwise, this feature won't work at all."]})}),"\n",(0,r.jsx)(n.h2,{id:"-filtering",children:"\ud83d\uded1 Filtering"}),"\n",(0,r.jsxs)(n.p,{children:["Subscribers can specify an ",(0,r.jsx)(n.code,{children:"EventSubscriberFilter"}),", which is a custom object that specifies whether the subscriber\nshould be called or not. It receives the subscriber, the subscriber arguments, and returns a boolean."]}),"\n",(0,r.jsxs)(n.p,{children:["Filters are particularly useful when reusing event ignoring logic. They also get access to the ",(0,r.jsx)(n.code,{children:"EventDispatchMeta"}),",\nwhere they can save objects to be used by the subscriber."]}),"\n",(0,r.jsx)(n.admonition,{type:"tip",children:(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"Filters are not subscriber aware, meaning that the same instance can be reused on many subscribers."}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["While subscribers cannot specify more than one filter, you can use a ",(0,r.jsx)(n.code,{children:"FilterAggregator"})," from ",(0,r.jsx)(n.code,{children:"@framework"}),' to "merge"\nfilters. For example, use the ',(0,r.jsx)(n.code,{children:"AndFilter"})," to make a filter that returns ",(0,r.jsx)(n.code,{children:"true"})," if all filters passed on its\nconstructor return ",(0,r.jsx)(n.code,{children:"true"}),"."]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["You can check more information about event interception on the ",(0,r.jsx)(n.a,{href:"./event-interception",children:"\ud83d\udee1\ufe0f Event Interception"}),"\ncategory guide. More specifically, you can check the ",(0,r.jsx)(n.a,{href:"./event-interception#-subscriber-filters",children:"\ud83d\udea7 Filters"})," section."]}),"\n"]}),"\n"]})}),"\n",(0,r.jsxs)(t,{children:[(0,r.jsxs)("summary",{children:["Filter example using ",(0,r.jsx)("code",{children:"AbstractSubscriberFilter"})]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import type {\n  ClientEvents,\n  Snowflake\n} from 'discord.js';\n\nimport type { EventDispatchArgs } from '@nyx-discord/core';\nimport {\n  AbstractEventSubscriber,\n  AbstractSubscriberFilter\n} from '@nyx-discord/framework';\n\ntype InteractionCreateArgs = ClientEvents['interactionCreate'];\n\nclass UserBlacklistInteractionSubscriberFilter\n  extends AbstractSubscriberFilter<InteractionCreateArgs> {\n  protected readonly userIds: Snowflake[];\n\n  constructor(userIds: Snowflake[]) {\n    super();\n    this.userIds = userIds;\n  }\n\n  public check(\n    _subscriber: EventSubscriber,\n    ...args: EventDispatchArgs<InteractionCreateArgs>,\n  ) {\n    const [_meta, interaction] = args;\n\n    // highlight-next-line\n    return this.userIds.includes(interaction.user.id);\n  }\n}\n\nclass MyEventSubscriber extends AbstractEventSubscriber {\n  protected readonly event = 'someEvent';\n\n  // highlight-start\n  protected readonly filter = new UserBlacklistInteractionSubscriberFilter(\n    ['235428738748121088'],\n  );\n  // highlight-end\n\n  public handleEvent(): void {\n    // highlight-next-line\n    // Only executed if user ID is not '235428738748121088'\n  }\n}\n"})})]}),"\n",(0,r.jsx)(n.admonition,{type:"warning",children:(0,r.jsxs)(n.p,{children:["The filter check logic is done by the ",(0,r.jsx)(n.code,{children:"SubscriberFilterCheckMiddleware"})," on ",(0,r.jsx)(n.code,{children:"@framework"}),". If you make your entirely\ncustom middleware, include it (or an equivalent). Otherwise, this feature won't work at all."]})}),"\n",(0,r.jsx)(n.h2,{id:"-metadata",children:"\ud83d\udcdd Metadata"}),"\n",(0,r.jsxs)(n.p,{children:["When extending nyx with plugins, you may want to specify extra data for them. You can do so with the ",(0,r.jsx)(n.code,{children:"MetaCollection"}),"\nobject, saved on the subscriber."]}),"\n",(0,r.jsx)(n.admonition,{type:"note",children:(0,r.jsxs)(n.p,{children:["While subscribers internally save a ",(0,r.jsx)(n.code,{children:"MetaCollection"}),", the return type of ",(0,r.jsx)(n.code,{children:"#getMeta()"})," is a ",(0,r.jsx)(n.code,{children:"ReadonlyMetaCollection"}),",\nmeaning that external objects can read the collection, but not modify it."]})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { AbstractEventSubscriber } from '@nyx-discord/framework';\nimport { Collection } from '@discordjs/collection';\n\nclass MyEventSubscriber extends AbstractEventSubscriber {\n  protected readonly event = 'someEvent';\n\n  // highlight-start\n  protected readonly meta = new Collection<Identifier, unknown>([\n    ['someKey', 'someValue']\n  ]);\n  // highlight-end\n}\n\n// a plugin can now read it via:\nconst meta = myEventSubscriber.getMeta();\nconst value = meta.get('someKey'); // 'someValue'\n"})})]})}function b(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(h,{...e})}):h(e)}},2543:(e,n,t)=>{t.d(n,{Z:()=>o});t(2983);var r=t(8934);const s={tabItem:"tabItem_FK4c"};var i=t(7458);function o(e){let{children:n,hidden:t,className:o}=e;return(0,i.jsx)("div",{role:"tabpanel",className:(0,r.Z)(s.tabItem,o),hidden:t,children:n})}},9021:(e,n,t)=>{t.d(n,{Z:()=>E});var r=t(2983),s=t(8934),i=t(6776),o=t(3729),c=t(3668),a=t(8866),l=t(5504),d=t(591);function u(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:n,children:t}=e;return(0,r.useMemo)((()=>{const e=n??function(e){return u(e).map((e=>{let{props:{value:n,label:t,attributes:r,default:s}}=e;return{value:n,label:t,attributes:r,default:s}}))}(t);return function(e){const n=(0,l.l)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function b(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function m(e){let{queryString:n=!1,groupId:t}=e;const s=(0,o.k6)(),i=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,a._X)(i),(0,r.useCallback)((e=>{if(!i)return;const n=new URLSearchParams(s.location.search);n.set(i,e),s.replace({...s.location,search:n.toString()})}),[i,s])]}function v(e){const{defaultValue:n,queryString:t=!1,groupId:s}=e,i=h(e),[o,a]=(0,r.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!b({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const r=t.find((e=>e.default))??t[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:n,tabValues:i}))),[l,u]=m({queryString:t,groupId:s}),[v,p]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[s,i]=(0,d.Nk)(t);return[s,(0,r.useCallback)((e=>{t&&i.set(e)}),[t,i])]}({groupId:s}),g=(()=>{const e=l??v;return b({value:e,tabValues:i})?e:null})();(0,c.Z)((()=>{g&&a(g)}),[g]);return{selectedValue:o,selectValue:(0,r.useCallback)((e=>{if(!b({value:e,tabValues:i}))throw new Error(`Can't select invalid tab value=${e}`);a(e),u(e),p(e)}),[u,p,i]),tabValues:i}}var p=t(1678);const g={tabList:"tabList_dumu",tabItem:"tabItem_hRcV"};var x=t(7458);function f(e){let{className:n,block:t,selectedValue:r,selectValue:o,tabValues:c}=e;const a=[],{blockElementScrollPositionUntilNextRender:l}=(0,i.o5)(),d=e=>{const n=e.currentTarget,t=a.indexOf(n),s=c[t].value;s!==r&&(l(n),o(s))},u=e=>{let n=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const t=a.indexOf(e.currentTarget)+1;n=a[t]??a[0];break}case"ArrowLeft":{const t=a.indexOf(e.currentTarget)-1;n=a[t]??a[a.length-1];break}}n?.focus()};return(0,x.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":t},n),children:c.map((e=>{let{value:n,label:t,attributes:i}=e;return(0,x.jsx)("li",{role:"tab",tabIndex:r===n?0:-1,"aria-selected":r===n,ref:e=>a.push(e),onKeyDown:u,onClick:d,...i,className:(0,s.Z)("tabs__item",g.tabItem,i?.className,{"tabs__item--active":r===n}),children:t??n},n)}))})}function y(e){let{lazy:n,children:t,selectedValue:s}=e;const i=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=i.find((e=>e.props.value===s));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return(0,x.jsx)("div",{className:"margin-top--md",children:i.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==s})))})}function j(e){const n=v(e);return(0,x.jsxs)("div",{className:(0,s.Z)("tabs-container",g.tabList),children:[(0,x.jsx)(f,{...e,...n}),(0,x.jsx)(y,{...e,...n})]})}function E(e){const n=(0,p.Z)();return(0,x.jsx)(j,{...e,children:u(e.children)},String(n))}},6436:(e,n,t)=>{t.d(n,{Z:()=>c,a:()=>o});var r=t(2983);const s={},i=r.createContext(s);function o(e){const n=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),r.createElement(i.Provider,{value:n},e.children)}}}]);