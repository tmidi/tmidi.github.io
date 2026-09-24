---
title: "Clear content of multiple files at once"
pubDate: "2017-09-12"
slug: clear-content-of-multiple-files-at-once
tags: [bash, linux, logging]
description: "Truncate the content of many log files at once without deleting them, using a simple Bash loop."
---
When I am updating my Linux template, I like to delete all the old logs. As a first step, I delete the old rotated logs. First, check how your logs are rotated, then create a find command like the one below to delete the old rotated logs:
```bash
  # Assuming the rotated logs format is: messages.2017-09-15.log
  find /var/log/ -name '*.20*.log' -delete
```
The command above will delete all files that match the rule. You can limit how deep find goes using `-maxdepth`, and you can use `-mtime +n` to find files older than n days and delete them.

Now it's time to empty the content of the files. This is helpful if your find rules did not catch some files, or if you don't want to delete an active log file.

```bash
  # to empty all the logs in a directory
  for i in /var/log/*; do cat /dev/null > $i; done
```
## Explanation

This empties the content of all files in /var/log/ by concatenating /dev/null (a special file system object that produces no output) into each file.

## References

 * [find](https://linux.die.net/man/1/find) man page.
 * This answer in [Server Fault](https://serverfault.com/a/381369)
