# Fortnite Chest Counter

A small, open-source **manual Fortnite chest counter** from [LootCounter](https://lootcounter.com/). This GitHub repository contains a Fortnite chest counter you can download, run locally and adapt under the MIT license. No Epic login, extension, game files, API keys, telemetry or build step.

This is a standalone personal counter, **not the source code of the hosted LootCounter application**. The hosted site includes separate squad rooms and session logs. This repository contains only independently written HTML, CSS and JavaScript for the standalone counter; it does not include a commercial template or its backend.

## Run it

1. Choose **Code → Download ZIP** in this repository, then extract the files.
2. Open `index.html` in a modern browser. Keep the CSS and JavaScript files alongside it.
3. Tap **Add a chest +1** after each opening you want to record.

Local-file storage behavior differs between browsers. For a consistent local origin, serve the folder instead:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:8080`. This binds only to your computer. There are no npm dependencies to install. The page makes no background network requests; the GitHub and hosted-tool links open only when you follow them.

## Controls

| Control       | Behavior                                                                 |
| ------------- | ------------------------------------------------------------------------ |
| +1 / −1       | Add or subtract one; count stays between 0 and 10,000,000                |
| Space / Enter | Add / subtract when this page is focused and you are not using a control |
| Set count     | Replace the count with a known nonnegative whole number                  |
| Undo          | Reverse the latest count change once                                     |
| Reset         | Ask for confirmation, then set the count to zero                         |
| Export JSON   | Download a readable copy of the current count and last update time       |

Shortcuts are local to the page. They do not run while Fortnite is focused, inspect your match or automate input to the game. Keep the page on another screen or tap it on your phone.

## Storage and privacy

The counter uses this browser's `localStorage` key `lootcounter-open-counter:v1`. It saves only a format version, count and update timestamp. It is separate from storage on lootcounter.com. There is no login, backend, analytics, cloud sync or import function. Use one editing tab at a time; simultaneous tabs can overwrite each other's saved count.

Export before clearing site data, changing browsers or closing a private session. If saving fails, a warning explains that the in-memory count needs exporting. If saved data is unreadable, it is preserved, counting is disabled and an original-data download is offered. Reset replaces it only after confirmation.

An export looks like this:

```json
{
  "version": 1,
  "count": 23,
  "updatedAt": "2026-11-12T00:00:00.000Z"
}
```

The timestamp is the counter's update time, not a verified match time. The count represents your manual entries, not Epic account data. This version can export records but cannot import them back.

## Check the code

- `index.html`: accessible controls and instructions.
- `styles.css`: responsive light/dark styles using your system preference.
- `counter.js`: pure validation, bounds and export-record helpers; also loadable by Node for tests.
- `app.js`: browser controls and local persistence.
- `counter.test.cjs`: boundary and malformed-storage tests.

With Node.js 20 or newer, run:

```sh
node --test counter.test.cjs
```

No executable download is needed. If you find a bug, open an issue with reproduction steps; do not include account credentials or other private information.

## Related tools

- [Hosted Fortnite chest counter and tracker](https://lootcounter.com/)
- [Check the scope of an in-game chest count](https://lootcounter.com/how-to-check-chests)
- [Dated session log and JSON export](https://lootcounter.com/fortnite-chest-tracker)

## License and affiliation

MIT — see [LICENSE](LICENSE). Independent fan-made software, not affiliated with or endorsed by Epic Games. Fortnite is a trademark of Epic Games. This tool does not detect chests, find Pirate Tokens, predict rewards or modify the game.
