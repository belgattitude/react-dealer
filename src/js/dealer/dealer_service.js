import 'whatwg-fetch';

class DealerService {

    constructor(options) {
        this.options = options;
    }

    findDealers() {

        var url = 'http://localhost/emdmusic_server/public/api/v1/dealer';

        fetch(url, {
           // mode: 'no-cors',
           // credentials: 'same-origin'
        }).then(function (response) {
            console.log('response', response);
                return response.json()
            }).then(function (json) {
            console.log('parsed json', json)
        }).catch(function (ex) {
            console.log('parsing failed', ex)
        });
    }

};

export default DealerService;

