module.exports = app => {
  app.log("app loaded")
  app.on('issues.opened', async context => {
    // `context` extracts information from the event, which can be passed to
    // GitHub API calls.

    //get payload
    payload = context.payload

    //get type of the owner of the repository because app should only be available for users
    repository_owner_type = payload.repository.owner.type

    if (repository_owner_type === "User") {
      app.log("user found")
      //get issue creator info
      issue_creator_dict = payload.issue.user

      //get issue creator name
      issue_creator_name = issue_creator_dict.login

      //get followers link for issue creator
      issue_creator_followers_link = issue_creator_dict.followers_url

      //get issues created by the creator of the opened issue
      const response = await context.github.issues.listForRepo(context.repo({
        state: 'all',
        creator: issue_creator_name
      }))
      //count how many issues
      const countIssue = response.data.filter(data => !data.pull_request).length
      app.log("count issue")
      app.log(countIssue)

      //check it is their first issue
      if (countIssue === 1) {
        app.log("first issue/PR")
        //find if the user already follows them by checking the followers link
        //if creator of issue is not followed, makes a comment on the repo
        //otherwise does nothing

        const config = await context.config('friendzoner.yml')
        //check that the bot is enabled
        app.log("config")
        app.log(config.friendzone_enabled)
        if (config.friendzone_enabled) {
          if (config.auto_follow) {
            app.log("auto_follow")
          } else {
            app.log("no auto_follow")
          }
          app.log("enabled")
        } else {
          app.log("disabled")
        }

      } else {
        app.log("not first issue")
      }

    } else {
      app.log("Organisation found")
    }

  })
}
