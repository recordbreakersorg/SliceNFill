using Engine

images::Dict{UInt8, Image} = Dict{UInt8, Image}()
counter::UInt8 = 0

Base.@ccallable function createImage(data::Cstring, width::Cuint, height::Cuint)::Cuint
  counter += 1
  images[counter] = Image(width, height)
  setdata!(images[counter], unsafe_string(data))
  return counter
end
Base.@ccallable function listImages()::Cstring
  return join(keys(images))
end
Base.@ccallable function getImageData(id::Cuint)::Cstring
  if haskey(images, id)
    return getdata(images[id], String)
  else
    return ""
  end
end
