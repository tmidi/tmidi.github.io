---
categories:
  - Linux
  - Snippets
title: "How to clear content of multiple files at once"
date: "2017-09-12T22:47:18-04:00"
draft: false
---
When I am updating my Linux template, I like to delete all old logs, as a first step, I delete old rotated logs. First check how your logs are rotated and create a find command the one below to delete old rotated logs:
<pre>
  <code class="language-bash">
  # Assuming my rotates logs format is : messages.2017-09-15.log
  find /var/log/ -name '*.20*.log' -delete
  </code>
</pre>
The command above will delete all file that match the rule, you can limit how deep you want to find files using __maxdepth__. you can also use __mtime +n__ to find files older than n days and delete them.

Now it's the time to empty the content of file, this helpful if your find rules did not catch some files, or you don't want to delete active log file.

<pre>
  <code class="language-bash">
  # to empty all the logs in a directory
  for i in /var/log/*; do cat /dev/null > $i; done
  </code>
</pre>
##### Explanation:
This will empty the content of all files in /var/log/, concatenate /dev/null (/dev/null is a special file system object that hides the output) to each item.

### References:

 * [find](https://linux.die.net/man/1/find) man page.
 * This answer in [Server Fault](https://serverfault.com/a/381369)
