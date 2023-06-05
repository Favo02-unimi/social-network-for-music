interface Track {
  id : string,
  album : {
    album_type : string,
    name : string,
    release_date : string,
    images : [{
      height : string,
      width : string,
      url : string
    }]
  },
  artists : [{
    id : string,
    name : string,
    external_urls : {
      spotify : string
    }
  }],
  duration_ms : number,
  explicit : boolean,
  external_urls : {
    spotify : string
  },
  name : string,
  popularity : number,
  preview_url : string
}

export default Track
