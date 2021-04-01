import React from 'react';
import './index.pcss'
import style from './index.pcss.json'
import Menu from "../../components/menu";

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Menu/>
                你好
            </>
        );
    }
}

export default Home;