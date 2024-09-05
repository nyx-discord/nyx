# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.5.0](https://github.com/nyx-discord/nyx/compare/@nyx-discord/framework@2.4.0...@nyx-discord/framework@2.5.0) (2024-09-05)

### Features

- add CommandManager[#set](https://github.com/nyx-discord/nyx/issues/set)Commands() and default impl ([78a7373](https://github.com/nyx-discord/nyx/commit/78a73732cee10f0d076856403a0999fa0c412e80))
- add CommandRepository[#clear](https://github.com/nyx-discord/nyx/issues/clear)() ([4cfefd5](https://github.com/nyx-discord/nyx/commit/4cfefd5f80feb1f6fcd4a5a39e8a07c810ddfb5d))
- make DefaultCommandManager[#set](https://github.com/nyx-discord/nyx/issues/set)Commands() emit add and remove events ([af91a96](https://github.com/nyx-discord/nyx/commit/af91a9623454fa86d5c2b91997b23c5b86a99ee7))

## [2.4.0](https://github.com/nyx-discord/nyx/compare/@nyx-discord/framework@2.3.1...@nyx-discord/framework@2.4.0) (2024-08-23)

### Features

- add CommandDeployer[#set](https://github.com/nyx-discord/nyx/issues/set)Commands() ([7086561](https://github.com/nyx-discord/nyx/commit/7086561795eaf53aa39df5d769e38d1edc5e4ce5))

## [2.3.1](https://github.com/nyx-discord/nyx/compare/@nyx-discord/framework@2.3.0...@nyx-discord/framework@2.3.1) (2024-07-27)

### Bug Fixes

- fix DefaultCommandResolver skipping subcommand autocompletes ([30989c0](https://github.com/nyx-discord/nyx/commit/30989c03b34809d830b9a7bd0c5e6ef18d2be66f))

## [2.3.0](https://github.com/nyx-discord/nyx/compare/@nyx-discord/framework@2.2.0...@nyx-discord/framework@2.3.0) (2024-07-23)

### Features

- **ActionRowList:** add push, setAt, slice and pop methods ([9bf0af1](https://github.com/nyx-discord/nyx/commit/9bf0af1a71e35b76acffde77863728ff5665c2cd))

### Bug Fixes

- fix BasicEventEmitterBus omitting rest subscribers ([0a750a2](https://github.com/nyx-discord/nyx/commit/0a750a2552201b9f9e72e310d01ec3d0e7f6dd79))

## [2.2.0](https://github.com/nyx-discord/nyx/compare/@nyx-discord/framework@2.1.0...@nyx-discord/framework@2.2.0) (2024-07-15)

### Features

- add iterators to repositories, buses and plugin manager ([4854343](https://github.com/nyx-discord/nyx/commit/4854343725d7495e723c4c7fd5802135b529b6a7))

## [2.1.0](https://github.com/nyx-discord/nyx/compare/@nyx-discord/framework@2.0.0...@nyx-discord/framework@2.1.0) (2024-07-13)

### Features

- **commands:** fallback to ChatInput when a command's type isn't found ([0fa8c61](https://github.com/nyx-discord/nyx/commit/0fa8c615d72e2f0e75591d0dfaea1b7a5f3f16fd))

## [2.0.0](https://github.com/nyx-discord/nyx/compare/@nyx-discord/framework@1.5.1...@nyx-discord/framework@2.0.0) (2024-07-11)

### ⚠ BREAKING CHANGES

- replace manager fields in NyxBot with getters
- move session end codes to single SessionEndCodes enum
- rename dataSeparator to metadataSeparator and remove CustomIdBuilder#getNamespace(), #getSeparator(), #getDataSeparator()
- make event manager/bus add/subscribe methods take a rest array rather than a single argument
- make command deployment on start optional
- remove EventBus dependency on bots
- remove ErrorHandler dependency on bots
- rewrite commands to use DJS builders, allow guild commands and create CommandDeployer
- remove LinkedList logic from middlewares
- add BotOptions#refreshCommands
- rename Session#start() to Session#onStart() and Session#update() to Session#onUpdate()

### Features

- add [#subscribe](https://github.com/nyx-discord/nyx/issues/subscribe)() methods to every manager ([fa55bb3](https://github.com/nyx-discord/nyx/commit/fa55bb31d082e57b4d22880cf6c7a9499ab2fa63))
- add BotOptions[#refresh](https://github.com/nyx-discord/nyx/issues/refresh)Commands ([a50218e](https://github.com/nyx-discord/nyx/commit/a50218ee2046e41dacfc1115d1ea9dbe89ea9cf7))
- add CommandCustomIdCodec[#get](https://github.com/nyx-discord/nyx/issues/get)NameTreeFromId() and deserializeToNameTree() ([4828ee5](https://github.com/nyx-discord/nyx/commit/4828ee5fd649bac7500174786c18d8fd04062ff9))
- add CustomIdCodec getters for separators and namespace ([a5edab0](https://github.com/nyx-discord/nyx/commit/a5edab0bcf5f5602e5db493367dab27c95f09a0a))
- add SessionManager[#resolve](https://github.com/nyx-discord/nyx/issues/resolve)() ([fae4114](https://github.com/nyx-discord/nyx/commit/fae4114b15f3b81c98d91e6157e00344a8e00ff2))
- make AbstractSession[#self](https://github.com/nyx-discord/nyx/issues/self)End() reason optional ([99523e7](https://github.com/nyx-discord/nyx/commit/99523e7006ee7a61016179739555c9f0f6b222b4))
- make command deployment on start optional ([ac2eee3](https://github.com/nyx-discord/nyx/commit/ac2eee3827a404a267b08d0ef4a971fbd757540d))
- make event manager/bus add/subscribe methods take a rest array rather than a single argument ([e58b97b](https://github.com/nyx-discord/nyx/commit/e58b97bae0fd0614e3d6271ca3524d6c1f0a5645))
- make PluginManager[#register](https://github.com/nyx-discord/nyx/issues/register)() accept rest ([fc9b981](https://github.com/nyx-discord/nyx/commit/fc9b9818ff0a15c1ef181d5ee0175117fdc446cf))
- move session end codes to single SessionEndCodes enum ([3266822](https://github.com/nyx-discord/nyx/commit/32668224422629389aabb3878bfe885fd0ca9226))
- remove ErrorHandler dependency on bots ([8f2bf41](https://github.com/nyx-discord/nyx/commit/8f2bf4112cd2fc68b5ddacb6551ee059818154c5))
- remove EventBus dependency on bots ([c342cea](https://github.com/nyx-discord/nyx/commit/c342ceadee9cf46c6a5bd68b6ad3cf645c166c2f))
- rename Session[#start](https://github.com/nyx-discord/nyx/issues/start)() to Session[#on](https://github.com/nyx-discord/nyx/issues/on)Start() and Session[#update](https://github.com/nyx-discord/nyx/issues/update)() to Session[#on](https://github.com/nyx-discord/nyx/issues/on)Update() ([0eb3645](https://github.com/nyx-discord/nyx/commit/0eb3645e60d0d449b9918d094ff1d6363f293af6))
- rewrite commands to use DJS builders, allow guild commands and create CommandDeployer ([9e9e96b](https://github.com/nyx-discord/nyx/commit/9e9e96b2fec88d89fe9ebec636400196be01ad63))

### Bug Fixes

- fix errors caught by the new eslint ([6837629](https://github.com/nyx-discord/nyx/commit/68376296f10c991861f2cc97d7d3cd55b7d7e347))
- handle undefined return type in SessionRepository ([58441ba](https://github.com/nyx-discord/nyx/commit/58441ba172f10ebb4dfd81bdafb43fcfab0d4805))

### Code Refactoring

- remove LinkedList logic from middlewares ([4b56d73](https://github.com/nyx-discord/nyx/commit/4b56d73b27d0eb3d9b9690d49ecbdc69bda5c0dd)), closes [#7](https://github.com/nyx-discord/nyx/issues/7)
- rename dataSeparator to metadataSeparator and remove CustomIdBuilder[#get](https://github.com/nyx-discord/nyx/issues/get)Namespace(), [#get](https://github.com/nyx-discord/nyx/issues/get)Separator(), [#get](https://github.com/nyx-discord/nyx/issues/get)DataSeparator() ([2053f9f](https://github.com/nyx-discord/nyx/commit/2053f9facae6dd00de172205ad13bfc23bfd28bb))
- replace manager fields in NyxBot with getters ([ff95b33](https://github.com/nyx-discord/nyx/commit/ff95b3361423511792b258e93c754c543c6f4562))

## [1.5.1](https://github.com/nyx-discord/nyx/compare/@nyx-discord/framework@1.5.0...@nyx-discord/framework@1.5.1) (2024-02-19)

**Note:** Version bump only for package @nyx-discord/framework

## [1.5.0](https://github.com/nyx-discord/nyx/compare/@nyx-discord/framework@1.4.0...@nyx-discord/framework@1.5.0) (2024-02-19)

### Features

- add SessionManager[#resolve](https://github.com/nyx-discord/nyx/issues/resolve)() ([99007a1](https://github.com/nyx-discord/nyx/commit/99007a1a4d6dba4df9a6e08f2831c59410b09381))
- make AbstractSession[#self](https://github.com/nyx-discord/nyx/issues/self)End() reason optional ([9908b38](https://github.com/nyx-discord/nyx/commit/9908b384073a152559c4c86ace0434369a59b176))

### Bug Fixes

- handle undefined return type in SessionRepository ([9e8bea9](https://github.com/nyx-discord/nyx/commit/9e8bea92abe8862d5e6feb4d3a627d6e878d61e6))

## [1.4.0](https://github.com/nyx-discord/nyx/compare/@nyx-discord/framework@1.3.0...@nyx-discord/framework@1.4.0) (2024-02-13)

### Features

- add ActionRowWrapper[#edit](https://github.com/nyx-discord/nyx/issues/edit)Component() ([39f7bf0](https://github.com/nyx-discord/nyx/commit/39f7bf05aedeab03e6473b249a6c9e8913f18888))

### Bug Fixes

- fix ActionRowWrapper[#edit](https://github.com/nyx-discord/nyx/issues/edit)Where() editing unmatched entries ([dec24e5](https://github.com/nyx-discord/nyx/commit/dec24e59fd3a23804de8d44865d9bbcf350842f6))

## [1.3.0](https://github.com/nyx-discord/nyx/compare/@nyx-discord/framework@1.2.6...@nyx-discord/framework@1.3.0) (2024-01-19)

### Features

- add ActionRowWrapper[#map](https://github.com/nyx-discord/nyx/issues/map)(), [#filter](https://github.com/nyx-discord/nyx/issues/filter)(), [#for](https://github.com/nyx-discord/nyx/issues/for)Each(), [#find](https://github.com/nyx-discord/nyx/issues/find)(), [#remove](https://github.com/nyx-discord/nyx/issues/remove)(), [#remove](https://github.com/nyx-discord/nyx/issues/remove)All() and [#get](https://github.com/nyx-discord/nyx/issues/get)Components() ([0c34707](https://github.com/nyx-discord/nyx/commit/0c3470791ef5a9503b0daa2d91072d713623e88e))

### Bug Fixes

- rename AbstractStagePaginationSession[#on](https://github.com/nyx-discord/nyx/issues/on)Start() to AbstractStagePaginationSession[#start](https://github.com/nyx-discord/nyx/issues/start)() ([1d0c031](https://github.com/nyx-discord/nyx/commit/1d0c0316127dabb50e695c880f69ce6089941acf))

## [1.2.6](https://github.com/nyx-discord/nyx/compare/@nyx-discord/framework@1.2.5...@nyx-discord/framework@1.2.6) (2024-01-15)

### Bug Fixes

- fix DefaultCommandRepository standalone command duplicate search ([8b207a6](https://github.com/nyx-discord/nyx/commit/8b207a68b74cc3c8162a4e3dcf95d75c5becd65a))

## [1.2.5](https://github.com/nyx-discord/nyx/compare/@nyx-discord/framework@1.2.4...@nyx-discord/framework@1.2.5) (2024-01-14)

### Bug Fixes

- fix ActionRowList constructor mapping every component to a new row ([f710a83](https://github.com/nyx-discord/nyx/commit/f710a836ca5d591003f8f46c87c2c8a255d0112c))

## [1.2.4](https://github.com/nyx-discord/nyx/compare/@nyx-discord/framework@1.2.3...@nyx-discord/framework@1.2.4) (2024-01-10)

### Bug Fixes

- rename AbstractStandaloneCommand[#get](https://github.com/nyx-discord/nyx/issues/get)ReferenceData() to [#to](https://github.com/nyx-discord/nyx/issues/to)ReferenceData() ([359f6f9](https://github.com/nyx-discord/nyx/commit/359f6f99b8efe331ceba795557077670720d8219))

## [1.2.3](https://github.com/nyx-discord/nyx/compare/@nyx-discord/framework@1.2.2...@nyx-discord/framework@1.2.3) (2024-01-06)

**Note:** Version bump only for package @nyx-discord/framework

## [1.2.2](https://github.com/nyx-discord/nyx/compare/@nyx-discord/framework@1.2.1...@nyx-discord/framework@1.2.2) (2024-01-06)

### Bug Fixes

- fix BasicCustomIdCodec[#create](https://github.com/nyx-discord/nyx/issues/create)IteratorFromCustomId() discarding first token ([16f7982](https://github.com/nyx-discord/nyx/commit/16f79824950856bc645790095516705eabc3e971))

## [1.2.1](https://github.com/nyx-discord/nyx/compare/@nyx-discord/framework@1.2.0...@nyx-discord/framework@1.2.1) (2024-01-06)

### Bug Fixes

- also resolve SessionPromise when manually ending session ([7ba0e61](https://github.com/nyx-discord/nyx/commit/7ba0e619db9f42d062ed5a89003fb1625def2f7b))
- don't proceed on DefaultSessionManager[#update](https://github.com/nyx-discord/nyx/issues/update)() if session ended while updating ([17fae72](https://github.com/nyx-discord/nyx/commit/17fae725e404a68f1b89eb2bba5588ae98056841))

## [1.2.0](https://github.com/nyx-discord/nyx/compare/@nyx-discord/framework@1.1.4...@nyx-discord/framework@1.2.0) (2024-01-06)

### Features

- add AbstractSession[#self](https://github.com/nyx-discord/nyx/issues/self)End() and [#codec](https://github.com/nyx-discord/nyx/issues/codec) utilities ([7265088](https://github.com/nyx-discord/nyx/commit/72650882e579987a826c2c240a70e0e1cf367668))
- add ChildableCommand[#add](https://github.com/nyx-discord/nyx/issues/add)Children() ([1d8d3bc](https://github.com/nyx-discord/nyx/commit/1d8d3bc58abc13a651640ef8bc6ecfa2fd259e8a))

## [1.1.4](https://github.com/nyx-discord/nyx/compare/@nyx-discord/framework@1.1.3...@nyx-discord/framework@1.1.4) (2023-12-27)

### Bug Fixes

- fix default session expiration callback triggering on manually deleted entries ([4be6136](https://github.com/nyx-discord/nyx/commit/4be6136445063a9d55c6b9f42088eae8e39af513))

## 1.1.3 (2023-12-27)

### Bug Fixes

- fix default session expiration callback triggering on manual deletes ([612c368](https://github.com/nyx-discord/nyx/commit/612c368d08377f44786701f82711abc790f1997b))

## 1.1.2 (2023-12-20)

**Note:** Version bump only for package @nyx-discord/framework

## 1.1.1 (2023-12-19)

### Bug Fixes

- rename AbstractSubCommand#getReferenceData() to AbstractSubCommand#toReferenceData() ([45a41a0](https://github.com/nyx-discord/nyx/commit/45a41a04dc879638c8818c09a9cab97fbedb4c9f))

# 1.1.0 (2023-12-19)

### Bug Fixes

- make DefaultCommandCustomIdCodec serialize using CommandCustomIdBuilder ([c3d1d93](https://github.com/nyx-discord/nyx/commit/c3d1d937447dff99bbbbcc5fe7415fbb2383f5bb))

## 1.0.12 (2023-12-19)

**Note:** Version bump only for package @nyx-discord/framework

## 1.0.11 (2023-12-18)

**Note:** Version bump only for package @nyx-discord/framework

## 1.0.10 (2023-12-18)

**Note:** Version bump only for package @nyx-discord/framework

## 1.0.9 (2023-12-18)

**Note:** Version bump only for package @nyx-discord/framework

## 1.0.8 (2023-12-18)

**Note:** Version bump only for package @nyx-discord/framework

## 1.0.7 (2023-12-18)

**Note:** Version bump only for package @nyx-discord/framework

## 1.0.6 (2023-12-18)

**Note:** Version bump only for package @nyx-discord/framework

## 1.0.5 (2023-12-18)

**Note:** Version bump only for package @nyx-discord/framework

## 1.0.4 (2023-12-18)

**Note:** Version bump only for package @nyx-discord/framework

## 1.0.3 (2023-12-18)

**Note:** Version bump only for package @nyx-discord/framework
