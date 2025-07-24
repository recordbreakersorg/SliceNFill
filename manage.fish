#!/usr/bin/fish

function build-engine
    julia +nightly --project=Engine/ juliac/juliac.jl --experimental --compile-ccallable --output-lib engine.so --trim=safe Engine/src/lib.jl
end

set usage "use as: ./manage.fish build-engine"

function log
    echo "[manage.fish] $argv"
end

if test "$argv[1]" = build-engine
    log "Building engine..."
    build-engine
else
    echo $usage
end
