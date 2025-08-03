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
function build-linux
    wails build -v 2 -tags webkit2_41
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
function package-linux
    cd build/darwin
    nfpm pkg --packager deb --target .
end

switch "$argv[1]"
    case build-windows
        build-windows
    case package-windows
        build-nsis
    case build-linux
        build-linux
    case package-linux
        package-linux
    case all
        build-linux && ./manage.fish package-linux && ./manage.fish build-windows && ./manage.fish package-windows
    case dev
        dev
    case ""
        echo "Run ./manage.fish help for usage"
end
