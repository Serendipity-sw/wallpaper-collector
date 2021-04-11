package modal

var (
	HttpCodeOK    = 200 // 成功
	HttpCodeERROR = 500 // 失败
)

type HttpResult struct {
	Code int         `json:"code"`
	Data interface{} `json:"data"`
	Msg  string      `json:"msg"`
}
