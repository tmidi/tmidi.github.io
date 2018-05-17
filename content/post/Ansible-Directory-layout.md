---
categories:
  - Ansible
  - Best Practices
  - Basg
title: "Ansible: Directory Layout"
date: "2018-02-15T23:48:26-05:00"
draft: false
comments: true
---
According to Ansible's [Best Practices](http://docs.ansible.com/ansible/latest/playbooks_best_practices.html "Ansible best practices"), There are many possible ways to organize playbook content, and that the usage of such layout should fit your needs. The only thing I highly recommend is using *roles* instead of tasks, this will give your flexibility and better organization of your code.

Ansible provide two examples of directory layouts. the first one is pretty simple and the one I go to when I am working on a small environement with a sample production and staging inventory files:

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

I always use the following command to create the above directory structure and get started as soon as possible:

<pre>
  <code class="language-bash">
mkdir -p group_vars host_vars library module_utils filter_plugins
mkdir -p roles/common/{tasks,handlers,templates,files,vars,defaults,meta,library,module_utils,lookup_plugins}
touch production staging site.yml roles/common/{tasks,handlers,templates,files,vars,defaults,meta}/main.yml
  </code>
</pre>

When I have a more complex inventory, with multiple groups and children, I opt for this alternative directory layout:

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

With this structure, I can put each inventory file with its `group_vars`\\`host_vars` in separate directory. To quickly spin up this directory layout, I use the following commands:

<pre>
  <code class="language-bash">
mkdir -p inventories/{production,staging}/{group_vars,host_vars}
touch inventories/{production,staging}/hosts
mkdir -p group_vars host_vars library module_utils filter_plugins
mkdir -p roles/common/{tasks,handlers,templates,files,vars,defaults,meta,library,module_utils,lookup_plugins}
touch site.yml roles/common/{tasks,handlers,templates,files,vars,defaults,meta}/main.yml
  </code>
</pre>

I usually don't do any work on `roles/common`, to create a new role I just duplicate `common` to a new directory, this way I have a role template that I can use whenever I want to create a new role.