package main

import (
	"flag"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/guotie/deferinit"
	"github.com/swgloomy/gutil"
	"github.com/swgloomy/gutil/glog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
)

var (
	rt         *gin.Engine
	pidStrPath = "./service.pid"
	debugFlag  = flag.Bool("d", false, "debug mode")
)

func main() {
	if gutil.CheckPid(pidStrPath) {
		return
	}
	flag.Parse()
	serverRun(*debugFlag)
	c := make(chan os.Signal, 1)
	gutil.WritePid(pidStrPath)
	signal.Notify(c, os.Interrupt, os.Kill, syscall.SIGTERM)
	//信号等待
	<-c
	gutil.RmPidFile(pidStrPath)
	serverExit()
}

func ginInit(debug bool) {
	//设置gin的工作方式
	gin.SetMode(gutil.If(debug, gin.DebugMode, gin.ReleaseMode).(string))
	rt = gin.Default()
	//允许跨域
	rt.Use(Cors())
	setGinRouter(rt)
	go func() {
		err := rt.Run(fmt.Sprintf(":8080"))
		if err != nil {
			fmt.Printf("rt run err! err: %s \n", err.Error())
		}
	}()
}

func Cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		method := c.Request.Method
		c.Header("Access-Control-Allow-Headers", "*")
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE,UPDATE")
		c.Header("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers")
		c.Header("Access-Control-Allow-Credentials", "true")

		if method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
		}

		c.Next()
	}
}

func serverExit() {
	deferinit.StopRoutines()
	fmt.Println("stop routine successfully!")

	deferinit.FiniAll()
	fmt.Println("stop all modules successfully!")

	glog.Close()

	os.Exit(0)
}

func serverRun(debug bool) {
	gutil.LogInit(debug, "./logs")

	gutil.SetCPUUseNumber(0)
	fmt.Println("set many cpu successfully!")

	deferinit.InitAll()
	fmt.Println("init all module successfully!")

	deferinit.RunRoutines()
	fmt.Println("init all run successfully!")

	ginInit(debug)
	fmt.Println("ginInit run successfully!")
}
