import React, { PureComponent } from 'react';
// import propTypes from 'prop-types';
import { Form, Input, Checkbox, Card, Spin, Upload, Button, Icon, message, notification } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import './IndexPage.scss';
import * as qiniu from 'qiniu-js'

const FormItem = Form.Item;
const maxWidth = 378.6;

class IndexPage extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      uploadImg: '',
      uploadImgUrl: '',
    };

    this.ak = '1Aooo13zVYGwzfZnvEn9d_exPKTb0gjIJKVr_kHQ';
    this.SK = 'Ma6k_xiYDdiBXY-9qMMWR5D6QZmarwDIakWfmDuk';
    this.token = "1Aooo13zVYGwzfZnvEn9d_exPKTb0gjIJKVr_kHQ:T__B71ZSc_k5uQf46QKa04lRo44=:eyJzY29wZSI6InFpbml1LXBpY3R1cmUtc3BhY2UiLCJkZWFkbGluZSI6MTUyNTIwODEyNX0=";
    this.bucket = 'qiniu-picture-space';
    this.region = 'up-z0.qiniup.com';
  }


  componentDidMount() { }

  componentWillReceiveProps(nextProps) { }

  qiniuJSUpload = () => {
    const { uploadImg } = this.state;
    console.log('uploadImg ->', uploadImg);
    var observable = qiniu.upload(uploadImg, uploadImg.name, this.token);
    console.log('observable ->', observable);
    observable.subscribe(observable); // 上传开始
  }


  /*   qiniuNodeJsUpload = () => {
      //需要填写你的 Access Key 和 Secret Key
      const { uploadImg } = this.state;
      console.log('uploadImg ->',uploadImg);
      qiniu.conf.ACCESS_KEY = this.ak;
      qiniu.conf.SECRET_KEY = this.SK;
      //要上传的空间
      const bucket = this.bucket;
      //上传到七牛后保存的文件名
      const key = uploadImg.name;
      //构建上传策略函数

      function uptoken(bucket, key) {
        var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
        return putPolicy.token();
      }

      //生成上传 Token
      const token = uptoken(bucket, key);
      //要上传文件的本地路径
      filePath = './ruby-logo.png'
      //构造上传函数
      function uploadFile(uptoken, key, localFile) {
        var extra = new qiniu.io.PutExtra();
        qiniu.io.putFile(uptoken, key, localFile, extra, function (err, ret) {
          if (!err) {
            // 上传成功， 处理返回值
            console.log(ret.hash, ret.key, ret.persistentId);
          } else {
            // 上传失败， 处理返回代码
            console.log(err);
          }
        });
      }
      //调用uploadFile上传
      uploadFile(token, key, filePath);
    }
   */

  // 图片上传前
  beforeUpload = (file) => {

    const _this = this;

    return new Promise((resolve) => {
      const fr = new FileReader();
      fr.readAsDataURL(file);
      fr.onload = function () {
        const img = new Image();
        img.src = fr.result;
        img.onload = function () {
          _this.setState({
            uploadImg: file,
            uploadImgUrl: img.src
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
    const { uploadImgUrl } = this.state;

    return (

      <div className="upload-page">
        <div className="content">
          <Spin spinning={spiningStatus} >
            <Card
              className="card"
              title="七牛云上传"
              hoverable={true}>
              {uploadImgUrl ? <img className="upload-bk-img" alt="upload-bk-img" src={uploadImgUrl} /> : <div className="default-img"></div>}
              <input type="file" name="image" accept='image/*' onChange={this.handleInputChange} />
              <Button type="primary" onClick={this.qiniuJSUpload}>上传</Button>

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
