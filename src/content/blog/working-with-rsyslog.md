---
title: "Working With Rsyslog"
pubDate: "2019-12-25"
slug: working-with-rsyslog
tags: [rsyslog, logging, linux]
description: "Working with rsyslog on Linux: configuration, templates, and forwarding logs to a central server."
---

# Introduction

A couple of weeks ago, I set out to centralize all of our infrastructure logs in one location, for the sake of the teams that need access to them.

Diversity is a good thing, but it is a challenge when you have multiple devices in your infrastructure generating logs in different formats and standards.

While comparing multiple solutions, we needed something that supports Linux, Windows, and dozens of network devices — a solution that is easy to configure and automate, and cost-effective. With thousands of endpoints, it also had to be high performance and scale as needed. The quest led us to the old faithful **rsyslog**: it was the only solution that checked all the boxes, with the capability to deliver one million messages per second to local destinations, and it is completely free.

In this post, I will cover some of the basic configurations to get you up and running and to make your configuration easier to automate and to change your rsyslog server as you add more endpoints.

# Working with Rsyslog

## Installation

rsyslog comes pre-installed in all major Linux distributions, if you need steps to install rsyslog, check [Newbie guide to rsyslog](https://www.rsyslog.com/tag/installation/) to install from source, otherwise use your distro package manager to install it.

### Debian:

    sudo apt install rsyslog

### RHEL:

    sudo yum install rsyslog

## Configurations

rsyslog's main configuration file is typically `/etc/rsyslog.conf`, more configuration files can be placed in `/etc/rsyslog.d/` for a modular configuration.

For this post, we will be creating modular configuration files for inputs, templates and rulesets.

### Inputs

In an rsyslog server, an `input` describes the message sources. An input takes multiple parameters; we will use a few of them to define the port and type.

In a new config file called `01-inputs.conf`, create your first input:

    input(type="imudp" port="514" ruleset="remote_all")
    input(type="imtcp" port="514" ruleset="remote_all")

With this, we created two inputs on the default rsyslog port (514): one to accept TCP connections with type `imtcp`, and the second one for UDP using `imudp`. For TCP, you can also use `imptcp`, which is tailored for high performance and is available since versions 4.7.3+ and 5.5.8+.

`ruleset` is used to define the ruleset that will be used with this input, we will define one in our output config file.

You can add other inputs as you need as long as the port you picked is not used by another process.

### Templates

Templates let you specify the message format, or use them for dynamic file name generation — which we will be using in our `01-templates.conf` file:

    template(name="catch_perhost" type="string" string="/var/log/remote/%FROMHOST%.log")

Here we are using a template of type `string`. `list`, `subtree` and `plugin` are also available as template types. We are generating dynamic file names using `%FROMHOST%` as a string the file name. you can change that and use a static name if you want to send logs from a specific group of devices:

    template(name="catch_asa" type="string" string="/var/log/remote/asa.log")
    template(name="catch_vcenter" type="string" string="/var/log/remote/vcenter.log")
    template(name="catch_all" type="string" string="/var/log/remote/catch_all.log")

Notice the template name changes, which will give us more flexibility later when it comes to our rulesets. When choosing template names, please avoid the `RSYSLOG_*` prefix — those names are reserved for rsyslog's internal use and will cause conflicts.

I use the `catch_all` template to process all unfiltered messages. This helps me capture every message that escapes the filters so I can review them and adjust the filters accordingly.

### Rulesets

A ruleset consists of a filter and the action(s) to execute when the filter evaluates to **true**. A filter can be evaluated using a priority and/or facility; other property-based filters can be used too, like `msg`, `syslogtag`, `hostname`, or the host IP.

In our `03-rulesets.conf`, we will define a ruleset that processes messages coming from the IP address of a vCenter host and places them in the `vcenter.log` file we defined in our templates file.

    ruleset(name="remote_all" queue.type="LinkedList" queue.size="100000") {
            if ($fromhost-ip == '192.168.33.11') then {
                    action(type="omfile"
                        DynaFile="catch_vcenter"
                        FileCreateMode="0664")
                    stop
            }
            # This setup the catch all logging
            action(type="omfile" DynaFile="catch_all")
    }

A lot to unpack here. We are using `remote_all` as the ruleset name — the same value we used when defining which ruleset the `input` uses.
`LinkedList` is an in-memory queue type. When using a LinkedList queue, memory is allocated only when needed, which makes this queue type handle message bursts very well.
In our filter, we check whether `$fromhost-ip` equals the IP address of our vCenter. If true, we use the `omfile` output to write messages to files, using `catch_vcenter` as the dynamic file template. `FileCreateMode` sets permissions for the dynamic file we just created.

# Conclusion

Rsyslog is a powerful logging solution and we barely scratched the surface of all the hundreds of available options/parameters we could use for configuration. It's always good practice to test your configuration in a test environment first, and to see what the [rsyslog documentation](https://www.rsyslog.com/doc/v8-stable/configuration/index.html) has to offer. If you see something I could have done differently in my config, please reach out and let me know — I am always looking to improve.
