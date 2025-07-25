using Engine

global images::Dict{UInt, Image} = Dict{UInt, Image}()
global counter::UInt = 0

Base.@ccallable function initEngine()::Cvoid
  global counter = 0
  global images = Dict{UInt, Image}()
  echo("Engine initialized with counter: ", counter)
  return
end

Base.@ccallable function createImage(data::Ptr{UInt8}, size::UInt, width::UInt, height::UInt)::UInt
  global counter, images
  counter += 1
  images[counter] = Image(width, height)
  setdata!(images[counter], unsafe_wrap(Vector{UInt8}, data, size))
  echo("Created image with id: ", counter, " dimensions ", width, "x", height)
  echo("size is ", size)
  return counter
end
Base.@ccallable function destroyImage(imageID::UInt)::Int
  global images
  echo("Destroying image ",imageID, ":exists=", haskey(images, imageID))
  if imageID in keys(images)
    delete!(images, imageID)
    return true
  end
  return false
end
Base.@ccallable function listImages()::Ptr{UInt}
  global images
  echo("Listing images... ")
  return pointer(collect(keys(images)))
end
Base.@ccallable function getImageData(id::UInt)::Ptr{UInt8}
  global images
  echo("Getting image data for id: ", id, ":exists=", haskey(images, id))
  if haskey(images, id)
    return pointer(images[id].data)
  else
    return C_NULL
  end
end

Base.@ccallable function setImageData(id::UInt, data::Ptr{UInt8}, len::UInt)::UInt
  global images
  echo("Setting image data for id: ", id)
  if haskey(images, id)
    setdata!(images[id], unsafe_wrap(Vector{UInt8}, data, len))
    return 0
  else
    return 1
  end
end
