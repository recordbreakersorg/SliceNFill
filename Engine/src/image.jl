mutable struct Image
  data::Vector{UInt8}
  width::UInt
  height::UInt
  Image(w::UInt, h::UInt) = new(Vector{UInt8}(undef, w * h * 4), w, h)
end

function setdata!(img::Image, data::Vector{UInt8})
  if length(data) != length(img.data)
    echo("Data length($(length(data))) does not match image dimensions $(img.width) x $(img.height) x 4 (expected $(length(img.data)))")
    return false
  end
  copyto!(img.data, data)
  return true
end

function getdata(img::Image)
  return img.data
end
