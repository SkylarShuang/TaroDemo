import { View, Text, Button, Canvas,Video } from '@tarojs/components'
import Taro, { useLoad, useReady, CanvasContext } from '@tarojs/taro'
import { useRef, useEffect,  } from 'react'
import './index.css'

export default function Index() {
  const context = useRef<Taro.CanvasContext>();
  // 绘制轨迹信息
const lineInfo = useRef({ startX: 0, startY: 0 });


  useLoad(() => {
    console.log('Page loaded.')
    Taro.login({
      success: res => {
        if(res.code){
          Taro.showToast({
            title: "登录成功"
          })
        }
      }
    })
  })

  // useLoad(() => {
  //   const query = Taro.createSelectorQuery()
  //   console.log("query", query)
  //   query.select("#myCanvas").fields({ node: true, size: true })
  //   .exec((res => {
  //     console.log("myCanvas", res)
  //     const canvas = res[0].node
  //     const ctx = canvas.getContext('2d')
  //     const { windowWidth, windowHeight } = Taro.getSystemInfoSync()
  //     ctx.canvas.width = windowWidth;
  //     ctx.canvas.height = windowHeight;

  //     ctx.setStrokeStyle('#000000');
  //     ctx.setLineWidth(4);
  //     ctx.setLineCap('round');
  //     ctx.setLineJoin('round');
  //     context.current = ctx as CanvasContext;
  //   }))
  // })

  const draw = () => {
    const query = Taro.createSelectorQuery()
    query.select("#myCanvas").fields({ node: true, size: true })
    .exec((res => {
      console.log("myCanvas", res)
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')
      const { windowWidth, windowHeight } = Taro.getSystemInfoSync()
      ctx.canvas.width = windowWidth;
      ctx.canvas.height = windowHeight;

      // 清空画布
      ctx.clearRect(0, 0, 200, 200)

      // 绘制红色正方形
      ctx.fillStyle = 'rgb(200, 0, 0)';
      ctx.fillRect(50, 50, 150, 150);

      // 绘制蓝色半透明正方形
      ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
      ctx.fillRect(130, 130, 150, 150);


      context.current = ctx as CanvasContext;
    }))
  }

  const canvasStart = (e) => {
    e.preventDefault();
  
    lineInfo.current.startX = e.changedTouches[0].clientX
    lineInfo.current.startY = e.changedTouches[0].clientY
    context.current?.beginPath()
  }
  
  const canvasMove = (e) => {
    e.preventDefault();
  
    let x = e.changedTouches[0].clientX
    let y = e.changedTouches[0].clientY
    context.current?.moveTo(lineInfo.current.startX, lineInfo.current.startY)
    context.current?.lineTo(x, y)
    context.current?.stroke()
    lineInfo.current.startX = x
    lineInfo.current.startY = y
  }

  const drawText = (ctx, color, text, x, y, font = 16) => {
    ctx.setFontSize(font)
    ctx.setFillStyle(color)
    ctx.setTextAlign('left')
    ctx.fillText(text, x, y)
    ctx.stroke()
    ctx.closePath()
  }

  const pay = () => {
    Taro.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: 'MD5',
      paySign: '',
      success (res) { 
        console.log("order_success", res)
      },
      fail (res) { 
        console.log("orderRes_fail:", res)
      }
    })
  }

  return (
    <View className='page_wrap'>
      <Text>Taro demo!</Text>
      <Button  openType='share' className='page_wrap_share_btn'>分享给好友</Button>
      <Button onClick={draw} className='page_wrap_canvas_btn'>绘画</Button>
      <Canvas style={{width: `100px`, height: `100px`}} canvasId='myCanvas' id='myCanvas' type='2d' onTouchStart={canvasStart} onTouchMove={canvasMove}></Canvas>
      <Button onClick={pay} className='page_wrap_canvas_btn'>视频播放</Button>
      <View className='components-page'>
        <Video
          id='video'
          src='http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
          poster='https://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg'
          initialTime={0}
          autoplay={false}
          loop={false}
          muted={false}
        />
      </View>
    </View>
  )
}
