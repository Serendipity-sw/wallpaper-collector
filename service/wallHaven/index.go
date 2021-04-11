package wallHaven

import (
	"errors"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"github.com/swgloomy/gutil/glog"
	"net/http"
	"strconv"
	"wallpaper-collector/service/modal"
)

/**
awesome wallpapers 壁纸网数据处理
*/
func DataProcess(pageIndex int) (*[]modal.WallpaperImage, error) {
	httpUrl := fmt.Sprintf("https://wallhaven.cc/toplist?page=%d", pageIndex)
	result, err := http.Get(httpUrl)
	if err != nil {
		glog.Error("DataProcess Get run err! httpUrl: %s err: %s \n", httpUrl, err.Error())
		return nil, err
	}
	defer func() {
		err = result.Body.Close()
		if err != nil {
			glog.Error("DataProcess body close err! httpUrl: %s err: %s \n", httpUrl, err.Error())
		}
	}()
	docQuery, err := goquery.NewDocumentFromReader(result.Body)
	if err != nil {
		glog.Error("DataProcess NewDocumentFromReader run err! httpUrl: %s err: %s \n", httpUrl, err.Error())
		return nil, err
	}
	var (
		list       []modal.WallpaperImage
		starStr    string
		star       int
		previewImg string
		imgSrc     string
		bo         bool
		domHtml    string
	)
	docQuery.Find(".thumb-listing-page li").Each(func(i int, selection *goquery.Selection) {
		var modal modal.WallpaperImage
		imgSrc, bo = selection.Find("img").Attr("data-src")
		if bo {
			modal.ImgUrl = imgSrc
		}
		previewImg, bo = selection.Find(".preview").Attr("href")
		if bo {
			modal.ImgPreview = previewImg
		}
		modal.ImgSize = selection.Find(".wall-res").Text()
		starStr = selection.Find(".wall-favs").Text()
		star, err = strconv.Atoi(starStr)
		if err != nil {
			domHtml, err = selection.Html()
			if err != nil {
				glog.Error("DataProcess get html err! httpUrl: %s eachIndex: %d err: %s \n", httpUrl, i, err.Error())
			} else {
				glog.Error("DataProcess Atoi run err! httpUrl: %s eachIndex: %d starStr: %s dom: %s err: %s \n", httpUrl, i, starStr, selection.Text())
			}
		} else {
			modal.Star = star
		}
		list = append(list, modal)
	})
	glog.Info("DataProcess run success! httpUrl: %s \n", httpUrl)
	return &list, nil
}

/**
awesome wallpapers 获取预览图片地址
*/
func ImgPreview(urlPath string) (string, error) {
	result, err := http.Get(urlPath)
	if err != nil {
		glog.Error("ImgPreview get run err! urlPath: %s err: %s \n", urlPath, err.Error())
		return "", err
	}
	defer func() {
		err = result.Body.Close()
		if err != nil {
			glog.Error("ImgPreview body close err! urlPath: %s err: %s \n", urlPath, err.Error())
		}
	}()
	docQuery, err := goquery.NewDocumentFromReader(result.Body)
	if err != nil {
		glog.Error("ImgPreview NewDocumentFromReader read err! urlPath: %s err: %s \n", urlPath, err.Error())
		return "", err
	}
	imgUrl, bo := docQuery.Find("section img").Attr("src")
	if bo {
		glog.Info("ImgPreview run success! urlPath: %s \n", urlPath)
		return imgUrl, nil
	}
	glog.Error("ImgPreview can't find url! urlPath: %s \n", urlPath)
	return "", errors.New(fmt.Sprintf("ImgPreview can't find url! urlPath: %s \n", urlPath))
}
