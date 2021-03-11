import {host} from "./host";

if(wx.getStorageSync('sessionid')) {

}
function request(url, method = 'GET', data = {}, hasToken = true) {
  const token = wx.getStorageSync('sessionid');
  wx.showLoading({
    mask: true
  });
  return new Promise((resolve, reject) => {
    let header = hasToken ? {'cookie': token} : {};
    wx.request({
      url: host + url, // 仅为示例，并非真实的接口地址
      method: method,
      data: data,
      header: header,
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          errorMessage(res);
          reject(res);
            wx.navigateTo({
                url: '/pages/login/login',
            })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        errorMessage(res);
        reject(res);
      },
      complete: function () {

      }
    })
  })
}

function requestFormData(url, method = 'GET', data = {}, hasToken = true) {
  const token = wx.getStorageSync('token');
  wx.showLoading({
    mask: true
  });
  return new Promise((resolve, reject) => {
    let header = hasToken ? {
      'Authorization': token,
      'content-type': "application/x-www-form-urlencoded"
    } : {
      'content-type': "application/x-www-form-urlencoded"
    };
    wx.request({
      url: host + url, // 仅为示例，并非真实的接口地址
      method: method,
      data: data,
      header: header,
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          errorMessage(res);
          reject(res);
        }
      },
      fail: function (res) {
        wx.hideLoading();
        errorMessage(res);
        reject(res);
      },
      complete: function () {

      }
    })
  })
}

function errorMessage(res) {
  let errorMessage=res.statusCode===401?'未授权':'服务异常';
  wx.showToast({
    title: errorMessage,
    icon: 'none',
    duration: 2000
  });
}

function get(obj) {
  return request(obj.url, 'GET', obj.data)
}

function getWithNoToken(obj) {
  return request(obj.url, 'GET', obj.data, false)
}

function post(obj) {
  return request(obj.url, 'POST', obj.data)
}

function postFormData(obj) {
  return requestFormData(obj.url, 'POST', obj.data)
}
function postFormNoToken(obj) {
  return requestFormData(obj.url, 'POST', obj.data,false)
}
function postWithNoToken(obj) {
  return request(obj.url, 'POST', obj.data, false)
}

function put(obj) {
  return request(obj.url, 'PUT', obj.data)
}

function putWithNoToken(obj) {
  return request(obj.url, 'PUT', obj.data, false)
}

export default {
  get,
  getWithNoToken,
  post,
  postFormData,
  postWithNoToken,
  postFormNoToken,
  put,
  putWithNoToken,
}
