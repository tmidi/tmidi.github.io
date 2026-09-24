---
title: "Working With Logstash"
pubDate: "2019-12-27"
slug: working-with-logstash
tags: [logstash, elasticsearch, logging]
description: "Working with Logstash: pipelines, filters, and shipping events into Elasticsearch."
---

# Introduction

In this post, I want to share some of my findings from working with Logstash. I was recently tasked with shipping logs from multiple network devices to an Elasticsearch cluster. The cluster was already receiving logs from thousands of Beats agents (Filebeat and Winlogbeat), and I had just finished configuring a cluster of syslog servers to receive logs from these network devices. You can read more about that in [Working with Rsyslog](/blog/working-with-rsyslog/).

Before we dive in I think it is important to explain the different stages of a Logstash processing pipeline. Logstash has three stages:

- Inputs: inputs are used to get data into Logstash at the time of writing this article and on the current Logstash version (7.5) there are a total of 54 inputs. **file**, **syslog** and **beats** are the most commonly used ones.
- Filters: filters sit in the middle of the pipeline and transform or enrich messages as they pass through. Common examples are **grok** for parsing unstructured logs, **mutate** for renaming or converting fields, and **geoip** for adding location data. At the time of writing there are more than 200 filter plugins available.
- Outputs: outputs are the final stage of the pipeline — they deliver the parsed events to their destination. **elasticsearch** is the most common output, and **file** and **stdout** are useful for debugging pipelines.

A message flows through the stages in order: an input receives the event, filters transform it, and an output ships it onward. A failing filter does not stop the pipeline by default — Logstash tags the event (for example with `_grokparsefailure`) and passes it along, which is worth remembering when you design your dashboards: filter your failures out deliberately instead of letting them pollute your indices.