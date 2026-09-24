---
title: "I am often wrong — on incident retrospectives"
pubDate: "2026-09-23"
description: "Leading infra teams taught me that most incident retrospectives fail for human reasons, not process ones. Here is what I got wrong, and what works instead."
slug: incident-retrospectives-i-am-often-wrong
tags: [devops, incidents, culture]
---

Boris Cherny wrote recently that he is often wrong, and the honesty resonated with a lot of people. It resonated with me too — but not because of engineering. It resonated because being wrong is most of what incident retrospectives are for, and most of the retrospectives I have run or sat through got that part wrong before we ever got to the action items.

I have been on call for production systems for most of my career, first as a sysadmin and now leading platform and infrastructure teams. Here are the things I used to believe about retrospectives that I no longer believe.

## Wrong #1: The timeline is the deliverable

Early in my career I ran retrospectives like investigations. We assembled the timeline to the minute, identified the root cause, assigned the action items, and closed. The document was tidy. The next incident looked exactly the same.

The timeline is a map, not the territory. What actually changed behavior on my teams was not a better timeline — it was asking a different question: *what would have made this incident boring?* Boring is the right bar. An incident is a system working as designed under bad conditions; the goal is not to find who or what failed, but to find the cheapest change that makes this class of event unremarkable. Sometimes that is a config, sometimes it is a runbook, and sometimes it is deleting the feature that caused it. Framing the question around the event instead of the people keeps the conversation off the defensive.

## Wrong #2: Action items fix incidents

Most action items I used to write were tickets in disguise: "add monitoring to X", "improve alerting on Y". They would sit in the backlog next to feature work, lose the priority fight every sprint, and quietly rot.

What worked better was a smaller, harder list:

- Every action item has an owner and a due date that someone agreed to out loud.
- No more than three per incident. If there are ten, we have not finished thinking — we have just started listing.
- Anything that cannot be scheduled goes to an explicit "accepted risk" list with a name next to it. An accepted risk someone signed is worth more than a ticket nobody will do.

A retro that produces one change that actually ships beats one that produces ten that don't.

## Wrong #3: Blameless means nobody feels anything

We wrote "blameless" on the wall and then acted surprised when nobody spoke freely. Blamelessness is not a rule you announce; it is a property of what happens to the person who speaks up next time.

Two things helped more than any policy:

- The engineer closest to the failure presents it themselves. Not their manager, not me. They narrate what they saw and believed at each moment, and the room's job is to make "given what they knew at the time, that decision made sense" come true.
- Leadership goes first. When I open the retrospective with the decisions *I* made that contributed — the deadline that pushed the risky deploy, the alert backlog I deprioritized — the room learns that honesty is safe at every level, not just theirs.

I still catch myself wanting to know "who" before "why". Catching that reflex is most of the job.

## Wrong #4: Every incident needs a full retrospective

We retrospected everything, so nobody wanted any of it. A 2 a.m. alert that a disk filled up does not need six people and a doc template; it needs a fix and a note.

What we do now: every incident gets written up, but only classes of incidents get a meeting — when the blast radius was large, when the same failure mode has recurred, or when the fix crossed a team boundary. Everything else is a paragraph and a link. The scarce resource in a retrospective is not the conference room, it is the attention of the people in it.

## What I still get wrong

I still underestimate how long action items take, and I still let "we'll add capacity monitoring" survive a meeting when "delete the cron job" was the real fix. And every time I think we have a handle on incident culture, a new failure mode — a deploy that a junior was afraid to roll back, a dashboard nobody trusted — teaches me that the process was fine and the trust was not.

Being often wrong is not a disclaimer. It is the design assumption. Your retrospective process should assume the people in the room — including you — will misread the situation, and should be built to survive that.

If you see something I could have done differently here, I would genuinely like to hear it. I am on [X](https://x.com/taleeb_midi) and [LinkedIn](https://www.linkedin.com/in/taleebmidi/) — let's connect.

## References

- [I am often wrong](https://borischerny.com) — Boris Cherny
- [How Complex Systems Fail](https://how.complexsystems.fail) — Richard I. Cook
- [Postmortem culture](https://sre.google/sre-book/postmortem-culture/) — Google SRE Book