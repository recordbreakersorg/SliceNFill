#!/usr/bin/fish

set global_tags webkit2_41

function dev
    wails dev -tags $global_tags
end
function build-windows
    wails build -platform windows -v 2 -tags webkit2_41
end
function build-nsis
    wails build -nsis -platform windows -v 2 -tags webkit2_41
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

if test "$argv[1]" = ""
    echo "Run ./manage.fish help for usage"
else if test "$argv[1]" = build-windows
    build-windows
else if test "$argv[1]" = build-nsis
    build-nsis
else
    cmd "$argv[1]"
end
