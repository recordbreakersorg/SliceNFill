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
    nfpm pkg --packager deb -f ./build/darwin/nfpm.yaml --target ./build/bin
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
        build-linux
        package-linux
        build-windows
        build-nsis
    case ""
        echo "Run ./manage.fish help for usage"
end
