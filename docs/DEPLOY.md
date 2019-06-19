# Deploying

If you would like to run your own instance of this app, see the [docs for deployment](https://probot.github.io/docs/deployment/).

## App permissions

It requires the following permissions:

- PR: read and write ✅
- Issues: read and write ✅
- Repository Metadata: read only ✅

And the following user permission:

- Followers: read and write ✅

## Config file

In your repository that you want to enable the friendzoner app on,
make sure that you create a file name friendzoner.yml in the .github folder.

This should contain three variables:

- friendzone_enabled
- message
- auto_follow

Friendzone enabled will enable the app if set to true
Message is the message that should be sent when someone makes their first issue/PR
Auto_follow will automatically make the owner of the repository
follow the new contributor if set to true.

For more information, [view an example config file](https://github.com/AngeloGiacco/volt/blob/master/.github/friendzoner.yml)
