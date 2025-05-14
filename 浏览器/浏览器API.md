
### DOM操作&页面渲染

- **`document` API**
    
    - `querySelector()` / `querySelectorAll()`：选择 DOM 元素。
    - `getElementById()` / `getElementsByClassName()`：传统 DOM 选择方法。
    - `createElement()` / `appendChild()` / `removeChild()`：动态操作 DOM。
    - `innerHTML` / `textContent`：修改元素内容。
        
- **`window` API**
    
    - `window.location`：操作 URL（跳转、获取参数等）。
    - `window.history`（`pushState()` / `replaceState()`）：SPA 路由控制。
    - `window.scrollTo()`：控制页面滚动

### 网络请求

- **`fetch()`**  
    现代网络请求 API，替代传统的 `XMLHttpRequest`（XHR）。
    
- **`XMLHttpRequest`**  
    旧式 AJAX 请求（仍用于兼容性场景）。
    
- **`WebSocket`**  
    双向实时通信（聊天室、实时数据推送）。
    
- **`Server-Sent Events (SSE)`**  
    服务器单向推送数据（如实时通知）

### 存储&缓存

- **`localStorage` / `sessionStorage`**  
    本地键值存储（持久化或会话级）。
    
- **`IndexedDB`**  
    客户端非关系型数据库（大容量存储）。
    
- **`Cookies`**  
    通过 `document.cookie` 读写（注意安全性）。
    
- **`Cache API`**  
    配合 Service Worker 实现离线缓存（PWA 核心）

### 用户交互

- **`Drag & Drop API`**  
    实现拖放功能。
    
- **`Clipboard API`**  
    读写剪贴板（`navigator.clipboard.writeText()`）。
    
- **`Fullscreen API`**  
    控制全屏显示（`element.requestFullscreen()`）。
    
- **`Pointer Events`**  
    统一处理鼠标、触摸、触控笔事件。

