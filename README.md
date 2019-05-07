# openEye
小程序，开眼视频

## 接口
```shell
let eyeUrl = https://baobab.kaiyanapp.com
```
1、获取推荐视频
```shell
${eyeUrl}/api/v4/tabs/selected
```
2、获取当前视频信息
```shell
${eyeUrl}/api/v1/video/${id}
```
3、获取当前视频评论
```shell
${eyeUrl}/api/v1/replies/video?id=${id}&num=${num}
```
4、获取推荐视频信息
```shell
${eyeUrl}/api/v4/video/related?id=${id}
```
