module Engine
export Image, Pix, setdata!, getdata, echo

include("image.jl")

echo(args...) = Base.println(Core.stdout, "[julia]", args...)

end
