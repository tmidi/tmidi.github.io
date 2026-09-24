---
title: "Ansible: Directory Layout"
pubDate: "2018-02-15"
slug: ansible-directory-layout
tags: [ansible, automation, devops]
description: "A production-ready Ansible directory layout: roles, group_vars, and the structure that keeps playbooks maintainable."
---

According to Ansible's [best practices](http://docs.ansible.com/ansible/latest/playbooks_best_practices.html "Ansible best practices"), there are many possible ways to organize playbook content, and the layout you choose should fit your needs. The one thing I highly recommend is using _roles_ instead of loose tasks — this gives you flexibility and better organization of your code.

Ansible provides two example directory layouts. The first one is pretty simple, and it is my go-to when working on a small environment with production and staging inventory files:
```bash
production                # inventory file for production servers
staging                   # inventory file for staging environment

group_vars/
    group1                 # here we assign variables to particular groups
    group2                 # ""
host_vars/
    hostname1              # if systems need specific variables, put them here
    hostname2              # ""

library/                  # if any custom modules, put them here (optional)
module_utils/             # if any custom module_utils to support modules, put them here (optional)
filter_plugins/           # if any custom filter plugins, put them here (optional)

site.yml                  # master playbook
webservers.yml            # playbook for webserver tier
dbservers.yml             # playbook for dbserver tier

roles/
    common/               # this hierarchy represents a "role"
        tasks/            #
            main.yml      #  <-- tasks file can include smaller files if warranted
        handlers/         #
            main.yml      #  <-- handlers file
        templates/        #  <-- files for use with the template resource
            ntp.conf.j2   #  <------- templates end in .j2
        files/            #
            bar.txt       #  <-- files for use with the copy resource
            foo.sh        #  <-- script files for use with the script resource
        vars/             #
            main.yml      #  <-- variables associated with this role
        defaults/         #
            main.yml      #  <-- default lower priority variables for this role
        meta/             #
            main.yml      #  <-- role dependencies
        library/          # roles can also include custom modules
        module_utils/     # roles can also include custom module_utils
        lookup_plugins/   # or other types of plugins, like lookup in this case

    webtier/              # same kind of structure as "common" was above, done for the webtier role
    monitoring/           # ""
    fooapp/               # ""
```

I always use the following command to create the above directory structure and get started as soon as possible:

```bash
mkdir -p group_vars host_vars library module_utils filter_plugins
mkdir -p roles/common/{tasks,handlers,templates,files,vars,defaults,meta,library,module_utils,lookup_plugins}
touch production staging site.yml roles/common/{tasks,handlers,templates,files,vars,defaults,meta}/main.yml
```

When I have a more complex inventory, with multiple groups and children, I opt for this alternative directory layout:

```bash
inventories/
    production/
        hosts               # inventory file for production servers
        group_vars/
            group1           # here we assign variables to particular groups
            group2           # ""
        host_vars/
            hostname1        # if systems need specific variables, put them here
            hostname2        # ""

    staging/
        hosts               # inventory file for staging environment
        group_vars/
            group1           # here we assign variables to particular groups
            group2           # ""
        host_vars/
            stagehost1       # if systems need specific variables, put them here
            stagehost2       # ""

library/
module_utils/
filter_plugins/

site.yml
webservers.yml
dbservers.yml

roles/
    common/               # this hierarchy represents a "role"
        tasks/            #
            main.yml      #  <-- tasks file can include smaller files if warranted
        handlers/         #
            main.yml      #  <-- handlers file
        templates/        #  <-- files for use with the template resource
            ntp.conf.j2   #  <------- templates end in .j2
        files/            #
            bar.txt       #  <-- files for use with the copy resource
            foo.sh        #  <-- script files for use with the script resource
        vars/             #
            main.yml      #  <-- variables associated with this role
        defaults/         #
            main.yml      #  <-- default lower priority variables for this role
        meta/             #
            main.yml      #  <-- role dependencies
        library/          # roles can also include custom modules
        module_utils/     # roles can also include custom module_utils
        lookup_plugins/   # or other types of plugins, like lookup in this case
```

With this structure, I can keep each inventory file together with its `group_vars`/`host_vars` in a separate directory. To quickly spin up this directory layout, I use the following commands:

```bash
mkdir -p inventories/{production,staging}/{group_vars,host_vars}
touch inventories/{production,staging}/hosts
mkdir -p group_vars host_vars library module_utils filter_plugins
mkdir -p roles/common/{tasks,handlers,templates,files,vars,defaults,meta,library,module_utils,lookup_plugins}
touch site.yml roles/common/{tasks,handlers,templates,files,vars,defaults,meta}/main.yml
```

I usually don't do any work directly in `roles/common`. To create a new role, I just duplicate `common` into a new directory — that way I have a ready-made role template whenever I want to create a new one.
