package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/swgloomy/gutil/glog"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
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
		g.POST("/saveImage", saveImage)
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

/**
图片保存
*/
func saveImage(c *gin.Context) {
	imgUrl := c.PostForm("imgUrl")
	if len(imgUrl) == 0 {
		glog.Error("saveImage imgUrl empty! imgUrl: %s \n", imgUrl)
		c.JSON(http.StatusOK, modal.HttpResult{Code: modal.HttpCodeERROR, Msg: "图片链接不存在!"})
		return
	}
	result, err := http.Get(imgUrl)
	if err != nil {
		glog.Error("saveImage img save err! imgUrl: %s err: %s \n", imgUrl, err.Error())
		c.JSON(http.StatusOK, modal.HttpResult{Code: modal.HttpCodeERROR, Msg: "图片下载失败!"})
		return
	}
	defer func() {
		err = result.Body.Close()
		if err != nil {
			glog.Error("saveImage http body read close err! imgUrl: %s err: %s \n", imgUrl, err.Error())
		}
	}()
	data, err := ioutil.ReadAll(result.Body)
	if err != nil {
		glog.Error("saveImage body read err! imgUrl: %s err: %s \n", imgUrl, err.Error())
		c.JSON(http.StatusOK, modal.HttpResult{Code: modal.HttpCodeERROR, Msg: "图片读取失败!"})
		return
	}
	uuidStr, err := uuid.NewUUID()
	if err != nil {
		glog.Error("saveImage create uuid err! imgUrl: %s err: %s \n", imgUrl, err.Error())
		c.JSON(http.StatusOK, modal.HttpResult{Code: modal.HttpCodeERROR, Msg: "创建UUID失败!"})
		return
	}
	imgPath := fmt.Sprintf("%s/%s.jpg", pictureDir, uuidStr)
	err = ioutil.WriteFile(imgPath, data, os.ModePerm)
	if err != nil {
		glog.Error("saveImage img save err! imgUrl: %s imgPath: %s err: %s \n", imgUrl, imgPath, err.Error())
		c.JSON(http.StatusOK, modal.HttpResult{Code: modal.HttpCodeERROR, Msg: "图片保存失败!"})
		return
	}
	abPath, err := filepath.Abs(imgPath)
	if err != nil {
		glog.Error("saveImage get file abs path err! imgUrl: %s imgPath: %s err: %s \n", imgUrl, imgPath, err.Error())
		c.JSON(http.StatusOK, modal.HttpResult{Code: modal.HttpCodeERROR, Msg: "获取文件绝对路径失败!"})
		return
	}
	glog.Info("saveImage img save success! imgUrl: %s imgPath: %s \n", imgUrl, abPath)
	c.JSON(http.StatusOK, modal.HttpResult{Code: modal.HttpCodeOK, Data: abPath})
}
