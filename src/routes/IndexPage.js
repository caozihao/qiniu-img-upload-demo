import React, { PureComponent } from 'react';
import { Card, Spin, Button, notification } from 'antd';
import { connect } from 'dva';
import utils from '../utils/utils';
import './IndexPage.scss';
import * as qiniu from 'qiniu-js'

class IndexPage extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      uploadImg: '',
      uploadImgUrl: '',
      curImgHeight: 200,
    };
    this.defaultImgWidth = 200;
    this.defaultIntervalTime = 1000 * 60 * 60 * 12;
    this.ak = '1Aooo13zVYGwzfZnvEn9d_exPKTb0gjIJKVr_kHQ';
    this.SK = 'Ma6k_xiYDdiBXY-9qMMWR5D6QZmarwDIakWfmDuk';
    // this.token = "1Aooo13zVYGwzfZnvEn9d_exPKTb0gjIJKVr_kHQ:T__B71ZSc_k5uQf46QKa04lRo44=:eyJzY29wZSI6InFpbml1LXBpY3R1cmUtc3BhY2UiLCJkZWFkbGluZSI6MTUyNTIwODEyNX0=";
    // this.bucket = 'qiniu-picture-space'; //私有
    this.bucket = 'qiniu-space-caozihao';  //公开
    this.privateHost = 'http://p7zobqagh.bkt.clouddn.com';
    this.publicHost = 'http://p83ybv56r.bkt.clouddn.com';
  }

  componentDidMount() { }

  componentWillReceiveProps(nextProps) { }

  // 上传图片
  qiniuJSUpload = () => {
    const { uploadImg } = this.state;
    let token = utils.genUpToken(this.ak, this.SK, this.bucket, this.defaultIntervalTime);
    var observable = qiniu.upload(uploadImg, uploadImg.name, token);
    observable.subscribe(observable); // 上传开始
  }

  getImgUrl = () => {
    const publicObj = {
      host: this.publicHost,
      key: '20141113180912_HFBKz.thumb.700_0 - 副本 (2).jpg',
    }

    const privateObj = {
      host: this.publicHost,
      key: '20141113180912_HFBKz.thumb.700_0 - 副本 (2).jpg',
      e: Math.round((new Date().getTime + 1000 * 60 * 60 * 8) / 1000),
      secretKey: this.SK,
    }


    const privateUrl = utils.getPrivateUrl(privateObj);
    const publicUrl = utils.getPublicUrl(publicObj);

    return {
      privateUrl,
      publicUrl,
    };
  }

  // 图片上传前
  beforeUpload = (file) => {
    const _this = this;
    const _defaultImgWidth = this.defaultImgWidth;
    return new Promise((resolve) => {
      const fr = new FileReader();
      fr.readAsDataURL(file);
      fr.onload = function () {
        const img = new Image();
        img.src = fr.result;
        img.onload = function () {
          const curImgHeight = img.height * _defaultImgWidth / img.width;
          _this.setState({
            uploadImg: file,
            uploadImgUrl: img.src,
            curImgHeight,
          })
        }
      };
    });
  }

  handleInputChange = (event) => {

    // 获取当前选中的文件
    const file = event.target.files[0];

    const accessImgTypeArr = ['image/jpeg', 'image/jpg', 'image/png'];
    let accessFlag = accessImgTypeArr.some((v) => {
      return file.type === v;
    });

    if (accessFlag) {
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (isLt2M) {
        this.beforeUpload(file);
      } else {
        const message = '图片最大不能超过2M';
        notification.error({
          message
        });
      }

    } else {
      notification.error({
        message: 'Only support:*.jpeg,*.jpg,*.png',
      });
    }
  }

  render() {
    const { spiningStatus } = this.props;
    const { uploadImgUrl, curImgHeight } = this.state;
    const { publicUrl, privateUrl } = this.getImgUrl();
    return (

      <div className="upload-page">
        <div className="content">
          <Spin spinning={spiningStatus} >
            <Card
              className="card"
              title="七牛云上传"
              hoverable={true}>
              <div className="default-img" style={{ height: curImgHeight }}>
                {uploadImgUrl ? <img className="upload-bk-img" alt="upload-bk-img" src={uploadImgUrl} /> : ''}
              </div>
              <input type="file" name="image" accept='image/*' onChange={this.handleInputChange} />
              <Button type="primary" onClick={this.qiniuJSUpload}>上传</Button>
            </Card>

            <Card
              className="card"
              title="公开空间-图片"
              hoverable={true}>
              <div className="default-img" style={{ height: curImgHeight }}>
                <img className="upload-bk-img" alt="upload-bk-img" src={publicUrl} />
              </div>
            </Card>
          </Spin>
        </div>
      </div>
    );
  }
}
IndexPage.propTypes = {};
IndexPage.defaultProps = {
  login: () => { },
  spiningStatus: false
};
export default connect()(IndexPage);
