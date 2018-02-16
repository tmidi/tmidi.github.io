---
title: "Cryptsetup Create Linux Encrypted Volumes"
date: 2017-09-28T23:17:17-04:00
draft: false
categories:
  - Linux
  - Cryptsetup
  - LUKS
---

# What's Cryptsetup?

According to Cryptsetup's Gitlab project page; Cryptsetup is utility used to conveniently setup disk encryption based
on DMCrypt kernel module.

These include plain dm-crypt volumes, LUKS volumes, loop-AES
and TrueCrypt (including VeraCrypt extension) format.

Project also includes veritysetup utility used to conveniently setup
DMVerity block integrity checking kernel module.

To install LUKS:
<pre>
  <code class="language-bash">
  # yum install -y cryptsetup
  </code>
</pre>

Activate Dmcrypt:
<pre>
  <code class="language-bash">
  # modprobe dm_crypt
  </code>
</pre>

Create the file to encrypt:
<pre>
  <code class="language-bash">
  # dd if=/dev/zero bs=1M count=1024 of=/home/myname/safe
  </code>
</pre>
Technically we are converting and coping a file.
if: input file, we are using /dev/zero to fill the file with null characters (ASCII NUL, 0x00).
of: output file, Write to FILE instead of standard output.
bs: Block size, for both read and write, default is 512.
count: copy only N input blocks, in our example we will copy 1Mx1024, the output file size will be 1GB.

Format the new created file:
<pre>
  <code class="language-bash">
    # cryptsetup luksFormat /home/myname/safe
        WARNING!
        This will overwrite data on safe irrevocably.
        Are you sure? (Type uppercase yes): YES
        Enter passphrase:
        Verify passphrase:
  </code>
</pre>
This will initializes a LUKS partition and sets the initial key. __you need to remember the initialization key__, this is the key you will use to mount or open the file

Now, we need to open the LUKS partition:
<pre>
  <code class="language-bash">
  # cryptsetup luksOpen device name
  # cryptsetup luksOpen /home/myname/safe safe-encrypt
  </code>
</pre>
This command will opens LUKS partition __device__ and sets up a mapping __name__ after successful verification of the initialization key.

Let's create XFS file system, you can use other file systems, adjust the command accordingly:
<pre>
  <code class="language-bash">
  # mkfs.xfs /dev/mapper/safe-encrypt
  </code>
</pre>

Close the LUKS partition:
<pre>
  <code class="language-bash">
  # cryptsetup luksClose name
  # cryptsetup luksClose safe-encrypt
  </code>
</pre>

At this point, you have an encrypted LUKS partition, now we need a mounting point to be able to access this partition, for this we need to open again the LUKS partition:
<pre>
  <code class="language-bash">
  # cryptsetup luksOpen /home/myname/safe safe-encrypt
  </code>
</pre>
When prompted, enter your password.

Create a mount point, I chose "/mnt/encrypted":
<pre>
  <code class="language-bash">
  # mkdir /mnt/encrypted
  </code>
</pre>

Mount LUKS partition:
<pre>
  <code class="language-bash">
  # mount /dev/mapper/safe-encrypt /mnt/encrypted
  </code>
</pre>

if you issue "df -h" or "mount \| grep safe-encrypt" you should be able to see newly mounted partition:

<pre>
  <code class="language-bash">
   # /dev/mapper/safe-encrypt     1019M   34M  986M   4% /mnt/encrypted
  </code>
</pre>

When you are done working on the partition, unmount the file system then close the LUKS partition:

<pre>
  <code class="language-bash">
  # umount /mnt/encrypted
  # cryptsetup luksClose safe-encrypt
  </code>
</pre>