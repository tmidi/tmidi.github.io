---
categories:
  - Linux
  - Bash
title: "Bash - Paths and file names manipulation"
date: "2018-02-06T22:10:18-04:00"
draft: false
---

In this post, we look dive into some of the interesting way we can use Bash to work with file names and paths, this usually helpful when you want to put a quick Bash script to copy or move/rename file. I recently had to deal with hundreds of log files generataed by the dozens of containers, the issue was each container writes logs inside a folder, but the logs files are basically have the same name inside each folder.

<pre>
  <code class="language-bash">
    # tree /var/log/containers
    ├── Container_01
    │   ├── java.log
    │   ├── access.log
    │   ├── security.log
    │   └── application.log
    ├── Container_02
    │   ├── java.log
    │   ├── access.log
    │   ├── security.log
    │   └── application.log
  </code>
</pre>

As you can see from the example above, if I want to backup the log files, and move them all to a remote server, I have two options:
* For each directory, I will create a mirror Directory and then move the log files there.
* Rename each file, in a way to show which directory it belongs to; ex *Container_01-java.log* or *java-Container_01.log*

For me, the second option works the best, this was I don't have to worry about multiple directory in the remote backup host, and have all the logs file under the same location. to achieve this, I had to do some path manipulation.

1. I need to get the directory name, assuming our path is "/var/log/:
<pre>
  <code class="language-bash">
    for D in /var/log/containers/*; do
        BASE=${D##*/} # This is the same as "dirname $D"
        echo $BASE
    done
  </code>
</pre>
This will get the name of each directory inside the path we provided, and then save the value using variable BASE, which we can use at later point. the echo statement is not necessary, and it's there just for debugging. Note that the result of the loop is a full path, using `##*/` will give us the last

2. Now for each directory we gathered from the previous run, we need to get the list of file inside each one, to achieve this:
<pre>
  <code class="language-bash">
    for F in $D; do
        echo $F
    done
  </code>
</pre>

Again with this we will get the full path, to manipulate this, we need to slice the full path, in one part we need the full path minus the filename (and the extension) and assign that to a variable, in the second part we need the short file name (nd the extension) and assign that a different variables.
To get the Path - file name => `%/*`
To get the the file name => `##*/`  # This is similar to what we used to get BASE:

<pre>
  <code class="language-bash">
    for F in $D/*; do
        FULLPATH=${C%/*}
        FILENAME=${C##*/}
    done
  </code>
</pre>

3. Rename/move files:
All we have to do at this point is to combine the variables to move the files:

<pre>
  <code class="language-bash">
    mv $F $FULLPATH/$BASE-$FILENAME
    # This is the full command if we to run it from a terminal:
    # mv /var/log/containers/Container_01/java.log /var/log/containers/Container_01/Container_01-java.log
  </code>
</pre>

if we put all together, we will have the following snippet of code:

<pre>
  <code class="language-bash">
    for D in /var/log/containers/*; do
        BASE=${D##*/}
        for F in $D/*; do
            FULLPATH=${C%/*}
            FILENAME=${C##*/}
            mv $F $FULLPATH/$BASE-$FILENAME
        done
    done
  </code>
</pre>

Some other methods to manipulate files:

<pre>
  <code class="language-bash">
    FILE=/path/to/file.txt

    # To get file name without extension:
    echo ${FILE%.*}

    # To get file's directory name:
    echo ${FILE##*/}
    or:
    dirname $FILE

    # To Get filename and extension:
    basename $FILE
  </code>
</pre>
