import React from 'react';
import './index.pcss'
import style from './index.pcss.json'
import Menu from "../../components/menu";
import axios from "axios";
import {Button, message, Modal, Spin} from "antd";
import qs from "qs";
import {PhotoSlider} from "react-photo-view";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            pageIndex: 1,
            loading: false,
            isImgPreview: false,
            imgPreview: ''
        }
        this.content = React.createRef()
    }

    componentDidMount() {
        this.wallpaperGetImgList()
        this.scrollBottom()
    }

    closeImgPreview = () => {
        this.setState({isImgPreview: false})
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
                this.setState({list: [...this.state.list, ...data]}, this.judgmentScrollBottom)
            }
        }).finally(_ => {
            this.setState({loading: false})
        })
    }

    showPreview = previewUrl => {
        this.setState({loading: true})
        axios.post("http://127.0.0.1:8082/wallHavenImgPreview", qs.stringify({imgUrl: previewUrl}), {headers: {'content-type': 'application/x-www-form-urlencoded'}}).then(res => {
            const {data: {code, msg, data}} = res
            if (code === 200) {
                this.setState({imgPreview: data, isImgPreview: true})
            } else {
                message.error(msg);
            }
        }).finally(_ => {
            this.setState({loading: false})
        })
    }

    scrollBottom = () => {
        this.content.current.onscroll = this.judgmentScrollBottom
    }

    judgmentScrollBottom = () => {
        const content = this.content.current
        let scrollHeight = content.scrollHeight,
            scrollTop = content.scrollTop,
            clientHeight = content.clientHeight
        if (scrollHeight - clientHeight === scrollTop) {
            this.setState({pageIndex: this.state.pageIndex + 1}, this.wallpaperGetImgList)
        }
    }

    fileDownLoad = () => {
        globalThis.api.send('downUrlLoad', this.state.imgPreview)
    }

    setWallpaper = () => {
        this.setState({loading: true, isImgPreview: false})
        axios.post("http://127.0.0.1:8082/saveImage", qs.stringify({imgUrl: this.state.imgPreview}), {headers: {'content-type': 'application/x-www-form-urlencoded'}}).then(res => {
            const {data: {code, msg, data}} = res
            if (code === 200) {
                globalThis.api.send('setWallpaper', data)
                message.success('壁纸设置成功!')
            } else {
                message.error(msg);
            }
        }).finally(_ => {
            this.setState({loading: false})
        })
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
                                                <img onClick={_ => {
                                                    this.showPreview(item.img_preview)
                                                }}
                                                     src={item.img_url} alt=""/>
                                                <div className={style.thumbInfo}>
                                                    <span className={style.star}>Star {item.star}</span>
                                                    <span className={style.imgSize}>{item.img_size}</span>
                                                </div>
                                            </div>
                                        </figure>
                                    </li>
                                )
                            }
                        </ul>
                    </Spin>

                    <PhotoSlider
                        toolbarRender={({ rotate, onRotate }) => {
                            return (
                                <>
                                    <svg
                                        className="PhotoView-PhotoSlider__toolbarIcon"
                                        onClick={() => onRotate(rotate + 90)}
                                        width="44"
                                        height="44"
                                        fill="white"
                                        viewBox="0 0 768 768"
                                    >
                                        <path d="M565.5 202.5l75-75v225h-225l103.5-103.5c-34.5-34.5-82.5-57-135-57-106.5 0-192 85.5-192 192s85.5 192 192 192c84 0 156-52.5 181.5-127.5h66c-28.5 111-127.5 192-247.5 192-141 0-255-115.5-255-256.5s114-256.5 255-256.5c70.5 0 135 28.5 181.5 75z" />
                                    </svg>
                                    <svg
                                        className="PhotoView-PhotoSlider__toolbarIcon"
                                        onClick={this.fileDownLoad}
                                        width="44"
                                        height="44"
                                        fill="white"
                                        viewBox="0 0 1024 1024"
                                    >
                                        <path d="M864 511.8c-17.7 0-32 14.3-32 32V864H192V543.8c0-17.7-14.3-32-32-32s-32 14.3-32 32V896c0 17.7 14.3 32 32 32h704c17.7 0 32-14.3 32-32V543.8c0-17.7-14.3-32-32-32zM488.7 687.3c6.1 7.3 15.1 11.5 24.6 11.5s18.5-4.2 24.6-11.5l177-212.3c11.3-13.6 9.5-33.8-4.1-45.1-13.6-11.3-33.8-9.5-45.1 4.1L544.5 579.3V128c0-17.7-14.3-32-32-32s-32 14.3-32 32v449.6L360.8 434c-11.3-13.6-31.5-15.4-45.1-4.1-13.6 11.3-15.4 31.5-4.1 45.1l177.1 212.3z" />
                                    </svg>
                                    <svg
                                        className="PhotoView-PhotoSlider__toolbarIcon"
                                        onClick={this.setWallpaper}
                                        width="44"
                                        height="44"
                                        fill="white"
                                        viewBox="0 -200 1200 1200"
                                    >
                                        <path d="M1023.977423 864.004939H576.007055v-31.992239h415.989417V32.014816h-831.978833v159.995062H128.014111V0.011289h895.963312zM256.016933 864.004939H128.014111V512.011289h32.003528v320.001411h95.999294z" />
                                        <path d="M896.019755 336.042685h-63.984478v-48.022224a64.007055 64.007055 0 0 0-64.007055-63.995767H64.018344a63.995767 63.995767 0 0 0-63.995767 63.995767v127.991533a63.995767 63.995767 0 0 0 63.995767 63.995767h704.009878a64.007055 64.007055 0 0 0 64.007055-63.995767v-47.965781h63.984478v127.968956c0 1.095006-1.602999 3.025378-2.675427 3.228575l-464.542211 90.106581c-16.131584 3.036666-28.774953 18.253864-28.774954 34.667666v82.057723a64.007055 64.007055 0 0 0-48.010935 61.92993v191.998589a64.007055 64.007055 0 0 0 128.01411 0V768.005644a63.939323 63.939323 0 0 0-47.988358-61.896064v-82.0803c0-1.095006 1.602999-3.014089 2.675427-3.217286l464.542212-90.106581c16.142873-3.025378 28.774953-18.253864 28.774953-34.678955V368.046213a32.07126 32.07126 0 0 0-32.014817-32.003528z m-95.988005 79.969309a32.037394 32.037394 0 0 1-32.003528 32.003528H64.018344a32.037394 32.037394 0 0 1-32.003528-32.003528V288.009172a32.037394 32.037394 0 0 1 32.003528-32.003528h704.009878a32.037394 32.037394 0 0 1 32.003528 32.003528v128.002822zM448.015522 768.005644v191.998589a32.014816 32.014816 0 0 1-64.007055 0V768.005644a32.059971 32.059971 0 0 1 30.56986-31.992239h1.467533a32.014816 32.014816 0 0 1 31.969662 31.992239z" />
                                    </svg>
                                </>
                            );
                        }}
                        images={[{src: this.state.imgPreview}]}
                        visible={this.state.isImgPreview}
                        onClose={this.closeImgPreview}
                    />
                </div>
            </>
        );
    }
}

export default Home;