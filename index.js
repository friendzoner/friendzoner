module.exports = app => {
  app.log("app loaded")
  app.on('issues.opened', async context => {
    // `context` extracts information from the event, which can be passed to
    // GitHub API calls.

    //get payload
    const payload = context.payload

    //get type of the owner of the repository because app should only be available for users
    const repository_owner_type = payload.repository.owner.type

    if (repository_owner_type === "User") {
      app.log("user found")
      //get issue creator info
      const issue_creator_dict = payload.issue.user

      //get issue creator name
      const issue_creator_name = issue_creator_dict.login

      //get followers link for issue creator
      const issue_creator_followers_link = issue_creator_dict.followers_url

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
        if (config.friendzone_enabled) {
          app.log("enabled")
          const owner_name = payload.repository.owner.login
          if (owner_name !== issue_creator_name){
            app.log("different")
            const followers_info = await context.github.users.listFollowersForUser({
              username: issue_creator_name
            })
            const followers_list = followers_info.data
            app.log(followers_info)
            var found = false
            for (i = 0; i < followers_list.length; i++) {
              var user_list = followers_list[i]
              var username = user_list["login"]
              app.log(username)
              if (username === issue_creator_name) {
                found = true
                break
              }
            }
            if (!found) {
              app.log("issue creator not followed")
            }
            if (config.auto_follow && !found) {
              app.log("auto_follow")
              context.github.follow(issue_creator_name)
            }
            if (!found && config.message !== false && config.message.length > 0 && typeof(config.message) == "string") {
              const message_body = config.message
              const params = context.issue({ body: message_body })
              context.github.issues.createComment(params)
            }
            return context.github.issues.addLabels(context.issue({labels: "newbie"}))
          } else {
            app.log("different")
          }
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
