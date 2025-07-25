using Engine

global images::Dict{UInt8, Image} = Dict{UInt8, Image}()
global counter::UInt8 = 0

Base.@ccallable function initEngine()::Cint
  echo("Initializing Engine...")
  global counter = 0
  global images = Dict{UInt8, Image}()
  echo("Engine initialized with counter: ", counter)
  return 0
end

Base.@ccallable function createImage(data::Ptr{UInt8}, len::Csize_t, width::Cuint, height::Cuint)::Cuint
  global counter, images
  echo("Creating image with width: ", width, " and height: ", height, " and data length: ", len)
  counter += 1
  images[counter] = Image(Int(width), Int(height))
  echo("Copying data to image...")
  setdata!(images[counter], unsafe_wrap(Vector{UInt8}, data, len))
  echo("Created image with id: ", counter)
  return counter
end
Base.@ccallable function listImages()::Cstring
  global images
  echo("Listing images... ")
  return join(keys(images))
end
Base.@ccallable function getImageData(id::Cuint)::Ptr{UInt8}
  global images
  echo("Getting image data for id: ", id)
  if haskey(images, id)
    return pointer(images[id].data)
  else
    return C_NULL
  end
end

Base.@ccallable function setImageData(id::Cuint, data::Ptr{UInt8}, len::Csize_t)::Cint
  global images
  echo("Setting image data for id: ", id)
  if haskey(images, id)
    setdata!(images[id], unsafe_wrap(Vector{UInt8}, data, len))
    return 0
  else
    return 1
  end
end
