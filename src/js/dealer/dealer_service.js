import 'whatwg-fetch';

class DealerService {
    constructor(options) {
        this.options = options;
    }

    findDealers() {
        return fetch('/dealers.json');
        fetch('/dealers.json')
            .then(function (response) {
                return response.json()
            }).then(function (json) {
            console.log('parsed json', json)
        }).catch(function (ex) {
            console.log('parsing failed', ex)
        });
    }

};

export default DealerService;

