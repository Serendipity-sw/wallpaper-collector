import React from 'react';
import './index.pcss'
import style from './index.pcss.json'
import Menu from "../../components/menu";
import axios from "axios";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        }
    }

    componentDidMount() {
        this.wallpaperGetImgList()
    }

    wallpaperGetImgList = () => {
        axios.get("http://127.0.0.1:8082/wallHavenTopList?pageIndex=1").then(res => {
            const {data: {code, data}} = res
            if (code === 200) {
                this.setState({list: data})
            }
        })
    }

    render() {
        return (
            <>
                <Menu/>
                <div className={style.contentArea}>
                    <ul>
                        {
                            this.state.list.map((item, index) =>
                                <li className={style.imgArea} key={index}>
                                    <figure className={style.picture}>
                                        <div className={style.img}>
                                            <img src={item.img_url} alt=""/>
                                        </div>
                                    </figure>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </>
        );
    }
}

export default Home;