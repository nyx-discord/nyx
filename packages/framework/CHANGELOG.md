# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
