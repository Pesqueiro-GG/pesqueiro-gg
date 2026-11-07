# Could-haves (unscheduled)

Only with spare time, after every Must and Should of the current milestone. Each is written well enough to start, but check the design again before picking one up: things may have changed.

<!-- item: C-01 -->
## C-01 · Vote for the Fish of the Month

**Type** Story · **Milestone** unscheduled · **Workstream** C · Social · **Priority** Could · **Size** M
**Depends on** {{S-12}}, {{S-16}}

### Story
As a group member, I want to nominate one fish a month and vote on others, so that great catches get recognized without XP.

### Implementation notes
- Tables `fish_month_entries` (`group_id`, `month` `YYYY-MM`, `user_id`, `catch_id`; PK group, month, user) and `fish_month_votes` (`group_id`, `month`, `voter_id`, `catch_id`; PK group, month, voter).
- Rules: one nomination per person per group per month, a catch caught that month and shared with the group; one vote per person, not for your own; voting closes at midnight Brasília time on the last day; the daily job picks the winner (most votes, then heavier, then earlier nomination) and awards a "Peixe do Mês" badge on the catch, no XP.
- UI: a "Peixe do mês" section on the group page; nominate from the catch page; winner badge on the catch card.

### Acceptance criteria
- [ ] Given a closed month, then the winner shows the badge and nobody received XP for it.

---

<!-- item: C-02 -->
## C-02 · Get push notifications

**Type** Story · **Milestone** unscheduled · **Workstream** A · Platform · **Priority** Could · **Size** M
**Depends on** {{S-18}}, {{S-41}}

### Story
As an angler, I want notifications on my phone, so that I don't miss a reaction or a challenge result.

### Implementation notes
- Web Push with VAPID keys (`web-push`), a small service worker only for `push` and `notificationclick`, table `push_subscriptions`.
- Opt-in from Settings, per type (social, progress, challenges); works on Android and on iPhone only when installed.
- Sent from the same handlers as in-app notifications, after the response; expired subscriptions removed on 404/410.

### Acceptance criteria
- [ ] Given opt-in on an installed Android app, then a comment on my catch arrives as a push within a minute.

---

<!-- item: C-03 -->
## C-03 · Explore fishing by state

**Type** Story · **Milestone** unscheduled · **Workstream** C · Social · **Priority** Could · **Size** M · **Journey** J5
**Depends on** {{S-24}}

### Story
As a curious angler, I want to browse public catches by state, so that I discover fishing in other regions.

### Implementation notes
- A state filter on the public feed (`TimelineSource` scope `public` with `state`), using the catch's `city_id` → UF; index on (`state`, `created_at`) through a column copied to `posts` at publish time.
- A "Explorar" screen with a list of states and the top species seen in each this season.

### Acceptance criteria
- [ ] Given the filter set to SP, then only public catches from São Paulo cities appear.

---

<!-- item: C-04 -->
## C-04 · Pages for pay-to-fish lakes

**Type** Story · **Milestone** unscheduled · **Workstream** B · Gamification · **Priority** Could · **Size** S
**Depends on** {{S-09}}

### Story
As an angler, I want a page per pay-to-fish lake with what was caught there, so that I can choose where to go.

### Implementation notes
- `/places/[id]`: name, city, recent public catches there, species seen (with counts), tips linked to the place.
- Only `kind = 'pay_to_fish'` places have pages; wild spots never do.

### Acceptance criteria
- [ ] Given a lake with public catches, then its page lists them and the species seen.

---

<!-- item: C-05 -->
## C-05 · Protected species notice

**Type** Story · **Milestone** unscheduled · **Workstream** B · Gamification · **Priority** Could · **Size** S
**Depends on** {{S-09}}, {{T-08}}

### Story
As an angler logging a protected species, I want a short notice about it, so that I learn without being lectured.

### Implementation notes
- When the selected species has `is_protected` and "kept" is chosen, show the species' `protection_note` in a neutral info box (reed color, shield icon) with a link to the official source; the catch can still be saved (XP rules already give 0).
- No notice when released.

### Acceptance criteria
- [ ] Given a protected species marked kept, then the notice shows once in the form and the catch saves normally.
