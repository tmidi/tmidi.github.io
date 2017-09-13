---
categories:
  - SELinux
  - OSSEC
  - Logrotate
title: "OSSEC - log rotation"
date: "2017-09-12T22:47:18-04:00"
draft: true
---
<pre>
  <code class="language-css">
  body {
    font-family: "Noto Sans", sans-serif;
  }
  </code>
</pre>
<pre>
  <code class="language-python">
  >>> from pygments.styles import get_all_styles
  >>> styles = list(get_all_styles())
  >>> print styles
  </code>
</pre>

When SELinux enabled, some OSSEC packages will fail to rotate logs under _/var/ossec/logs_, which will result in crontab errors and in some cases faillure to write to logs.

One way to fix this is to change context type, for this let's first check the current context:

I'm very __happy__ to introduce my new website!
It's a static website that I have done in less than 3 hours with this [Hugo tutorial](https://fillmem.com/post/self-hosted-fast-secured-and-free-static-site/)
