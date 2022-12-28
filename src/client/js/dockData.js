const dock = [
  {
    image:"item",
    key:"1"
  },
  {
    image:"iitem",
    key:"2"
  },
  {
    image:"item",
    key:"3"
  },
  {
    image:"install",
    key:"L Click"
  },
  {
    image:"inventory",
    key:"e"
  },
  {
    image:"settings",
    key:"esc"
  },
]
const dockTileSize = 45
const dockMargin = 8
const dockWidth = dock.length * dockTileSize + (dock.length+1)*dockMargin
export {dock, dockTileSize, dockMargin, dockWidth}