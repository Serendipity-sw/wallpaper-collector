import React from 'react';
import './index.pcss'
import style from './index.pcss.json'
import Menu from "../../components/menu";
import axios from "axios";
import {Spin} from "antd";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            pageIndex: 1,
            loading: false
        }
        this.content = React.createRef()
    }

    componentDidMount() {
        this.wallpaperGetImgList()
        this.scrollBottom()
    }

    wallpaperGetImgList = () => {
        this.setState({loading: true})
        axios.get("http://127.0.0.1:8082/wallHavenTopList", {
            params: {
                pageIndex: this.state.pageIndex
            }
        }).then(res => {
            const {data: {code, data}} = res
            if (code === 200) {
                this.setState({list: [...this.state.list, ...data]})
            }
        }).finally(_ => {
            this.setState({loading: false})
        })
    }

    scrollBottom = () => {
        this.content.current.onscroll = () => {
            const content = this.content.current
            let scrollHeight = content.scrollHeight,
                scrollTop = content.scrollTop,
                clientHeight = content.clientHeight
            if (scrollHeight - clientHeight === scrollTop) {
                this.setState({pageIndex: this.state.pageIndex + 1}, this.wallpaperGetImgList)
            }
        }
    }

    render() {
        return (
            <>
                <Menu/>
                <div className={style.contentArea} ref={this.content}>
                    <Spin spinning={this.state.loading} wrapperClassName={style.loading} tip="数据加载中...">
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
                    </Spin>
                </div>
            </>
        );
    }
}

export default Home;