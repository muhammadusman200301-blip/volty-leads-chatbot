// Fills a web chat lead's name, email and WhatsApp into their `leads` row from the contact.
// Volty often writes the row at hand-off, before the visitor sends the contact form, so the row
// misses those fields. The event catalog has no "label added" or "contact updated" event, so this
// runs on each web chat visitor message, waits for Volty's turn to save the details, then copies them.
import { defineAutomation, z } from '~/automation'

const LEADS = 'tbl:3pxqbp3tc6z2'

type Identifier = { kind: string; value: string; verified: boolean; isPrimary: boolean }
type LeadRow = { id: string; fields: Record<string, unknown> }

// Primary first, then verified, then the most recently listed.
function pick(ids: Identifier[], kinds: string[]): string | null {
  const found = ids.filter((i) => kinds.includes(i.kind) && i.value)
  found.sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || Number(b.verified) - Number(a.verified))
  return found[0]?.value ?? null
}

function isEmpty(v: unknown): boolean {
  return v === undefined || v === null || v === ''
}

export default defineAutomation({
  id: 'lead-contact-sync',
  trigger: { kind: 'event', name: 'message.received', filter: { channel: 'web' } },
  queueWhilePaused: true,
  input: z.object({ conversationId: z.string() }),
  output: z.object({ updated: z.boolean(), reason: z.string() }),
  async run({ input, ctx }) {
    // Let Volty's turn on this message save the identifiers and write the row first.
    await ctx.sleep(120_000)

    const conv = (await ctx.volty.conversations.get({ conversationId: input.conversationId })) as {
      contactId: string | null
    }
    if (!conv.contactId) return { updated: false, reason: 'no contact' }

    const { rows } = (await ctx.volty.rows.query({
      tableId: LEADS,
      where: [{ column: 'contact_id', op: 'eq', value: conv.contactId }],
      limit: 1,
    })) as { rows: LeadRow[] }
    const row = rows[0]
    if (!row) return { updated: false, reason: 'no lead row' }

    const { contact } = (await ctx.volty.contacts.get({ id: conv.contactId })) as {
      contact: { displayName: string | null; profileName: string | null; email: string | null; phone: string | null }
    }
    const { identifiers } = (await ctx.volty.contacts.listIdentifiers({ contactId: conv.contactId })) as {
      identifiers: Identifier[]
    }

    const fromContact: Record<string, string | null> = {
      name: contact.displayName ?? contact.profileName,
      email: contact.email ?? pick(identifiers, ['email']),
      whatsapp: contact.phone ?? pick(identifiers, ['phone', 'whatsapp_wa_id']),
    }

    // Only fill what the row is missing, so a value Volty or staff wrote is never overwritten.
    const fields: Record<string, string> = {}
    for (const [key, value] of Object.entries(fromContact)) {
      if (value && isEmpty(row.fields[key])) fields[key] = value
    }
    if (Object.keys(fields).length === 0) return { updated: false, reason: 'nothing missing' }

    await ctx.volty.rows.update({ tableId: LEADS, rows: [{ id: row.id, fields }] })
    return { updated: true, reason: `filled ${Object.keys(fields).join(', ')}` }
  },
})
