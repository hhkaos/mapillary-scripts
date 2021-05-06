const parse = require('parse-link-header');
const config = require('./config.json');
const axios = require('axios');
const fs = require('fs')

let output = {"type":"FeatureCollection","features":[]}
let page_counter = 1;

const write_response = function(){
    fs.writeFile(`downloads/images_downloaded_${Date.now()}.json`, JSON.stringify(output, null, 2), err => {
        if (err) {
            console.error(err)
            return
        }
        console.log(`Download finished: ${output.features.length} photos`);
    });
}

const load_page = function(url){

    axios.get(url)
        .then(function (response) {
            output.features = output.features.concat(response.data.features);
            console.log(`Page ${page_counter} received`);
            page_counter++;
            if(response.headers.link || output.features === 400){
                const parsed = parse(response.headers.link);
                if(parsed.next){
                    load_page(parsed.next.url);
                }else{
                    write_response();
                }
            }else{
                console.log('No link header or more than 400 results')
            }
        })
        .catch(function (error) {
            console.log(error);
        });
};


const u = new URLSearchParams({
    client_id:config.client_id,
    bbox: "-2.4801851246529174,36.83570027690869,-2.424809739804093,36.8623692390420",
    // pano: true
}).toString();

load_page(`https://a.mapillary.com/v3/images?${u}`);

