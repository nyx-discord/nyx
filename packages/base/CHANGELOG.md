# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.0.0 (2026-11-09)

### Features

- add BaseBot and update loader tests to use /base ([fe879bb](https://github.com/nyx-discord/nyx/commit/fe879bb6045a3d546ae99ccc1bcc62113df68e93))
- **base:** add base package and command files ([048fcee](https://github.com/nyx-discord/nyx/commit/048fceed117d0035a26f0ba502d9f694b2c6a74a))
- **base:** allow error instances on ErrorHandler[#has](https://github.com/nyx-discord/nyx/issues/has)Consumer() ([3e224d2](https://github.com/nyx-discord/nyx/commit/3e224d2967b1c81c5db4516102d0e67246f1177f))
- **djs-core:** add discordjs/core adapter package ([30846e3](https://github.com/nyx-discord/nyx/commit/30846e3d48b56af3a5849d6f4a72baf8a62efbd5))
- **djs:** add discord.js adapter package and loosen constraints in types/base ([9d900b5](https://github.com/nyx-discord/nyx/commit/9d900b5c25e843134fcb4caebf0eb18d243b551f))
- **types:** add type files ([eafe83d](https://github.com/nyx-discord/nyx/commit/eafe83dcbef80e572a33ffbd3075ce2cc2e42eda))

### Bug Fixes

- **base:** accept null on syncTimeout for BasicSyncEventDispatcher constructor ([5edc2db](https://github.com/nyx-discord/nyx/commit/5edc2db5cd4a144056bf388d33c13a16beed687e))
- **base:** avoid double passing meta to errorHandler on BasicAsyncEventDispatcher ([99cfd45](https://github.com/nyx-discord/nyx/commit/99cfd45bb1f8f01af32a6dd555994e4d59e3d8e0))
- **base:** correctly unlisten from EventEmitter on BasicEventEmitterBus after removing last subscriber ([4753ef4](https://github.com/nyx-discord/nyx/commit/4753ef455faa22229dc7676fbcdc211a890648c6))
- **base:** don't execute subscriber after handling middleware error on BasicSyncEventDispatcher ([330e784](https://github.com/nyx-discord/nyx/commit/330e7847dac30ab3627441d6a8df9ea05cfbab85))
- **base:** fix non implemented DefaultBotService[#is](https://github.com/nyx-discord/nyx/issues/is)Running ([a817cf5](https://github.com/nyx-discord/nyx/commit/a817cf5c5575face3ade3912e9de4f117e7f3a72))
- **base:** properly handle erroring state on DefaultBotService ([58e2c92](https://github.com/nyx-discord/nyx/commit/58e2c920b2bd6b0ed946e0beb1417a8b9b00420f))
- **base:** try catch NyxPlugin[#on](https://github.com/nyx-discord/nyx/issues/on)Register() and delete if errors on DefaultPluginManager ([b64d0d6](https://github.com/nyx-discord/nyx/commit/b64d0d6b3612de6e04d40eab56715e8d7683d09a))
- **base:** unlisten from emitter on unsubscribeProtected on BasicEventEmitterBus ([f4fcc1f](https://github.com/nyx-discord/nyx/commit/f4fcc1f6f28abad9658624993131c2009510783f))
