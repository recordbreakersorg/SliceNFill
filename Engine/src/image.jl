mutable struct Pix
  r::UInt8
  g::UInt8
  b::UInt8
  a::UInt8
end

getdata(p::Pix, ::Type{String}) = Char(p.r) * Char(p.g) * Char(p.b) * Char(p.a)

mutable struct Image
  data::Matrix{Pix}
  width::UInt
  height::UInt
  Image(w::Int, h::Int) = new(Matrix{Pix}(undef, w, h), w, h)
end

function setdata!(img::Image, data::String)
  if length(data) != img.width * img.height * 4
    echo("Data length does not match image dimensions")
    return false
  end
  idx = 1
  for y in 1:img.height, x in 1:img.width # list of rows
    img.data[x, y] = Pix(
      UInt8(data[idx]),
      UInt8(data[idx + 1]),
      UInt8(data[idx + 2]),
      UInt8(data[idx + 3])
    )
    idx += 4
  end
  return true
end
function getdata(img::Image, ::Type{String})
  data::String = ""
  for y in 1:img.height, x in 1:img.width # list of rows
    data *= getdata(img.data[x, y], String)
  end
  return data
end
