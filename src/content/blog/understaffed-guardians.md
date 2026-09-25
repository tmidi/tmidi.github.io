---
title: "Understaffed guardians: why InfoSec builds policy instead of solutions"
pubDate: "2026-09-24"
description: "A recent r/devops rant called infrastructure engineering 'the art of telling developers no'. I think the security teams saying no are as underfunded as the developers hitting the wall."
slug: understaffed-guardians
tags: [devops, security, culture]
---

![Three mentalities of infrastructure: an open field, a locked gate, and a funded road](/images/funded-road-comic.svg)

Every developer has met the villain of this story: the security team that answers every request with a ticket, a policy review, and eventually a no. The villain is easy to caricature, and the recent wave of frustration about AI access (model gateways, token exchanges, nine-minute credentials) has turned that caricature into a genre. A rant on r/devops captured it well: "when did infrastructure engineering become the art of telling developers 'no'?"

But I want to argue something less satisfying and, I think, closer to the truth: **most security teams aren't saying no because they're malicious or power-hungry. They're saying no because it's the only output their budget buys.**

## The economics of a "no"

A "yes" is expensive. If a developer asks, "Can my service call this internal API?" and security says yes, someone has to design the auth flow, someone has to implement it, someone has to test it, document it, monitor it, and answer questions about it for the next three years. A yes is a project with a lifetime cost.

A "no" is cheap. It costs one review meeting and one sentence.

When a team is drowning, and security teams are drowning, the rational allocation of their scarce attention is to spend it on the cheap output. Not because they prefer to obstruct, but because **the org chart has priced "yes" out of their reach**.

This is the observation buried in the most upvoted reply to that rant: management chronically underfunds infrastructure and security, InfoSec "builds policy and not solutions" *because they're understaffed too*, and everyone is scraping by with not enough capacity. The gatekeepers aren't standing at the gate. There is no gate. There's a rope, a laminated sign, and one very tired person holding both.

## The misallocation problem

So the scarce resource, senior security judgment, gets spent writing documents instead of building systems. That's not a culture failure, it's a triage failure. Faced with ten times the demand they can handle, security teams do the only scaling move available to a team with no headcount: **they convert problems into requirements.**

Requirements scale beautifully. A policy document, once written, applies to everyone forever and costs nothing per additional request. A self-service developer platform, by contrast, has to be built, maintained, versioned, and staffed. It's a product with customers, and nobody has funded the product team.

The result is the situation every practitioner recognizes: the security apparatus consumes the actual product. Compliance expands because it's the only lever. And each new layer (identity, zero trust, gateways, policy engines, now model gateways and prompt policies) is added by the same logic that adds one more form to a RMV counter when you can't hire more clerks.

## Why AI made it worse (and why it was always going to)

AI didn't create this dynamic; it ran into it at full speed. A new technology with enormous potential arrives, everyone wants to use it tomorrow, and the security organization, which has no spare capacity to build a paved road, responds with the only tool it has: restrictions. Model access policies. Regional restrictions. Per-user permissions. Tokens issued by identities that need permission to request the tokens.

The 1990s engineer's "here's a socket, go build" worked not because the 90s were wiser, but because **the internet began as a system with no security budget at all**. That was its own kind of underfunding, just the kind that doesn't announce itself until you're cleaning up an incident.

## What "funded properly" looks like

If the diagnosis is structural, the fix isn't a culture memo. It's three concrete resource decisions:

1. **Fund the paved road, not just the guardrail.** A platform team whose product is "the safe way is the easy way": golden paths where the compliant choice is the default one, not the one you file an exception for. This is expensive. That's the point. If it's unbuilt, it's because it's unfunded, not because developers are reckless.

2. **Buy back "yes" with automation.** For the most common requests (a service identity, an API permission, a model endpoint) the answer should be a pipeline, not a meeting. If a class of request happens more than ten times a year, it should never again require human review.

3. **Measure security by throughput, not by blocks.** The KPI of a security team shouldn't be "requests denied." That metric rewards the rope and the laminated sign. It should be something like "days from request to safely yes." Teams optimize what you measure, and right now most orgs measure obstruction.

## The honest caveat

None of this means the rants are wrong, only that they're aimed at the wrong target. The developer who spent a week fighting a token exchange is genuinely a victim of a broken system. So is the security engineer who wrote the policy at midnight because building the alternative was never in anyone's budget. **Two underfunded teams, one org chart.** The antagonism between them is the sound of a company buying control it can't afford instead of capability it can.

The 90s mentality was "here are some powers, try not to screw it up." The modern mentality is "you probably shouldn't be allowed to." The mentality that gets us out is neither. It's "here's a funded road, and yes is the default."

If you see something I could have done differently in this argument, reach out.

## References

- Original r/devops thread: [When did infrastructure engineering become the art of telling developers 'no'?](https://www.reddit.com/r/devops/comments/1woo526/when_did_infrastructure_engineering_become_the/)
