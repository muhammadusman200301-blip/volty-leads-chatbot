// The Sandbox inbox: hours, reply targets, hand-off, priority guide, routing, Volty's reply mode and its web chat.
// Written by volty pull from the live inbox. Who works the inbox, team members and channels stay in the app.
import { defineInbox } from '~/inbox'

export default defineInbox({
  name: "Sandbox",
  icon: {
    kind: "emoji",
    value: "🚧",
  },
  autoEnrollOrgMembers: true,
  businessHours: null,
  idleClose: {
    afterMinutes: 1440,
    owned: false,
  },
  firstResponseMinutes: 60,
  handoff: {
    targetMinutes: 240,
    topics: [],
    tellContact: true,
  },
  priority: {
    smartPriority: "off",
    smartSegments: "off",
    guide: {
      high: null,
      medium: null,
      low: null,
    },
  },
  routing: {
    mode: "rules_only",
    policy: null,
    openCap: null,
    rules: [],
  },
  volty: {
    agent: "Volty",
    defaultResponder: true,
    replyMode: "live",
    afterHoursReplyMode: null,
    window: null,
    liveForNewContacts: false,
    stepBackMinutes: 30,
    newContactWindowDays: null,
    waitExtends: false,
    selfStepDown: null,
  },
  webChat: null,
})
