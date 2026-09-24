---
title: "Journalctl examples"
pubDate: "2017-09-16"
slug: journalctl-examples
tags: [linux, logging, systemd]
description: "Everyday journalctl examples: filtering by unit, time, and priority, plus tips for reading journald logs."
---
__Journald__ addresses one major issue with Linux application logging: it provides centralized log management for the kernel and userland processes, regardless of where the logs come from. You can also use journald as an alternative logging driver inside Docker containers — this feature has been available since Docker 1.7.

To view logs written by journald you may use __journalctl__, it will show the full content of the journal when it's called without parameters:
```bash
  # journalctl

  -- Logs begin at Sat 2017-09-16 09:35:23 EDT, end at Sun 2017-09-17 00:22:30 EDT. --
	Sep 16 09:35:23 Desktop-VM kernel: Linux version 4.12.0-13-generic (buildd@lgw01-14) (gcc version 7.2.0 (Ubuntu 7.2
	Sep 16 09:35:23 Desktop-VM kernel: Command line: BOOT_IMAGE=/vmlinuz-4.12.0-13-generic root=/dev/mapper/cl-root ro
	Sep 16 09:35:23 Desktop-VM kernel: KERNEL supported cpus:
	Sep 16 09:35:23 Desktop-VM kernel:   Intel GenuineIntel
	Sep 16 09:35:23 Desktop-VM kernel:   AMD AuthenticAMD
	Sep 16 09:35:23 Desktop-VM kernel:   Centaur CentaurHauls
	Sep 16 09:35:23 Desktop-VM kernel: x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'
	Sep 16 09:35:23 Desktop-VM kernel: x86/fpu: Supporting XSAVE feature 0x002: 'SSE registers'
	Sep 16 09:35:23 Desktop-VM kernel: x86/fpu: Supporting XSAVE feature 0x004: 'AVX registers'
	Sep 16 09:35:23 Desktop-VM kernel: x86/fpu: xstate_offset[2]:  576, xstate_sizes[2]:  256
	Sep 16 09:35:23 Desktop-VM kernel: x86/fpu: Enabled xstate features 0x7, context size is 832 bytes, using 'standard
	Sep 16 09:35:23 Desktop-VM kernel: e820: BIOS-provided physical RAM map:
	....
```

To show all fields in full when the lines are very long:
```bash
  # journalctl -a
  Sep 17 00:14:18 Desktop-VM sudo[28209]: pam_unix(sudo:session): session closed for user root
	Sep 17 00:14:22 Desktop-VM gnome-software[2043]: running get-distro-updates with refine-flags=require-version,require-setup-action,require-update-details,require-upgrade-
	Sep 17 00:14:22 Desktop-VM gnome-software[2043]: running get-updates with refine-flags=require-update-details,require-update-severity with timeout=60 on plugin=fwupd took
	Sep 17 00:14:22 Desktop-VM gnome-software[2043]: running get-updates with refine-flags=require-version,require-update-details,require-provenance,require-icon with failure
	Sep 17 00:14:22 Desktop-VM gnome-software[2043]: running refine with refine-flags=require-version,require-update-details,require-provenance,require-icon with failure-flag
	...
```

Use -r or --reverse to show newest entries first:
```bash
  # journalctl -r
  -- Logs begin at Sat 2017-09-16 09:35:23 EDT, end at Sun 2017-09-17 00:22:30 EDT. --
	Sep 17 00:22:30 Desktop-VM systemd-timesyncd[862]: Synchronized to time server 91.189.89.199:123 (ntp.ubuntu.com).
	Sep 17 00:18:41 Desktop-VM gnome-software[2043]: running search with refine-flags=require-icon with timeout=60 with max-results=20 with search=sub on plugin=snap on apps
	Sep 17 00:18:41 Desktop-VM PackageKit[1476]: resolve transaction /123_ccbdbbce from uid 1000 finished with success after 381ms
	Sep 17 00:18:40 Desktop-VM nautilus[29287]: Could not establish a connection to Tracker: Failed to load SPARQL backend: Key file does not have group “DomainOntology”
	Sep 17 00:18:40 Desktop-VM nautilus[29287]: g_key_file_load_from_file: assertion 'file != NULL' failed
	Sep 17 00:18:40 Desktop-VM systemd[1644]: Started GNOME Terminal Server.
	...
```

You can also use `-n N` or `--lines=N` to show the last N lines, `-e` or `--pager-end` to jump to the end of the logs, and `-f` or `--follow` to stream journal entries continuously.
One of my favorite options is `-u` or `--unit`, which shows messages for a specific systemd unit or a matching pattern.
```bash
  # journalctl -u cron
  -- Logs begin at Sat 2017-09-16 09:35:23 EDT, end at Sun 2017-09-17 01:00:31 EDT. --
	Sep 16 09:35:25 Desktop-VM systemd[1]: Started Regular background program processing daemon.
	Sep 16 09:35:25 Desktop-VM cron[1002]: (CRON) INFO (pidfile fd = 3)
	Sep 16 09:35:25 Desktop-VM cron[1002]: (CRON) INFO (Running @reboot jobs)
	Sep 16 10:17:01 Desktop-VM CRON[3345]: pam_unix(cron:session): session opened for user root by (uid=0)
	Sep 16 10:17:01 Desktop-VM CRON[3346]: (root) CMD (   cd / && run-parts --report /etc/cron.hourly)
	Sep 16 10:17:01 Desktop-VM CRON[3345]: pam_unix(cron:session): session closed for user root
	...
```

You can use `-p` or `--priority` to filter messages by priority. It takes either a numeric or a textual log level (between 0/"emerg" and 7/"debug"). Accepted priorities are : "emerg" (0), "alert" (1), "crit" (2), "err" (3), "warning" (4), "notice" (5), "info" (6), "debug" (7).
```bash
  # journalctl -p err
  -- Logs begin at Sat 2017-09-16 09:35:23 EDT, end at Sun 2017-09-17 01:00:31 EDT. --
	Sep 16 09:35:26 Desktop-VM NetworkManager[1017]: ((src/devices/nm-device.c:1452)): assertion '<dropped>' failed
	Sep 16 09:35:26 Desktop-VM gnome-session-binary[1202]: CRITICAL: Unable to create a DBus proxy for GnomeScreensaver: Error calling StartServiceByName for org.gnome.Screen
	Sep 16 09:35:26 Desktop-VM gnome-session-binary[1202]: Unrecoverable failure in required component org.gnome.Shell.Desktop-VM
	Sep 16 09:35:29 Desktop-VM systemd[1]: Failed to start systemd-resolved-update-resolvconf.service.
	Sep 16 09:35:29 Desktop-VM systemd[1]: Failed to start systemd-resolved-update-resolvconf.service.
	...
```

When it is supported, you can use -x, --catalog to show explanation texts from the message catalog, this will supply you with explanation of the message and a possible solution or point you to external resources to resolve an issue:

```bash
  # journalctl -p 3 -x
  Sep 16 09:35:29 tal-Desktop-VM systemd[1]: Failed to start systemd-resolved-update-resolvconf.service.
	-- Subject: Unit systemd-resolved-update-resolvconf.service has failed
	-- Defined-By: systemd
	-- Support: http://www.ubuntu.com/support
	--
	-- Unit systemd-resolved-update-resolvconf.service has failed.
	--
	-- The result is failed.
```

In my opinion, journalctl is an invaluable tool for debugging system and application issues. Take the time to read the man page, and practice with the examples above.



## References

 * [journalctl](https://www.freedesktop.org/software/systemd/man/journalctl.html) man page

