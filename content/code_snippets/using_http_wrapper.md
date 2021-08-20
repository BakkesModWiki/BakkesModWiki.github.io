---
title: Using HttpWrapper
tags: [Code Snippet, HTTPWrapper]
permalink: code_snippets_using_http_wrapper.html
folder: Code Snippet
---

## Sending a simple http request with a string body
```cpp
CurlRequest req;
req.url = "https://httpbin.org/anything";
req.body = "testing with body";
 
LOG("sending body request");
HttpWrapper::SendCurlRequest(req, [this](int code, std::string result)
{
    LOG("Body result{}", result);
});
```
## Perform an HTTP/S JSON request
```cpp
CurlRequest req;
req.url = "https://httpbin.org/anything";
req.body = R"T({
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false
})T";
 
HttpWrapper::SendCurlJsonRequest(req, [this](int code, std::string result)
{
    LOG("Json result{}", result);
});
```
## Sending a file over HTTP/S
```cpp
{
CurlRequest req;
req.url = "https://httpbin.org/anything";
req.body = "testing body with file output";
 
LOG("sending file output body request");
HttpWrapper::SendCurlRequest(req, L"file_output_test.txt", [this](int code, std::wstring result)
{
    LOG("sending file output body request: returned");
});
```
## Downloading a file with download progress callbacks and reading the raw downloaded data 
```cpp
CurlRequest req;
req.url = "url";
req.progress_function = [](double file_size, double downloaded, ...)
{
    if (file_size != 0)
        LOG("Download progress {:.2f}%", downloaded / file_size * 100); 
};
 
HttpWrapper::SendCurlRequest(req, [this](int code, char* data, size_t size)
{
    std::ofstream out_file {"test_image_raw.jpeg", std::ios_base::binary};
    if (out_file)
        out_file.write(data, size);
});
```
## Downloading a file to the filesystem
```cpp
CurlRequest req;
req.url = "url";
 
LOG("sending raw output image download request");
HttpWrapper::SendCurlRequest(req, L"test_image.jpeg", [this](int code, std::wstring out_path)
{
    LOG("file image download code: {}", code);
});
```

---
Written by Martinn