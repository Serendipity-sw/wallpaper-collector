package main

import (
	"github.com/gin-gonic/gin"
	"github.com/swgloomy/gutil/glog"
	"net/http"
	"strconv"
	"wallpaper-collector/service/modal"
	"wallpaper-collector/service/wallHaven"
)

func setGinRouter(r *gin.Engine) {
	g := &r.RouterGroup
	{
		g.GET("/", func(c *gin.Context) { c.String(http.StatusOK, "ok") }) //确认接口服务程序是否健在
		g.GET("/wallHavenTopList", wallHavenTopList)
		g.POST("/wallHavenImgPreview", wallHavenImgPreview)
	}
}

/**
wallHaven排行榜
*/
func wallHavenTopList(c *gin.Context) {
	pageIndexStr := c.Query("pageIndex")
	pageIndex, err := strconv.Atoi(pageIndexStr)
	if err != nil {
		glog.Error("wallHavenTopList atoi run err! pageIndexStr: %s err: %s \n", pageIndexStr, err.Error())
		pageIndex = 1
	}
	if pageIndex < 1 {
		pageIndex = 1
	}
	imgListIn, err := wallHaven.DataProcess(pageIndex)
	if err != nil {
		glog.Error("wallHavenTopList DataProcess run err! pageIndex: %d err: %s \n", pageIndex, err.Error())
		c.JSON(http.StatusOK, modal.HttpResult{Code: modal.HttpCodeERROR, Msg: "数据获取失败!"})
		return
	}
	glog.Info("wallHavenTopList DataProcess run success! pageIndex: %d \n", pageIndex)
	c.JSON(http.StatusOK, modal.HttpResult{Code: modal.HttpCodeOK, Data: imgListIn})
}

/**
wallHaven 图片详情
*/
func wallHavenImgPreview(c *gin.Context) {
	imgUrl := c.PostForm("imgUrl")
	if len(imgUrl) == 0 {
		glog.Error("wallHavenImgPreview imgUrl empty! imgUrl: %s \n", imgUrl)
		c.JSON(http.StatusOK, modal.HttpResult{Code: modal.HttpCodeERROR, Msg: "预览图片链接不存在!"})
		return
	}
	imgPreview, err := wallHaven.ImgPreview(imgUrl)
	if err != nil {
		glog.Error("wallHavenImgPreview ImgPreview run err! imgUrl: %s err: %s \n", imgUrl, err.Error())
		c.JSON(http.StatusOK, modal.HttpResult{Code: modal.HttpCodeERROR, Msg: "图片数据获取失败!"})
		return
	}
	glog.Info("wallHavenImgPreview run success! imgUrl: %s imgPreview: %s \n", imgUrl, imgPreview)
	c.JSON(http.StatusOK, modal.HttpResult{Code: modal.HttpCodeOK, Data: imgPreview})
}
