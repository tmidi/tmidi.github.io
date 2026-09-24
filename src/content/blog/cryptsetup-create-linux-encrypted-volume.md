---
title: "Cryptsetup Create Linux Encrypted Volumes"
pubDate: "2017-09-28"
slug: cryptsetup-create-linux-encrypted-volume
tags: [linux, security, encryption]
description: "Create LUKS/dm-crypt encrypted volumes on Linux with cryptsetup — install, format, and mount."
---

# What's Cryptsetup?

According to the [Cryptsetup GitLab project page](https://gitlab.com/cryptsetup/cryptsetup), Cryptsetup is a utility used to conveniently set up disk encryption based on the DMCrypt kernel module.

Supported formats include plain dm-crypt volumes, LUKS volumes, loop-AES,
and TrueCrypt formats (including the VeraCrypt extension).

The project also includes veritysetup, a utility used to conveniently set up
the DMVerity block integrity checking kernel module.

To install Cryptsetup:
```bash
  # yum install -y cryptsetup
```

Activate Dmcrypt:
```bash
  # modprobe dm_crypt
```

Create the file to encrypt:
```bash
  # dd if=/dev/zero bs=1M count=1024 of=/home/myname/safe
```
Technically we are converting and copying a file.
if: input file, we are using /dev/zero to fill the file with null characters (ASCII NUL, 0x00).
of: output file, Write to FILE instead of standard output.
bs: Block size, for both read and write, default is 512.
count: copy only N input blocks, in our example we will copy 1Mx1024, the output file size will be 1GB.

Format the newly created file:
```bash
    # cryptsetup luksFormat /home/myname/safe
        WARNING!
        This will overwrite data on safe irrevocably.
        Are you sure? (Type uppercase yes): YES
        Enter passphrase:
        Verify passphrase:
```
This initializes the LUKS partition and sets the initial key. __You need to remember this passphrase__ — it is the key you will use to mount or open the file.

Now, we need to open the LUKS partition:
```bash
  # cryptsetup luksOpen device name
  # cryptsetup luksOpen /home/myname/safe safe-encrypt
```
This command opens the LUKS partition *device* and sets up a mapping *name* after successful verification of the passphrase.

Let's create XFS file system, you can use other file systems, adjust the command accordingly:
```bash
  # mkfs.xfs /dev/mapper/safe-encrypt
```

Close the LUKS partition:
```bash
  # cryptsetup luksClose name
  # cryptsetup luksClose safe-encrypt
```

At this point you have an encrypted LUKS partition, but you still need a mount point to access it. For this, we need to open the LUKS partition again:
```bash
  # cryptsetup luksOpen /home/myname/safe safe-encrypt
```
When prompted, enter your password.

Create a mount point, I chose "/mnt/encrypted":
```bash
  # mkdir /mnt/encrypted
```

Mount LUKS partition:
```bash
  # mount /dev/mapper/safe-encrypt /mnt/encrypted
```

If you run `df -h` or `mount | grep safe-encrypt`, you should see the newly mounted partition:

```bash
   # /dev/mapper/safe-encrypt     1019M   34M  986M   4% /mnt/encrypted
```

When you are done working on the partition, unmount the file system then close the LUKS partition:

```bash
  # umount /mnt/encrypted
  # cryptsetup luksClose safe-encrypt
```