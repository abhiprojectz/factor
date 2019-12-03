import axios from "axios"
import { onEvent, addFilter } from "@factor/tools"
import { EmailTransactionalConfig } from "@factor/email/util"
slack()

facebook()

function slack(): void {
  if (process.env.SLACK_NOTIFY_URL) {
    // Track email sign up events
    onEvent(
      "email-list-new-email-added",
      ({
        email,
        listId,
        tags = []
      }: {
        email: string;
        listId: string;
        tags: string[];
      }) => {
        let text = `New email [${email}] added to [${listId}].`

        if (tags.length > 0) {
          text += ` Tags: ${tags.join(", ")}`
        }

        axios.request({
          method: "post",
          url: process.env.SLACK_NOTIFY_URL,
          data: { text }
        })
      }
    )

    addFilter("transactional-email", (email: EmailTransactionalConfig) => {
      axios.request({
        method: "post",
        url: process.env.SLACK_NOTIFY_URL,
        data: {
          pretext: `Email Sent to "${email.to}" from "${email.from}"`,
          title: email.subject,
          text: email.text
        }
      })
    })
  }
}

function facebook(): void {
  onEvent("email-list-new-email-requested", () => {
    if (typeof window.fbq != "undefined") {
      window.fbq("track", "Subscribe")
    }
  })
}