#!/usr/bin/fish

function build-engine
    julia +nightly --depwarn=error --project=Engine/ juliac/juliac.jl --experimental --compile-ccallable --output-lib libengine.so --trim=safe Engine/src/lib.jl
end
function dev
    wails dev -tags webkit2_41
end

set usage "use as: ./manage.fish build-engine"

function log
    echo "[manage.fish] $argv"
end

if test "$argv[1]" = build-engine
    log "Building engine..."
    build-engine
else if test "$argv[1]" = dev
    log "Runing dev build with wails..."
    dev
else
    echo $usage
end
