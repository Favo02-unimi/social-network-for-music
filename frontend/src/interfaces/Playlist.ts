import type Track from "./Track"

interface Playlist {
  _id : string,
  title : string,
  description : string,
  tags : string[],
  isPublic : boolean,
  tracks : Track[],
  creator : string,
  followers : [{
    userId : string,
    isCreator : boolean,
    isCollaborator : boolean
  }],
  isCreator : boolean,
  isCollaborator : boolean,
  isFollower : boolean
}

export default Playlist
