module.exports = app => {
  app.on('issues.opened', async context => {
    // `context` extracts information from the event, which can be passed to
    // GitHub API calls. This will return:
    //   { owner: 'yourname', repo: 'yourrepo', number: 123, body: 'Hello World! }
    const tempParams = context.issue()
    const owner = tempParams.owner
    const ownerType = context.issue.user.login
    const params = context.issue({ body: ownerType })

    // Post a comment on the issue
    return context.github.issues.createComment(params)
  })
}
