import 'whatwg-fetch';

class DealerService {

    options = {
        language: 'en'
    };


    constructor(options) {
        this.options = options;
    }

    /**
     *
     * @param object place
     */
    findDealers(place) {

        var api_endpoint_url = 'http://localhost/emdmusic_server/public/api/v1/dealer';
        var params = {
            lat: place.lat,
            lng: place.lng,
            distance: place.distance,
            brand: place.brand,
            language: this.options.language
        };
        console.log('params', params);

        // Setting url with search params
        var url = new URL(api_endpoint_url);
        var searchParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
                searchParams.append(key, params[key])
            }
        );
        url.search = searchParams.toString();
        var api_url = url.toString();

        var checkStatus = function(response) {
            if (response.status >= 200 && response.status < 300) {
                return response
            } else {
                var error = new Error(response.statusText)
                error.response = response
                throw error
            }
        }

        var parseJson = function(response) {
            return new Promise((resolve) => {
                response.json().then(jsonResponse => {
                    resolve(jsonResponse.data);
                });
            });
        }

        var fetchParams = {
            // mode: 'no-cors',
            // credentials: 'same-origin',
            method: 'get',
            headers: {
                'Accept': 'application/json'
            }
        };

        return fetch(api_url, fetchParams)
            .then(checkStatus)
            .then(parseJson)
            .catch(function (ex) {
                console.log('parsing failed', ex)
            });
    }

}

export default DealerService;

