package modal

type WallpaperImage struct {
	ImgUrl     string `json:"img_url"`     // 图片路劲
	ImgPreview string `json:"img_preview"` // 图片预览地址
	ImgSize    string `json:"img_size"`    // 图片大小
	Star       int    `json:"star"`        // 赞
}
