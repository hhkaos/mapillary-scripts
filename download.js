var parse = require('parse-link-header');

var linkHeader =
  '<https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="next", ' +
  '<https://api.github.com/user/9287/repos?page=1&per_page=100>; rel="prev"; pet="cat", ' +
  '<https://api.github.com/user/9287/repos?page=5&per_page=100>; rel="last"'

var parsed = parse(linkHeader);
console.log(parsed);

var request = require('request');
var options = {
  'method': 'GET',
  'url': 'https://a.mapillary.com/v3/images?client_id=&bbox=-2.4801851246529174,36.83570027690869,-2.424809739804093,36.86236923904206',
  'headers': {
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
