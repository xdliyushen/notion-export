# notion-export
fastest way to export notion pages.

## 使用
有两种使用方法，一种是通过命令行调用，一种是在代码中通过函数调用。

命令行：
```shell
notion-export-cli --email example@mail.com --password your_password --blockId page1_id --blockId page2_id
```

函数：
```js
const notionExportFn = require('notion-export-cli');

notionExportFn({
    email: 'example@mail.com',
    password: 'your_password',
    blockId: [
      // ...
    ],
})
.then(res => {
    // ['page_content_download_url']
    console.log(res);
});
```

## 参数
| 参数名 | 种类 |描述 | 默认值 |
| -- | -- | -- | -- |
| email | string | notion 登录邮箱 | - |
| password | string | notion 登录密码 | - |
| blockId | string\|array | 导出的 notion 页面的 id | - |
| exportType | string | 导出 notion 页面的类型 | 'markdown' |

## 常见问题
### 怎么查看要导出的页面的 id?
首先打开页面，然后点击右上角的 `share` 按钮，会弹出如下弹窗：
![image](https://user-images.githubusercontent.com/37898499/163699168-ea8d8b3e-e473-4a88-8f98-47b5496700a4.png)
之后点击 `copy link`，就会得到页面链接，格式为：
```
https://www.notion.so/页面标题-blockId
```
通过查看链接即可得到 blockId。
