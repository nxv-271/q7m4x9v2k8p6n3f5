# 大阪・京都 2027 旅行小工具（PWA 版）

這是可以直接用網址開啟、加入 iPhone 主畫面、離線也能看的旅行小工具。

## 檔案結構（部署到 GitHub Pages 時，這些檔案要放在 repo 的最上層，或是 `/docs` 資料夾）

```
index.html
manifest.json
service-worker.js
assets/           ← 所有地圖與集合照片（原始解析度，不要壓縮）
icons/            ← App 圖示
```

## 部署到 GitHub Pages（最簡單、免費）

1. 到 https://github.com/new 建立一個新的 **public** repository，例如取名 `osaka2027`。
2. 把這個資料夾裡「全部檔案」（`index.html`、`manifest.json`、`service-worker.js`、`assets/`、`icons/`）上傳到這個 repo 的最上層（可以直接在 GitHub 網頁上用「Add file → Upload files」拖曳上傳，不需要指令）。
3. 上傳完成後，到 repo 的 **Settings → Pages**。
4. 在「Build and deployment」→「Source」選擇 **Deploy from a branch**，Branch 選 `main`，資料夾選 `/ (root)`，按 **Save**。
5. 等 1～2 分鐘，畫面會出現網址，格式類似：
   `https://你的帳號.github.io/osaka2027/`
6. 打開這個網址確認可以正常瀏覽，就完成部署了。

之後只要修改檔案、再上傳覆蓋（或用 `git push`），GitHub Pages 會自動更新網站。

> 若之後有更新地圖或行程內容，記得同時把 `service-worker.js` 裡最上面的
> `CACHE_NAME = 'osaka2027-v1'` 版本號改成 `v2`、`v3`…
> 這樣 iPhone 上已經加入主畫面的舊快取才會抓到新版本，否則可能還是看到舊內容。

## iPhone 加入主畫面

1. iPhone 用 **Safari**（不是 Chrome）打開上面的網址。
2. 點下方（或網址列旁）的「分享」圖示（方框 + 向上箭頭）。
3. 往下捲，點「加入主畫面」。
4. 確認名稱是「大阪2027」，點「加入」。
5. 主畫面會出現一個粉紅色鳥居圖示的 App，點它開啟，就會像 App 一樣全螢幕顯示（沒有 Safari 網址列）。

## 關於地圖放大

點任何地圖圖片，會直接開啟該張圖片的**原始解析度檔案**（不是縮圖、不是 CSS 放大），
iPhone Safari 對圖片檔案原生支援雙指 pinch zoom，可以放到很大看清楚店名、路名、文字。
看完之後，點左上角返回箭頭，或用手指從螢幕左邊緣往右滑，就可以回到行程頁面。

## 離線功能

第一次用 Wi-Fi 打開網站（或加入主畫面後第一次開啟）時，
背景會自動把整個 App（HTML／CSS／JS／manifest／icons／全部地圖與集合照片）存到手機的離線快取裡。
之後即使在日本沒有網路，也可以照常：
打開 App → 看 D1～D5 行程 → 點地圖 → 放大查看。
**只有「導航」按鈕（跳轉 Google Maps）需要網路連線。**

## 沒有 GitHub 帳號？

也可以用其他免費靜態網站託管（用法幾乎一樣，把整個資料夾拖上去即可）：
- Netlify Drop：https://app.netlify.com/drop
- Vercel：https://vercel.com/new
- Cloudflare Pages：https://pages.cloudflare.com/

這些平台都會給你一個 `https://xxxxx.xxxxx.app` 這種網址，效果和 GitHub Pages 相同。
