const dataModule = (function () {
    
    
    class TvShow {
      constructor(name, id, coverUrl, summary = '', cast = [], seasons = []) {
        this.id = id;
        this.name = name;
        this.coverUrl = coverUrl;
        this.summary = summary;
        this.cast = cast;
        this.seasons = seasons;
      }
    }

    class Season {
        constructor(startDate, endDate) {
          this.startDate = startDate;
          this.endDate = endDate;
        }
      }
  
    const getShows = () => {
      
        return fetch('http://api.tvmaze.com/shows')
        .then(function (res) {
          return res.json();
        })
        .then((showsRawObjects) => {
            
            const topFiftyShows = showsRawObjects
            .filter(show => show.rating.average)
            .sort((a, b) => b.rating.average - a.rating.average)
            .slice(0, 50);
            return topFiftyShows.map(({ name, id, image }) => new TvShow(name, id, image.original));
          });
        };
  
    const getSingleTvShow = (id) => {
      
        return fetch(
        `http://api.tvmaze.com/shows/${id}?embed[]=seasons&embed[]=cast`
      )
        .then(function (res) {
          return res.json();
        })
        .then(function (rawTvShow) {
          
            const tvSeasons = rawTvShow._embedded.seasons.map(
            (s) => new Season(s.premiereDate, s.endDate)
            );
          
            const cast = rawTvShow._embedded.cast.map((a) => a.person.name);
          
          return new TvShow(
            
            rawTvShow.name,
            rawTvShow.id,
            rawTvShow.image.original,
            rawTvShow.summary,
            cast.slice(0, 7),
            tvSeasons
          );
        });
    };
  
    const searchShow = (term) => {
      
        return fetch(`https://api.tvmaze.com/search/shows?q=${term}`)
        .then(function (res) {
          return res.json();
        })
        .then(function (showsRawObjects) {
          
            return showsRawObjects.map(({ show }) => {
            const { name, id, image } = show;
            const imageToUse = image ? image.original : '';
            return new TvShow(name, id, imageToUse);
          });
        });
    };
  
    return { 
        
        getShows, 
        searchShow, 
        getSingleTvShow 
    
    };
  })();
