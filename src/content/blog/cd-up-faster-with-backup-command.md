---
title: "Change Directory Up Faster With Back up Command"
pubDate: "2018-03-15"
slug: cd-up-faster-with-backup-command
tags: [bash, linux, scripting]
description: "A Bash pattern for moving up directories faster and keeping a backup of where you came from."
---

[Donovan Brown](http://donovanbrown.com) wrote a good [article](http://donovanbrown.com/post/Why-cd-when-you-can-just-backup) showcasing how you can use a custom PowerShell function to navigate up directories without the need to type multiple `cd ..` . I found his idea interesting, and it can be a real time saver if you spend a lot of time working in PowerShell.

Unfortunately (or fortunately depends how you see it) nowadays I don't use PowerShell much — and when I do, my usage is limited to a few PowerCLI commands. I do, however, spend considerable time in the Linux shell, so the natural thing to do was to port Donovan's idea to a Bash script. The Bash script is going to be different from the PowerShell one, but the concept remains the same.

What do we need?

- A function that takes an integer as an argument.
- A help function that displays a basic help menu when a wrong argument is entered.

## The help function:
I like to keep this as simple as possible: one line to describe the argument, and a second line to indicate that this is the help menu:

```bash
    function bu_usage () {
       cat <<-EOF
        Usage: bu [N]
                N        Where N is the number of level to move back to. this argument must be an integer.
                h help   displays this basic help menu.
        EOF
```

I used `-EOF` to allow indentation, this work better with tabs than with spaces.

## The back up function
Now that the help function is out of the way, we can start building the backup function. We know the function takes one argument, and that argument must be an integer:

```bash
    function bu () {
        FUNCTIONARG=$1
        # Make sure the provided argument is a positive integer:
        if [[ ! -z "${FUNCTIONARG##*[!0-9]*}" ]]; then
            for i in $(seq 1 $FUNCTIONARG); do
                STRARGMNT+="../"
            done
            CMD="cd ${STRARGMNT}"
            eval $CMD
        else
            bu_usage
        fi
    }
```

**How does it work?** The function starts by making sure the argument is a valid integer; if it isn't, it calls the help function we created earlier. Then, using a sequence of numbers from 1 to the argument, it appends `../` to `STRARGMNT` on each iteration. When the loop completes, it runs the `cd` command with all the appended directories. This gives us:


|argument|command    |
|--------|-----------|
|1       |cd ..      |
|2       |cd ../..   |
|3       |cd ../../..|


## How to use this?
I usually add functions like this to a `.functions` file in my home directory, which gets sourced by `.bash_profile`.
To source `.functions` or other dotfiles, add this loop to your `.bash_profile` (files must be comma-separated):

```bash
    for file in ~/.{functions}; do
        [ -r "$file" \] && \[ -f "$file" \] && source "$file";
    done;
    unset file;
```

Create `.functions` and add this content to it:
```bash
     function bu () {
        function bu_usage () {
           cat <<-EOF
            Usage: bu [N]
                    N        Where N is the number of level to move back to. this argument must be an integer.
                    h help   displays this basic help menu.
            EOF
        }

        # unset variables
        STRARGMNT=""
        FUNCTIONARG=$1

        # Make sure the provided argument is a positive integer:
        if [[ ! -z "${FUNCTIONARG##*[!0-9]*}" ]]; then
            for i in $(seq 1 $FUNCTIONARG); do
                STRARGMNT+="../"
            done
            CMD="cd ${STRARGMNT}"
            eval $CMD
        else
            bu_usage
        fi
    }
```

This is slightly different from the previous functions we created: the help menu is now a nested function inside the main `bu` function, and we initialize an empty `STRARGMNT` to unset the variable each time the function runs.

When you are done, run `source .bash_profile` — or close and reopen your terminal — for the changes to take effect.

**How to run it?**

- `bu help` or `bu -h` for the help menu
- `bu 2` to go two folders up — the equivalent of running `cd ../..`

You can see `bu` in action here:

[![asciicast](https://asciinema.org/a/Serx0ac08heiRW4QI61FW2QKv.png)](https://asciinema.org/a/Serx0ac08heiRW4QI61FW2QKv)
