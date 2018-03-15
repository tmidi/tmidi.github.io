---
categories:
  - Bash
  - Shell
title: "Cd Up Faster With Backup Command"
date: "2018-03-15T00:56:24-04:00"
draft: false
---
[Donovan Brown](http://donovanbrown.com) wrote a good [article](http://donovanbrown.com/post/Why-cd-when-you-can-just-backup) showcasing how you can use a custom PowerShell function to navigate up directories without the need to type multiple `cd ..` . I find his idea interesting and could be of important time saver if you spend a lot of time on PowerShell.

Unfortunately (or fortunately) I don't use PowerShell a lot, and when I do my usage is limited to few PowerCLI commands, but I do spend a considerable time interacting with Linux Shell. The natural thing to do is to port Donovan's idea into a Bash script., naturally, the Bash script is going to be different from the PowerShell one, but the concept is the same.

What we need?
 - A function that take an integer as an argument.
 - A help function to display a basic help menu when wrong argument entered.

## The help function:
I like to keep this as simple as possible, since our function will take only one line for the argument and the second line to indicate that this a help menu:

    function bu_usage () {
       cat <<-EOF
        Usage: bu [N]
                N        Where N is the number of level to move back to. this argument must be an integer.
                h help   displays this basic help menu.
        EOF
    }

I used `-EOF` to allow indentation, this work better with tabs than with spaces.

## The backup function
Now that our help function is out of the way we can start building out backup function. we know the function will take one argument, and this argument must be an integer:

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
**How this works?** the functions starts first by making sure the argument is a valid integer, if not it will call the help function we created earlier. Using a sequence of numbers from 1 to the argument, we will append `../` to `STRARGMNT` with each iteration. When the for loop is complete we run `cd` command with all the appended up directories.

## How to install?
I usually add functions like these to a `.functions` file under my home directory, the function file get sources by `.bash_profile`.
To source `.functions` or other dotfiles add this for loop to your `.bash_profile`, files must be comma separated:

    for file in ~/.{functions}; do
        [ -r "$file" \] && \[ -f "$file" \] && source "$file";
    done;
    unset file;

Create `.functions` and add this content to it:

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

This is slightly different from the previous functions we created. The help menu is a nested function inside the main `bu` function. we also created empty `STRARGMNT` to unset the variable each time the function runs.

When you are done `source .bash_profile` or close and reopen your terminal for the change to take effect

**how to run?**
`bu help` or `bu -h` for help menu.
`bu 2` to go two folders up, this is the equivalent of running `cd ..\..\`
you can see `bu` in action here(external link):

[![asciicast](https://asciinema.org/a/Serx0ac08heiRW4QI61FW2QKv.png)](https://asciinema.org/a/Serx0ac08heiRW4QI61FW2QKv)

