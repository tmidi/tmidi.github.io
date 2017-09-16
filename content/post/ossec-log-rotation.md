---
categories:
  - SELinux
  - OSSEC
  - Logrotate
title: "OSSEC - log rotation"
date: "2017-09-12T22:47:18-04:00"
draft: false
---
When SELinux enabled, some OSSEC packages will fail to rotate logs under __/var/ossec/logs__, which will result in crontab errors and in some cases failure to write to logs.

One way to fix this is to change context type, for this let's first check the current context:

<pre>
  <code class="language-bash">
  	# Check the current SELinux context:
  	ls -aZ /var/ossec/logs

  	# Change SELinux context:
  	semanage fcontext -a -t var_log_t "/var/ossec/logs(/.*)?"

  	# Apply the previous context change:
  	restorecon -R -v /var/ossec/logs

  	# Check/confirm the context change:
  	ls -aZ /var/ossec/logs
  </code>
</pre>

##### Command explanation:
- _semanage fcontext_ : Used to change SELinux context of files.
- _semanage fcontext_ -a: Add object to record name.
- _semanage fcontext_ -t: SELinux type of Object.
- _restorecon_ : -R for recursively and -v for verbose, or to show changes in file labels.

If above failed, don't disable SELinux, instead generate and install a SELinux targeted policy, __audit2allow__ is your best friend in this case. Red Hat offers a good [step by step](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Security-Enhanced_Linux/sect-Security-Enhanced_Linux-Fixing_Problems-Allowing_Access_audit2allow.html) or [Dan's Walsh](http://danwalsh.livejournal.com/24750.html) revisited guide to achieve this, if you are following Red Hat's guide, pleas keep in mind that you might have multiple denials, so you might need to Grep for the "comm" value to create a specific policy.

### References:

 * [Semanage](https://linux.die.net/man/8/semanage) man page.
 * [Restorecon](https://linux.die.net/man/8/restorecon) man page
 * [Audit2allow](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Security-Enhanced_Linux/sect-Security-Enhanced_Linux-Fixing_Problems-Allowing_Access_audit2allow.html) [Red Hat](https://www.redhat.com/) guide.
 * [Dan Walsh's Blog](http://danwalsh.livejournal.com/24750.html) Using audit2allow to build policy modules. Revisited.

