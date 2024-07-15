# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.1.0](https://github.com/nyx-discord/nyx/compare/@nyx-discord/core@2.0.0...@nyx-discord/core@2.1.0) (2024-07-15)

### Features

- add iterators to repositories, buses and plugin manager ([4854343](https://github.com/nyx-discord/nyx/commit/4854343725d7495e723c4c7fd5802135b529b6a7))

## [2.0.0](https://github.com/nyx-discord/nyx/compare/@nyx-discord/core@1.5.1...@nyx-discord/core@2.0.0) (2024-07-11)

### ⚠ BREAKING CHANGES

- replace manager fields in NyxBot with getters
- add tests for core
- many changes to StringIterator
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
- make command deployment on start optional ([ac2eee3](https://github.com/nyx-discord/nyx/commit/ac2eee3827a404a267b08d0ef4a971fbd757540d))
- make event manager/bus add/subscribe methods take a rest array rather than a single argument ([e58b97b](https://github.com/nyx-discord/nyx/commit/e58b97bae0fd0614e3d6271ca3524d6c1f0a5645))
- make MetadatableCustomIdBuilder[#push](https://github.com/nyx-discord/nyx/issues/push)Meta() return the index where the value was pushed ([b081195](https://github.com/nyx-discord/nyx/commit/b081195793da4785efb0f06c15be44e0e3123b20))
- make PluginManager[#register](https://github.com/nyx-discord/nyx/issues/register)() accept rest ([fc9b981](https://github.com/nyx-discord/nyx/commit/fc9b9818ff0a15c1ef181d5ee0175117fdc446cf))
- many changes to StringIterator ([0d2f205](https://github.com/nyx-discord/nyx/commit/0d2f2054f7fa6e165bdbc8dd835e7f1bba971945))
- move session end codes to single SessionEndCodes enum ([3266822](https://github.com/nyx-discord/nyx/commit/32668224422629389aabb3878bfe885fd0ca9226))
- remove ErrorHandler dependency on bots ([8f2bf41](https://github.com/nyx-discord/nyx/commit/8f2bf4112cd2fc68b5ddacb6551ee059818154c5))
- remove EventBus dependency on bots ([c342cea](https://github.com/nyx-discord/nyx/commit/c342ceadee9cf46c6a5bd68b6ad3cf645c166c2f))
- rename Session[#start](https://github.com/nyx-discord/nyx/issues/start)() to Session[#on](https://github.com/nyx-discord/nyx/issues/on)Start() and Session[#update](https://github.com/nyx-discord/nyx/issues/update)() to Session[#on](https://github.com/nyx-discord/nyx/issues/on)Update() ([0eb3645](https://github.com/nyx-discord/nyx/commit/0eb3645e60d0d449b9918d094ff1d6363f293af6))
- rewrite commands to use DJS builders, allow guild commands and create CommandDeployer ([9e9e96b](https://github.com/nyx-discord/nyx/commit/9e9e96b2fec88d89fe9ebec636400196be01ad63))

### Bug Fixes

- filter empty string if there's only metadata in a built MetadatableCustomId ([2fed25a](https://github.com/nyx-discord/nyx/commit/2fed25a0065fe3268333e190ab80b0bee528defe))
- fix MetadatableCustomIdBuilder meta methods changing non metadata tokens ([154fbbd](https://github.com/nyx-discord/nyx/commit/154fbbd1fdf6b11d9bd186bf9d2658fdcee97d80))
- fix MetadatableCustomIdBuilder omitting non empty token ([467a63a](https://github.com/nyx-discord/nyx/commit/467a63a5254357542f241e7048cf58518ca2a8d3))
- make MetadatableCustomIdBuilder pass tokens when cloning ([62a859e](https://github.com/nyx-discord/nyx/commit/62a859ee89982dd18bda1c04afe974886be8315c))
- make PaginationCustomIdBuilder pass extracted tokens on .fromPaginatedString() ([3784b9e](https://github.com/nyx-discord/nyx/commit/3784b9efc38570ed0fe1d494bcdc7a674c833a94))
- make PaginationCustomIdBuilder pass tokens when cloning ([89f5a67](https://github.com/nyx-discord/nyx/commit/89f5a672e30e4b3dcf8852fb7da5710437f0e7ec))
- manually set metadata instead of using setMetaAt on PaginationCustomIdBuilder[#set](https://github.com/nyx-discord/nyx/issues/set)Page() ([036ac0a](https://github.com/nyx-discord/nyx/commit/036ac0a6cbbf9eaf7ba1dd43f7a87d2304e2c9d2))

### Code Refactoring

- remove LinkedList logic from middlewares ([4b56d73](https://github.com/nyx-discord/nyx/commit/4b56d73b27d0eb3d9b9690d49ecbdc69bda5c0dd)), closes [#7](https://github.com/nyx-discord/nyx/issues/7)
- rename dataSeparator to metadataSeparator and remove CustomIdBuilder[#get](https://github.com/nyx-discord/nyx/issues/get)Namespace(), [#get](https://github.com/nyx-discord/nyx/issues/get)Separator(), [#get](https://github.com/nyx-discord/nyx/issues/get)DataSeparator() ([2053f9f](https://github.com/nyx-discord/nyx/commit/2053f9facae6dd00de172205ad13bfc23bfd28bb))
- replace manager fields in NyxBot with getters ([ff95b33](https://github.com/nyx-discord/nyx/commit/ff95b3361423511792b258e93c754c543c6f4562))

### Tests

- add tests for core ([b7f8108](https://github.com/nyx-discord/nyx/commit/b7f81083df3dd2c06ad21506152dfbf59ef5bd4a))

## [1.5.1](https://github.com/nyx-discord/nyx/compare/@nyx-discord/core@1.5.0...@nyx-discord/core@1.5.1) (2024-02-19)

### Bug Fixes

- fix MetadatableCustomIdBuilder omitting non empty token ([4d5d4c5](https://github.com/nyx-discord/nyx/commit/4d5d4c5f1ffba0662383507b2acb752c93d29272))

## [1.5.0](https://github.com/nyx-discord/nyx/compare/@nyx-discord/core@1.4.0...@nyx-discord/core@1.5.0) (2024-02-19)

### Features

- add SessionManager[#resolve](https://github.com/nyx-discord/nyx/issues/resolve)() ([99007a1](https://github.com/nyx-discord/nyx/commit/99007a1a4d6dba4df9a6e08f2831c59410b09381))

### Bug Fixes

- filter empty string if there's only metadata in a built MetadatableCustomId ([126d334](https://github.com/nyx-discord/nyx/commit/126d3349d7c6a939c881cb8afe814612618b9d8d))

## [1.4.0](https://github.com/nyx-discord/nyx/compare/@nyx-discord/core@1.3.0...@nyx-discord/core@1.4.0) (2024-02-13)

### Features

- add PaginationCustomIdBuilder next and previous page methods ([5f7abad](https://github.com/nyx-discord/nyx/commit/5f7abad5ab7e7db8096d2d63e7a37e8d95783ee9))

### Bug Fixes

- fix MetadatableCustomIdBuilder meta methods changing non metadata tokens ([a0bb9d2](https://github.com/nyx-discord/nyx/commit/a0bb9d224c5da16e86b674363650ac475747c561))

## [1.3.0](https://github.com/nyx-discord/nyx/compare/@nyx-discord/core@1.2.3...@nyx-discord/core@1.3.0) (2024-01-14)

### Features

- validate strings on CustomIdBuilders before pushing ([997a90d](https://github.com/nyx-discord/nyx/commit/997a90d57fd4a3f566bfecd3ee2a52b44f2d0efe))

## [1.2.3](https://github.com/nyx-discord/nyx/compare/@nyx-discord/core@1.2.2...@nyx-discord/core@1.2.3) (2024-01-10)

### Bug Fixes

- add missing export to core index.ts ([b671889](https://github.com/nyx-discord/nyx/commit/b671889e8db177288d6d55bc99f559f36df7b903))

## [1.2.2](https://github.com/nyx-discord/nyx/compare/@nyx-discord/core@1.2.1...@nyx-discord/core@1.2.2) (2024-01-06)

**Note:** Version bump only for package @nyx-discord/core

## [1.2.1](https://github.com/nyx-discord/nyx/compare/@nyx-discord/core@1.2.0...@nyx-discord/core@1.2.1) (2024-01-06)

**Note:** Version bump only for package @nyx-discord/core

## [1.2.0](https://github.com/nyx-discord/nyx/compare/@nyx-discord/core@1.1.4...@nyx-discord/core@1.2.0) (2024-01-06)

### Features

- add ChildableCommand[#add](https://github.com/nyx-discord/nyx/issues/add)Children() ([1d8d3bc](https://github.com/nyx-discord/nyx/commit/1d8d3bc58abc13a651640ef8bc6ecfa2fd259e8a))
- add SessionSelfEndCode ([f832b75](https://github.com/nyx-discord/nyx/commit/f832b75728fd1a8e7cd96b0a06150b731371d87a))

### Bug Fixes

- fix SessionManager[#end](https://github.com/nyx-discord/nyx/issues/end)() code type to accept Identifiers ([b7a89f9](https://github.com/nyx-discord/nyx/commit/b7a89f9eb9dc0716275401fa328418004a446fa9))

## [1.1.4](https://github.com/nyx-discord/nyx/compare/@nyx-discord/core@1.1.3...@nyx-discord/core@1.1.4) (2023-12-27)

**Note:** Version bump only for package @nyx-discord/core

## 1.1.3 (2023-12-27)

### Bug Fixes

- fix default session expiration callback triggering on manual deletes ([612c368](https://github.com/nyx-discord/nyx/commit/612c368d08377f44786701f82711abc790f1997b))

## 1.1.2 (2023-12-20)

**Note:** Version bump only for package @nyx-discord/core

## 1.1.1 (2023-12-19)

### Bug Fixes

- rename AbstractSubCommand#getReferenceData() to AbstractSubCommand#toReferenceData() ([45a41a0](https://github.com/nyx-discord/nyx/commit/45a41a04dc879638c8818c09a9cab97fbedb4c9f))

# 1.1.0 (2023-12-19)

### Bug Fixes

- make DefaultCommandCustomIdCodec serialize using CommandCustomIdBuilder ([c3d1d93](https://github.com/nyx-discord/nyx/commit/c3d1d937447dff99bbbbcc5fe7415fbb2383f5bb))

## 1.0.11 (2023-12-19)

**Note:** Version bump only for package @nyx-discord/core

## 1.0.10 (2023-12-18)

**Note:** Version bump only for package @nyx-discord/core

## 1.0.9 (2023-12-18)

**Note:** Version bump only for package @nyx-discord/core

## 1.0.8 (2023-12-18)

**Note:** Version bump only for package @nyx-discord/core

## 1.0.7 (2023-12-18)

**Note:** Version bump only for package @nyx-discord/core

## 1.0.6 (2023-12-18)

**Note:** Version bump only for package @nyx-discord/core

## 1.0.5 (2023-12-18)

**Note:** Version bump only for package @nyx-discord/core

## 1.0.4 (2023-12-18)

**Note:** Version bump only for package @nyx-discord/core

## 1.0.3 (2023-12-18)

**Note:** Version bump only for package @nyx-discord/core

## 1.0.2 (2023-12-18)

**Note:** Version bump only for package @nyx-discord/core
