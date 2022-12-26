const dock = [
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
const dockTileSize = 60
const dockMargin = 10
const dockWidth = dock.length * dockTileSize + (dock.length+1)*dockMargin
export {dock, dockTileSize, dockMargin, dockWidth}