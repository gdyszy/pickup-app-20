<h1> 优礼品卡提货系统2.0 </h1>

# 产品简介
优礼品卡提货系统 2.0，是基于 uniCloud + uni-app开发的礼品卡提货系统。

# 应用场景
1.公司节日福利发放礼品卡，员工自行到提货系统选择礼品提货下单；

2.礼品公司制作提货卡，将卡片交付采购企业，收卡人扫码提货；

3.大闸蟹未上市时销售提货卡，大闸蟹上市时凭卡到系统中提货；

4.中秋节礼品卡提货，国庆节礼品卡提货，节日礼品卡发放场景；

5.其他适用的提货卡的应用场景。

# 产品优势
产品后台采用uniCloud开发一云多端的整套业务。并充分利用serverless的技术优势，降低开发成本。

产品前端采用uni-App开发，实现App（iOS，Android）、H5、微信小程序多平台部署运营。

系统扩展性能强，可基于优礼品卡提货系统方便的扩展功能。

# 产品功能
# 管理后台功能
*  兑换卡管理：添加卡、批量制卡、删除卡、状态设置、条件搜索卡号 查看二维码 H5端（new） 列表排序（new）

*  商品管理：添加商品、删除商品、根据条件搜索商品、列表排序（new）、商品分类（new）、商品回收价格设置（new）

*  商品分类（new）：添加分类、删除分类、根据条件搜索分类、输入快递单号，自动获取快递公司名（new）

*  兑换订单：查看用户兑换的订单、对订单进行发货操作，根据条件搜索订单

*  礼包活动管理：添加礼包、删除礼包、根据条件搜索礼包、可选礼物、添加提货卡密


*  联系我们：更换系统标题，系统logo、配置企业微信客服（new）、联系电话（new）、提货须知（new）、订单查询须知（new）

*  物流管理（new）：配置快递Key、快递公司列表

*  轮播图(new)：添加、删除、修改轮播图， 用户端首页展示用

# 用户端功能
*  预约兑换
*  真伪验证
*  发货查询
*  回收卡
*  扫二维码验证卡号密码提货：刮开图层获取密码、转增亲友
*  联系客服




# 前端效果图
![](https://wiki.yszyun.com/uploads/pickup-app-20/images/m_97e21f45f119af161215deea31435985_r.jpg)



![](https://wiki.yszyun.com/uploads/pickup-app-20/images/m_1e21756f67d3f6f226e3bb3b2c0cf7e4_r.jpg)


![](https://wiki.yszyun.com/uploads/pickup-app-20/images/m_7b14fd86ac6f9460a06562bbc7566da8_r.jpg)

![](https://wiki.yszyun.com/uploads/pickup-app-20/images/m_cd94a74f151df1a4fed4d86f9251515c_r.jpg)

![](https://wiki.yszyun.com/uploads/pickup-app-20/images/m_3a4bcd882e2c1d72d45b6aa73bc33f46_r.jpg)

![](https://wiki.yszyun.com/uploads/pickup-app-20/images/m_63b2fc843fc194616b90fe36a4d57afa_r.jpg)

![](https://wiki.yszyun.com/uploads/pickup-app-20/images/m_49f8e2b6be95fcc64f841b156a9c840b_r.jpg)

![](https://wiki.yszyun.com/uploads/pickup-app-20/images/m_f8abbb3b0861abfa4b6c419f0f4926e8_r.jpg)

![](https://wiki.yszyun.com/uploads/pickup-app-20/images/m_2bcbede28e76886bb240670ad3bdb00f_r.jpg)

![](https://wiki.yszyun.com/uploads/pickup-app-20/images/m_2e2f06a4382bb8276de56fa5bf7f6541_r.jpg)

![](https://wiki.yszyun.com/uploads/pickup-app-20/images/m_59f9e797a1fdbcf788c3807feb9cde0a_r.png)

![](https://wiki.yszyun.com/uploads/pickup-app-20/images/m_bdead77f1905c573889a72753de6a459_r.png)


# 产品演示

前端 [https://thk.yszyun.com/#/pages/index/index?emp_code=UZbUbX](https://thk.yszyun.com/#/pages/index/index?emp_code=UZbUbX)
扫码访问

![](https://wiki.yszyun.com/uploads/pickup-app-20/images/m_ba80559982df742ec98d4024334c8ab6_r.png)

# 此插件需关联管理后台才能使用
管理后台购买，请联系技术人员

![](https://wiki.yszyun.com/uploads/moa-admin/images/m_a3639d790e5a0b1f9d1a1dd5e695894c_r.png)


# 目录结构
```
├── uni_modules   uni公共组件
├── components              组件资源
├── pages                   前端页面
├── App.vue                 全局生命周期和全局样式配置
├── manifest.json           应用配置
├── main.js                 vue初始化入口
├── pages.json              配置页面路由
└── README.md               说明文档 
```

# 安装步骤
* 复制源码到新建的项目
* 进入manifest.json可视化重新获取appid
* 修改main.js 文件中的 $webUrl、$emp_code、$extInfoUrl、$corpId
* 使用HBuilderx运行到浏览器

以上方法都是基于[HBuilderX工具开发](https://uniapp.dcloud.io/quickstart?id=_1-%e9%80%9a%e8%bf%87-hbuilderx-%e5%8f%af%e8%a7%86%e5%8c%96%e7%95%8c%e9%9d%a2)的方法

扫码添加技术微信支持，备注说明对应的插件名称

![](https://wiki.yszyun.com/uploads/moa-admin/images/m_a3639d790e5a0b1f9d1a1dd5e695894c_r.png)
