/*
 * 基于autojs，微信全自动发送消息脚本，支持包括锁屏密码和应用锁等图案解锁进入。
 * by Runze Lee
 */

//全局常量
const NAME = "文件传输助手"; //发送给谁（如果备注过就是备注名）
const MSG = "求英语作业物资"; //发送的内容
const HASPWD = true; //手机有没有图案锁屏密码
const PWD = p => { //图案锁屏密码（从左到右从上到下每个点记为一个1-9的数字，第一个参数是总滑动时间，如果密码长时间短会来不及绘全）
    gesture(1500, p[1], p[4], p[5], p[2], p[3], p[6], p[9], p[8], p[7]);
};
const PWD_POSITION = Array(null, //锁屏密码的每个图案点坐标，可以通过开发者选项里的指针位置获取
    [145, 852], [360, 852], [570, 852],
    [145, 1060], [360, 1060], [570, 1060],
    [145, 1268], [360, 1268], [570, 1268]
);
const HASAPPLOCK = false; //微信有没有图案应用锁
const APPLOCK = p => { //图案应用锁密码
    gesture(1500, p[1], p[4], p[5], p[2], p[3], p[6], p[9], p[8], p[7]);
};
const APPLOCK_POSITION = Array(null, //应用锁的每个图案点坐标
    [145, 852], [360, 852], [570, 852],
    [145, 1060], [360, 1060], [570, 1060],
    [145, 1268], [360, 1268], [570, 1268]
);
const DEBUG = false; //启用则不发送消息，只到达消息框输入消息

if (!device.isScreenOn()) {
    if (HASPWD) unlock(false);
    sleep(1000);
}
toast("脚本开始运行，若你正在使用手机，请等待脚本执行完毕");
var launchtime = 0;
while (!id("fly").exists()) {
    if (HASAPPLOCK && text("请输入密码").exists()) {
        unlock(true);
        sleep(500);
        if (id("fly").exists()) {
            break;
        }
    }
    if (currentActivity().includes("com.tencent.mm")) {
        while (!id("fly").exists()) {
            back();//在微信的其他activity返回到首页
            sleep(500);
        }
        break;
    }
    launchtime++;
    app.startActivity({
        action: "android.intent.action.MAIN",
        className: "com.tencent.mm.ui.LauncherUI",
        packageName: "com.tencent.mm"
    });
    toast("正在打开微信");
    sleep(3000);
    if (launchtime > 5) home();//启动不太可能超过15秒，一般返回了假的activity，回桌面重进
    if (launchtime > 10) {
        toast("第" + launchtime + "次开启，开启次数过多，若已经进入微信请重新运行脚本😱");
    }
}
var main = id("ki2").className("android.widget.RelativeLayout").drawingOrder(1).findOne().bounds();
click(main.centerX(), main.centerY());
sleep(500);
findZztAndSend(NAME, MSG);

function unlock(isAppLock) {
    if (!isAppLock) {
        device.wakeUp();
        sleep(500);
        swipe(500, 2000, 500, 1000, 210);
        sleep(500);
        PWD(PWD_POSITION);
    } else {
        APPLOCK(APPLOCK_POSITION);
    }
}

function findZztAndSend(zzt_name, msg) {
    var zzt = id("hje").className("android.view.View").text(zzt_name);
    var toTop = id("fy").findOne();
    //双击左上角置顶，然后循环向下翻找人
    click(toTop.bounds().centerX(), toTop.bounds().centerY());
    click(toTop.bounds().centerX(), toTop.bounds().centerY());
    var scrolltime = 0;
    while (!zzt.exists() || zzt.findOne().bounds().top > id("fly").findOne().bounds().top) {
        scrolltime++;
        swipe(500, 1000, 500, 20, 200);
        sleep(500);
        if (scrolltime > 10) {
            toast("第" + scrolltime + "次滑动，滑动次数过多，若在底部反复横跳，请重新运行脚本😱");
        }
    }
    click(zzt.findOne().bounds().centerX(), zzt.findOne().bounds().centerY());
    sleep(1000);
    className("EditText").findOne().setText(msg);
    if (!DEBUG) {
        text("发送").findOne().click();
        toast("已发送，脚本执行完毕");
    } else {
        toast("调试模式，已输入消息");
    }

}