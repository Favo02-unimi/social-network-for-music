import type Follower from "./Follower"
import type Track from "./Track"

interface Playlist {
  _id : string,
  title : string,
  description : string,
  tags : string[],
  isPublic : boolean,
  tracks : Track[],
  creator : string,
  followers : Follower[],
  isCreator : boolean,
  isCollaborator : boolean,
  isFollower : boolean
}

export default Playlist
