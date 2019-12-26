---
title: "Working With Rsyslog"
date: "2019-12-25T10:38:48-05:00"
draft: false
tags: [rsyslog Linux Guide]
---

# Introduction

Couple weeks ago, I took a journey to centralize all our infrastructure logs in one location for the seek of ease to teams who needs access such logs.

Diversity is a good thing, but it's a challenge when you have multiple devices in your infrastructure that generate logs in different formats and standards. While looking at multiple solutions and comparing them.

We needed something that support Linux, Windows and dozens of network devices, a solution that easy to configure, automate and cost effective. With thousands of endpoints it must be of high performance and possible to scale when it is needed to. The quest lead us to the old **rsyslog**, it was the only solution that checked all the boxes with capability to deliver one million messages per second to local destinations and it is completely free.

In this post, I will cover some of the basic configurations to get you up an running with rsyslog and to make your configuration easier to automate and to change your rsyslog server as you add more endpoints.

# Working with Rsyslog

## Installation

rsyslog comes pre-installed in all major Linux distributions, if you need steps to install rsyslog, check [Newbie guide to rsyslog](https://www.rsyslog.com/tag/installation/) to install from source, otherwise use your distro package manager to install it.

### Debian:

    sudo apt install rsyslog

### RHEL:

    sudo yum install rsyslog

## Configurations

Rsyslogd's main configuration is typically found in `/etc/rsyslog.conf`, more configuration files can be placed in `/etc/rsyslog.d/` for a modular configuration.

For this post, we will be creating modular configuration files for inputs, templates and rulesets.

### Inputs

In a rsyslog server, `input` is used to describe the message sources, input takes multiple parameters, we will be using few of them to define the port and type.

I new config file called `01-inputs.conf` create your first input:

    input(type="imudp" port="514" ruleset="remote_all")
    input(type="imtcp" port="514" ruleset="remote_all")

With this; we created two inputs using default rsyslog port (514), one to accept TCP connections with type `imtcp` and the secoand one for UDP using `imudp`. For TCP, you can use `imptcp` which tailored for high performance and it is available since versions 4.7.3+, 5.5.8+.

`ruleset` is used to define the ruleset that will be used with this input, we will define one in our output config file.

You can add other inputs as you need as long as the port you picked is not used by another process.

### Templates

Templates allow you to specify the format of the message or used for dynamic file name generation which we will ne using in our `01-templates.conf` file:

    template(name="catch_perhost" type="string" string="/var/log/remote/%FROMHOST%.log")

We are using here a template of type `string`. `list`, `subtree` and `plugin` are also available as template types. We are generating dynamic file names using `%FROMHOST%` as a string the file name. you can change that and use static name if you want to send logs from a specific group of devices:

    template(name="catch_asa" type="string" string="/var/log/remote/asa.log")
    template(name="catch_vcenter" type="string" string="/var/log/remote/vcenter.log")
    template(name="catch_all" type="string" string="/var/log/remote/catch_all.log")

Notice the template name change which will give us later more flexibility when it comes to our rulesets. When choosing template name please avoiding using `RSYSLOG_` as they reserved for rsyslog use and will cause conflict.

I am using `catch_all` template to process all unfiltered messages, this help in logging all messages that escape filters so I can review them and see what needs to be adjusted to filter them.

### Rulesets

Rulesets consists of a filter and action(s) to be executed when the filter evaluate to **true**. A filter evaluated using could a priority and/or facility, other property-based filters could be used like msg, syslogtag, hostname or host IP.

In our `03-rulesets.conf`, we will define a ruleset for processing messages coming from an IP address that belongs to a vCenter host and places messages in `vcenter.log` file that we defined in our templates files.

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

A lot to unpack here, we are using `remote_all` as the ruleset name, that's the same values we used when defining what ruleset the `input` will be using.
`LinkedList` is in-memory queue type. when using LinkedList queue; the memory is allocated only when needed which make this type of queue handle message bursts very well.
In our filter, we check if the `$fromhost-ip` is equal to IP address of our vCenter, if true; we use `omfile` type to write messages to files using `catch_vcenter` as a dynamic file template. `FileCreateMode` sets permissions for the dynamic file we just created.

# Conclusion

Rsyslog is a powerful logging solution and we barely scratched the surface of all the hundreds of available options/parameters we could use for configuration. It's always a good practice to test configuration in your testing environment and see what [rsyslog documentation](https://www.rsyslog.com/doc/v8-stable/configuration/index.html) has to offer. If you see that I could have something differently in my config, please reach out and let me know, I am always looking for improvement.
