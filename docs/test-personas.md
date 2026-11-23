# Test personas

Run each persona in the web chat (or with `volty debug wake-sync --web-chat <channel id> --from <seed>`) and check the result.

| # | Persona | What they say | Expected |
|---|---|---|---|
| 1 | Clinic, Hot | Aesthetic clinic in Singapore, WhatsApp + Instagram, ~2,000 chats a month, 8 front-desk staff, manual bookings, wants to start this month | Yong Kang TCM example, Pro plan, hand-off to the team with the summary |
| 2 | Ecommerce, Warm | Online bakery on Shopify, ~500 chats, 3 staff, lost leads after hours, 1-3 months | Cake Inspiration example, Plus plan, free-trial link, offer of a call |
| 3 | B2B switcher | Packaging exporter in Malaysia, email + WhatsApp, uses SleekFlow, slow quotes | Yat Guan example, SleekFlow comparison, hand-off for non-US pricing |
| 4 | Security | "Is my patient data used to train AI?" | No: customer data is not used to train models, AWS Singapore, zero data retention |
| 5 | Zoho | "Do you integrate with Zoho?" | Yes: voltade.com has a Zoho CRM integration page (https://voltade.com/integrations/zoho-crm). Volty reads Zoho CRM leads, contacts, accounts and deals and can create leads or add notes once an admin turns that on. No claim beyond that page |
| 6 | Not a lead | "I'm looking for a job" | Polite answer, team@voltade.com, no sales questions |
| 7 | Human | "Can I talk to a person?" | Immediate hand-off |

## Results

Run with `volty debug wake-sync --web-chat chn:qrjuq9e91grj` on the Sandbox, 23 Nov 2026. Four rounds; the instructions were fixed after rounds 1-3. Final round (round 4) below.

| # | Date | Result | Notes |
|---|---|---|---|
| 1 | 23 Nov 2026 | Pass | Yong Kang TCM example, Pro plan, `lead-hot`, hand-off with trial link, one `leads` row. R1 failed (no plan, Prologue example, 2 rows); R2 fixed. Known gap: hand-off fires before the contact form, so the row has no name/email (they are saved on the contact) |
| 2 | 23 Nov 2026 | Pass | Cake Inspiration example, Plus at S$199 from voltade.com/en-sg/pricing, trial link, offer of a call, no hand-off, `lead-warm`, complete row (score 50). R1-R2 failed (handed off for "non-US pricing"); R3 failed (no row written) |
| 3 | 23 Nov 2026 | Pass | Yat Guan example, SleekFlow comparison, Pro, Malaysia price not on the site so hand-off, `lead-hot`, one row. Same known gap as #1: row lacks contact details |
| 4 | 23 Nov 2026 | Pass | No training on customer data, zero data retention, AWS Singapore. R1-R2 partial (AWS Singapore missing) |
| 5 | 23 Nov 2026 | Pass | "Yes" with what the Zoho CRM page lists (read leads, contacts, accounts, deals; create leads or add notes with admin approval). In round 3 it answered "not a ready connector"; the expectation now follows the page |
| 6 | 23 Nov 2026 | Pass | Polite, team@voltade.com, no sales questions, `not-a-lead` label. R1 partial (no label) |
| 7 | 23 Nov 2026 | Pass | Immediate `hand-to-team` |

### Automation check: `lead-contact-sync` (23 Nov 2026)

Persona 1 rerun after the automation went live: Volty asked for contact details before the hand-off and wrote one complete row (Sarah Tan, Glow Aesthetics, email, WhatsApp, `contact_id` stamped). To test the gap itself, the row's name, email and WhatsApp were cleared and the visitor sent one more message: the next run reported `filled name, email, whatsapp` and the row was complete again, updated by `lead-contact-sync`. The test row and the sandbox conversation were then deleted.
