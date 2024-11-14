![Flowinity Banner](https://assets.flowinity.com/home/0th.png)

# Flowinity (formerly PrivateUploader) [![codecov](https://codecov.io/gh/PrivateUploader/PrivateUploader/branch/api-v4/graph/badge.svg?token=RT9XLUOX5Y)](https://codecov.io/gh/PrivateUploader/PrivateUploader)

Flowinity is the next generation image hosting server written in Vue and TypeScript.

Flowinity is intended to be an out of the way image hosting server for everyone else,
thus it doesn't have features you'd regularly find in other ShareX servers, such
as rich OpenGraph embeds. But instead has unique features like Insights, and
Collections.

Additionally, Flowinity has only recently become an open source project, so
documentation and resources are lacking initially, but will improve over time.

![PrivateUploader Features](https://i.flowinity.com/i/086834402e31.png)

## Don't want to host your own server?

You can use the official public instance of Flowinity at
[https://flowinity.com](https://www.flowinity.com).

<details>
  <summary><h2>Screenshots (Click to expand)</h2></summary>

View the full collection on
[Flowinity](https://www.flowinity.com/collections/2736179e19078284d9a5a4c1241289db7f777b180fed932b88162bbb2ec00ef1).

![Gallery](https://i.flowinity.com/i/d68241bda319.png)
![Collection Page](https://i.flowinity.com/i/a1fb3e1af098.png)
![User Profile](https://i.flowinity.com/i/4d0adcf1c4a4.png)
![Insights](https://i.flowinity.com/i/ab6170f5d976.png)

</details>

## Features

- **Gallery**, where all your uploaded files live.
- **Collections**, which can be shared with multiple users.
- **AutoCollects**, create custom rules to automatically add items into
  collections.
- **Workspaces**, create quick notes/documents inside Flowinity.
- **Insights**, see reports about how, and when you use Flowinity.
- **Communications**, the built-in messaging platform to communicate with other
  users.
- **Scoped API keys** for additional security.
- **Scoped passwords**, set custom passwords with different API permissions.
- **ShareX, and Sharenix support** (built-in client export).

## System Requirements

- Node.js 18.0.0 or newer (NodeJS 18 is necessary for structuredClone, no
  polyfills are built-in)
- 2GB of RAM or more (RAM usage is dependent on the number of threads Flowinity uses)
- 4GB of disk space or more (for core server, database, and frontend files)
- 64-bit x86 or ARM processor, 1 CPU core or more (4 recommended)
- MariaDB server (MySQL won't work, Sequelize dialect "mysql" does not support
  JSON)
- Redis server with RedisJSON plugin (only works with UNIX-like systems)
- Linux, other UNIX-based like macOS (Microsoft Windows is not officially
  supported)
- Tesseract OCR (with English language support) for OCR features

# Setting Up

These instructions assume you're using a standard Linux system with systemd,
these instructions will differ depending on what init system you use.

<details>
  <summary><h2>Docker w/ docker-compose (Quickest method)</h2></summary>

1. Clone the Docker-specific repo:
   `git clone https://github.com/PrivateUploader/docker-compose flowinity`
2. Change directory into repo: `cd flowinity`
3. Create the container (change the environment variables to your liking):
   `DB_DATABASE=flowinity DB_USER=flowinity DB_PASSWORD=CHANGE_ME DB_ROOT_PASSWORD=CHANGE_ME docker-compose up -d`
4. Follow the setup wizard on http://localhost:34582
5. You must change the MariaDB server hostname to `mariadb` and the redis
hostname to `redis` in the setup wizard. (seen below):
![Setup Wizard](https://i.flowinity.com/i/87987421cfa1.png)
![Setup Wizard](https://i.flowinity.com/i/582d2fd8d1a7.png)
</details>

<details>
  <summary><h2>Manual Setup</h2></summary>

1. Create Flowinity user and group: `useradd -m flowinity`
2. Install MariaDB and Redis (with the RedisJSON plugin) on your server.
3. Login as the Flowinity user: `su flowinity`
4. Change directory into TPU home directory: `cd`
5. Clone the repository:
   `git clone https://github.com/PrivateUploader/Flowinity flowinity`
6. Change directory into the repository: `cd flowinity`
7. Install dependencies: `yarn install`
8. Create systemd service files for TPU with
   `cp flowinity.service /etc/systemd/system/flowinity.service`
9. Modify the systemd service file (use nano, vim, etc), replace all instances
   of `CHANGE_ME` with your own values. Do not run Flowinity as root user and use the
   user created earlier.
10. Start TPU and start on boot with `systemctl enable flowinity --now`
11. Follow the setup wizard on http://localhost:34582 and configure NGINX web
server.
</details>

<details>
  <summary><h2>NGINX Configuration</h2></summary>

1. TPU includes an example NGINX configuration file, you can find it at
   `nginx.conf` in either of the Docker or primary TPU repositories.
2. Copy it to your NGINX configuration directory:
   `cp nginx.conf /etc/nginx/conf.d/flowinity.conf` (this folder can differ between
   distributions, it could be `/etc/nginx/sites-available`, if so, symlink it to
   `/etc/nginx/sites-enabled`).
3. Modify the NGINX configuration file (use nano, vim, etc), replace all
   instances of `CHANGE_ME` with your own values.
4. Test the NGINX configuration: `nginx -t`
5. If the test is successful, reload NGINX: `nginx -s reload`
</details>

## Scripts

- `yarn build` - Build Flowinity.
- `yarn serve` - Start Flowinity in development mode.
- `yarn serve-cluster` - Start Flowinity in development cluster mode.
- `yarn start` - Start Flowinity in production mode and build (cluster mode).

Even if you only have 1 CPU core/thread, you should still use `start` in
production as it will support the `TPU_RESTART` process command and will
automatically scale if you add more CPU cores/threads.

#### Do not restart Flowinity via `pm2` or `systemd` if you are using the `serve-cluster` script in production.<br><br>This can be done in the admin panel or via a POST request to /api/v3/admin/restart (administrator account required, can be automated with "admin.ci" API scope).

#### Having a single CPU core will cause Flowinity to be temporarily unavailable when restarting.

## Contributors

[![All Contributors](https://img.shields.io/github/all-contributors/Troplo/PrivateUploader?color=ee8449&style=flat-square)](#contributors)

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://troplo.com"><img src="https://avatars.githubusercontent.com/u/45160807?v=4?s=100" width="100px;" alt="Troplo"/><br /><sub><b>Troplo</b></sub></a><br /><a href="#code-Troplo" title="Code">💻</a> <a href="#doc-Troplo" title="Documentation">📖</a> <a href="#data-Troplo" title="Data">🔣</a> <a href="#infra-Troplo" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#security-Troplo" title="Security">🛡️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/theloosegoose"><img src="https://avatars.githubusercontent.com/u/32515234?v=4?s=100" width="100px;" alt="The Loose Goose"/><br /><sub><b>The Loose Goose</b></sub></a><br /><a href="#code-theloosegoose" title="Code">💻</a> <a href="#infra-theloosegoose" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#translation-theloosegoose" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://bytedefined.com"><img src="https://avatars.githubusercontent.com/u/56295147?v=4?s=100" width="100px;" alt="bytedefined"/><br /><sub><b>bytedefined</b></sub></a><br /><a href="#code-Bytedefined" title="Code">💻</a> <a href="#translation-Bytedefined" title="Translation">🌍</a> <a href="#ideas-Bytedefined" title="Ideas, Planning, & Feedback">🤔</a> <a href="#bug-Bytedefined" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://electrics01.com"><img src="https://avatars.githubusercontent.com/u/103579308?v=4?s=100" width="100px;" alt="ElectricS01"/><br /><sub><b>ElectricS01</b></sub></a><br /><a href="#code-ElectricS01" title="Code">💻</a> <a href="#ideas-ElectricS01" title="Ideas, Planning, & Feedback">🤔</a> <a href="#bug-ElectricS01" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Jolt707"><img src="https://avatars.githubusercontent.com/u/106564193?v=4?s=100" width="100px;" alt="Jolt707"/><br /><sub><b>Jolt707</b></sub></a><br /><a href="#code-Jolt707" title="Code">💻</a> <a href="#ideas-Jolt707" title="Ideas, Planning, & Feedback">🤔</a> <a href="#bug-Jolt707" title="Bug reports">🐛</a> <a href="#a11y-Jolt707" title="Accessibility">️️️️♿️</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
