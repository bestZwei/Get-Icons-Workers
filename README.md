# Favicon Fetcher Cloudflare Worker

This Cloudflare Worker script is designed to fetch the favicon of a specified domain. It supports multiple favicon formats and allows you to specify the desired icon size.

## Features

- Fetches favicons from a variety of common paths.
- Supports multiple image formats: `.ico`, `.png`, `.gif`, `.svg`, `.jpg`, `.webp`.
- Allows specifying the desired favicon size via query parameters.
- Implements request retry and timeout mechanisms.
- Utilizes a common User-Agent to improve request success rates.
- Logs errors for debugging purposes.

## Deployment

### Prerequisites

- A Cloudflare account with access to Workers.
- Basic knowledge of JavaScript and Cloudflare Workers.

### Steps

1. **Log in to Cloudflare**: Access your Cloudflare dashboard.

2. **Create a new Worker**:
   - Navigate to the Workers & Pages section.
   - Click on "Create a Worker".

3. **Copy the script**: Paste the provided JavaScript code into the Cloudflare Workers editor.

4. **Save and deploy**: Save your changes and deploy the Worker.

5. **Test the Worker**: Access the Worker URL with the appropriate query parameters to test its functionality.

   Example: `https://your-worker-url/?domain=example.com&size=128`

## Usage

### Query Parameters

- `domain`: The domain from which to fetch the favicon. (Required)
- `size`: The desired size of the favicon. Defaults to `128` if not specified. (Optional)

### Example Request

```sh
curl "https://your-worker-url/?domain=example.com&size=128"
```

## Code Explanation

- **handleRequest**: The main function that processes incoming requests, extracts query parameters, and initiates the favicon fetching process.
- **getFaviconUrl**: Attempts to retrieve the favicon URL by checking multiple default paths and parsing the domain's HTML for `<link>` tags.
- **fetchWithTimeout**: A helper function that fetches a URL with a specified timeout and retry mechanism.
- **extractFaviconUrls**: Parses HTML content to extract potential favicon URLs from `<link>` tags.
- **fetchFavicon**: Fetches the favicon from the determined URL and returns it as a response.

## Limitations

- The script may not capture dynamically loaded favicons via JavaScript.
- Certain domains may have CORS policies that prevent fetching resources.


## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Contact

For questions or support, please contact [post@zwei.de.eu.org](mailto:post@zwei.de.eu.org).

---

# Favicon Fetcher Cloudflare Worker

这个 Cloudflare Worker 脚本旨在获取指定域名的 favicon。它支持多种 favicon 格式，并允许您指定所需的图标大小。

## 特性

- 从多种常见路径获取 favicon。
- 支持多种图像格式：`.ico`、`.png`、`.gif`、`.svg`、`.jpg`、`.webp`。
- 允许通过查询参数指定所需的 favicon 大小。
- 实现请求重试和超时机制。
- 使用常见的 User-Agent 来提高请求成功率。
- 记录错误以便于调试。

## 部署

### 前提条件

- 拥有一个 Cloudflare 账户，并可以访问 Workers。
- 对 JavaScript 和 Cloudflare Workers 有基本了解。

### 步骤

1. **登录 Cloudflare**: 访问您的 Cloudflare 仪表板。

2. **创建新 Worker**:
   - 导航到 Workers & Pages 部分。
   - 点击“创建 Worker”。

3. **复制脚本**: 将提供的 JavaScript 代码粘贴到 Cloudflare Workers 编辑器中。

4. **保存并部署**: 保存更改并部署 Worker。

5. **测试 Worker**: 使用适当的查询参数访问 Worker URL 以测试其功能。

   示例: `https://your-worker-url/?domain=example.com&size=128`

## 使用方法

### 查询参数

- `domain`: 要获取 favicon 的域名。（必填）
- `size`: 所需的 favicon 大小。如果未指定，默认为 `128`。（可选）

### 示例请求

```sh
curl "https://your-worker-url/?domain=example.com&size=128"
```

## 代码说明

- **handleRequest**: 处理传入请求的主要函数，提取查询参数并启动 favicon 获取过程。
- **getFaviconUrl**: 通过检查多个默认路径和解析域名的 HTML 来尝试检索 favicon URL。
- **fetchWithTimeout**: 一个帮助函数，用于在指定超时和重试机制下获取 URL。
- **extractFaviconUrls**: 解析 HTML 内容以从 `<link>` 标签中提取潜在的 favicon URL。
- **fetchFavicon**: 从确定的 URL 获取 favicon 并将其作为响应返回。

## 限制

- 该脚本可能无法捕获通过 JavaScript 动态加载的 favicon。
- 某些域名可能具有 CORS 策略，阻止获取资源。

## 贡献

欢迎贡献！如有任何改进或错误修复，请提出问题或提交拉取请求。

## 联系方式

如有问题或需要支持，请联系 [post@zwei.de.eu.org](mailto:post@zwei.de.eu.org)。

