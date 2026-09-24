---
title: "OSSEC - log rotation"
pubDate: "2017-09-12"
slug: ossec-log-rotation
tags: [security, logging, linux]
description: "Configuring log rotation for OSSEC alerts and archives on Linux."
---
When SELinux is enabled, some OSSEC packages fail to rotate logs under `/var/ossec/logs`, which results in crontab errors and, in some cases, a failure to write to the logs.

One way to fix this is to change the SELinux context type. First, check the current context:

```bash
  	# Check the current SELinux context:
  	ls -aZ /var/ossec/logs

  	# Change SELinux context:
  	semanage fcontext -a -t var_log_t "/var/ossec/logs(/.*)?"

  	# Apply the previous context change:
  	restorecon -R -v /var/ossec/logs

  	# Check/confirm the context change:
  	ls -aZ /var/ossec/logs
```

## Command explanation
- `semanage fcontext`: Changes the SELinux context of files.
- `semanage fcontext -a`: Adds the object to the policy record.
- `semanage fcontext -t`: Sets the SELinux type of the object.
- `restorecon`: `-R` applies the change recursively, `-v` is verbose and shows file label changes.

If the above fails, don't disable SELinux. Instead, generate and install a targeted SELinux policy — `audit2allow` is your best friend in this case. Red Hat offers a good [step by step](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Security-Enhanced_Linux/sect-Security-Enhanced_Linux-Fixing_Problems-Allowing_Access_audit2allow.html) or [Dan Walsh's](http://danwalsh.livejournal.com/24750.html) revisited guide to achieve this. If you are following Red Hat's guide, please keep in mind that you might have multiple denials, so you may need to grep for the "comm" value to create a specific policy.

## References

 * [Semanage](https://linux.die.net/man/8/semanage) man page
 * [Restorecon](https://linux.die.net/man/8/restorecon) man page
 * [Audit2allow](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Security-Enhanced_Linux/sect-Security-Enhanced_Linux-Fixing_Problems-Allowing_Access_audit2allow.html) — Red Hat guide
 * [Dan Walsh's blog](http://danwalsh.livejournal.com/24750.html) — using audit2allow to build policy modules, revisited

### References


