module Engine
export Image, Pix, setdata!, getdata

include("image.jl")

echo(args...) = Base.println(Core.stdout, args...)

end
