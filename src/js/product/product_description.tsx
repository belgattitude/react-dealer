import * as React from 'react';
import '../../css/product/product_card.scss';


export interface ProductDescriptionProps {
    description?: string;
    characteristic?: string;
}

export interface ProductDescriptionState {

}

export default class ProductDescription extends React.Component<ProductDescriptionProps, ProductDescriptionState> {

    constructor(props) {
        super(props);
    }

    parseDesc(description?: string, characteristic?: string) : Array<string> {

        let desc = [];
        if (description) {
            desc = description.split("\n");
        }
        if (characteristic) {
            desc.push(characteristic);
        }

        desc.map((item: string, id) => {
           desc[id] = item.replace('- ', '');
        });
        return desc;
    }

    render() {
        const desc = this.parseDesc(this.props.description, this.props.characteristic);
        return (
            <div className="product-description">
                { desc.length > 0 ?
                    <ul>
                        { desc.map((item, id) => {
                            return (
                                <li key={'bullet-' + id}>{item}</li>
                            )
                        })}
                    </ul>
                    : ''
                }
            </div>
        );
    }

}

