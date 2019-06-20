# Testing 🧪

I have used the receive feature of probot in order to simulate the API payloads
that would be received by the app.

```sh

cd path/to/folder

node_modules/.bin/probot receive -e issues -p test/fixtures/issues.opened.user.json ./index.js

```

This will simulate the app based on the payload and flag any issues🚨
