# Health Check 問題分析

## 當前配置

### Task Definition 配置
```json
"healthCheck": {
  "command": [
    "CMD-SHELL",
    "curl -f http://localhost:3000/api/health || exit 1"
  ],
  "interval": 30,
  "retries": 6,
  "startPeriod": 300,
  "timeout": 10
}
```

## 可能的問題

### 1. **Next.js Standalone 模式的路由問題**
Next.js standalone 模式在構建時會生成 `server.js`，但 API 路由應該仍然可用。需要確認：
- API 路由是否正確包含在 standalone 輸出中
- `server.js` 是否正確處理 `/api/*` 路由

### 2. **應用啟動時間**
- `startPeriod: 300` (5分鐘) 應該足夠，但 Next.js 可能需要更長時間啟動
- 檢查 CloudWatch Logs 確認應用何時完全啟動

### 3. **Curl 命令問題**
- `curl -f` 會在 HTTP 錯誤時返回非零退出碼
- 需要確認 curl 是否正確安裝（Dockerfile 中已安裝）
- 可能需要添加 `-s` (silent) 和 `--max-time` 選項

### 4. **端口配置**
- 確認應用監聽在 `localhost:3000` 而不是 `0.0.0.0:3000`
- Next.js 默認監聽所有接口，但 health check 使用 localhost 應該沒問題

### 5. **環境變數**
- 確認 `PORT=3000` 環境變數已設置
- 檢查 `NODE_ENV` 是否影響路由

## 建議的解決方案

### 方案 1: 改進 Health Check 命令（推薦）
```json
"healthCheck": {
  "command": [
    "CMD-SHELL",
    "curl -sf --max-time 5 http://localhost:3000/api/health || exit 1"
  ],
  "interval": 30,
  "retries": 6,
  "startPeriod": 300,
  "timeout": 10
}
```
**改進點**：
- `-s`: silent 模式，不顯示進度
- `--max-time 5`: 設置超時時間為 5 秒

### 方案 2: 使用 wget（如果 curl 有問題）
```json
"healthCheck": {
  "command": [
    "CMD-SHELL",
    "wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1"
  ],
  "interval": 30,
  "retries": 6,
  "startPeriod": 300,
  "timeout": 10
}
```

### 方案 3: 使用 Node.js 腳本（最可靠）
創建一個簡單的 health check 腳本：
```javascript
// healthcheck.js
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/health',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on('error', () => {
  process.exit(1);
});

req.on('timeout', () => {
  req.destroy();
  process.exit(1);
});

req.end();
```

然後在 task definition 中使用：
```json
"healthCheck": {
  "command": [
    "CMD-SHELL",
    "node healthcheck.js"
  ],
  "interval": 30,
  "retries": 6,
  "startPeriod": 300,
  "timeout": 10
}
```

### 方案 4: 增加調試信息
在 health check 命令中添加日誌輸出：
```json
"healthCheck": {
  "command": [
    "CMD-SHELL",
    "curl -v http://localhost:3000/api/health 2>&1 || exit 1"
  ],
  "interval": 30,
  "retries": 6,
  "startPeriod": 300,
  "timeout": 10
}
```

## 調試步驟

1. **檢查 CloudWatch Logs**
   - 查看應用啟動日誌
   - 確認應用何時完全啟動
   - 查看是否有錯誤信息

2. **手動測試容器**
   ```bash
   # 進入運行中的容器
   docker exec -it <container_id> sh
   
   # 測試 health check
   curl -v http://localhost:3000/api/health
   ```

3. **檢查 ECS Task 狀態**
   - 在 AWS Console 查看 Task 詳細信息
   - 查看 Health Check 狀態和失敗原因

4. **驗證 API 路由**
   - 確認 `/api/health` 路由在本地開發環境正常工作
   - 測試 standalone 構建是否包含該路由

## 推薦配置

基於分析，推薦使用改進的 curl 命令：

```json
"healthCheck": {
  "command": [
    "CMD-SHELL",
    "curl -sf --max-time 5 --connect-timeout 3 http://localhost:3000/api/health || exit 1"
  ],
  "interval": 30,
  "retries": 6,
  "startPeriod": 300,
  "timeout": 10
}
```

**參數說明**：
- `-s`: silent 模式
- `-f`: 失敗時返回非零退出碼
- `--max-time 5`: 總超時時間 5 秒
- `--connect-timeout 3`: 連接超時 3 秒

