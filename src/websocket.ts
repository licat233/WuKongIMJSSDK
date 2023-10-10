


// const platformObj: any = getPlatformObj() // 获取平台全局操作对象

declare const uni: any; // 定义uni 为全局对象
declare const wx: any; // 定义wx为全局对象

function getPlatformObj() {
    if (typeof uni !== 'undefined' && typeof uni.connectSocket === 'function') {
        console.log('UniApp运行环境');
        return uni
    } else if (typeof wx !== 'undefined' && typeof wx.connectSocket === 'function') {
        console.log('小程序运行环境');
        return wx
    } else {
        console.log('web运行环境');
        return undefined
    }
}

export class WKWebsocket {
    addr!: string
    ws!: WebSocket | any
    destory: boolean = false
    platform:any
    constructor(addr: string,platform?:any) {
        this.addr = addr

        if(platform) {
            this.platform = platform
        }else {
            this.platform = getPlatformObj()
        }
        if(this.platform) {
           this.ws = this.platform.connectSocket({
                url: addr,
               
                complete: ()=> {
                    // eslint-disable-next-line no-empty-function
                } // TODO: 这里一定要写，不然会返回一个 Promise对象
            })
        }else{
            this.ws = new WebSocket(this.addr);
            this.ws.binaryType = 'arraybuffer';
        }
       
    }

    onopen(callback: () => void) {
        if (this.platform) {
            this.ws.onOpen(() => {
                if (this.destory) {
                    return
                }
                if (callback) {
                    callback()
                }
            })
        } else {
            this.ws.onopen = () => {
                if (this.destory) {
                    return
                }
                if (callback) {
                    callback()
                }
            }
        }
    }

    onmessage(callback: ((ev: MessageEvent) => any) | null) {
        if (this.platform) {
            this.ws.onMessage((e) => {
                if (this.destory) {
                    return
                }
                if (callback) {
                    callback(e.data)
                }
            })
        } else {
            this.ws.onmessage = (e) => {
                if (this.destory) {
                    return
                }
                if (callback) {
                    callback(e.data)
                }
            }
        }

    }

    onclose(callback: (e: CloseEvent) => void) {
        if (this.platform) {
            this.ws.onClose((params) => {
                if (this.destory) {
                    return
                }
                if (callback) {
                    callback(params)
                }
            })
        } else {
            this.ws.onclose = (e) => {
                if (this.destory) {
                    return
                }
                if (callback) {
                    callback(e)
                }
            }
        }

    }

    onerror(callback: (e: Event) => void) {
        if (this.platform) {
            this.ws.onError((e) => {
                if (callback) {
                    callback(e)
                }
            })
        } else {
            this.ws.onerror = (e) => {
                if (this.destory) {
                    return
                }
                if (callback) {
                    callback(e)
                }
            }
        }
    }

    send(data: any) {
        if (this.platform) {
            if(data instanceof Uint8Array) {
                this.ws.send({ data:data.buffer })
            }else {
                this.ws.send({ data })
            }
            
        } else {
            this.ws.send(data)
        }

    }

    close() {
        this.destory = true
        this.ws.close()
    }
}