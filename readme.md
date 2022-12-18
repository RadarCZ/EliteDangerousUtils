# ed-log-reader
[![GitHub](https://img.shields.io/github/license/radarcz/ed-log-reader?style=for-the-badge)](https://github.com/RadarCZ/ed-log-reader/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/ed-log-reader?style=for-the-badge)](https://www.npmjs.com/package/ed-log-reader)
[![GitHub last commit](https://img.shields.io/github/last-commit/radarcz/ed-log-reader?style=for-the-badge)](https://github.com/RadarCZ/ed-log-reader)

[![node-current](https://img.shields.io/node/v/ed-log-reader?style=for-the-badge)](https://nodejs.org/dist/v19.3.0/)
[![npm dev dependency version](https://img.shields.io/npm/dependency-version/ed-log-reader/dev/typescript?style=for-the-badge)](https://www.npmjs.com/package/typescript)

[![Mastodon Follow](https://img.shields.io/mastodon/follow/109387591320006293?domain=https%3A%2F%2Fgomastodon.cz&style=social)](https://gomastodon.cz/@datradar)
[![Twitter Follow](https://img.shields.io/twitter/follow/datradar?style=social)](https://twitter.com/DatRadar)


#### I strongly suggest using typescript for consumption of this library.
#### Due to the amount of different objects and log types not all typings may be available, feel free to make a pull request!

# EDLog

EDLog is a basic `EventEmitter` that acts as a wrapper around
that handles log rotation, parsing and handling of their events.

It can also act as a backlog reader.

EDLog is very simple to bootstrap as it takes care of pathing too.

Please mind that events may be delayed by about 100ms as the log is polled.

## Compatibility

**Only runs on Windows right now, sorry.**

### Simple demo
```typescript
import { EDLog, locations } from 'elite-dangerous-utils';

const log = new EDLog();

log.on('event:ReceiveText', event => {
    switch (event.Channel) {
        case 'npc':
            console.log(`Message from: ${event.From_Localised || event.From}: ${event.Message_Localised}`);
            break;
        case 'player':
            console.log(`Direct message from: ${event.From.substr(1)}: ${event.Message}`);
            break;
        case 'local':
            if (event.From_Localised.startsWith('CMDR')) {
                console.log(`Message from ${event.From_Localised.replace('Commander ', '')}: ${event.Message}`);
                break;
            }
            console.log(`Message from ${event.From.substr(1)}: ${event.Message}`);
            break;
    }
});

log.on('event:Bounty', event => {
    console.log(`Killed ${event.Target} for ${event.TotalReward} `);
});
log.on('file', ev => console.log(ev.file))
log.on('event', ev => console.log(ev));
log.start();
```

### Events

- `event:*`: Emitted for each log event as documented in the [Spec](https://forums.frontier.co.uk/attachment.php?attachmentid=112608&d=1477509102]) and possibly more.
    - [TS] Some events may not be explicitly typed, in these cases please us the generic form and create a pull request.
    - The `timestamp` property is replaced by a `Date` object for ease of use.
- `event`: Catch-all listener for ALL events.
- `file`: Emitted when a log rotation occurs
    - `file`: The file path of the new file.
- `warn`: Emits an error object.

For all other docs please see the `.ts` files.

---

### Docs

Due to the size of the schema of this API, please refer to the `.ts` files, most types should be documented.
