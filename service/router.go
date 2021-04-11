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
		c.JSON(http.StatusOK, modal.HttpResult{Code: modal.HttpCodeERROR})
		return
	}
	glog.Info("wallHavenTopList DataProcess run success! pageIndex: %d \n", pageIndex)
	c.JSON(http.StatusOK, modal.HttpResult{Code: modal.HttpCodeOK, Data: imgListIn})
}
