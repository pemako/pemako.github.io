---
date: '2026-04-09T20:00:00+08:00'
title: 'OpenTelemetry'
description: ""
summary: ""
tags: ["otel", "observability"]
categories: ["observability"]
series: ["Observability"]
ShowToc: true
TocOpen: true
---

# OpenTelemetry

`OpenTelemetry` 简称 `"OTel"`, 在 `OpenTelemetry` 中典型的 `OTel` 方案可以被细分为几个逻辑组件，他们包括 `APIs`, `SDKs`, 收集器。

- `API` 负责收集遥测数据及其中的所有数据
- `SDK` 负责将这些数据从当前被观测的进程中提取出来，转给另一个实体进行分析
- `Collector` 统一接收 `SDK` 从进程中获取到的观测数据。收集器是一个处理遥测数据的 `ETL(Extract, Transform, Load)` 管道。
  - 接收遥测数据
  - 处理遥测数据
  - 导出遥测数据

在链路追踪和可观测性中，有下面三方面信息

- 链路追踪 `Traces`
- 指标数据 `metrics`
- 服务日志 `logs`

### `OTel Collector` 工作原理

![20230814203245](https://raw.githubusercontent.com/pemako/assets/main/2024/01/202403011354562.png)

收集器的主要组件包括

- 接收模块 - 从收集器外部接收jj遥测数据（例如: `OTLP` 、`Kafak` `MySQL` `syslog`）
- 处理模块 - 处理或转换数据（例如属性、批次、Kubernetes 属性）
- 导出模块 - 将处理后的数据发送到另一个目标（例如：`Jaeger` `AWS Cloud Watch` `Zipkin`）
- 扩展模块 - 收集器增强功能的插件（例如: `HTTP` 转发器）



### Progagation & Baggage

`progagation(传播) Baggage(行李)` 为了解决分布式链路追踪。

![20230815165150](https://raw.githubusercontent.com/pemako/assets/main/2024/01/202403011422059.png)



![20230815165043](https://raw.githubusercontent.com/pemako/assets/main/2024/01/202403011422397.png)

上面的三个服务通过使用传播,我们能够将跟踪 `ID` 和父跨度`ID` 作为头信息传递。在 `Go` 中，传播可以通过全局设置来处理

```go
import (
  "go.opentelementry.io/otel"
  "go.opentelementry.io/otel/propagation"
)

otel.SetTextMapPropagator(
  propagation.NewCompositeTextMapPropagator(
    propagation.TraceContext{},
    propagation.Baggage{}),
)
```

在示例代码中，我们可以在控制层（Handler，通常用于处理HTTP请求并生成相应的响应，承担的作用包括路由和请求分发，请求处理逻辑，响应生成）进行生成

```go
http.Handle(
  fmt.Sprintf("/%s/", rootPath),
  otelhttp.NewHandler(
    http.HandlerFunc(userCart),
    "http_user_cart",
    otelhttp.WithTraceProvider(otel.GetTracerProvider()),
    otelhttp.WithPropagators(otel.GetTextMapPropagator()),
  ))

```

当从一个服务发送 HTTP 请求到另一个服务时，可通过 `otelhttp` 库的辅助函数来创建和管理分布式追踪的跨度对象

```go
import "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"

resp, err := otelhttp.Get(ctx, fmt.Sprintf("%s/%s", userServiceEndpoint, userName))
```



从上图中可以看出 `service 1` 生成了一些数据 `attr1` 。这些与 `service 1` 相关的数据可能要添加到 `service 2` 或 `service 3` 所在跨度对象的属性中。由于这些服务可能无法直接访问此数据，在 OpenTelemetry 中是通过**行李**来解决这个问题。行李本质上是携带额外信息的键值对，通过请求传递数据给不同服务和组件。

在 Go 中，我们可以通过以下方式添加行李信息：

```go
reqAddrBaggage, err := baggage.NewMember("req.addr", r.RemoteAddr)
if err != nil {
    // Handle error...
}

reqBaggage, err := baggage.New(reqAddrBaggage)
if err != nil {
    // Handle error...
}
ctx = baggage.ContextWithBaggage(ctx, reqBaggage)
```

这样设置后我们的 HTTP 请求将包括 `req.addr` 行李 。

后续消费端的服务（在图中，这可能是 `service 2` 或 `service 3` ），就可以从请求上下文中解析行李：

```go
import "go.opentelemetry.io/otel/baggage"

// ...

reqBaggage := baggage.FromContext(ctx)
span.SetAttributes(attribute.String(
    "req.addr",
    reqBaggage.Member("req.addr").Value()),
)
```

此代码解析行李信息，并将其作为当前跨度的属性添加进去。



> 完整示例代码: https://github.com/trstringer/otel-shopping-cart
>
> https://flashcat.cloud/blog/otel-part5-propagation/
>
> https://flashcat.cloud/blog/otel-part6-ecosystem/

