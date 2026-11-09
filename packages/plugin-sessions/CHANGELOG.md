# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.1](https://github.com/nyx-discord/nyx/compare/%40nyx-discord%2Fplugin-sessions%401.0.0...%40nyx-discord%2Fplugin-sessions%401.0.1) (2026-11-09)

### Bug Fixes

- add missing readmes and update old ones ([bdbd807](https://github.com/nyx-discord/nyx/commit/bdbd807235c952834bd7c56edbe2575a106719fa))

## 1.0.0 (2026-11-09)

### ⚠ BREAKING CHANGES

- add session limits
- **plugin-sessions:** make the plugin library agnostic and add adapters for djs and djs-core
- move sessions to a standalone plugin
- remove the EventManager and add the client bus directly to the bot

### Features

- add session limits ([b9df762](https://github.com/nyx-discord/nyx/commit/b9df7626d2f4d9b8baf4774a5419f7af6a552542))
- **plugin-sessions:** add SessionRepository[#get](https://github.com/nyx-discord/nyx/issues/get)ByConstructor utility ([3ffd799](https://github.com/nyx-discord/nyx/commit/3ffd7998c8b3504aa71b7ae2277d2baf906d4c43))
- share bus metadata to executors ([fcb4f09](https://github.com/nyx-discord/nyx/commit/fcb4f09048a418416af4a1866e8d5a530b1fe44f))

### Bug Fixes

- fix some framework and core imports not being resolved in IDE ([9906a08](https://github.com/nyx-discord/nyx/commit/9906a085339aa85b30b1c42eb9a80867d55bfd19))
- **plugin-sessions:** apply parent limits to subclasses ([3d13abf](https://github.com/nyx-discord/nyx/commit/3d13abfeff049061234f9b92d0fc616f32598a6a))
- **plugin-sessions:** displace sessions only after actual start ([05dbd0c](https://github.com/nyx-discord/nyx/commit/05dbd0c571b81b6b1907507b5fb2a884ad42792a))
- **plugin-sessions:** forbid removing limits after start ([74c49ea](https://github.com/nyx-discord/nyx/commit/74c49ea02fcc33bcc180158554ac831b1eec079f))
- **plugin-sessions:** lock limit slots to avoid race conditions on ending sessions ([0bd287a](https://github.com/nyx-discord/nyx/commit/0bd287a0b48dd04f7af601d7185dfcfb289c556b))

### Code Refactoring

- move sessions to a standalone plugin ([a753a40](https://github.com/nyx-discord/nyx/commit/a753a40ecaa013af7ce5135ef14831c528f6647e))
- **plugin-sessions:** make the plugin library agnostic and add adapters for djs and djs-core ([fb580eb](https://github.com/nyx-discord/nyx/commit/fb580eb1127fee540856962063109083b4521465))
- remove the EventManager and add the client bus directly to the bot ([d03fc55](https://github.com/nyx-discord/nyx/commit/d03fc5594b84f7c4a9c0975297244ad0f6b1a4a0))
