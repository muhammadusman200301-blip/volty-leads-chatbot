# Volty lead-qualifying chatbot for voltade.com

First-round assessment for Voltade, by Muhammad Usman.

**Live chat:** https://volty.voltade.com/chat/8hke2y6mr5wvnvsqrg3d2

## What it does

1. **Answers questions** about Volty from the voltade.com pages. The site is connected as a Volty source (594 pages, refreshed daily), so prices, features, integrations and case studies come from the page, not from memory.
2. **Qualifies the visitor** one question at a time, mostly with tap cards: industry, channels, monthly chats, team size, biggest problem, current tools, country, timeline, then a contact form.
3. **Scores the lead** Hot, Warm or Cold with a simple points table (below), and labels the contact `lead-hot`, `lead-warm` or `lead-cold` once scoring is done.
4. **Acts on the score.** Hot leads give their contact details, then go to the team with a one-glance summary. Warm leads get the plan, the free-trial link and the offer of a call, with no hand-off. Cold leads get the trial link and the pricing page.
5. **Recommends a plan** from team size: Plus, Pro, Max or Enterprise, always, at the visitor's local price when voltade.com lists one.
6. **Records every qualified lead** as one row in the `leads` table, and an automation fills in the row's contact details if the visitor sends them after the hand-off.

## Design choices

- **Answer first, then qualify.** A visitor who asks about pricing gets the price before any question. Forms never block an answer.
- **One question per message, max 3 sentences.** It reads like a person, not a form.
- **Tap over type.** Choice, Form, Table and Link button cards keep the chat fast on mobile.
- **Local pricing from the site.** Outside the US, the bot quotes the price from that country's voltade.com pricing page (for Singapore, https://voltade.com/en-sg/pricing: Plus S$199, Pro S$500). Only a market the site does not list (such as Malaysia) goes to the team. An earlier rule sent every non-US visitor to the team, which turned Warm Singapore leads into hand-offs.
- **No made-up results.** Only the published case studies (Yong Kang TCM, Prologue Clinic, Happy Fish, illum.e, Yat Guan, Cake Inspiration) and their exact numbers, starting with the first one for the visitor's industry.
- **Security in one line.** Data questions always get the three facts: hosted on AWS in Singapore, customer data never trains AI, zero data retention with AI providers.
- **Know when to stop.** Job seekers and vendors get the `not-a-lead` label and team@voltade.com, with no sales questions. Requests for a person, Enterprise, security questionnaires or an unlisted local price go straight to the team.
- **Label once.** The label is set only after scoring, because removing a label later waits for staff approval.

## Lead score

| Signal | Points |
|---|---|
| Clinic, education, B2B or ecommerce | +15 |
| 2+ channels | +10 |
| 1,000-5,000 chats a month / 5,000+ | +15 / +20 |
| 6-20 people / 21+ | +10 / +15 |
| Start this month / 1-3 months | +25 / +15 |
| Switching from SleekFlow, respond.io or Wati | +10 |
| Gave work email and WhatsApp | +10 |

Hot: 60+ · Warm: 35-59 · Cold: under 35

## Leads table and labels

- **`leads` table** (`tbl:3pxqbp3tc6z2`): name, company, email, whatsapp, industry, channels, monthly_volume, team_size, main_problem, tools, country, timeline, recommended_plan (Plus/Pro/Max/Enterprise), score, tier (hot/warm/cold), summary, contact_id. Volty stamps the row's date itself, so there is no created_at column. The web chat may add rows but cannot read the table; `contact_id` is the customer-owner column, so a chat sees and updates only its own visitor's row. One row per lead, updated rather than duplicated.
- **Contact Labels:** `lead-hot`, `lead-warm`, `lead-cold`, `not-a-lead`, each described, and Volty may add them.

## Automation: `lead-contact-sync`

`volty/automations/lead-contact-sync.ts`. Volty often writes a Hot lead's row at hand-off, before the visitor sends the contact form. The automation runs on every web chat visitor message, waits two minutes for Volty's turn to save the details, finds the visitor's row by `contact_id`, and copies name, email and WhatsApp from the contact into any of those cells that are empty. It never overwrites a value. Volty has no "label added" or "contact updated" event, so the visitor's message is the trigger.

## Testing

Seven personas in `docs/test-personas.md`, run with `volty debug wake-sync --web-chat` on the Sandbox. Four rounds on 23 Nov 2026, fixing the instructions after each of the first three. All seven pass:

| # | Persona | Result |
|---|---|---|
| 1 | Clinic, Hot | Pass: Yong Kang, Pro, hand-off, complete row |
| 2 | Ecommerce, Warm | Pass: Cake Inspiration, Plus at S$199, trial link, call offer, no hand-off |
| 3 | B2B switcher | Pass: Yat Guan, SleekFlow comparison, Pro, hand-off for Malaysia pricing |
| 4 | Security | Pass: AWS Singapore, no training, zero retention |
| 5 | Zoho | Pass: yes, from the Zoho CRM integration page |
| 6 | Job seeker | Pass: team@voltade.com, `not-a-lead`, no sales questions |
| 7 | Asks for a person | Pass: immediate hand-off |

## Opening

- Headline: "Hi there! Want 90% of your chats answered automatically?"
- Shortcuts: What does Volty do? · Pricing and free trial · Is Volty right for my business?

## Files

| Path | What it is |
|---|---|
| `instructions/web-chat.md` | Copy of the web chat instructions running in Volty (under 4,000 characters) |
| `volty/` | The workspace as a Volty project (`volty pull` / `volty push`): inbox settings, instructions, the automation |
| `docs/knowledge-notes.md` | Facts collected from voltade.com, used to write and check the instructions |
| `docs/test-personas.md` | Test cases and results |
| `web/index.html` | Demo page with the one-line script tag install |

## Install on any site

```html
<script async src="https://volty.voltade.com/widget/v1.js" data-widget-id="8hke2y6mr5wvnvsqrg3d2"></script>
```

The site's domain must be on the web chat's allowed websites list.
