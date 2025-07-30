#!/usr/bin/fish

set global_tags (string split " " "-tags webkit2_41")

function dev
    wails dev $global_tags
end

function help
    echo "manage.fish to easily run commands"
    echo "usage ./manage.fish dev|help"
end

function cmd -a name
    switch $name
        case dev
            dev
        case help
            help
    end
end

if test $argv[1] = ""
    echo "Run ./manage.fish help for usage"
else
    cmd "$argv[1]"
end
