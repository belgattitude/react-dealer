import * as React from 'react';

export interface CatalogLandingPageProps {
}

export interface CatalogLandingPageState {
}

export class CatalogLandingPage extends React.Component<CatalogLandingPageProps, CatalogLandingPageState> {


    constructor(props: CatalogLandingPageProps) {

        super(props);

        this.state = {
        } as CatalogLandingPageState;

    }



    componentDidMount() {

    }


    render() {

        return (
            <div className="catalog-landing-page">
                <select>
                    <option>cool</option>
                </select>
            </div>
        );

    }


}

