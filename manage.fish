#!/usr/bin/fish

set global_tags [webkit2_41]

function dev
    wails dev -tags $global_tags
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
