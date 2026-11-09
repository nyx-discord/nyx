# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.0.0 (2026-11-09)

### Features

- add backend-specific typed fields ([0d7cb6e](https://github.com/nyx-discord/nyx/commit/0d7cb6e1fdef765c07f2193e0a995dfc3248d599))
- **djs-core:** add discordjs/core adapter package ([30846e3](https://github.com/nyx-discord/nyx/commit/30846e3d48b56af3a5849d6f4a72baf8a62efbd5))
- **djs,djs-core,http:** add more typed field utilities ([25c1c22](https://github.com/nyx-discord/nyx/commit/25c1c224692b3489137674f33b40fab65fa7a996))
- **djs,djs-core:** add bot helper types ([231df47](https://github.com/nyx-discord/nyx/commit/231df47cb83339935fe91eb08c598f20f86a9c19))
- **djs:** add discord.js adapter package and loosen constraints in types/base ([9d900b5](https://github.com/nyx-discord/nyx/commit/9d900b5c25e843134fcb4caebf0eb18d243b551f))
- **djs:** allow users to pass the Client directly for DjsBot.create() without wrapping ([0fcef9a](https://github.com/nyx-discord/nyx/commit/0fcef9a2d38b9b36730166f0adacebfa1ebdcf43))
- share bus metadata to executors ([fcb4f09](https://github.com/nyx-discord/nyx/commit/fcb4f09048a418416af4a1866e8d5a530b1fe44f))

### Bug Fixes

- actually populate new core/djs bot typed field ([41e2a8b](https://github.com/nyx-discord/nyx/commit/41e2a8b2efe649a4d5e9ca0a59912181221c78a7))
- **djs,djs-core:** unsubscribeProtected on Bot[#stop](https://github.com/nyx-discord/nyx/issues/stop)() ([e5e12c6](https://github.com/nyx-discord/nyx/commit/e5e12c6e1b82513062f6a14ab14a60e418b38de2))
- properly handle deployer errors and rollback on both DefaultCommandManagers ([ed8f3eb](https://github.com/nyx-discord/nyx/commit/ed8f3eb8dc7d65c0d23c4aceda7cd004be8fa49f))
- wrap command errors on both DefaultCommandExecutors ([bda58f6](https://github.com/nyx-discord/nyx/commit/bda58f68c9255d2c52aa55a196276575deb43329))
