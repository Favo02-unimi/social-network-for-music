interface Playlist {
  _id : string,
  title : string,
  description : string,
  tags : string[],
  isPublic : boolean,
  tracks : string[],
  creator : string,
  followers : [{
    userId : string,
    isCreator : boolean,
    isCollaborator : boolean
  }],
  isCreator : boolean,
  isCollaborator : boolean
}

export default Playlist
