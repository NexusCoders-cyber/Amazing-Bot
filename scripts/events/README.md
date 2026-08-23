# AmazingBot V2 — Event Scripts

Event scripts run automatically on group events (joins, leaves, etc.).

```js
export default {
    config: {
        name: 'eventname',
        author: 'YourName',
        version: '1.0',
        shortDescription: 'What this event does',
        category: 'events',
        role: 0,
    },

    async onStart({ sock, from, participants, action, author, metadata, changes }) {
        // action: 'add' | 'remove' | 'leave' | 'promote' | 'demote' | 'subject' | 'desc' | 'announce' | 'restrict'
        // participants: array of JIDs affected
        // author: JID of whoever triggered the action, when known
        // metadata: group metadata object
        // changes: extra data for 'subject' | 'desc' | 'announce' | 'restrict' (e.g. { subject: 'New name' })
    },
};
```

Every registered event script runs on every matching action — the bot loops through all of `AmazingBot.eventCommands` and calls `onStart` on each one, the same way GoatBot V2 does.

See `newevent.eg.js` for a bare template, `welcomeEvent.js` for a welcome/goodbye implementation, and `log.js` for promote/demote/group-settings announcements.
