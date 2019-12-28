---
title: "Working With Logstash"
date: 2019-12-27T20:54:52-05:00
draft: true
author = "Taleeb Midi"
tags: [logstash, elasticsearch]
---

# Introduction

In this post, I am trying to write some of finding while working with Logstash. I recently been tasked to ship logs of multiple network devices to an Elasticsearch cluster. The same cluster was already receiving logs from thousands of Beats agents (Filebeat and Winlogbeat) and I just recently configured a cluster of syslog servers to receive logs from these network devices. you can read more about that in [Working with Rsyslog](https://midiroot.com/working-with-rsyslog/).

Before we dive in I think it is important to explain the different stages of a Logstash processing pipeline. Logstash has three stages:

- Inputs: inputs are used to get data into Logstash at the time of writing this article and on the current Logstash version (7.5) there are a total of 54 inputs. **file**, **syslog** and **beats** are the most commonly used ones.
- Filters:
